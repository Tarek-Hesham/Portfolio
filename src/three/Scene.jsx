import { Component, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollState, prefersReducedMotion } from '../lib/scroll'

// Where the chrome blob sits for each section (matched by data-scene="…").
// The scene blends between neighbouring keyframes as you scroll.
const KEYFRAMES = {
  hero: { pos: [1.55, 0.05, 0], scale: 1.12, distort: 0.48, tint: '#ffffff' },
  about: { pos: [2.55, 0.35, -1], scale: 0.9, distort: 0.52, tint: '#ffd9c9' },
  work: { pos: [0, 0, -6], scale: 2.8, distort: 0.22, tint: '#4a4a4a' },
  // Text-heavy sections: the blob sinks deep behind the content and dims.
  services: { pos: [1.5, 0, -9], scale: 2.6, distort: 0.6, tint: '#3d3a38' },
  experience: { pos: [-1.5, -0.2, -9], scale: 2.6, distort: 0.5, tint: '#38332f' },
  contact: { pos: [3.1, 0.55, -2], scale: 1.05, distort: 0.5, tint: '#ffb08f' },
}

let sections = []

function measureSections() {
  sections = [...document.querySelectorAll('[data-scene]')].map((el) => {
    const box = el.closest('.pin-spacer') || el
    const rect = box.getBoundingClientRect()
    const top = rect.top + window.scrollY
    return { key: el.dataset.scene, mid: top + rect.height / 2 }
  })
}

const smooth = (t) => t * t * (3 - 2 * t)

function targetFor(out, mobile) {
  const center = scrollState.y + window.innerHeight / 2
  let a = sections[0]
  let b = sections[0]
  let t = 0
  for (let i = 0; i < sections.length; i++) {
    if (center >= sections[i].mid) {
      a = sections[i]
      b = sections[i + 1] || sections[i]
      t = b === a ? 0 : (center - a.mid) / (b.mid - a.mid)
    }
  }
  const ka = KEYFRAMES[a?.key] || KEYFRAMES.hero
  const kb = KEYFRAMES[b?.key] || KEYFRAMES.hero
  // Hold each keyframe for the first part of the stretch, then glide to the next.
  const s = smooth(Math.min(Math.max((t - 0.35) / 0.65, 0), 1))

  out.pos.set(...ka.pos).lerp(out.tmpVec.set(...kb.pos), s)
  out.scale = THREE.MathUtils.lerp(ka.scale, kb.scale, s)
  out.distort = THREE.MathUtils.lerp(ka.distort, kb.distort, s)
  out.tint.set(ka.tint).lerp(out.tmpColor.set(kb.tint), s)

  if (mobile) {
    out.pos.x *= 0.28
    out.pos.y += a?.key === 'hero' && s < 0.5 ? 0.95 : 0
    out.scale *= 0.72
  }
  return out
}

function Blob({ mobile }) {
  const mesh = useRef()
  const mat = useRef()
  const target = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      tmpVec: new THREE.Vector3(),
      tint: new THREE.Color(),
      tmpColor: new THREE.Color(),
      scale: 1,
      distort: 0.4,
    }),
    [],
  )
  const cur = useMemo(
    () => ({ pos: new THREE.Vector3(...KEYFRAMES.hero.pos), scale: 0.001, distort: 0.4, tint: new THREE.Color('#fff') }),
    [],
  )

  useFrame((state, dt) => {
    if (!mesh.current || !mat.current) return
    targetFor(target, mobile)
    const k = 1 - Math.exp(-2.6 * dt)
    const vel = Math.min(Math.abs(scrollState.velocity), 60)

    cur.pos.lerp(target.pos, k)
    cur.scale = THREE.MathUtils.lerp(cur.scale, target.scale, k)
    cur.distort = THREE.MathUtils.lerp(cur.distort, target.distort + vel * 0.006, k)
    cur.tint.lerp(target.tint, k)

    const t = state.clock.elapsedTime
    mesh.current.position.copy(cur.pos)
    mesh.current.position.y += Math.sin(t * 0.7) * 0.06
    mesh.current.scale.setScalar(cur.scale)

    const spin = prefersReducedMotion ? 0 : dt * (0.18 + vel * 0.01)
    mesh.current.rotation.y += spin
    mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, state.pointer.y * 0.45, 3, dt)
    mesh.current.rotation.z = THREE.MathUtils.damp(mesh.current.rotation.z, -state.pointer.x * 0.3, 3, dt)

    mat.current.distort = prefersReducedMotion ? 0.25 : cur.distort
    mat.current.color.copy(cur.tint)
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, mobile ? 40 : 80]} />
      <MeshDistortMaterial
        ref={mat}
        color="#ffffff"
        metalness={1}
        roughness={0.1}
        distort={0.4}
        speed={prefersReducedMotion ? 0 : 2.2}
        envMapIntensity={1.25}
      />
    </mesh>
  )
}

const particleVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.3 + position.x * 0.5) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (28.0 / -mv.z);
    vColor = aColor;
    vAlpha = smoothstep(22.0, 4.0, -mv.z);
  }
`
const particleFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vAlpha * 0.9);
  }
`

