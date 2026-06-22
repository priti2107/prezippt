import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid, Instances, Instance, Float } from "@react-three/drei";
import * as THREE from "three";

const N = 12;

// District centers laid out along a winding depth path.
const DISTRICTS: THREE.Vector3[] = Array.from({ length: N }, (_, i) =>
  new THREE.Vector3(Math.sin(i * 0.85) * 24, 0, -i * 72),
);

// Accent colors alternate between primary sky and secondary light-blue.
const PRIMARY = new THREE.Color("#0EA5E9");
const SECONDARY = new THREE.Color("#38BDF8");
const accentFor = (i: number) => (i % 2 === 0 ? PRIMARY : SECONDARY);

// Camera keyframes: weave between districts, slightly elevated.
const CAM_POINTS: THREE.Vector3[] = DISTRICTS.map((d, i) => {
  const side = i % 2 === 0 ? 1 : -1;
  const last = i === N - 1;
  return new THREE.Vector3(
    d.x * 0.35 + side * (last ? 0 : 16),
    last ? 46 : 13 + Math.sin(i * 1.3) * 3,
    d.z + (last ? 86 : 40),
  );
});

const LOOK_POINTS: THREE.Vector3[] = DISTRICTS.map(
  (d) => new THREE.Vector3(d.x * 0.5, 8, d.z),
);

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

type Building = {
  pos: [number, number, number];
  scale: [number, number, number];
  color: THREE.Color;
  emissive: number;
};

function useBuildings(): Building[] {
  return useMemo(() => {
    const out: Building[] = [];
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    DISTRICTS.forEach((d, di) => {
      const accent = accentFor(di);
      const count = 9 + Math.floor(rnd() * 5);
      for (let b = 0; b < count; b++) {
        const angle = rnd() * Math.PI * 2;
        const radius = 8 + rnd() * 22;
        const w = 2.6 + rnd() * 4;
        const h = 6 + rnd() * 34;
        const mix = rnd();
        const col = new THREE.Color("#ffffff").lerp(accent, 0.18 + mix * 0.25);
        out.push({
          pos: [d.x + Math.cos(angle) * radius, h / 2, d.z + Math.sin(angle) * radius],
          scale: [w, h, w],
          color: col,
          emissive: 0.05 + mix * 0.22,
        });
      }
    });
    return out;
  }, []);
}

function Buildings() {
  const buildings = useBuildings();
  return (
    <Instances limit={buildings.length} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        metalness={0.35}
        roughness={0.18}
        transparent
        opacity={0.92}
      />
      {buildings.map((b, i) => (
        <Instance key={i} position={b.pos} scale={b.scale} color={b.color} />
      ))}
    </Instances>
  );
}

function Beacons() {
  return (
    <>
      {DISTRICTS.map((d, i) => {
        const accent = accentFor(i);
        return (
          <group key={i} position={[d.x, 0, d.z]}>
            {/* central glowing core tower */}
            <mesh position={[0, 34, 0]}>
              <cylinderGeometry args={[1.1, 1.6, 68, 8]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={1.4}
                metalness={0.4}
                roughness={0.2}
                transparent
                opacity={0.85}
              />
            </mesh>
            {/* floating holographic rings + panels */}
            <Float speed={2} rotationIntensity={0.6} floatIntensity={1.4}>
              <mesh position={[0, 30, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[7, 0.18, 16, 64]} />
                <meshStandardMaterial
                  color={accent}
                  emissive={accent}
                  emissiveIntensity={1.6}
                />
              </mesh>
            </Float>
            <Float speed={1.4} rotationIntensity={0.4} floatIntensity={2}>
              <mesh position={[6, 16, 4]} rotation={[0, -0.5, 0.1]}>
                <planeGeometry args={[7, 4.4]} />
                <meshStandardMaterial
                  color={accent}
                  emissive={accent}
                  emissiveIntensity={0.7}
                  transparent
                  opacity={0.28}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </Float>
            {/* glow disc on ground */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[26, 48]} />
              <meshBasicMaterial
                color={accent}
                transparent
                opacity={0.06}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function DataStreams() {
  const ref = useRef<THREE.Points>(null);
  const { geometry, speeds } = useMemo(() => {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const di = Math.floor(Math.random() * N);
      const d = DISTRICTS[di];
      positions[i * 3] = d.x + (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = Math.random() * 60;
      positions[i * 3 + 2] = d.z + (Math.random() - 0.5) * 70;
      c.set("#ffffff").lerp(accentFor(di), 0.6);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sp[i] = 4 + Math.random() * 10;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry: g, speeds: sp };
  }, []);

  useFrame((_, delta) => {
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < speeds.length; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      if (arr[i * 3 + 1] > 64) arr[i * 3 + 1] = 0;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.55}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig({ progress }: { progress: RefObject<number> }) {
  const target = useRef(new THREE.Vector3(0, 8, 0));
  const camPos = useRef(new THREE.Vector3());
  const lookPos = useRef(new THREE.Vector3());

  useFrame((state) => {
    const p = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1);
    const f = THREE.MathUtils.clamp(p * (N - 1), 0, N - 1);
    const i = Math.floor(f);
    const j = Math.min(i + 1, N - 1);
    const t = smooth(f - i);

    camPos.current.lerpVectors(CAM_POINTS[i], CAM_POINTS[j], t);
    lookPos.current.lerpVectors(LOOK_POINTS[i], LOOK_POINTS[j], t);

    state.camera.position.lerp(camPos.current, 0.06);
    target.current.lerp(lookPos.current, 0.06);
    state.camera.lookAt(target.current);
  });

  return null;
}

export default function CityScene({ progress }: { progress: RefObject<number> }) {
  return (
    <>
      <color attach="background" args={["#F8FAFC"]} />
      <fog attach="fog" args={["#F8FAFC", 60, 240]} />

      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#ffffff", "#cfe4f5", 0.7]} />
      <directionalLight position={[40, 80, 30]} intensity={1.1} color="#ffffff" />
      <pointLight position={[0, 30, 0]} intensity={120} color="#38BDF8" distance={160} />
      <pointLight
        position={[0, 30, -360]}
        intensity={140}
        color="#0EA5E9"
        distance={200}
      />

      <Grid
        position={[0, 0, -420]}
        args={[1200, 1200]}
        cellSize={6}
        cellThickness={0.6}
        cellColor="#E7EDF5"
        sectionSize={36}
        sectionThickness={1.1}
        sectionColor="#38BDF8"
        fadeDistance={260}
        fadeStrength={2}
        infiniteGrid
      />

      <Buildings />
      <Beacons />
      <DataStreams />

      <CameraRig progress={progress} />
    </>
  );
}
