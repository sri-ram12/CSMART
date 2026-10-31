import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export type FootwearType = 'sneaker' | 'slipper' | 'formal' | 'loafer' | 'boot' | 'sandal' | 'clog';

export interface FootwearModelProps {
  type: FootwearType;
  modelUrl?: string;
  shoeTextureVariant?: string;
  primaryColor: string;
  accentColor?: string;
  soleColor?: string;
  roughness?: number;
  metalness?: number;
  wireframe: boolean;
  autoRotate: boolean;
}

export const MODEL_PATHS: Record<FootwearType, string> = {
  sneaker: '/models/shoe.glb',
  slipper: '/models/slipper.glb',
  sandal: '/models/sandal.glb',
  formal: '/models/formal.glb',
  loafer: '/models/loafer.glb',
  boot: '/models/boot.glb',
  clog: '/models/slipper.glb',
};

// Preload standard category GLB models for instantaneous viewing
try {
  useGLTF.preload('/models/shoe.glb');
  useGLTF.preload('/models/slipper.glb');
  useGLTF.preload('/models/sandal.glb');
  useGLTF.preload('/models/formal.glb');
  useGLTF.preload('/models/loafer.glb');
  useGLTF.preload('/models/boot.glb');
} catch {}

// 1. UNIVERSAL CATEGORY-DRIVEN GLB MODEL LOADER
export function CategoryGLBModel({
  type,
  modelUrl,
  shoeTextureVariant,
  primaryColor,
  accentColor,
  soleColor,
  roughness,
  metalness,
  wireframe,
  autoRotate,
}: FootwearModelProps) {
  const resolvedUrl = modelUrl || MODEL_PATHS[type] || '/models/shoe.glb';
  const { scene } = useGLTF(resolvedUrl);
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const isShopifyShoe = resolvedUrl.includes('shoe.glb');

  // Select authentic diffuse texture variant for athletic shoe
  const textureUrl = useMemo(() => {
    if (shoeTextureVariant === 'green_runner' || shoeTextureVariant === 'beach_runner') {
      return '/models/diffuseBeach.jpg';
    }
    if (shoeTextureVariant === 'white_street' || shoeTextureVariant === 'street_runner') {
      return '/models/diffuseStreet.jpg';
    }
    if (shoeTextureVariant === 'black_midnight' || shoeTextureVariant === 'midnight_runner') {
      return '/models/diffuseMidnight.jpg';
    }
    // Auto-select based on primary color brightness if no explicit texture variant
    if (primaryColor) {
      const clean = primaryColor.replace('#', '');
      if (clean.length === 6 || clean.length === 3) {
        const expanded = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
        const num = parseInt(expanded, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 80) return '/models/diffuseMidnight.jpg';
        if (brightness > 200) return '/models/diffuseStreet.jpg';
      }
    }
    return '/models/diffuseStreet.jpg';
  }, [shoeTextureVariant, primaryColor]);

  // Load diffuse texture and configure color space and UV orientation
  const diffuseTexture = useMemo(() => {
    if (!isShopifyShoe) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(textureUrl);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [isShopifyShoe, textureUrl]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const clonedMats = mats.map((m) => {
            const mat = (m as THREE.Material).clone();
            (mat as any).wireframe = wireframe;

            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              if (isShopifyShoe) {
                // For shoe.glb, preserve full photorealistic PBR maps & details
                if (diffuseTexture) {
                  mat.map = diffuseTexture;
                }
                // Apply brand-specific primary color tinting
                mat.color = new THREE.Color(primaryColor || '#FFFFFF');
                mat.roughness = roughness !== undefined ? roughness : 0.58;
                mat.metalness = metalness !== undefined ? metalness : 0.12;
                mat.needsUpdate = true;
              } else {
                const name = ((mesh.name || '') + ' ' + (mat.name || '')).toLowerCase();

                // Sole & Outsole & Tread
                if (
                  name.includes('sole') ||
                  name.includes('bottom') ||
                  name.includes('tread') ||
                  name.includes('heel') ||
                  name.includes('bumper')
                ) {
                  mat.color = new THREE.Color(soleColor || (type === 'formal' ? '#29180C' : '#18181B'));
                  mat.roughness = 0.8;
                  mat.metalness = 0.05;
                }
                // Accents, Logos, Buckles, Rings, Laces
                else if (
                  name.includes('stripe') ||
                  name.includes('logo') ||
                  name.includes('accent') ||
                  name.includes('buckle') ||
                  name.includes('ring') ||
                  name.includes('badge') ||
                  name.includes('lace')
                ) {
                  mat.color = new THREE.Color(accentColor || '#FFFFFF');
                  if (name.includes('buckle') || name.includes('ring') || name.includes('metal')) {
                    mat.roughness = 0.25;
                    mat.metalness = 0.85;
                  } else {
                    mat.roughness = 0.5;
                    mat.metalness = 0.15;
                  }
                }
                // Upper / Straps / Vamp / Quarters
                else {
                  mat.color = new THREE.Color(primaryColor);
                  if (type === 'formal' || type === 'loafer') {
                    mat.roughness = 0.32;
                    mat.metalness = 0.18;
                  } else if (type === 'boot') {
                    mat.roughness = 0.6;
                    mat.metalness = 0.1;
                  } else {
                    mat.roughness = 0.52;
                    mat.metalness = 0.1;
                  }
                }
                mat.needsUpdate = true;
              }
            }
            return mat;
          });

          mesh.material = Array.isArray(mesh.material) ? clonedMats : clonedMats[0];
        }
      }
    });
  }, [clonedScene, isShopifyShoe, diffuseTexture, primaryColor, accentColor, soleColor, roughness, metalness, wireframe, type]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const scale = isShopifyShoe ? 1.85 : 0.95;
  const rotation: [number, number, number] = isShopifyShoe ? [0, -Math.PI / 2, 0] : [0, 0, 0];
  const positionY = isShopifyShoe ? -0.05 : 0;

  return (
    <group ref={groupRef} position={[0, positionY, 0]}>
      <primitive object={clonedScene} scale={scale} rotation={rotation} />
    </group>
  );
}

