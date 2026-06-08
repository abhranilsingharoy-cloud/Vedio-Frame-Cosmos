import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

function ParticleCloud({ count = 5000 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return [pos];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y -= delta * 0.05;
    pointsRef.current.rotation.x -= delta * 0.02;

    // Subtle mouse interaction
    const targetX = (state.pointer.x * Math.PI) / 10;
    const targetY = (state.pointer.y * Math.PI) / 10;
    pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.02;
    pointsRef.current.rotation.x += (targetY - pointsRef.current.rotation.x) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#8B5CF6"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingFrames() {
  const groupRef = useRef<THREE.Group>(null);
  
  const frames = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5 - 2
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 0.5
    }));
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.x += delta * 0.1 * (i % 2 === 0 ? 1 : -1);
      child.rotation.y += delta * 0.15 * (i % 3 === 0 ? 1 : -1);
      child.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005;
    });
  });

  return (
    <group ref={groupRef}>
      {frames.map((frame, i) => (
        <mesh key={i} position={frame.position} rotation={frame.rotation} scale={frame.scale}>
          <planeGeometry args={[1.6, 0.9]} />
          <meshPhysicalMaterial 
            color="#1e1e2e" 
            roughness={0.2} 
            metalness={0.8} 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
            transmission={0.9}
            thickness={1}
          />
          <lineSegments>
            <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.6, 0.9)]} />
            <lineBasicMaterial attach="material" color="#6366f1" opacity={0.5} transparent />
          </lineSegments>
        </mesh>
      ))}
    </group>
  );
}

export function Canvas3DBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#05050A]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#6366f1" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        
        <ParticleCloud />
        <FloatingFrames />
        
        {/* Environment for reflections on the glass materials */}
        <Environment preset="city" />
        
        <fog attach="fog" args={['#05050A', 3, 10]} />
      </Canvas>
    </div>
  );
}
