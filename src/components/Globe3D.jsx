import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const CITY_NODES = [
  { lat: 40.71, lon: -74.0 }, { lat: 34.05, lon: -118.24 }, { lat: 51.5, lon: -0.12 },
  { lat: 48.85, lon: 2.35 }, { lat: 35.68, lon: 139.69 }, { lat: 28.61, lon: 77.2 },
  { lat: 1.35, lon: 103.82 }, { lat: -33.86, lon: 151.2 }, { lat: -23.55, lon: -46.63 },
  { lat: 19.43, lon: -99.13 }, { lat: 30.04, lon: 31.24 }, { lat: -1.29, lon: 36.82 },
  { lat: 55.75, lon: 37.61 }, { lat: 37.56, lon: 126.97 }, { lat: 52.52, lon: 13.4 },
  { lat: 25.2, lon: 55.27 }, { lat: 41.9, lon: 12.49 }, { lat: 31.23, lon: 121.47 },
];

const ARC_PAIRS = [
  [0, 4], [1, 8], [2, 5], [3, 10], [4, 6], [5, 11], [7, 13], [8, 15],
  [9, 16], [12, 2], [13, 17], [15, 6], [16, 3],
];

function lonLatToTexture(lon, lat, width, height) {
  return {
    x: ((lon + 180) / 360) * width,
    y: ((90 - lat) / 180) * height,
  };
}

