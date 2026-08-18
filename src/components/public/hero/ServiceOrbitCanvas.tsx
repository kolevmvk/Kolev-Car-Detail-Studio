"use client";

import { Environment, MeshReflectorMaterial, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Abstract, stylized car silhouette — deliberately not a photoreal specific
 * vehicle (no license-clean 3D car model exists for an "ordinary everyday
 * car" — see assets/SOURCES.md discussion). Built from primitives in the
 * site's own material language (dark charcoal body, gold accent trim) so it
 * reads as a genuine 3D object that can actually rotate 360°, rather than
 * the flat segmented-photo cutout used in the S01/S07 spatial scenes.
 */
function CarForm({ pulse }: { pulse: React.MutableRefObject<number> }) {
  const trimRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!trimRef.current) return;
    const mat = trimRef.current.material as THREE.MeshStandardMaterial;
    const target = 0.4 + pulse.current * 1.8;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, target, 0.08);
    void state;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Body — soft-rounded, not boxy */}
      <RoundedBox args={[2.8, 0.52, 1.28]} radius={0.14} smoothness={4} position={[0, 0.52, 0]} castShadow>
        <meshPhysicalMaterial color="#151210" roughness={0.28} metalness={0.35} clearcoat={1} clearcoatRoughness={0.15} envMapIntensity={1.6} />
      </RoundedBox>
      {/* Cabin, tapered toward the rear via a slight rotation cue */}
      <RoundedBox
        args={[1.3, 0.4, 1.02]}
        radius={0.16}
        smoothness={4}
        position={[-0.12, 0.92, 0]}
        castShadow
      >
        <meshPhysicalMaterial color="#0d0c0b" roughness={0.1} metalness={0.15} transparent opacity={0.9} envMapIntensity={2} />
      </RoundedBox>
      {/* Gold beltline pinstripes — thin strips along each side, not a
          full deck (a wide flat plate reads as a slab, not trim) */}
      {[1, -1].map((side) => (
        <mesh key={side} ref={side === 1 ? trimRef : undefined} position={[0, 0.76, side * 0.655]}>
          <boxGeometry args={[2.7, 0.028, 0.03]} />
          <meshStandardMaterial color="#c4913a" emissive="#c4913a" emissiveIntensity={0.45} roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* Wheels — tucked near the corners, under the body's footprint */}
      {[
        [1.0, 0.3, 0.6],
        [1.0, 0.3, -0.6],
        [-1.0, 0.3, 0.6],
        [-1.0, 0.3, -0.6],
      ].map(([x, y, z]) => (
        <group key={`${x}-${z}`} position={[x, y, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 28]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.4} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.01 * Math.sign(z || 1), 0, 0]}>
            <torusGeometry args={[0.14, 0.018, 8, 20]} />
            <meshStandardMaterial color="#c4913a" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * A fixed FOV frames a wide, low object fine on a landscape viewport but
 * crops it badly on a narrow portrait one (perspective FOV is vertical, so
 * a tall/narrow canvas sees proportionally less width). Widen the FOV as
 * the viewport gets taller relative to its width so the whole car stays in
 * frame on mobile — adjusting FOV rather than camera distance/position so
 * this never fights OrbitControls, which owns position every frame.
 */
function ResponsiveCamera() {
  const lastAspect = useRef(0);

  useFrame((state) => {
    const { width, height } = state.size;
    const aspect = width / height;
    if (Math.abs(aspect - lastAspect.current) < 0.01) return;
    lastAspect.current = aspect;
    const cam = state.camera;
    if (!(cam instanceof THREE.PerspectiveCamera)) return;
    cam.fov = aspect >= 1.4 ? 32 : THREE.MathUtils.clamp(32 * (1.4 / Math.max(aspect, 0.4)), 32, 68);
    cam.updateProjectionMatrix();
  });

  return null;
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[24, 24]} />
      <MeshReflectorMaterial
        resolution={768}
        mirror={0.55}
        blur={[240, 80]}
        mixBlur={8}
        mixStrength={1.3}
        roughness={0.85}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.3}
        color="#08080a"
        metalness={0.35}
      />
    </mesh>
  );
}

export type ServiceOrbitCanvasProps = {
  lowPower: boolean;
  pulse: React.MutableRefObject<number>;
};

export function ServiceOrbitCanvas({ lowPower, pulse }: ServiceOrbitCanvasProps) {
  return (
    <Canvas
      dpr={lowPower ? [1, 1.3] : [1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, position: [3.6, 1.7, 4.2] }}
      shadows={!lowPower}
      onCreated={({ scene, gl }) => {
        scene.background = null;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <fog attach="fog" args={["#0d0d0d", 6, 13]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={1.15} castShadow={!lowPower} />
      <Environment files="/hdri/aerodynamics_workshop_1k.hdr" environmentIntensity={1.3} />

      <ResponsiveCamera />
      <CarForm pulse={pulse} />
      <Floor />

      <OrbitControls
        target={[0, 0.65, 0]}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2 - 0.32}
        maxPolarAngle={Math.PI / 2 - 0.04}
        autoRotate
        autoRotateSpeed={1.1}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
      />

      {!lowPower && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom intensity={0.22} luminanceThreshold={0.75} luminanceSmoothing={0.2} mipmapBlur radius={0.4} />
          <Vignette eskil={false} offset={0.3} darkness={0.55} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
