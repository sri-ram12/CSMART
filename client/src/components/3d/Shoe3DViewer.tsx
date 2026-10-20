import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Float,
  Center,
  useGLTF,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Compass,
  Loader2,
} from 'lucide-react';

interface ShoeModelProps {
  tintColor: string;
  wireframe: boolean;
  autoRotate: boolean;
}

// Photorealistic 3D Sneaker loader using official GLTF/GLB asset
function RealisticShoeModel({ tintColor, wireframe, autoRotate }: ShoeModelProps) {
  const { scene } = useGLTF('/models/shoe.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene so multiple viewers don't conflict
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Apply real-time color tint & wireframe updates
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          // If array of materials or single material
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            (mat as any).wireframe = wireframe;
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              // Smoothly blend tint color
              mat.color = new THREE.Color(tintColor);
              mat.roughness = 0.55;
              mat.metalness = 0.15;
              mat.needsUpdate = true;
            }
          });
        }
      }
    });
  }, [clonedScene, tintColor, wireframe]);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <primitive object={clonedScene} scale={1.8} />
    </group>
  );
}

// Preload the 3D model for instant switching
useGLTF.preload('/models/shoe.glb');

interface Shoe3DViewerProps {
  primaryColor?: string;
  accentColor?: string;
  soleColor?: string;
  modelType?: string;
  className?: string;
  height?: string;
  allowFullscreen?: boolean;
}

