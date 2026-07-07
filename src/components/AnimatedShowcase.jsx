import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, ContactShadows, Float, PresentationControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const G = '#c9a84c';

const THEMES = {
  aurora: {
    parts: [
      { keywords: ['head','helmet','hair','face','neck'],  color: '#FF6B9D', emissive: '#8b1a4a', metalness: 0.3, roughness: 0.4 },
      { keywords: ['body','torso','chest','jacket','coat','shirt','upper'], color: '#C084FC', emissive: '#5b21b6', metalness: 0.5, roughness: 0.25 },
      { keywords: ['arm','hand','glove','sleeve','forearm','wrist','elbow'], color: '#22D3EE', emissive: '#0e7490', metalness: 0.6, roughness: 0.2 },
      { keywords: ['leg','pant','thigh','knee','shin','calf','trousers'],   color: '#818CF8', emissive: '#3730a3', metalness: 0.4, roughness: 0.3 },
      { keywords: ['boot','shoe','foot','ankle','sole'],  color: '#E879F9', emissive: '#86198f', metalness: 0.7, roughness: 0.15 },
      { keywords: ['belt','strap','pouch','pocket','buckle'],color: '#34D399', emissive: '#065f46', metalness: 0.8, roughness: 0.1 },
    ],
    orbs: ['#C084FC', '#22D3EE', '#FF6B9D', '#818CF8', '#E879F9'],
  },
  sunset: {
    parts: [
      { keywords: ['head','helmet','hair','face','neck'],  color: '#F97316', emissive: '#7c2d12', metalness: 0.3, roughness: 0.4 },
      { keywords: ['body','torso','chest','jacket','coat','shirt','upper'], color: '#EF4444', emissive: '#7f1d1d', metalness: 0.5, roughness: 0.25 },
      { keywords: ['arm','hand','glove','sleeve','forearm','wrist','elbow'], color: '#FBBF24', emissive: '#78350f', metalness: 0.6, roughness: 0.2 },
      { keywords: ['leg','pant','thigh','knee','shin','calf','trousers'],   color: '#F43F5E', emissive: '#881337', metalness: 0.4, roughness: 0.3 },
      { keywords: ['boot','shoe','foot','ankle','sole'],  color: '#DC2626', emissive: '#450a0a', metalness: 0.7, roughness: 0.15 },
      { keywords: ['belt','strap','pouch','pocket','buckle'],color: '#D97706', emissive: '#451a03', metalness: 0.8, roughness: 0.1 },
    ],
    orbs: ['#EF4444', '#FBBF24', '#F97316', '#F43F5E', '#DC2626'],
  },
  ocean: {
    parts: [
      { keywords: ['head','helmet','hair','face','neck'],  color: '#06B6D4', emissive: '#164e63', metalness: 0.3, roughness: 0.4 },
      { keywords: ['body','torso','chest','jacket','coat','shirt','upper'], color: '#0EA5E9', emissive: '#0c4a6e', metalness: 0.5, roughness: 0.25 },
      { keywords: ['arm','hand','glove','sleeve','forearm','wrist','elbow'], color: '#67E8F9', emissive: '#155e75', metalness: 0.6, roughness: 0.2 },
      { keywords: ['leg','pant','thigh','knee','shin','calf','trousers'],   color: '#1E40AF', emissive: '#1e3a8a', metalness: 0.4, roughness: 0.3 },
      { keywords: ['boot','shoe','foot','ankle','sole'],  color: '#0369A1', emissive: '#0c4a6e', metalness: 0.7, roughness: 0.15 },
      { keywords: ['belt','strap','pouch','pocket','buckle'],color: '#0F172A', emissive: '#020617', metalness: 0.8, roughness: 0.1 },
    ],
    orbs: ['#0EA5E9', '#67E8F9', '#06B6D4', '#1E40AF', '#0369A1'],
  },
  neon: {
    parts: [
      { keywords: ['head','helmet','hair','face','neck'],  color: '#FF0080', emissive: '#701a75', metalness: 0.3, roughness: 0.4 },
      { keywords: ['body','torso','chest','jacket','coat','shirt','upper'], color: '#7928CA', emissive: '#3b0764', metalness: 0.5, roughness: 0.25 },
      { keywords: ['arm','hand','glove','sleeve','forearm','wrist','elbow'], color: '#00DFD8', emissive: '#134e4a', metalness: 0.6, roughness: 0.2 },
      { keywords: ['leg','pant','thigh','knee','shin','calf','trousers'],   color: '#FF4D4D', emissive: '#7f1d1d', metalness: 0.4, roughness: 0.3 },
      { keywords: ['boot','shoe','foot','ankle','sole'],  color: '#FFE600', emissive: '#78350f', metalness: 0.7, roughness: 0.15 },
      { keywords: ['belt','strap','pouch','pocket','buckle'],color: '#00FF9F', emissive: '#064e3b', metalness: 0.8, roughness: 0.1 },
    ],
    orbs: ['#7928CA', '#00DFD8', '#FF0080', '#FF4D4D', '#FFE600'],
  },
};

