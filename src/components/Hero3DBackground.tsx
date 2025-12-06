import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Box, Torus, Icosahedron } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const FloatingShape = ({ 
  position, 
  shape, 
  color, 
  speed = 1,
  distort = 0.3
}: { 
  position: [number, number, number]; 
  shape: 'sphere' | 'box' | 'torus' | 'icosahedron';
  color: string;
  speed?: number;
  distort?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed;
    }
  });

  const ShapeComponent = useMemo(() => {
    switch (shape) {
      case 'sphere':
        return (
          <Sphere ref={meshRef} args={[1, 32, 32]}>
            <MeshDistortMaterial
              color={color}
              attach="material"
              distort={distort}
              speed={2}
              roughness={0.4}
              metalness={0.8}
            />
          </Sphere>
        );
      case 'box':
        return (
          <Box ref={meshRef} args={[1.5, 1.5, 1.5]}>
            <meshStandardMaterial
              color={color}
              roughness={0.3}
              metalness={0.9}
            />
          </Box>
        );
      case 'torus':
        return (
          <Torus ref={meshRef} args={[1, 0.4, 16, 32]}>
            <meshStandardMaterial
              color={color}
              roughness={0.2}
              metalness={0.85}
            />
          </Torus>
        );
      case 'icosahedron':
        return (
          <Icosahedron ref={meshRef} args={[1, 0]}>
            <meshStandardMaterial
              color={color}
              roughness={0.3}
              metalness={0.9}
              flatShading
            />
          </Icosahedron>
        );
      default:
        return null;
    }
  }, [shape, color, distort]);

  return (
    <Float
      speed={speed}
      rotationIntensity={0.5}
      floatIntensity={1.5}
      floatingRange={[-0.2, 0.2]}
    >
      <group position={position} scale={0.8}>
        {ShapeComponent}
      </group>
    </Float>
  );
};

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary accent color shapes */}
      <FloatingShape position={[-4, 2, -3]} shape="sphere" color="#D4812A" speed={0.8} distort={0.4} />
      <FloatingShape position={[4, -1, -4]} shape="torus" color="#D4812A" speed={1.2} />
      
      {/* Secondary dark shapes */}
      <FloatingShape position={[3, 2.5, -5]} shape="icosahedron" color="#3C2A1E" speed={0.6} />
      <FloatingShape position={[-3, -2, -4]} shape="box" color="#1e293b" speed={1} />
      
      {/* Background accent shapes */}
      <FloatingShape position={[0, 3, -8]} shape="sphere" color="#0F172A" speed={0.4} distort={0.2} />
      <FloatingShape position={[-5, 0, -6]} shape="torus" color="#475569" speed={0.7} />
      <FloatingShape position={[5, 1, -7]} shape="icosahedron" color="#64748b" speed={0.5} />
      
      {/* Additional depth shapes */}
      <FloatingShape position={[1, -3, -5]} shape="sphere" color="#D4812A" speed={0.9} distort={0.3} />
      <FloatingShape position={[-2, 1.5, -6]} shape="box" color="#334155" speed={0.8} />
    </group>
  );
};

const Hero3DBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#D4812A" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#D4812A" />
        <Scene />
      </Canvas>
    </div>
  );
};

export default Hero3DBackground;