function Particles({ count }) {
  const points = useRef()
  const { positions, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const white = new THREE.Color('#f1ede6')
    const accent = new THREE.Color('#ff5a1f')
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.4
      positions[i * 3 + 2] = r * Math.cos(phi) - 4
      sizes[i] = 0.6 + Math.random() * 2.2
      const c = Math.random() < 0.14 ? accent : white
      colors.set([c.r, c.g, c.b], i * 3)
    }
    return { positions, sizes, colors }
  }, [count])

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) } }),
    [],
  )

  useFrame((state, dt) => {
    if (!points.current) return
    uniforms.uTime.value = state.clock.elapsedTime
    if (!prefersReducedMotion) points.current.rotation.y += dt * 0.025
    points.current.rotation.x = scrollState.progress * 0.9
    points.current.position.x = THREE.MathUtils.damp(points.current.position.x, state.pointer.x * 0.4, 2, dt)
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Small objects spread down the page; they drift with scroll for depth.
const SHAPES = [
  { type: 'torus', pos: [-3.6, 1.6, -2.5], scale: 0.42, mat: 'chrome' },
  { type: 'octa', pos: [3.9, -2.1, -2], scale: 0.38, mat: 'wire' },
  { type: 'sphere', pos: [-2.6, -5.5, -1.5], scale: 0.22, mat: 'accent' },
  { type: 'knot', pos: [3.2, -8.5, -3], scale: 0.34, mat: 'chrome' },
  { type: 'box', pos: [-4, -12, -2.5], scale: 0.4, mat: 'wire' },
  { type: 'torus', pos: [3.6, -15.5, -2], scale: 0.36, mat: 'accent' },
  { type: 'octa', pos: [-3.2, -19, -1.5], scale: 0.4, mat: 'chrome' },
  { type: 'sphere', pos: [3.8, -22.5, -2.5], scale: 0.26, mat: 'chrome' },
  { type: 'knot', pos: [-3.8, -26, -2], scale: 0.3, mat: 'wire' },
  { type: 'box', pos: [3.4, -29.5, -1.8], scale: 0.32, mat: 'accent' },
]

function ShapeGeometry({ type }) {
  switch (type) {
    case 'torus':
      return <torusGeometry args={[1, 0.36, 32, 96]} />
    case 'octa':
      return <octahedronGeometry args={[1, 0]} />
    case 'knot':
      return <torusKnotGeometry args={[0.8, 0.26, 160, 24]} />
    case 'box':
      return <boxGeometry args={[1.2, 1.2, 1.2]} />
    default:
      return <sphereGeometry args={[1, 48, 48]} />
  }
}

function ShapeMaterial({ kind }) {
  if (kind === 'wire') return <meshBasicMaterial color="#f1ede6" wireframe transparent opacity={0.35} />
  if (kind === 'accent')
    return <meshPhysicalMaterial color="#ff5a1f" metalness={0.2} roughness={0.15} clearcoat={1} envMapIntensity={1.4} />
  return <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.08} envMapIntensity={1.2} />
}

function Shapes({ mobile }) {
  const group = useRef()
  useFrame((state, dt) => {
    if (!group.current) return
    // ~5 world units ≈ one viewport at this depth; drift at ~60% scroll speed.
    const target = (scrollState.y / window.innerHeight) * 3.1
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, target, 6, dt)
    group.current.children.forEach((child, i) => {
      if (prefersReducedMotion) return
      child.rotation.x += dt * (0.2 + i * 0.03)
      child.rotation.y += dt * (0.25 + i * 0.02)
    })
  })
  return (
    <group ref={group}>
      {SHAPES.map((s, i) => (
        <Float key={i} speed={1.4} rotationIntensity={0.6} floatIntensity={1.2} enabled={!prefersReducedMotion}>
          <mesh
            position={[s.pos[0] * (mobile ? 0.45 : 1), s.pos[1], s.pos[2]]}
            scale={s.scale * (mobile ? 0.7 : 1)}
          >
            <ShapeGeometry type={s.type} />
            <ShapeMaterial kind={s.mat} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function CameraRig() {
  useFrame((state, dt) => {
    const cam = state.camera
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.35, 2, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, state.pointer.y * 0.25, 2, dt)
    cam.lookAt(0, 0, -1)
  })
  return null
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#0c0c0c']} />
      <Lightformer form="rect" intensity={1.6} position={[0, 0, -12]} scale={[30, 14, 1]} color="#2a2724" />
      <Lightformer form="rect" intensity={3} position={[0, 9, 0]} rotation-x={Math.PI / 2} scale={[20, 6, 1]} />
      <Lightformer form="rect" intensity={1.4} position={[-9, 0, 3]} rotation-y={Math.PI / 2} scale={[14, 1.2, 1]} />
      <group rotation={[-Math.PI / 3, 0, 1]}>
        <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
        <Lightformer form="rect" intensity={2} rotation-y={Math.PI / 2} position={[-5, 0, -1]} scale={[0.6, 8, 1]} />
        <Lightformer form="rect" intensity={2.4} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[10, 3, 1]} />
        <Lightformer
          form="ring"
          color="#ff5a1f"
          intensity={9}
          position={[10, 10, 0]}
          scale={10}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        />
        <Lightformer form="rect" color="#ff7a3d" intensity={3} position={[0, -6, 2]} rotation-x={-Math.PI / 2} scale={[12, 2, 1]} />
      </group>
    </Environment>
  )
}

class WebGLBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function Scene() {
  const mobile = window.innerWidth < 768

  useEffect(() => {
    measureSections()
    const onResize = () => measureSections()
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onResize)
    ScrollTrigger.addEventListener('refresh', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
      ScrollTrigger.removeEventListener('refresh', onResize)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="webgl" aria-hidden="true">
      <WebGLBoundary>
        <Canvas
          dpr={[1, mobile ? 1.5 : 1.75]}
          camera={{ position: [0, 0, 6], fov: 35 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[4, 6, 4]} intensity={1.2} />
          <Studio />
          <Blob mobile={mobile} />
          <Particles count={mobile ? 900 : 2200} />
          <Shapes mobile={mobile} />
          <CameraRig />
        </Canvas>
      </WebGLBoundary>
    </div>
  )
}
