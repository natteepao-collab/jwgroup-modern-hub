import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Station Ramintra Main Tower
const MainTower = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  // Window grid for the main tower
  const windowsMain = useMemo(() => {
    const windows = [];
    const rows = 22;
    const cols = 6;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        windows.push(
          <mesh
            key={`main-${row}-${col}`}
            position={[
              -0.65 + col * 0.22,
              -3.2 + row * 0.28,
              0.51
            ]}
          >
            <planeGeometry args={[0.15, 0.2]} />
            <meshStandardMaterial
              color={row > 18 ? "#FFE4B5" : "#87CEEB"}
              emissive={row > 18 ? "#FFD700" : "#4A90D9"}
              emissiveIntensity={0.4}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        );
      }
    }
    return windows;
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {/* Main tower body - dark gray/blue */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 7, 1]} />
        <meshStandardMaterial
          color="#2C3E50"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Windows */}
      {windowsMain}
      
      {/* Back windows */}
      {windowsMain.map((_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        return (
          <mesh
            key={`back-${i}`}
            position={[
              -0.65 + col * 0.22,
              -3.2 + row * 0.28,
              -0.51
            ]}
            rotation={[0, Math.PI, 0]}
          >
            <planeGeometry args={[0.15, 0.2]} />
            <meshStandardMaterial
              color="#87CEEB"
              emissive="#4A90D9"
              emissiveIntensity={0.3}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        );
      })}
      
      {/* Rooftop structure */}
      <mesh position={[0, 3.7, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.8]} />
        <meshStandardMaterial color="#34495E" roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Orange accent frame on top */}
      <mesh position={[0, 4.1, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.6]} />
        <meshStandardMaterial 
          color="#D4812A" 
          emissive="#D4812A"
          emissiveIntensity={0.5}
          roughness={0.2} 
          metalness={0.8} 
        />
      </mesh>
      
      {/* Glass railing on rooftop */}
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[0.9, 0.3, 0.65]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent
          opacity={0.6}
          roughness={0.1} 
          metalness={0.9} 
        />
      </mesh>
      
      {/* Building base/podium */}
      <mesh position={[0, -3.8, 0.3]}>
        <boxGeometry args={[2, 0.6, 1.5]} />
        <meshStandardMaterial color="#8B7355" roughness={0.5} metalness={0.4} />
      </mesh>
      
      {/* Ground floor with lights */}
      <mesh position={[0, -4.2, 0.3]}>
        <boxGeometry args={[2.2, 0.3, 1.6]} />
        <meshStandardMaterial 
          color="#FFE4B5" 
          emissive="#FFD700"
          emissiveIntensity={0.3}
          roughness={0.3} 
          metalness={0.5} 
        />
      </mesh>
      
      {/* JW Logo placeholder on building */}
      <mesh position={[0, -2.5, 0.52]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshStandardMaterial 
          color="#D4812A" 
          emissive="#D4812A"
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// Adjacent Shorter Tower
const SideTower = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + 1) * 0.04;
    }
  });

  // Window grid for side tower
  const windowsSide = useMemo(() => {
    const windows = [];
    const rows = 14;
    const cols = 5;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        windows.push(
          <mesh
            key={`side-${row}-${col}`}
            position={[
              -0.5 + col * 0.22,
              -2 + row * 0.28,
              0.41
            ]}
          >
            <planeGeometry args={[0.14, 0.18]} />
            <meshStandardMaterial
              color="#FFE4B5"
              emissive="#FFD700"
              emissiveIntensity={0.35}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        );
      }
    }
    return windows;
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {/* Side tower body - beige/cream color */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.3, 4.5, 0.8]} />
        <meshStandardMaterial
          color="#C4A574"
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
      
      {/* Windows */}
      {windowsSide}
      
      {/* Rooftop accent */}
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[1.1, 0.15, 0.7]} />
        <meshStandardMaterial color="#D4812A" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Base connection */}
      <mesh position={[0, -2.5, 0.2]}>
        <boxGeometry args={[1.5, 0.5, 1]} />
        <meshStandardMaterial color="#8B7355" roughness={0.5} metalness={0.4} />
      </mesh>
    </group>
  );
};