// Legacy Sneaker fallback
function SneakerGLBModel(props: FootwearModelProps) {
  return <CategoryGLBModel {...props} type="sneaker" />;
}

// 2. SLIPPER & SLIDE 3D MODEL (CloudStep Slide / Bahamas / Comfort Flip)
function SlipperSlide3DModel({ primaryColor, accentColor, soleColor, wireframe, autoRotate }: FootwearModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const upperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(primaryColor),
        roughness: 0.55,
        metalness: 0.08,
        wireframe,
      }),
    [primaryColor, wireframe]
  );

  const footbedMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentColor || '#27272A'),
        roughness: 0.75,
        metalness: 0.04,
        wireframe,
      }),
    [accentColor, wireframe]
  );

  const soleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(soleColor || '#18181B'),
        roughness: 0.85,
        metalness: 0.02,
        wireframe,
      }),
    [soleColor, wireframe]
  );

  return (
    <group ref={groupRef} position={[0, -0.05, 0]} scale={0.65}>
      {/* Outsole Base with Textured Tread */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow material={soleMat}>
        <boxGeometry args={[0.96, 0.07, 2.25]} />
      </mesh>

      {/* Ergonomic Molded Footbed with Contoured Arch */}
      <mesh position={[0, 0.0, 0]} scale={[1.0, 0.12, 1.0]} castShadow receiveShadow material={footbedMat}>
        <boxGeometry args={[0.92, 0.5, 2.18]} />
      </mesh>
      {/* Heel Cup Dip */}
      <mesh position={[0, 0.03, -0.65]} scale={[0.85, 0.08, 0.6]} castShadow material={footbedMat}>
        <sphereGeometry args={[0.42, 24, 16]} />
      </mesh>

      {/* Wide Arch Slide Band (Spanning smoothly across foot) */}
      <mesh position={[0, 0.18, 0.15]} rotation={[0, 0, Math.PI / 2]} scale={[0.55, 1.0, 1.0]} castShadow receiveShadow material={upperMat}>
        <cylinderGeometry args={[0.48, 0.48, 0.9, 32, 1, true, 0, Math.PI]} />
      </mesh>
      {/* Raised Band Perimeter Piping */}
      <mesh position={[0, 0.18, 0.15]} rotation={[0, 0, Math.PI / 2]} scale={[0.55, 1.0, 1.0]} castShadow material={upperMat}>
        <torusGeometry args={[0.48, 0.035, 14, 32, Math.PI]} />
      </mesh>
    </group>
  );
}

