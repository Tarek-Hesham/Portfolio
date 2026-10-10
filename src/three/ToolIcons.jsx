import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { isRTL, prefersReducedMotion, scrollState } from '../lib/scroll'

// Floating 3D design-tool icons spread down the page.

const EXTRUDE = { depth: 0.32, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.045, bevelSegments: 5, curveSegments: 40 }

function extrude(shapes, opts = EXTRUDE) {
  const g = new THREE.ExtrudeGeometry(shapes, opts)
  g.center()
  return g
}

function Glossy({ color, metal = 0.1, rough = 0.22 }) {
  return (
    <meshPhysicalMaterial color={color} metalness={metal} roughness={rough} clearcoat={1} clearcoatRoughness={0.15} envMapIntensity={1.3} />
  )
}

// ── Figma logo: five pieces on a 2×3 grid ──
function leftRounded() {
  const s = new THREE.Shape()
  s.moveTo(1, 0)
  s.lineTo(0.5, 0)
  s.absarc(0.5, 0.5, 0.5, -Math.PI / 2, Math.PI / 2, true)
  s.lineTo(1, 1)
  s.lineTo(1, 0)
  return s
}
function rightRounded() {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.lineTo(0.5, 0)
  s.absarc(0.5, 0.5, 0.5, -Math.PI / 2, Math.PI / 2, false)
  s.lineTo(0, 1)
  s.lineTo(0, 0)
  return s
}
function circle() {
  const s = new THREE.Shape()
  s.absarc(0.5, 0.5, 0.5, 0, Math.PI * 2, false)
  return s
}
function leaf() {
  const s = new THREE.Shape()
  s.moveTo(0.5, 1)
  s.lineTo(1, 1)
  s.lineTo(1, 0.5)
  s.absarc(0.5, 0.5, 0.5, 0, Math.PI / 2, true)
  return s
}

function FigmaIcon() {
  const parts = useMemo(() => {
    const opts = { ...EXTRUDE, bevelSize: 0.03 }
    const make = (shape, x, y, color) => {
      const g = new THREE.ExtrudeGeometry(shape, opts)
      g.translate(x - 1, y - 1.5, -opts.depth / 2)
      return { g, color }
    }
    return [
      make(leftRounded(), 0, 2, '#F24E1E'),
      make(rightRounded(), 1, 2, '#FF7262'),
      make(leftRounded(), 0, 1, '#A259FF'),
      make(circle(), 1, 1, '#1ABCFE'),
      make(leaf(), 0, 0, '#0ACF83'),
    ]
  }, [])
  return (
    <group scale={0.62}>
      {parts.map((p, i) => (
        <mesh key={i} geometry={p.g}>
          <Glossy color={p.color} />
        </mesh>
      ))}
    </group>
  )
}

// ── Pen tool nib ──
function PenIcon() {
  const { nib, cap } = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, -1)
    s.lineTo(0.56, -0.1)
    s.quadraticCurveTo(0.62, 0.16, 0.42, 0.36)
    s.lineTo(0.27, 0.55)
    s.lineTo(-0.27, 0.55)
    s.lineTo(-0.42, 0.36)
    s.quadraticCurveTo(-0.62, 0.16, -0.56, -0.1)
    s.lineTo(0, -1)
    const hole = new THREE.Path()
    hole.absarc(0, -0.1, 0.1, 0, Math.PI * 2, true)
    const slit = new THREE.Path()
    slit.moveTo(-0.025, -0.82)
    slit.lineTo(0.025, -0.82)
    slit.lineTo(0.025, -0.24)
    slit.lineTo(-0.025, -0.24)
    slit.lineTo(-0.025, -0.82)
    s.holes.push(hole, slit)
    const nib = new THREE.ExtrudeGeometry(s, { ...EXTRUDE, depth: 0.22, bevelSize: 0.03 })
    nib.translate(0, 0, -0.11)
    return { nib }
  }, [])
  return (
    <group scale={1.05}>
      <mesh geometry={nib}>
        <Glossy color="#ff5a1f" />
      </mesh>
      <RoundedBox args={[0.62, 0.26, 0.34]} radius={0.06} position={[0, 0.76, 0]}>
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} envMapIntensity={1.3} />
      </RoundedBox>
    </group>
  )
}

