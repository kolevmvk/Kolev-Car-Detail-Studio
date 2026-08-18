"use client";

import { Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type HeroCanvasProps = {
  photoSrc: string;
  progressRef: React.MutableRefObject<number>;
  lowPower: boolean;
};

/**
 * The photo is not a flat image here — it is a lit, physically-shaded plane
 * standing in a real (CC0) workshop light environment. As the camera moves
 * on scroll, the studio HDRI sweeps a real specular highlight across the
 * lacquer-like surface, the way light moves across a car's paint.
 *
 * A custom vertex displacement (patched into the built-in PBR shader via
 * onBeforeCompile) adds a slow, subtle ripple — kept physically correct
 * lighting while still being a bespoke shader, not a stock material.
 */
function PaintPlane({ photoSrc, progressRef }: Pick<HeroCanvasProps, "photoSrc" | "progressRef">) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const uniformsRef = useRef({
    uProgress: { value: 0 },
    uTime: { value: 0 },
  });

  const [photoTexture, setPhotoTexture] = useState<THREE.Texture | null>(null);
  const [aspect, setAspect] = useState(16 / 9);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(photoSrc, (tex) => {
      if (cancelled) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      setPhotoTexture(tex);
      if (tex.image) setAspect(tex.image.width / tex.image.height);
    });
    return () => {
      cancelled = true;
    };
  }, [photoSrc]);

  const handleBeforeCompile = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    const u = uniformsRef.current;
    shader.uniforms.uProgress = u.uProgress;
    shader.uniforms.uTime = u.uTime;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uProgress;
        uniform float uTime;`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float ripple = sin(position.x * 2.4 + uTime * 0.35) * cos(position.y * 1.6 - uTime * 0.22);
        transformed.z += ripple * 0.045 * (0.35 + uProgress * 0.65);`
      );
  };

  useFrame((state) => {
    const p = progressRef.current;
    const u = uniformsRef.current;
    u.uProgress.value = p;
    u.uTime.value = state.clock.elapsedTime;

    const cam = state.camera;
    cam.position.x = THREE.MathUtils.lerp(-0.15, 0.85, p);
    cam.position.y = THREE.MathUtils.lerp(0.05, 0.42, p);
    cam.position.z = THREE.MathUtils.lerp(4.1, 2.15, p);
    cam.rotation.z = THREE.MathUtils.lerp(0, -0.018, p);
    cam.lookAt(0, THREE.MathUtils.lerp(0, 0.08, p), 0);

    const mat = materialRef.current;
    if (mat) {
      mat.clearcoatRoughness = THREE.MathUtils.lerp(0.28, 0.08, p);
      mat.envMapIntensity = THREE.MathUtils.lerp(0.9, 1.6, p);
    }
  });

  if (!photoTexture) return null;

  const planeHeight = 3.4;
  const planeWidth = planeHeight * aspect;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[planeWidth, planeHeight, 64, 36]} />
      <meshPhysicalMaterial
        ref={materialRef}
        map={photoTexture}
        roughness={0.42}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.2}
        envMapIntensity={0.9}
        onBeforeCompile={handleBeforeCompile}
      />
    </mesh>
  );
}

export function HeroCanvas({ photoSrc, progressRef, lowPower }: HeroCanvasProps) {
  return (
    <Canvas
      dpr={lowPower ? [1, 1.3] : [1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, position: [-0.15, 0.05, 4.1] }}
      onCreated={({ scene }) => {
        scene.background = null;
      }}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[2, 3, 2]} intensity={0.4} />
      <Environment files="/hdri/aerodynamics_workshop_1k.hdr" environmentIntensity={1.1} />
      <PaintPlane photoSrc={photoSrc} progressRef={progressRef} />
    </Canvas>
  );
}