// 3. FORMAL SHOE 3D MODEL (Derby / Oxford / Polished Leather Dress Shoe)
function FormalShoe3DModel({ primaryColor, accentColor, soleColor, wireframe, autoRotate }: FootwearModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const leatherMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(primaryColor),
        roughness: 0.28,
        metalness: 0.18,
        wireframe,
      }),
    [primaryColor, wireframe]
  );

  const soleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(soleColor || '#29180C'),
        roughness: 0.65,
        metalness: 0.06,
        wireframe,
      }),
    [soleColor, wireframe]
  );

  const laceMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1E1E1E'),
        roughness: 0.8,
        metalness: 0.05,
        wireframe,
      }),
    [wireframe]
  );

  return (
    <group ref={groupRef} position={[0, -0.05, 0]} scale={0.65}>
      {/* Formal Outsole with Natural Leather Welting */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow material={soleMat}>
        <boxGeometry args={[0.88, 0.04, 2.25]} />
      </mesh>
      {/* Stacked Formal Dress Block Heel */}
      <mesh position={[0, -0.02, -0.65]} castShadow receiveShadow material={soleMat}>
        <boxGeometry args={[0.8, 0.08, 0.6]} />
      </mesh>

      {/* Horizontally Sculpted Vamp & Forefoot */}
      <mesh position={[0, 0.1, 0.35]} rotation={[Math.PI / 2, 0, 0]} scale={[1.0, 0.55, 1.0]} castShadow receiveShadow material={leatherMat}>
        <cylinderGeometry args={[0.38, 0.43, 1.15, 32]} />
      </mesh>
      {/* Tapered Almond Toe Cap */}
      <mesh position={[0, 0.08, 0.85]} scale={[1.0, 0.52, 1.2]} castShadow receiveShadow material={leatherMat}>
        <sphereGeometry args={[0.39, 32, 16]} />
      </mesh>

      {/* Quarters & Rear Heel Counter */}
      <mesh position={[0, 0.14, -0.35]} scale={[1.0, 0.85, 1.0]} castShadow receiveShadow material={leatherMat}>
        <boxGeometry args={[0.78, 0.28, 0.9]} />
      </mesh>
      {/* Ankle Collar Ring */}
      <mesh position={[0, 0.26, -0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow material={leatherMat}>
        <torusGeometry args={[0.34, 0.035, 14, 32]} />
      </mesh>

      {/* Lacing Throat & Eyelets Facings */}
      <mesh position={[0, 0.22, 0.15]} rotation={[-0.2, 0, 0]} castShadow material={leatherMat}>
        <boxGeometry args={[0.34, 0.06, 0.55]} />
      </mesh>
      {/* Waxed Dress Laces Crossbars */}
      {[-0.12, -0.04, 0.04, 0.12].map((z, idx) => (
        <mesh key={idx} position={[0, 0.26 + idx * 0.012, 0.15 + z]} castShadow material={laceMat}>
          <boxGeometry args={[0.26, 0.015, 0.035]} />
        </mesh>
      ))}
    </group>
  );
}

// 4. LOAFER 3D MODEL (Penny Loafer / Moccasin / Slip-On)
function Loafer3DModel({ primaryColor, accentColor, soleColor, wireframe, autoRotate }: FootwearModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const upperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(primaryColor),
        roughness: 0.35,
        metalness: 0.16,
        wireframe,
      }),
    [primaryColor, wireframe]
  );

  const soleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(soleColor || '#1C1917'),
        roughness: 0.7,
        metalness: 0.05,
        wireframe,
      }),
    [soleColor, wireframe]
  );

  return (
    <group ref={groupRef} position={[0, -0.05, 0]} scale={0.65}>
      {/* Low-Profile Outsole */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow material={soleMat}>
        <boxGeometry args={[0.88, 0.04, 2.2]} />
      </mesh>
      {/* Low Heel Block */}
      <mesh position={[0, -0.03, -0.65]} castShadow receiveShadow material={soleMat}>
        <boxGeometry args={[0.78, 0.05, 0.6]} />
      </mesh>

      {/* Forefoot Vamp */}
      <mesh position={[0, 0.09, 0.35]} rotation={[Math.PI / 2, 0, 0]} scale={[1.0, 0.52, 1.0]} castShadow receiveShadow material={upperMat}>
        <cylinderGeometry args={[0.39, 0.42, 1.1, 32]} />
      </mesh>
      {/* Moccasin Toe Curve */}
      <mesh position={[0, 0.08, 0.82]} scale={[1.0, 0.5, 1.1]} castShadow receiveShadow material={upperMat}>
        <sphereGeometry args={[0.4, 32, 16]} />
      </mesh>

      {/* Raised Moc-Toe Welt Stitching Piping */}
      <mesh position={[0, 0.17, 0.48]} rotation={[Math.PI / 2, 0, 0]} scale={[1.0, 0.52, 1.0]} castShadow material={upperMat}>
        <torusGeometry args={[0.35, 0.028, 12, 32, Math.PI * 1.1]} />
      </mesh>

      {/* Penny Loafer Cross Saddle Strap */}
      <mesh position={[0, 0.19, 0.1]} rotation={[-0.1, 0, 0]} castShadow material={upperMat}>
        <boxGeometry args={[0.8, 0.05, 0.18]} />
      </mesh>

      {/* Low Slip-on Collar & Quarters */}
      <mesh position={[0, 0.12, -0.35]} castShadow receiveShadow material={upperMat}>
        <boxGeometry args={[0.78, 0.22, 0.9]} />
      </mesh>
      <mesh position={[0, 0.21, -0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow material={upperMat}>
        <torusGeometry args={[0.34, 0.03, 12, 32]} />
      </mesh>
    </group>
  );
}

// 5. BOOTS 3D MODEL (High Ankle / Outdoor Trekker / Tactical Combat)
function Boot3DModel({ primaryColor, accentColor, soleColor, wireframe, autoRotate }: FootwearModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const bootMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(primaryColor),
        roughness: 0.55,
        metalness: 0.12,
        wireframe,
      }),
    [primaryColor, wireframe]
  );

  const soleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(soleColor || '#18181B'),
        roughness: 0.85,
        metalness: 0.08,
        wireframe,
      }),
    [soleColor, wireframe]
  );

  const collarMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentColor || '#3F2E22'),
        roughness: 0.7,
        metalness: 0.08,
        wireframe,
      }),
    [accentColor, wireframe]
  );

  return (
    <group ref={groupRef} position={[0, -0.1, 0]} scale={0.6}>
      {/* Heavy-Duty Lugged Commando Sole */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow material={soleMat}>
        <boxGeometry args={[0.96, 0.09, 2.3]} />
      </mesh>
      {/* Deep Trekker Heel Block */}
      <mesh position={[0, 0.01, -0.65]} castShadow receiveShadow material={soleMat}>
        <boxGeometry args={[0.9, 0.12, 0.7]} />
      </mesh>
      {/* Outsole Cleat Grips */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((z, idx) => (
        <mesh key={idx} position={[0, -0.11, z]} castShadow material={soleMat}>
          <boxGeometry args={[0.92, 0.03, 0.08]} />
        </mesh>
      ))}

      {/* Forefoot Upper Running Horizontally */}
      <mesh position={[0, 0.12, 0.35]} rotation={[Math.PI / 2, 0, 0]} scale={[1.0, 0.65, 1.0]} castShadow receiveShadow material={bootMat}>
        <cylinderGeometry args={[0.42, 0.46, 1.1, 32]} />
      </mesh>
      {/* Reinforced Toe Box */}
      <mesh position={[0, 0.1, 0.85]} scale={[1.0, 0.65, 1.1]} castShadow receiveShadow material={bootMat}>
        <sphereGeometry args={[0.44, 32, 16]} />
      </mesh>

      {/* High Ankle Shaft Collar (Vertical) */}
      <mesh position={[0, 0.48, -0.3]} castShadow receiveShadow material={bootMat}>
        <cylinderGeometry args={[0.38, 0.42, 0.7, 32]} />
      </mesh>
      {/* Padded Ankle Comfort Collar */}
      <mesh position={[0, 0.82, -0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow material={collarMat}>
        <torusGeometry args={[0.38, 0.065, 16, 32]} />
      </mesh>

      {/* Boot Gusseted Tongue & Speed Hooks */}
      <mesh position={[0, 0.42, 0.04]} rotation={[-0.32, 0, 0]} castShadow material={bootMat}>
        <boxGeometry args={[0.38, 0.65, 0.15]} />
      </mesh>
    </group>
  );
}

// 6. SANDALS 3D MODEL (Ethnic / Floaters / Strappy Multi-Surface Sandals)
function Sandal3DModel({ primaryColor, accentColor, soleColor, wireframe, autoRotate }: FootwearModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const strapMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(primaryColor),
        roughness: 0.65,
        metalness: 0.08,
        wireframe,
      }),
    [primaryColor, wireframe]
  );

  const soleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(soleColor || '#18181B'),
        roughness: 0.8,
        metalness: 0.05,
        wireframe,
      }),
    [soleColor, wireframe]
  );

  const footbedMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentColor || '#3F3F46'),
        roughness: 0.75,
        metalness: 0.05,
        wireframe,
      }),
    [accentColor, wireframe]
  );

  return (
    <group ref={groupRef} position={[0, -0.05, 0]} scale={0.65}>
      {/* Floater Multi-Surface Outsole */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow material={soleMat}>
        <boxGeometry args={[0.94, 0.06, 2.25]} />
      </mesh>
      {/* Contoured Ergonomic Footbed */}
      <mesh position={[0, -0.01, 0]} castShadow receiveShadow material={footbedMat}>
        <boxGeometry args={[0.9, 0.04, 2.18]} />
      </mesh>

      {/* Forefoot Cross Strap (Arching smoothly across toe) */}
      <mesh position={[0, 0.14, 0.5]} rotation={[0, 0, Math.PI / 2]} scale={[0.5, 1.0, 1.0]} castShadow material={strapMat}>
        <cylinderGeometry args={[0.46, 0.46, 0.88, 24, 1, true, 0, Math.PI]} />
      </mesh>

      {/* Instep Midfoot Strap with Velcro Pad */}
      <mesh position={[0, 0.18, 0.05]} rotation={[0, 0, Math.PI / 2]} scale={[0.55, 1.0, 1.0]} castShadow material={strapMat}>
        <cylinderGeometry args={[0.48, 0.48, 0.9, 24, 1, true, 0, Math.PI]} />
      </mesh>

      {/* Ankle Heel Wrap Strap */}
      <mesh position={[0, 0.18, -0.55]} rotation={[0, 0, Math.PI / 2]} scale={[0.55, 1.0, 1.0]} castShadow material={strapMat}>
        <torusGeometry args={[0.44, 0.04, 12, 32]} />
      </mesh>
    </group>
  );
}

