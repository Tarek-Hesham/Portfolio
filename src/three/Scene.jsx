import { Component, Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState, prefersReducedMotion } from '../lib/scroll'
import Portrait from './Portrait'
import ToolIcons from './ToolIcons'

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
    gl_FragColor = vec4(vColor, a * vAlpha * 0.4);
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
      sizes[i] = 0.5 + Math.random() * 1.6
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
    points.current.material.uniforms.uTime.value = state.clock.elapsedTime
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

export default function Scene({ ready, portrait, page }) {
  const mobile = window.innerWidth < 768

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
          <Particles count={mobile ? 350 : 750} />
          {portrait && (
            <Suspense fallback={null}>
              <Portrait src={portrait} mobile={mobile} ready={ready} active={page === 'home'} />
            </Suspense>
          )}
          <ToolIcons mobile={mobile} />
          <CameraRig />
        </Canvas>
      </WebGLBoundary>
    </div>
  )
}
