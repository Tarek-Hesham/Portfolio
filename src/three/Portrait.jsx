import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { isTouch, prefersReducedMotion, scrollState } from '../lib/scroll'

// The hero photo rebuilt as a field of particles. Brightness pushes each
// particle forward (real depth), the cursor bends it like a lens, and on
// scroll the portrait dissolves into the star field.

const vertex = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uIntro;
  uniform float uScatter;
  uniform float uHover;
  uniform float uDepth;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uViewScale;
  uniform vec2 uMouse;
  attribute vec2 aUv;
  attribute vec3 aDir;
  attribute float aRnd;
  varying float vLum;
  varying float vForce;
  varying float vAlpha;
  varying float vScan;

  void main() {
    vec3 tex = texture2D(uTex, aUv).rgb;
    float lum = dot(tex, vec3(0.299, 0.587, 0.114));
    vLum = lum;

    vec3 p = position;
    p.z += lum * uDepth;
    p.z += sin(uTime * 1.3 + aRnd * 6.2831 + p.y * 3.0) * 0.025;

    // Holographic scan line sweeping down the face.
    float scan = smoothstep(0.035, 0.0, abs(aUv.y - (1.0 - fract(uTime * 0.12))));
    vScan = scan;
    p.z += scan * 0.12;

    // Cursor lens: push particles out and toward the camera.
    vec2 d = p.xy - uMouse;
    float dist = length(d);
    float force = smoothstep(0.85, 0.0, dist) * uHover;
    p.xy += normalize(d + 0.0001) * force * 0.3;
    p.z += force * 0.65;
    vForce = force;

    // Intro assembly (staggered) and scroll dissolve share one spread value.
    float local = clamp(uIntro * 1.7 - aRnd * 0.7, 0.0, 1.0);
    float assembled = 1.0 - pow(1.0 - local, 3.0);
    float spread = max(1.0 - assembled, uScatter * (0.55 + aRnd * 0.45));
    float ang = spread * (1.5 + aRnd * 2.5);
    p += aDir * spread * 5.0;
    p.xz = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p.xz;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float visible = smoothstep(0.06, 0.2, lum);
    float size = uSize * (0.3 + lum * 1.05) * (1.0 + force * 1.4 + scan * 0.8);
    gl_PointSize = size * visible * uPixelRatio * uViewScale * (6.0 / -mv.z);
    vAlpha = visible * (1.0 - spread * 0.75);
  }
`

const fragment = /* glsl */ `
  uniform vec3 uAccent;
  varying float vLum;
  varying float vForce;
  varying float vAlpha;
  varying float vScan;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.1, d);
    vec3 col = mix(vec3(0.42), vec3(1.0, 0.98, 0.95), vLum);
    col = mix(col, uAccent, clamp(vForce * 1.1 + vScan * 0.7, 0.0, 1.0));
    gl_FragColor = vec4(col, a * vAlpha);
  }