export const Shoe3DViewer: React.FC<Shoe3DViewerProps> = ({
  primaryColor = '#DC2626',
  accentColor = '#FFFFFF',
  soleColor = '#F8FAFC',
  className = '',
  height = 'h-[440px] md:h-[520px]',
  allowFullscreen = true,
}) => {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentCameraPreset, setCurrentCameraPreset] = useState<'3/4' | 'side' | 'sole' | 'top' | 'heel'>('3/4');
  const controlsRef = useRef<any>(null);

  // Active colorway override state (White & Red tailored palette)
  const [activeColor, setActiveColor] = useState(primaryColor);

  useEffect(() => {
    setActiveColor(primaryColor);
  }, [primaryColor]);

  const cameraPositions: Record<string, [number, number, number]> = {
    '3/4': [1.8, 0.9, 1.8],
    side: [2.5, 0.1, 0],
    sole: [0, -2.5, 0.1],
    top: [0, 2.5, 0.1],
    heel: [-0.1, 0.6, -2.4],
  };

  const handleSetPreset = (preset: '3/4' | 'side' | 'sole' | 'top' | 'heel') => {
    setCurrentCameraPreset(preset);
    setAutoRotate(false);
    if (controlsRef.current) {
      const pos = cameraPositions[preset];
      controlsRef.current.object.position.set(...pos);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    handleSetPreset('3/4');
    setAutoRotate(true);
  };

  const colorways = [
    { name: 'Scarlet Red', hex: '#DC2626', label: 'Hyper Red' },
    { name: 'Crimson Rose', hex: '#E11D48', label: 'Crimson' },
    { name: 'Pure White', hex: '#FFFFFF', label: 'Arctic White' },
    { name: 'Midnight Onyx', hex: '#18181B', label: 'Stealth Black' },
    { name: 'Deep Burgundy', hex: '#991B1B', label: 'Ruby' },
  ];

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden bg-white shadow-card transition-all duration-300 ${height} ${className} ${
        isFullscreen ? '!fixed !inset-0 !z-50 !h-screen !w-screen !rounded-none bg-white' : ''
      }`}
    >
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: cameraPositions['3/4'], fov: 42 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'none' }}
        className="w-full h-full cursor-grab active:cursor-grabbing bg-gradient-to-b from-slate-50 via-white to-red-50/20"
      >
        <ambientLight intensity={1.2} />
        <spotLight
          position={[6, 10, 6]}
          angle={0.4}
          penumbra={0.8}
          intensity={2.2}
          castShadow
          shadow-mapSize={2048}
        />
        <directionalLight position={[-6, 6, -4]} intensity={0.8} color="#FFFFFF" />
        <directionalLight position={[0, -4, 2]} intensity={0.4} color="#FEE2E2" />

        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center gap-2 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border-none text-xs font-bold text-slate-700">
                <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                <span>Loading Photorealistic 3D Model...</span>
              </div>
            </Html>
          }
        >
          <Float speed={autoRotate ? 1.4 : 0} rotationIntensity={0.15} floatIntensity={0.2}>
            <Center>
              <RealisticShoeModel
                tintColor={activeColor}
                wireframe={wireframe}
                autoRotate={autoRotate}
              />
            </Center>
          </Float>

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -0.65, 0]}
            opacity={0.35}
            scale={5}
            blur={2.2}
            far={3}
            color="#0F172A"
          />

          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          minDistance={1.2}
          maxDistance={5.5}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>

      {/* Top Header Badge & Borderless Action Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm text-xs font-bold text-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span>Photorealistic 3D WebGL</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Wireframe toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            title="Toggle Wireframe Inspection"
            className={`p-2.5 rounded-xl border-none backdrop-blur-md shadow-sm transition-all ${
              wireframe
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white/90 text-slate-700 hover:text-red-600 hover:bg-white'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Auto Rotate toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause Turntable' : 'Play Turntable'}
            className={`p-2.5 rounded-xl border-none backdrop-blur-md shadow-sm transition-all ${
              autoRotate
                ? 'bg-red-50 text-red-600'
                : 'bg-white/90 text-slate-700 hover:text-red-600 hover:bg-white'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow text-red-600' : ''}`} />
          </button>

          {/* Fullscreen toggle */}
          {allowFullscreen && (
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen 3D'}
              className="p-2.5 rounded-xl border-none bg-white/90 backdrop-blur-md text-slate-700 hover:text-red-600 hover:bg-white shadow-sm transition-all"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Floating Guidance Tag */}
      <div className="absolute top-14 left-4 pointer-events-none hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
        <Compass className="w-3.5 h-3.5 text-red-600" />
        <span>Rotate • Zoom • Inspect sole treads</span>
      </div>

      {/* Bottom Floating Toolbar: Camera Presets & Real-Time Red/White Colorways */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 pointer-events-none z-10">
        {/* Borderless Camera Angles Pills */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl shadow-md pointer-events-auto overflow-x-auto max-w-full">
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold px-1.5 hidden md:inline">
            Angle:
          </span>
          <button
            onClick={() => handleSetPreset('3/4')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 ${
              currentCameraPreset === '3/4'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            3/4 View
          </button>
          <button
            onClick={() => handleSetPreset('side')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 ${
              currentCameraPreset === 'side'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => handleSetPreset('sole')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 ${
              currentCameraPreset === 'sole'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            Sole Tread
          </button>
          <button
            onClick={() => handleSetPreset('top')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 ${
              currentCameraPreset === 'top'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            Top
          </button>
          <button
            onClick={() => handleSetPreset('heel')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 ${
              currentCameraPreset === 'heel'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            Heel
          </button>
          <button
            onClick={handleResetCamera}
            title="Reset Angle"
            className="p-1 sm:p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border-none transition-colors ml-0.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Colorway Material Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-md pointer-events-auto">
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mr-1 hidden sm:inline">
            3D Color:
          </span>
          {colorways.map((cw) => (
            <button
              key={cw.name}
              onClick={() => setActiveColor(cw.hex)}
              title={cw.label}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-transform shrink-0 ${
                activeColor === cw.hex
                  ? 'border-red-600 scale-125 shadow-md shadow-red-500/30 ring-2 ring-red-200'
                  : 'border-slate-200 hover:scale-110'
              }`}
              style={{ backgroundColor: cw.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shoe3DViewer;