// ── Selection cursor ──
function CursorIcon() {
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(0, -1.1)
    s.lineTo(0.3, -0.82)
    s.lineTo(0.5, -1.22)
    s.lineTo(0.66, -1.15)
    s.lineTo(0.47, -0.76)
    s.lineTo(0.84, -0.76)
    s.lineTo(0, 0)
    return extrude(s, { ...EXTRUDE, depth: 0.18, bevelSize: 0.05 })
  }, [])
  return (
    <mesh geometry={geo} scale={1.1}>
      <Glossy color="#f6f3ee" rough={0.18} />
    </mesh>
  )
}

// ── Adobe-style app tiles (Ps / Ai) ──
function useLabelTexture(text, color) {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')
    ctx.strokeStyle = color
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.roundRect(22, 22, 212, 212, 30)
    ctx.stroke()
    ctx.fillStyle = color
    ctx.font = '700 112px "Bricolage Grotesque", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 128, 136)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  }, [text, color])
}

function AppTile({ label, bg, fg }) {
  const tex = useLabelTexture(label, fg)
  return (
    <group>
      <RoundedBox args={[1.2, 1.2, 0.26]} radius={0.2} smoothness={5}>
        <Glossy color={bg} rough={0.3} />
      </RoundedBox>
      <mesh position={[0, 0, 0.135]}>
        <planeGeometry args={[1.12, 1.12]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}

// ── Framer logo ──
function FramerIcon() {
  const geo = useMemo(() => {
    const pts = (arr) => {
      const s = new THREE.Shape()
      arr.forEach(([x, y], i) => (i ? s.lineTo(x / 8, -y / 8) : s.moveTo(x / 8, -y / 8)))
      return s
    }
    return extrude([
      pts([[0, 0], [16, 0], [16, 8], [8, 8]]),
      pts([[0, 8], [8, 8], [16, 16], [0, 16]]),
      pts([[0, 16], [8, 16], [8, 24]]),
    ], { ...EXTRUDE, depth: 0.26, bevelSize: 0.03 })
  }, [])
  return (
    <mesh geometry={geo} scale={0.42}>
      <Glossy color="#0099ff" />
    </mesh>
  )
}

// ── Bezier curve with anchors & handles ──
function BezierIcon() {
  const { tube, h1, h2 } = useMemo(() => {
    const a = new THREE.Vector3(-1, -0.45, 0)
    const c1 = new THREE.Vector3(-0.35, 0.95, 0)
    const c2 = new THREE.Vector3(0.35, -0.95, 0)
    const b = new THREE.Vector3(1, 0.45, 0)
    const curve = new THREE.CubicBezierCurve3(a, c1, c2, b)
    const line = (p, q) => new THREE.TubeGeometry(new THREE.LineCurve3(p, q), 1, 0.014, 6)
    return { tube: new THREE.TubeGeometry(curve, 80, 0.05, 12), h1: line(a, c1), h2: line(b, c2) }
  }, [])
  return (
    <group scale={0.85}>
      <mesh geometry={tube}>
        <Glossy color="#f6f3ee" />
      </mesh>
      <mesh geometry={h1}>
        <meshBasicMaterial color="#ff5a1f" />
      </mesh>
      <mesh geometry={h2}>
        <meshBasicMaterial color="#ff5a1f" />
      </mesh>
      {[[-1, -0.45], [1, 0.45]].map(([x, y], i) => (
        <RoundedBox key={i} args={[0.2, 0.2, 0.2]} radius={0.03} position={[x, y, 0]}>
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} />
        </RoundedBox>
      ))}
      {[[-0.35, 0.95], [0.35, -0.95]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <Glossy color="#ff5a1f" />
        </mesh>
      ))}
    </group>
  )
}

// ── Colour swatches fan ──
function SwatchesIcon() {
  const colors = ['#0ACF83', '#1ABCFE', '#ff5a1f']
  return (
    <group>
      {colors.map((c, i) => (
        <group key={c} rotation={[0, 0, (i - 1) * -0.38]}>
          <RoundedBox args={[0.5, 1.3, 0.08]} radius={0.04} position={[0, 0.55, i * 0.1]}>
            <Glossy color={c} />
          </RoundedBox>
        </group>
      ))}
    </group>
  )
}

