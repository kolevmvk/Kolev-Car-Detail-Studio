"use client";

import { Environment, MeshReflectorMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type SpatialCanvasProps = {
  bgSrc: string;
  carSrc: string;
  mirrorText: string;
  progressRef: React.MutableRefObject<number>;
  lowPower: boolean;
  /** yaw sweep in radians the camera arcs through as progress goes 0 -> 1 */
  yawRange?: [number, number];
  fogColor?: string;
  /** pause the render loop entirely while the scene is off-screen */
  active: boolean;
};

function useTexture(src: string, colorSpace: THREE.ColorSpace) {
  const [state, setState] = useState<{ texture: THREE.Texture; aspect: number } | null>(null);
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(src, (tex) => {
      if (cancelled) return;
      tex.colorSpace = colorSpace;
      tex.anisotropy = 4;
      const image = tex.image as HTMLImageElement;
      setState({ texture: tex, aspect: image.width / image.height });
    });
    return () => {
      cancelled = true;
    };
  }, [src, colorSpace]);
  return state;
}

/** Offscreen-canvas texture of the wordmark — real geometry, so the floor
 * reflector genuinely mirrors it, not a DOM overlay pretending to. */
function useWordmarkTexture(text: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f3efe8";
    ctx.font = "600 150px Georgia, 'Times New Roman', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "18px";
    ctx.fillText(text.toUpperCase(), canvas.width / 2 + 9, canvas.height / 2 + 8);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [text]);
}

function BackgroundPlane({ src }: { src: string }) {
  const state = useTexture(src, THREE.SRGBColorSpace);
  if (!state) return null;
  const h = 5.6;
  return (
    <mesh position={[0, 1.05, -5.5]}>
      <planeGeometry args={[h * state.aspect, h]} />
      <meshBasicMaterial map={state.texture} toneMapped={false} fog transparent opacity={0.92} />
    </mesh>
  );
}

function CarPlane({
  src,
  materialRef,
}: {
  src: string;
  materialRef: React.MutableRefObject<THREE.MeshPhysicalMaterial | null>;
}) {
  const state = useTexture(src, THREE.SRGBColorSpace);
  if (!state) return null;
  const h = 1.85;
  return (
    <mesh position={[0, h / 2 - 0.02, 0]} castShadow>
      <planeGeometry args={[h * state.aspect, h, 24, 12]} />
      <meshPhysicalMaterial
        ref={materialRef}
        map={state.texture}
        transparent
        // Deliberately a hard cutoff, not smooth alpha blending: the source
        // segmentation's edge pixels carry old-background color
        // contamination, so blending them in reads as a hazy halo around
        // the car — a harder discard threshold hides that better than a
        // "more correct" soft edge does, given this specific asset.
        alphaTest={0.4}
        roughness={0.38}
        metalness={0.25}
        clearcoat={1}
        clearcoatRoughness={0.15}
        envMapIntensity={1.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Wordmark({ text }: { text: string }) {
  const texture = useWordmarkTexture(text);
  return (
    <mesh position={[0, 0.01, 1.35]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.4, 0.85]} />
      <meshBasicMaterial map={texture} transparent opacity={0.85} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

function Floor({ lowPower }: { lowPower: boolean }) {
  if (lowPower) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0c0b0a" roughness={0.35} metalness={0.7} envMapIntensity={1.2} />
      </mesh>
    );
  }
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        resolution={1024}
        mirror={0.65}
        blur={[280, 90]}
        mixBlur={9}
        mixStrength={1.4}
        roughness={0.85}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.35}
        color="#08080a"
        metalness={0.4}
      />
    </mesh>
  );
}

function Rig({
  progressRef,
  yawRange,
  carMaterialRef,
}: {
  progressRef: React.MutableRefObject<number>;
  yawRange: [number, number];
  carMaterialRef: React.MutableRefObject<THREE.MeshPhysicalMaterial | null>;
}) {
  const pointer = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    el.addEventListener("pointermove", handleMove);
    return () => el.removeEventListener("pointermove", handleMove);
  }, [gl]);

  useFrame((state) => {
    const p = progressRef.current;
    const [yawStart, yawEnd] = yawRange;
    const yaw = THREE.MathUtils.lerp(yawStart, yawEnd, p) + pointer.current.x * 0.06;
    const radius = THREE.MathUtils.lerp(4.6, 2.9, p);
    const height = THREE.MathUtils.lerp(1.35, 0.85, p) + pointer.current.y * 0.05;

    const cam = state.camera;
    cam.position.x = Math.sin(yaw) * radius;
    cam.position.z = Math.cos(yaw) * radius;
    cam.position.y = height;
    cam.lookAt(0, 0.75, 0);

    const mat = carMaterialRef.current;
    if (mat) {
      mat.envMapIntensity = THREE.MathUtils.lerp(1.5, 2.2, p);
      mat.clearcoatRoughness = THREE.MathUtils.lerp(0.28, 0.1, p);
    }
  });

  return null;
}

export function SpatialCanvas({
  bgSrc,
  carSrc,
  mirrorText,
  progressRef,
  lowPower,
  yawRange = [-0.55, 0.15],
  fogColor = "#0d0d0d",
  active,
}: SpatialCanvasProps) {
  const carMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  return (
    <Canvas
      dpr={lowPower ? [1, 1.3] : [1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 34, position: [0, 1.35, 4.6] }}
      shadows={!lowPower}
      frameloop={active ? "always" : "never"}
      onCreated={({ scene, gl }) => {
        scene.background = null;
        // toneMappingExposure must be set on the renderer instance after
        // construction — passing it inside the `gl` config object is a
        // no-op because THREE.WebGLRenderer's constructor doesn't read it.
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
    >
      <fog attach="fog" args={[fogColor, 4, 11]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.5, 4, 2]} intensity={1.1} castShadow={!lowPower} />
      <Environment files="/hdri/aerodynamics_workshop_1k.hdr" environmentIntensity={1.4} />

      <BackgroundPlane src={bgSrc} />
      <CarPlane src={carSrc} materialRef={carMaterialRef} />
      <Wordmark text={mirrorText} />
      <Floor lowPower={lowPower} />

      <Rig progressRef={progressRef} yawRange={yawRange} carMaterialRef={carMaterialRef} />

      {/* Filmic finish — skipped on low-power mobile, it's pure polish, not
          load-bearing for the scene reading correctly without it. */}
      {!lowPower && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={0.18}
            luminanceThreshold={0.88}
            luminanceSmoothing={0.15}
            mipmapBlur
            radius={0.35}
          />
          <Vignette eskil={false} offset={0.3} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