// BTS/Train Track
const TrainTrack = ({ position }: { position: [number, number, number] }) => {
  const trainRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (trainRef.current) {
      // Train moving along the track
      trainRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 3;
    }
  });

  return (
    <group position={position}>
      {/* Track pillars */}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh key={i} position={[x, -0.8, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 1.6, 8]} />
          <meshStandardMaterial color="#555555" roughness={0.6} metalness={0.4} />
        </mesh>
      ))}
      
      {/* Track beam */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 0.15, 0.4]} />
        <meshStandardMaterial color="#444444" roughness={0.5} metalness={0.5} />
      </mesh>
      
      {/* Rails */}
      <mesh position={[0, 0.1, 0.12]}>
        <boxGeometry args={[8, 0.05, 0.05]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.1, -0.12]}>
        <boxGeometry args={[8, 0.05, 0.05]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Train */}
      <mesh ref={trainRef} position={[0, 0.35, 0]}>
        <boxGeometry args={[1.2, 0.35, 0.3]} />
        <meshStandardMaterial 
          color="#2E7D32" 
          roughness={0.3} 
          metalness={0.7} 
        />
      </mesh>
    </group>
  );
};

// Background Buildings
const BackgroundBuilding = ({ 
  position, 
  size, 
  color 
}: { 
  position: [number, number, number]; 
  size: [number, number, number];
  color: string;
}) => {
  return (
    <Float speed={0.3} rotationIntensity={0} floatIntensity={0.1}>
      <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
};

// Cloud
const Cloud = ({ position }: { position: [number, number, number] }) => {
  const cloudRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#FFB6C1" transparent opacity={0.6} roughness={1} />
      </mesh>
      <mesh position={[0.3, 0.1, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#FFC0CB" transparent opacity={0.5} roughness={1} />
      </mesh>
      <mesh position={[-0.25, 0.05, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#FFB6C1" transparent opacity={0.5} roughness={1} />
      </mesh>
    </group>
  );
};

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation for parallax effect
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Station Ramintra Tower */}
      <MainTower position={[0.3, 0.5, 0]} />
      
      {/* Adjacent shorter tower */}
      <SideTower position={[1.5, -0.8, 0.3]} />
      
      {/* BTS Track */}
      <TrainTrack position={[-1.5, -3.5, 1.5]} />
      
      {/* Background buildings */}
      <BackgroundBuilding position={[4, -1.5, -3]} size={[1, 3, 0.8]} color="#5D6D7E" />
      <BackgroundBuilding position={[5, -2, -4]} size={[0.8, 2, 0.6]} color="#85929E" />
      <BackgroundBuilding position={[-3.5, -2, -3]} size={[0.9, 2.5, 0.7]} color="#5D6D7E" />
      <BackgroundBuilding position={[-4.5, -2.5, -4]} size={[1.2, 1.5, 0.8]} color="#7F8C8D" />
      <BackgroundBuilding position={[3, -2.5, -5]} size={[1.5, 1.8, 1]} color="#616A6B" />
      
      {/* Pink clouds for sunset effect */}
      <Cloud position={[3, 4, -5]} />
      <Cloud position={[-3, 3.5, -6]} />
      <Cloud position={[0, 4.5, -7]} />
      
      {/* Ground/Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]}>
        <planeGeometry args={[15, 12]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.3} 
          metalness={0.6}
        />
      </mesh>
      
      {/* Road markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.48, 2]}>
        <planeGeometry args={[0.1, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Street lights glow */}
      {[-2, 0, 2].map((x, i) => (
        <pointLight key={i} position={[x, -3.5, 2]} intensity={0.2} color="#FFE4B5" distance={3} />
      ))}
    </group>
  );
};

const Hero3DBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1.5, 8], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Dusk/Evening lighting */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} color="#FFE4C4" />
        <directionalLight position={[-5, 8, -3]} intensity={0.4} color="#FFB6C1" />
        <pointLight position={[0, 5, 5]} intensity={0.5} color="#D4812A" />
        <pointLight position={[-3, 2, 3]} intensity={0.3} color="#87CEEB" />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#1a1a3a', 10, 25]} />
        
        <Scene />
      </Canvas>
    </div>
  );
};

export default Hero3DBackground;