`

export default function Portrait({ src, mobile, ready, active = true }) {
  const group = useRef(null)
  const material = useRef(null)
  const tex = useTexture(src)
  const seg = mobile ? 120 : 160
  const size = 3.5

  const geometry = useMemo(() => {
    const count = seg * seg
    const positions = new Float32Array(count * 3)
    const uvs = new Float32Array(count * 2)
    const dirs = new Float32Array(count * 3)
    const rnd = new Float32Array(count)
    let i = 0
    for (let y = 0; y < seg; y++) {
      for (let x = 0; x < seg; x++) {
        const u = x / (seg - 1)
        const v = y / (seg - 1)
        positions.set([(u - 0.5) * size, (v - 0.5) * size, 0], i * 3)
        uvs.set([u, v], i * 2)
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = 0.5 + Math.random()
        dirs.set([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)], i * 3)
        rnd[i] = Math.random()
        i++
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aUv', new THREE.BufferAttribute(uvs, 2))
    g.setAttribute('aDir', new THREE.BufferAttribute(dirs, 3))
    g.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1))
    return g
  }, [seg])

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uScatter: { value: 0 },
      uHover: { value: 0 },
      uDepth: { value: 0.9 },
      uSize: { value: mobile ? 3.6 : 4.6 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uViewScale: { value: 1 },
      uMouse: { value: new THREE.Vector2(10, 10) },
      uAccent: { value: new THREE.Color('#ff5a1f') },
    }),
    [tex, mobile],
  )

  const tmp = useMemo(
    () => ({
      plane: new THREE.Plane(),
      normal: new THREE.Vector3(),
      origin: new THREE.Vector3(),
      hit: new THREE.Vector3(),
      mouse: new THREE.Vector2(10, 10),
      lastPointer: new THREE.Vector2(),
      lastMove: -10,
    }),
    [],
  )

  useFrame((state, dt) => {
    const g = group.current
    if (!g || !material.current) return
    const t = state.clock.elapsedTime
    // Read uniforms from the live material (React may have re-created the memo).
    const u = material.current.uniforms
    u.uTime.value = t
    u.uViewScale.value = state.size.height / 900
    if (ready) u.uIntro.value = Math.min(1, u.uIntro.value + dt / (prefersReducedMotion ? 0.5 : 2.6))

    const scatter = active ? Math.min(Math.max(scrollState.y / (window.innerHeight * 0.85), 0), 1) : 1
    u.uScatter.value = THREE.MathUtils.damp(u.uScatter.value, scatter, 6, dt)
    g.visible = u.uScatter.value < 0.995

    // Placement: centred behind the name in both languages, above the name
    // on phones. Sized from the visible width at this depth.
    const vw = state.viewport.width
    const scale = mobile ? Math.min(0.6, (vw * 0.95) / size) : Math.min(1, vw / 5.6)
    const x = 0
    const y = (mobile ? state.viewport.height * 0.2 : 0.05) + u.uScatter.value * 0.8
    g.position.x = THREE.MathUtils.damp(g.position.x, x, 4, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, y, 4, dt)
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, scale, 4, dt))

    // Tilt toward the cursor so the depth reads as real 3D.
    const px = isTouch ? Math.sin(t * 0.4) * 0.6 : state.pointer.x
    const py = isTouch ? Math.cos(t * 0.3) * 0.4 : state.pointer.y
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.38 + Math.sin(t * 0.3) * 0.05, 3, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.35, 3, dt)

    // Cursor position on the portrait plane, in local space.
    let hoverTarget = 0
    if (isTouch) {
      tmp.mouse.set(Math.sin(t * 0.7) * 0.9, Math.cos(t * 0.5) * 0.9)
      hoverTarget = prefersReducedMotion ? 0 : 0.8
    } else {
      if (!state.pointer.equals(tmp.lastPointer)) {
        tmp.lastPointer.copy(state.pointer)
        tmp.lastMove = t
      }
      g.updateMatrixWorld()
      tmp.normal.set(0, 0, 1).transformDirection(g.matrixWorld)
      tmp.origin.setFromMatrixPosition(g.matrixWorld)
      tmp.plane.setFromNormalAndCoplanarPoint(tmp.normal, tmp.origin)
      state.raycaster.setFromCamera(state.pointer, state.camera)
      if (state.raycaster.ray.intersectPlane(tmp.plane, tmp.hit)) {
        g.worldToLocal(tmp.hit)
        tmp.mouse.set(tmp.hit.x, tmp.hit.y)
        const inside = Math.abs(tmp.hit.x) < size * 0.7 && Math.abs(tmp.hit.y) < size * 0.7
        hoverTarget = inside && t - tmp.lastMove < 3 ? 1 : 0
      }
    }
    u.uMouse.value.x = THREE.MathUtils.damp(u.uMouse.value.x, tmp.mouse.x, 8, dt)
    u.uMouse.value.y = THREE.MathUtils.damp(u.uMouse.value.y, tmp.mouse.y, 8, dt)
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, hoverTarget, 4, dt)
  })

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  )
}
