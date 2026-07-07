import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Vector3, CatmullRomCurve3, TubeGeometry, CanvasTexture, MeshPhongMaterial, Color, BackSide } from 'three';

// ─── Utility: lat/lon → 3D cartesian on unit sphere ───────────────────────────
function latLonToVec3(lat, lon, radius = 1) {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ─── City dots on the globe ────────────────────────────────────────────────────
const CITIES = [
  { name: 'Bhopal',  lat: 23.2599, lon: 77.4126 },
  { name: 'Delhi',   lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai',  lat: 19.0760, lon: 72.8777 },
  { name: 'Kashmir', lat: 34.0837, lon: 74.7973 },
  { name: 'Kerala',  lat: 10.8505, lon: 76.2711 },
  { name: 'Jaipur',  lat: 26.9124, lon: 75.7873 },
  { name: 'Dubai',   lat: 25.2048, lon: 55.2708 },
  { name: 'Bali',    lat: -8.3405, lon: 115.0920 },
  { name: 'London',  lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo',   lat: 35.6762, lon: 139.6503 },
  { name: 'NYC',     lat: 40.7128, lon: -74.0060 },
  { name: 'Sydney',  lat: -33.8688, lon: 151.2093 },
];

// ─── Arc routes to animate planes along ───────────────────────────────────────
const ROUTES = [
  [0, 1], [0, 2], [1, 6], [2, 7],
  [1, 9], [0, 8], [3, 6], [4, 7],
];

// Build a smooth great-circle arc between two points on the sphere
function buildArc(a, b, radius = 2.02, segments = 80) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const v = new Vector3().lerpVectors(a, b, t).normalize();
    const lift = 1 + 0.18 * Math.sin(t * Math.PI);
    points.push(v.multiplyScalar(radius * lift));
  }
  return points;
}

// ─── Single animated plane along one arc ──────────────────────────────────────
function OrbitingPlane({ points, speed = 0.18, color = '#c9a84c' }) {
  const meshRef  = useRef();
  const trailRef = useRef();
  const progress = useRef(Math.random()); // stagger start positions

  useFrame((_, delta) => {
    progress.current = (progress.current + delta * speed) % 1;
    const idx    = Math.floor(progress.current * (points.length - 1));
    const nextIdx = Math.min(idx + 1, points.length - 1);
    const t      = (progress.current * (points.length - 1)) - idx;

    const pos = new Vector3().lerpVectors(points[idx], points[nextIdx], t);
    const dir = new Vector3().subVectors(points[nextIdx], points[idx]).normalize();

    if (meshRef.current) {
      meshRef.current.position.copy(pos);
      meshRef.current.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), dir);
    }
  });

  return (
    <group>
      {/* Glowing dot as the "plane" */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      {/* Soft halo */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.25}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─── Arc line rendered as a tube ──────────────────────────────────────────────
function ArcLine({ points, opacity = 0.35 }) {
  const geometry = useMemo(() => {
    const curve  = new CatmullRomCurve3(points);
    return new TubeGeometry(curve, 80, 0.003, 4, false);
  }, [points]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color="#c9a84c"
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── City beacon dot ──────────────────────────────────────────────────────────
function CityDot({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 2 + position.x * 10);
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.022, 6, 6]} />
      <meshStandardMaterial
        color="#f0c060"
        emissive="#c9a84c"
        emissiveIntensity={2}
        transparent
        opacity={0.9}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─── The Earth Globe ──────────────────────────────────────────────────────────
function Globe({ scrollY }) {
  const groupRef = useRef();
  const atmRef   = useRef();

  // Precompute city positions on R=2 sphere
  const cityPositions = useMemo(
    () => CITIES.map(c => latLonToVec3(c.lat, c.lon, 2.03)),
    []
  );

  // Precompute arc point arrays
  const arcs = useMemo(
    () =>
      ROUTES.map(([a, b]) =>
        buildArc(
          latLonToVec3(CITIES[a].lat, CITIES[a].lon, 2),
          latLonToVec3(CITIES[b].lat, CITIES[b].lon, 2)
        )
      ),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Base slow auto-rotation
      groupRef.current.rotation.y = t * 0.06;
      // Scroll-driven tilt + pull-back
      const s = scrollY.current;
      groupRef.current.rotation.x = s * 0.0004;
      groupRef.current.position.y  = -s * 0.003;
      const scale = Math.max(0.55, 1 - s * 0.0005);
      groupRef.current.scale.setScalar(scale);
    }
    // Atmosphere pulse
    if (atmRef.current) {
      atmRef.current.material.opacity = 0.18 + 0.04 * Math.sin(t * 0.8);
    }
  });

  // ── Globe sphere material (procedural ocean + landmass look) ──────────────
  const globeMaterial = useMemo(() => {
    // create a canvas texture for a stylised earth
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width  = size;
    canvas.height = size / 2;
    const ctx = canvas.getContext('2d');

    // Deep ocean base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0,   '#03111f');
    oceanGrad.addColorStop(0.5, '#051828');
    oceanGrad.addColorStop(1,   '#02101b');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Latitude grid lines (faint)
    ctx.strokeStyle = 'rgba(100,160,220,0.12)';
    ctx.lineWidth = 0.8;
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = ((90 - lat) / 180) * canvas.height;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 20) {
      const x = ((lon + 180) / 360) * canvas.width;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }

    // Stylised landmasses (simplified blobs)
    ctx.fillStyle = 'rgba(20, 60, 40, 0.85)';
    const landPatches = [
      // North America
      { cx: 0.18, cy: 0.32, rx: 0.09, ry: 0.14 },
      // South America
      { cx: 0.22, cy: 0.60, rx: 0.055, ry: 0.13 },
      // Europe
      { cx: 0.50, cy: 0.28, rx: 0.05,  ry: 0.07 },
      // Africa
      { cx: 0.50, cy: 0.53, rx: 0.065, ry: 0.16 },
      // Asia (big)
      { cx: 0.65, cy: 0.30, rx: 0.16,  ry: 0.14 },
      // India peninsula
      { cx: 0.615,cy: 0.52, rx: 0.04,  ry: 0.10 },
      // Australia
      { cx: 0.76, cy: 0.68, rx: 0.065, ry: 0.07 },
      // Greenland
      { cx: 0.28, cy: 0.14, rx: 0.04,  ry: 0.06 },
    ];
    landPatches.forEach(({ cx, cy, rx, ry }) => {
      ctx.beginPath();
      ctx.ellipse(cx * canvas.width, cy * canvas.height, rx * canvas.width, ry * canvas.height, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Coastline highlight
    ctx.strokeStyle = 'rgba(60,180,100,0.3)';
    ctx.lineWidth = 1.5;
    landPatches.forEach(({ cx, cy, rx, ry }) => {
      ctx.beginPath();
      ctx.ellipse(cx * canvas.width, cy * canvas.height, rx * canvas.width, ry * canvas.height, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Ice caps
    ctx.fillStyle = 'rgba(200, 230, 255, 0.5)';
    ctx.beginPath(); ctx.ellipse(canvas.width * 0.5, 4, canvas.width * 0.5, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(canvas.width * 0.5, canvas.height - 4, canvas.width * 0.5, 10, 0, 0, Math.PI * 2); ctx.fill();

    const tex = new CanvasTexture(canvas);
    return new MeshPhongMaterial({
      map: tex,
      specular: new Color('#1a3a5c'),
      shininess: 35,
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* ── Core Earth sphere ── */}
      <mesh material={globeMaterial}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>

      {/* ── Atmosphere glow layer ── */}
      <mesh ref={atmRef}>
        <sphereGeometry args={[2.18, 64, 64]} />
        <meshStandardMaterial
          color="#1a6aff"
          transparent
          opacity={0.18}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer atmosphere rim */}
      <mesh>
        <sphereGeometry args={[2.32, 64, 64]} />
        <meshStandardMaterial
          color="#0a3aff"
          transparent
          opacity={0.055}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Outer atmosphere rim ── */}
      <mesh>
        <sphereGeometry args={[2.32, 64, 64]} />
        <meshStandardMaterial
          color="#0a3aff"
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Gold equatorial ring ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.45, 0.006, 16, 120]} />
        <meshStandardMaterial color="#c9a84c" emissive="#c9a84c" emissiveIntensity={1.2} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ── Tilted orbit ring ── */}
      <mesh rotation={[Math.PI / 5, 0.4, 0]}>
        <torusGeometry args={[2.7, 0.003, 16, 120]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.6} transparent opacity={0.55} />
      </mesh>

      {/* ── Arc lines ── */}
      {arcs.map((pts, i) => (
        <ArcLine key={i} points={pts} opacity={0.3 + (i % 3) * 0.08} />
      ))}

      {/* ── Animated planes on arcs ── */}
      {arcs.map((pts, i) => (
        <OrbitingPlane key={i} points={pts} speed={0.12 + i * 0.015} />
      ))}

      {/* ── City dots ── */}
      {cityPositions.map((pos, i) => (
        <CityDot key={i} position={pos} />
      ))}
    </group>
  );
}

// ─── Slow-drifting star field ─────────────────────────────────────────────────
function StarField() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.006;
      ref.current.rotation.x = clock.getElapsedTime() * 0.002;
    }
  });
  return (
    <group ref={ref}>
      <Stars radius={90} depth={60} count={5000} factor={4} saturation={0.4} fade speed={0.5} />
    </group>
  );
}

// ─── Scene wrapper — receives scroll ref ─────────────────────────────────────
function Scene({ scrollY }) {
  return (
    <>
      <StarField />
      {/* Cinematic lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[8, 5, 5]}   intensity={1.8} color="#ffffff" />
      <directionalLight position={[-6, -4, -4]} intensity={0.4} color="#3b82f6" />
      <pointLight       position={[0, 0, 6]}    intensity={0.6} color="#c9a84c" distance={12} />
      <Globe scrollY={scrollY} />
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
export default function CinematicGlobe() {
  const scrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene scrollY={scrollY} />
      </Canvas>
    </div>
  );
}