const ICONS = {
  figma: FigmaIcon,
  pen: PenIcon,
  cursor: CursorIcon,
  ps: () => <AppTile label="Ps" bg="#001e36" fg="#31a8ff" />,
  ai: () => <AppTile label="Ai" bg="#330000" fg="#ff9a00" />,
  framer: FramerIcon,
  bezier: BezierIcon,
  swatches: SwatchesIcon,
}

const LAYOUT = [
  { type: 'figma', pos: [-3.7, 1.55, -2.2], scale: 0.42, rot: [0.2, 0.5, -0.15] },
  { type: 'pen', pos: [-0.4, -1.95, -2.6], scale: 0.4, rot: [0.3, -0.4, 0.5] },
  { type: 'cursor', pos: [3.95, -1.9, -1.6], scale: 0.45, rot: [0.2, -0.5, 0.25] },
  { type: 'ps', pos: [-3.5, -5.3, -1.8], scale: 0.5, rot: [0.15, 0.55, -0.12] },
  { type: 'bezier', pos: [3.4, -8.5, -2.4], scale: 0.6, rot: [0.3, -0.45, 0.1] },
  { type: 'ai', pos: [-3.9, -11.9, -2.2], scale: 0.5, rot: [0.1, 0.5, 0.15] },
  { type: 'framer', pos: [3.6, -15.3, -2], scale: 0.48, rot: [0.2, -0.55, -0.1] },
  { type: 'swatches', pos: [-3.4, -18.9, -1.6], scale: 0.5, rot: [0.25, 0.45, 0.2] },
  { type: 'figma', pos: [3.7, -22.5, -2.4], scale: 0.36, rot: [0.15, -0.5, 0.1] },
  { type: 'pen', pos: [-3.7, -25.9, -2], scale: 0.38, rot: [0.3, 0.5, -0.4] },
  { type: 'cursor', pos: [3.3, -29.5, -1.8], scale: 0.42, rot: [0.2, -0.5, 0.2] },
  { type: 'ps', pos: [-3.3, -33, -2.2], scale: 0.42, rot: [0.15, 0.5, -0.1] },
]

export default function ToolIcons({ mobile }) {
  const group = useRef(null)
  const items = useRef([])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    // ~5 world units ≈ one viewport at this depth; drift at ~60% scroll speed.
    const target = (scrollState.y / window.innerHeight) * 3.1
    g.position.y = THREE.MathUtils.damp(g.position.y, target, 6, dt)
    const side = (isRTL() ? -1 : 1) * (mobile ? 0.45 : 1)

    const t = state.clock.elapsedTime
    const vel = Math.max(-40, Math.min(40, scrollState.velocity))
    items.current.forEach((m, i) => {
      if (!m) return
      // Mirror positions (not the icons themselves) for Arabic.
      m.position.x = THREE.MathUtils.damp(m.position.x, LAYOUT[i].pos[0] * side, 4, dt)
      const base = LAYOUT[i].rot
      const sway = prefersReducedMotion ? 0 : 1
      m.rotation.y = THREE.MathUtils.damp(
        m.rotation.y,
        base[1] + Math.sin(t * 0.55 + i) * 0.45 * sway + state.pointer.x * 0.45,
        3,
        dt,
      )
      m.rotation.x = THREE.MathUtils.damp(m.rotation.x, base[0] + Math.cos(t * 0.4 + i) * 0.15 * sway - state.pointer.y * 0.3, 3, dt)
      m.rotation.z = THREE.MathUtils.damp(m.rotation.z, base[2] + vel * 0.012, 4, dt)
    })
  })

  return (
    <group ref={group}>
      {LAYOUT.map((it, i) => {
        const Icon = ICONS[it.type]
        return (
          <Float key={i} speed={1.3} rotationIntensity={0.25} floatIntensity={1.1} enabled={!prefersReducedMotion}>
            <group
              ref={(el) => (items.current[i] = el)}
              position={[it.pos[0] * (mobile ? 0.45 : 1) * (isRTL() ? -1 : 1), it.pos[1], it.pos[2]]}
              scale={it.scale * (mobile ? 0.7 : 1)}
            >
              <Icon />
            </group>
          </Float>
        )
      })}
    </group>
  )
}