// 7. CROCS & CLOGS 3D MODEL (Ventilated Foam Upper / Turbo Strap)
function Clog3DModel({ primaryColor, accentColor, soleColor, wireframe, autoRotate }: FootwearModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const clogMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(primaryColor),
        roughness: 0.55,
        metalness: 0.06,
        wireframe,
      }),
    [primaryColor, wireframe]
  );

  const soleBandMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(soleColor || '#F8FAFC'),
        roughness: 0.7,
        metalness: 0.05,
        wireframe,
      }),
    [soleColor, wireframe]
  );

  return (
    <group ref={groupRef} position={[0, -0.05, 0]} scale={0.65}>
      {/* Thick Lightweight Foam Outsole */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow material={clogMat}>
        <boxGeometry args={[1.05, 0.08, 2.25]} />
      </mesh>
      {/* Signature Contrast White Sole Stripe */}
      <mesh position={[0, -0.045, 0]} castShadow material={soleBandMat}>
        <boxGeometry args={[1.06, 0.025, 2.26]} />
      </mesh>

      {/* Roomy Rounded Upper with Ventilated Toe Box */}
      <mesh position={[0, 0.16, 0.35]} scale={[1.05, 0.65, 1.25]} castShadow receiveShadow material={clogMat}>
        <sphereGeometry args={[0.5, 32, 24, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
      </mesh>

      {/* Open Heel Cup with Pivoting Turbo Heel Strap */}
      <mesh position={[0, 0.14, -0.55]} rotation={[-0.4, 0, 0]} castShadow material={clogMat}>
        <torusGeometry args={[0.48, 0.04, 12, 32, Math.PI]} />
      </mesh>
      {/* Logo Rivet Studs on Strap Pivot */}
      <mesh position={[-0.48, 0.05, -0.3]} castShadow material={soleBandMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
      </mesh>
      <mesh position={[0.48, 0.05, -0.3]} castShadow material={soleBandMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
      </mesh>
    </group>
  );
}

// Master Footwear Dispatcher
export function Footwear3DModel(props: FootwearModelProps) {
  // Uses dedicated high-fidelity GLB binary asset for each footwear category
  return <CategoryGLBModel {...props} />;
}