function drawPoly(ctx, width, height, coords) {
  ctx.beginPath();
  coords.forEach(([lon, lat], index) => {
    const point = lonLatToTexture(lon, lat, width, height);
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;

  const ocean = ctx.createLinearGradient(0, 0, width, height);
  ocean.addColorStop(0, '#061326');
  ocean.addColorStop(0.45, '#092542');
  ocean.addColorStop(1, '#020712');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.28;
  for (let y = 0; y < height; y += 18) {
    const alpha = 1 - Math.abs(y - height / 2) / (height / 2);
    ctx.strokeStyle = `rgba(72, 181, 255, ${0.035 * alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const landGradient = ctx.createLinearGradient(0, 0, width, height);
  landGradient.addColorStop(0, '#7f8b55');
  landGradient.addColorStop(0.42, '#3f7a58');
  landGradient.addColorStop(0.72, '#9b6b42');
  landGradient.addColorStop(1, '#2f5e50');
  ctx.fillStyle = landGradient;
  ctx.strokeStyle = 'rgba(206, 231, 184, 0.22)';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(91, 255, 196, 0.18)';
  ctx.shadowBlur = 12;

  const continents = [
    [[-168, 68], [-134, 72], [-102, 58], [-88, 44], [-68, 46], [-53, 58], [-62, 22], [-96, 16], [-126, 24], [-150, 45]],
    [[-82, 13], [-58, 8], [-47, -10], [-55, -34], [-68, -55], [-76, -34], [-83, -8]],
    [[-18, 36], [8, 58], [45, 70], [92, 61], [132, 52], [154, 35], [123, 18], [84, 7], [53, 24], [29, 8], [8, 32]],
    [[-18, 35], [30, 34], [48, 7], [36, -34], [16, -35], [-4, -12], [-15, 8]],
    [[112, -11], [154, -18], [146, -41], [116, -36], [108, -24]],
    [[-52, 76], [-28, 72], [-20, 62], [-42, 58], [-60, 66]],
  ];

  continents.forEach(poly => drawPoly(ctx, width, height, poly));
  ctx.shadowBlur = 0;

  ctx.globalCompositeOperation = 'screen';
  CITY_NODES.forEach(({ lat, lon }, index) => {
    const point = lonLatToTexture(lon, lat, width, height);
    const radius = 3 + (index % 3);
    const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 6);
    glow.addColorStop(0, 'rgba(255, 178, 91, 0.9)');
    glow.addColorStop(0.25, 'rgba(249, 115, 22, 0.34)');
    glow.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalCompositeOperation = 'source-over';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 130; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const rx = 35 + Math.random() * 100;
    const ry = 8 + Math.random() * 24;
    const alpha = 0.025 + Math.random() * 0.05;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function latLonToVector3(lat, lon, radius = 1.53) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function AtmosphereGlow() {
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
        gl_FragColor = vec4(0.24, 0.74, 1.0, 1.0) * intensity;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  }), []);

  return (
    <mesh scale={[1.18, 1.18, 1.18]}>
      <sphereGeometry args={[1.5, 96, 96]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function DataNodes() {
  const geometry = useMemo(() => {
    const positions = [];
    CITY_NODES.forEach(node => {
      const p = latLonToVector3(node.lat, node.lon, 1.545);
      positions.push(p.x, p.y, p.z);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#ff9f43"
        size={0.055}
        transparent
        opacity={0.92}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function DataArcs() {
  const groupRef = useRef();
  const arcs = useMemo(() => ARC_PAIRS.map(([from, to], index) => {
    const start = latLonToVector3(CITY_NODES[from].lat, CITY_NODES[from].lon, 1.57);
    const end = latLonToVector3(CITY_NODES[to].lat, CITY_NODES[to].lon, 1.57);
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.0 + (index % 3) * 0.08);
    const curve = new THREE.CatmullRomCurve3([start, mid, end]);
    const points = curve.getPoints(48);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: index % 2 ? '#38bdf8' : '#f97316',
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return { geo, mat };
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    arcs.forEach(({ mat }, index) => {
      mat.opacity = 0.16 + Math.sin(t * 1.4 + index) * 0.08 + 0.18;
    });
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {arcs.map(({ geo, mat }, index) => (
        <line key={index} geometry={geo}>
          <primitive object={mat} attach="material" />
        </line>
      ))}
    </group>
  );
}

function OrbitingParticles() {
  const ref = useRef();
  const geometry = useMemo(() => {
    const positions = [];
    const count = 260;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.25 + Math.sin(angle * 5) * 0.12;
      const y = Math.cos(angle * 3) * 0.18;
      positions.push(radius * Math.cos(angle), y, radius * Math.sin(angle));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.16;
    ref.current.rotation.x = 0.34 + Math.sin(clock.getElapsedTime() * 0.18) * 0.03;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#f97316"
        size={0.016}
        transparent
        opacity={0.52}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function StarField() {
  const ref = useRef();
  const geometry = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 360; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3.4 + Math.random() * 2.0;
      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = -clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#9bdcff"
        size={0.012}
        transparent
        opacity={0.42}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function EarthSystem() {
  const groupRef = useRef();
  const cloudsRef = useRef();
  const earthTexture = useMemo(() => createEarthTexture(), []);
  const cloudTexture = useMemo(() => createCloudTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.075;
      groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.025;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = t * 0.095;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.18, -0.4, 0]}>
      <mesh>
        <sphereGeometry args={[1.5, 128, 128]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.68}
          metalness={0.05}
          emissive="#07111d"
          emissiveIntensity={0.34}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={[1.012, 1.012, 1.012]}>
        <sphereGeometry args={[1.5, 96, 96]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.34}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={[1.006, 1.006, 1.006]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.035} />
      </mesh>

      <DataNodes />
      <DataArcs />
      <AtmosphereGlow />
    </group>
  );
}

export default function Globe3D() {
  return (
    <div className="w-full h-full" style={{ minHeight: 420 }}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        dpr={[1, 1.8]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#030305', 4.6, 8]} />
        <ambientLight intensity={0.22} />
        <directionalLight position={[4, 2, 4]} intensity={1.55} color="#ffffff" />
        <directionalLight position={[-3, -1, 2]} intensity={0.72} color="#38bdf8" />
        <pointLight position={[2.4, 1.6, 2.8]} intensity={1.4} color="#f97316" />
        <pointLight position={[-2.8, -1.6, 2.4]} intensity={0.9} color="#38bdf8" />

        <StarField />
        <EarthSystem />
        <OrbitingParticles />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.35}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      </Canvas>
    </div>
  );
}