const FALLBACK = { color: '#94A3B8', emissive: '#1e293b', metalness: 0.5, roughness: 0.3 };

function getPartStyle(name, palette) {
  const n = (name || '').toLowerCase();
  for (const rule of palette) {
    if (rule.keywords.some(k => n.includes(k))) return rule;
  }
  return FALLBACK;
}

function GuideCharacter({ theme = 'aurora' }) {
  const group    = useRef();
  const matsRef  = useRef([]);
  const { scene, animations } = useGLTF('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/Soldier.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const clip = actions['Walk'] || actions[Object.keys(actions)[0]];
    if (clip) { clip.play(); clip.timeScale = 0.75; }
  }, [actions]);

  useEffect(() => {
    const palette = THEMES[theme]?.parts || THEMES.aurora.parts;
    matsRef.current = [];

    scene.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow    = true;
      child.receiveShadow = true;

      const style = getPartStyle(child.name, palette);
      const mat = new THREE.MeshStandardMaterial({
        color:            new THREE.Color(style.color),
        emissive:         new THREE.Color(style.emissive),
        emissiveIntensity: 0.25,
        metalness:        style.metalness,
        roughness:        style.roughness,
        envMapIntensity:  2.0,
      });

      child.material = mat;
      matsRef.current.push({ mat, baseColor: new THREE.Color(style.color), idx: child.name.charCodeAt(0) || 0 });
    });
  }, [scene, theme]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    matsRef.current.forEach(({ mat, baseColor, idx: i }) => {
      mat.emissiveIntensity = 0.2 + 0.15 * Math.sin(t * 1.2 + i * 0.9);
      const shift = Math.sin(t * 0.4 + i * 1.1) * 0.04;
      mat.color.setHSL(
        ((baseColor.getHSL({}).h || 0) + shift + 1) % 1,
        0.75 + 0.1 * Math.sin(t * 0.6 + i),
        0.52 + 0.06 * Math.sin(t * 0.8 + i * 0.5),
      );
    });
  });

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1.25}
      position={[0, -1.8, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

function FloatingOrbs({ theme = 'aurora' }) {
  const group = useRef();
  const orbs = THEMES[theme]?.orbs || THEMES.aurora.orbs;
  useFrame(({ clock }) => { group.current.rotation.y = clock.elapsedTime * 0.18; });
  return (
    <group ref={group}>
      {/* Teal torus-knot */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2} position={[1.6, 0.6, -1]}>
        <mesh castShadow>
          <torusKnotGeometry args={[0.28, 0.09, 128, 32]} />
          <meshStandardMaterial color={orbs[0]} emissive="#007a72" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>
      {/* Violet octahedron */}
      <Float speed={3} rotationIntensity={2} floatIntensity={2} position={[-1.6, -0.4, 0.8]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color={orbs[1]} emissive="#5b21b6" emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
      {/* Coral icosahedron */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={3} position={[0.2, 1.6, -1.2]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color={orbs[2]} emissive="#cc2200" emissiveIntensity={0.4} metalness={0.7} roughness={0.15} />
        </mesh>
      </Float>
      {/* Orange sphere */}
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5} position={[-0.8, 1.2, -0.6]}>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={orbs[3]} emissive="#c04a00" emissiveIntensity={0.5} metalness={0.6} roughness={0.2} />
        </mesh>
      </Float>
      {/* Emerald diamond */}
      <Float speed={1.8} rotationIntensity={2} floatIntensity={2} position={[1.2, -0.8, 0.4]}>
        <mesh castShadow>
          <dodecahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color={orbs[4]} emissive="#065f46" emissiveIntensity={0.4} metalness={0.9} roughness={0.05} />
        </mesh>
      </Float>
    </group>
  );
}

function CameraRig() {
  useFrame(state => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x*2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1+state.mouse.y, 0.05);
    state.camera.lookAt(0,-0.5,0);
  });
  return null;
}

export default function AnimatedShowcase() {
  const [theme, setTheme] = useState('aurora');
  const themeColors = THEMES[theme]?.parts || THEMES.aurora.parts;
  const representative = themeColors.map(p => p.color);
  return (
    <section className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#050a14 0%,#060d1a 100%)', borderTop:'1px solid rgba(201,168,76,0.1)', borderBottom:'1px solid rgba(201,168,76,0.1)' }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ background:'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 65%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">

        {/* 3D Canvas */}
        <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
          transition={{ duration:0.9 }}
          className="w-full lg:w-1/2 h-[500px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 0 60px rgba(201,168,76,0.08)' }}>
          <Canvas shadows camera={{ position:[0,1,5], fov:45 }}>
            <color attach="background" args={['#050a14']} />
            <fog attach="fog" args={['#050a14',6,15]} />
            {/* Warm key light */}
            <ambientLight intensity={0.5} />
            <spotLight position={[4,6,4]}   angle={0.25} penumbra={1} intensity={2.5} castShadow color="#fff5e0" />
            {/* Cool fill from left */}
            <spotLight position={[-4,4,-4]} angle={0.3}  penumbra={1} intensity={1.2} color="#a78bfa" />
            {/* Teal rim from below-right */}
            <pointLight position={[2,-1,3]}  intensity={1.0} color="#4ECDC4" distance={8} />
            {/* Red accent from top-left */}
            <pointLight position={[-3,3,1]}  intensity={0.8} color="#FF6B6B" distance={8} />
            {/* Gold under-glow */}
            <pointLight position={[0,-0.5,2]} intensity={0.5} color="#FFE66D" distance={5} />
            <Suspense fallback={null}>
              <PresentationControls config={{ mass:2, tension:500 }} snap={{ mass:4, tension:1500 }}
                polar={[-Math.PI/4,Math.PI/4]} azimuth={[-Math.PI/2,Math.PI/2]}>
                <GuideCharacter theme={theme} />
                <FloatingOrbs theme={theme} />
              </PresentationControls>
              <Environment preset="city" />
              <ContactShadows position={[0,-1.5,0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#000033" />
            </Suspense>
            <CameraRig />
          </Canvas>
          {/* Theme switcher */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
            {Object.keys(THEMES).map(key => (
              <button key={key} onClick={() => setTheme(key)} className="relative w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110" style={{ borderColor: theme === key ? '#f1f5f9' : 'transparent', boxShadow: theme === key ? '0 0 12px rgba(255,255,255,0.25)' : 'none' }} title={key.charAt(0).toUpperCase() + key.slice(1)}>
                {representative.slice(0, 4).map((c, i) => (
                  <span key={i} className="absolute rounded-full" style={{ top: `${i * 25}%`, left: `${i * 25}%`, width: '50%', height: '50%', backgroundColor: c }} />
                ))}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Text */}
        <motion.div initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
          transition={{ duration:0.9 }} className="w-full lg:w-1/2">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color:G }}>Interactive Experience</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily:'Cinzel,serif', color:'#f1f5f9' }}>
            Meet Your <br />
            <span style={{ background:'linear-gradient(135deg,#f0c060,#c9a84c,#a07830)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Virtual Guide
            </span>
          </h2>
          <p className="text-lg mb-8 leading-relaxed" style={{ color:'#64748b' }}>
            Our intelligent 3D virtual guide is fully interactive — drag to explore. Designed to help you
            navigate our catalog and discover the perfect destination for your next adventure.
          </p>
          <ul className="space-y-4 mb-10">
            {['Interactive 3D Travel Assistance','Real-time Destination Previews','Personalised Itinerary Curation'].map(item => (
              <li key={item} className="flex items-center gap-3" style={{ color:'#94a3b8' }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background:G, boxShadow:`0 0 8px ${G}` }} />
                {item}
              </li>
            ))}
          </ul>
          <a href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300"
            style={{ background:'transparent', border:`1px solid rgba(201,168,76,0.4)`, color:G }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor=G; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(201,168,76,0.4)'; }}>
            Explore Now
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
