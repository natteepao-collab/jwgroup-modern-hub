import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

// Modern Building Component
const Building = ({ 
  position, 
  size, 
  color,
  windowColor = "#87CEEB",
  speed = 1
}: { 
  position: [number, number, number]; 
  size: [number, number, number];
  color: string;
  windowColor?: string;
  speed?: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1;
    }
  });

  const [width, height, depth] = size;
  const windowRows = Math.floor(height / 0.4);
  const windowCols = Math.floor(width / 0.3);

  return (
    <group ref={groupRef} position={position}>
      {/* Main building body */}
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      
      {/* Windows on front */}
      {Array.from({ length: windowRows }).map((_, row) => 
        Array.from({ length: windowCols }).map((_, col) => (
          <mesh
            key={`front-${row}-${col}`}
            position={[
              -width / 2 + 0.2 + col * 0.3,
              -height / 2 + 0.3 + row * 0.4,
              depth / 2 + 0.01
            ]}
          >
            <planeGeometry args={[0.15, 0.25]} />
            <meshStandardMaterial
              color={windowColor}
              emissive={windowColor}
              emissiveIntensity={0.3}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        ))
      )}
      
      {/* Windows on back */}
      {Array.from({ length: windowRows }).map((_, row) => 
        Array.from({ length: windowCols }).map((_, col) => (
          <mesh
            key={`back-${row}-${col}`}
            position={[
              -width / 2 + 0.2 + col * 0.3,
              -height / 2 + 0.3 + row * 0.4,
              -depth / 2 - 0.01
            ]}
            rotation={[0, Math.PI, 0]}
          >
            <planeGeometry args={[0.15, 0.25]} />
            <meshStandardMaterial
              color={windowColor}
              emissive={windowColor}
              emissiveIntensity={0.3}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        ))
      )}
      
      {/* Roof accent */}
      <mesh position={[0, height / 2 + 0.05, 0]}>
        <boxGeometry args={[width + 0.1, 0.1, depth + 0.1]} />
        <meshStandardMaterial color="#D4812A" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
};

// Modern Tower with glass effect
const GlassTower = ({ 
  position, 
  height = 4,
  width = 1,
  color = "#1e3a5f"
}: { 
  position: [number, number, number]; 
  height?: number;
  width?: number;
  color?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
      <group position={position}>
        <mesh ref={meshRef}>
          <boxGeometry args={[width, height, width * 0.6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.1}
            metalness={0.95}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Antenna/Spire on top */}
        <mesh position={[0, height / 2 + 0.3, 0]}>
          <cylinderGeometry args={[0.02, 0.05, 0.6, 8]} />
          <meshStandardMaterial color="#D4812A" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
};

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main tall buildings - center cluster */}
      <GlassTower position={[0, 0.5, -3]} height={5} width={1.2} color="#0F172A" />
      <GlassTower position={[-1.8, 0, -4]} height={4} width={1} color="#1e293b" />
      <GlassTower position={[2, 0.2, -3.5]} height={4.5} width={1.1} color="#334155" />
      
      {/* Secondary buildings */}
      <Building 
        position={[-3.5, -0.5, -5]} 
        size={[1.5, 3, 1]} 
        color="#3C2A1E" 
        windowColor="#FFD700"
        speed={0.8}
      />
      <Building 
        position={[3.8, -0.3, -4.5]} 
        size={[1.2, 2.5, 0.8]} 
        color="#1e293b" 
        windowColor="#87CEEB"
        speed={1.2}
      />
      
      {/* Background smaller buildings */}
      <Building 
        position={[-5, -1, -7]} 
        size={[1, 2, 0.8]} 
        color="#475569" 
        windowColor="#FFE4B5"
        speed={0.6}
      />
      <Building 
        position={[5.5, -0.8, -6]} 
        size={[0.9, 1.8, 0.7]} 
        color="#64748b" 
        windowColor="#87CEEB"
        speed={0.9}
      />
      <GlassTower position={[-2.5, -0.2, -6]} height={3} width={0.8} color="#475569" />
      <GlassTower position={[4.2, 0, -5.5]} height={3.5} width={0.9} color="#1e3a5f" />
      
      {/* Far background buildings */}
      <Building 
        position={[0, -1.2, -9]} 
        size={[2, 2.5, 1]} 
        color="#0F172A" 
        windowColor="#D4812A"
        speed={0.4}
      />
      <GlassTower position={[-4, -0.5, -8]} height={2.5} width={0.7} color="#334155" />
      <GlassTower position={[6, -0.6, -8]} height={2} width={0.6} color="#1e293b" />
      
      {/* Ground plane with subtle reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, -5]}>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.2} 
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

const Hero3DBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 15, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-10, 10, -5]} intensity={0.4} color="#D4812A" />
        <pointLight position={[0, 5, 8]} intensity={0.6} color="#D4812A" />
        <pointLight position={[-5, 3, 0]} intensity={0.3} color="#87CEEB" />
        <fog attach="fog" args={['#0F172A', 8, 20]} />
        <Scene />
      </Canvas>
    </div>
  );
};

export default Hero3DBackground;