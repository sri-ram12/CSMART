/**
 * Standalone 3D GLB Model Generator for CHANDHANA SHOE MART
 * Creates real, production-ready glTF 2.0 binary (.glb) assets for all footwear families:
 * - slipper.glb (Slide / Flip-Flop)
 * - sandal.glb (Floater / Strappy Sandal)
 * - formal.glb (Oxford / Derby Dress Shoe)
 * - loafer.glb (Penny Loafer / Moccasin)
 * - boot.glb (High-Ankle Outdoor Boot)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Node.js FileReader polyfill for Three.js GLTFExporter
global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob
      .arrayBuffer()
      .then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      })
      .catch((err) => {
        if (this.onerror) this.onerror(err);
      });
  }
};

async function buildAllModels() {
  const THREE = await import('../../client/node_modules/three/build/three.module.js');
  const { GLTFExporter } = await import(
    '../../client/node_modules/three/examples/jsm/exporters/GLTFExporter.js'
  );

  const outputDirs = [
    path.resolve(__dirname, '../../client/public/models'),
    path.resolve(__dirname, '../../client/dist/models'),
  ];

  for (const d of outputDirs) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  }

  const exporter = new GLTFExporter();

  async function exportToGLB(scene, filename) {
    const glb = await exporter.parseAsync(scene, { binary: true });
    const buffer = Buffer.from(glb);
    for (const d of outputDirs) {
      const dest = path.join(d, filename);
      fs.writeFileSync(dest, buffer);
      console.log(`✅ Generated ${filename} -> ${dest} (${buffer.length} bytes)`);
    }
  }

  // =========================================================================
  // 1. SLIPPER & SLIDE GLB (CloudStep / Bahamas / Flite / Walkaroo Slide)
  // =========================================================================
  {
    const scene = new THREE.Scene();
    scene.name = 'Slipper_Slide_Model';

    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.04,
      name: 'SoleMaterial',
    });
    const footbedMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.7,
      metalness: 0.05,
      name: 'FootbedMaterial',
    });
    const upperMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.5,
      metalness: 0.08,
      name: 'UpperMaterial',
    });
    const logoMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.2,
      name: 'LogoAccentMaterial',
    });

    // Outsole base
    const outsole = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.07, 2.3), soleMat);
    outsole.name = 'Outsole_Base';
    outsole.position.set(0, -0.06, 0);
    scene.add(outsole);

    // Tread ribs on bottom
    for (let z = -0.9; z <= 0.9; z += 0.2) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.02, 0.06), soleMat);
      rib.name = `Tread_Rib_${z.toFixed(1)}`;
      rib.position.set(0, -0.105, z);
      scene.add(rib);
    }

    // Molded ergonomic footbed
    const footbed = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.06, 2.22), footbedMat);
    footbed.name = 'Footbed_Molded';
    footbed.position.set(0, -0.01, 0);
    scene.add(footbed);

    // Heel cup dip
    const heelCup = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 16), footbedMat);
    heelCup.name = 'Footbed_HeelCup';
    heelCup.scale.set(0.9, 0.1, 0.7);
    heelCup.position.set(0, 0.02, -0.65);
    scene.add(heelCup);

    // Toe grip crest
    const toeCrest = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 16), footbedMat);
    toeCrest.name = 'Footbed_ToeCrest';
    toeCrest.rotation.z = Math.PI / 2;
    toeCrest.position.set(0, 0.025, 0.75);
    scene.add(toeCrest);

    // Wide arch slide band (Upper)
    const bandGeom = new THREE.CylinderGeometry(0.48, 0.48, 0.92, 32, 1, true, 0, Math.PI);
    const band = new THREE.Mesh(bandGeom, upperMat);
    band.name = 'Upper_SlideBand';
    band.rotation.z = Math.PI / 2;
    band.scale.set(0.58, 1.0, 1.0);
    band.position.set(0, 0.18, 0.15);
    scene.add(band);

    // Band perimeter piping
    const piping = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.035, 14, 32, Math.PI), upperMat);
    piping.name = 'Upper_Piping';
    piping.rotation.z = Math.PI / 2;
    piping.scale.set(0.58, 1.0, 1.0);
    piping.position.set(0, 0.18, 0.15);
    scene.add(piping);

    // Embossed brand logo patch
    const logoBadge = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.15), logoMat);
    logoBadge.name = 'Accent_BrandLogo';
    logoBadge.position.set(0, 0.46, 0.15);
    scene.add(logoBadge);

    await exportToGLB(scene, 'slipper.glb');
  }

  // =========================================================================
  // 2. SANDAL GLB (Floater / Strappy / Ethnic / Sparx & Walkaroo Floater)
  // =========================================================================
  {
    const scene = new THREE.Scene();
    scene.name = 'Sandal_Floater_Model';

    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.05,
      name: 'OutsoleMaterial',
    });
    const footbedMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      roughness: 0.75,
      metalness: 0.05,
      name: 'FootbedMaterial',
    });
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.6,
      metalness: 0.08,
      name: 'UpperStrapMaterial',
    });
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xa1a1aa,
      roughness: 0.25,
      metalness: 0.85,
      name: 'BuckleMetalMaterial',
    });

    // Multi-surface grooved outsole
    const outsole = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.07, 2.26), soleMat);
    outsole.name = 'Outsole_Base';
    outsole.position.set(0, -0.06, 0);
    scene.add(outsole);

    // Front toe bumper
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.09, 0.12), soleMat);
    bumper.name = 'Outsole_ToeBumper';
    bumper.position.set(0, -0.02, 1.1);
    scene.add(bumper);

    // Ergonomic footbed
    const footbed = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 2.2), footbedMat);
    footbed.name = 'Footbed_Cushion';
    footbed.position.set(0, -0.01, 0);
    scene.add(footbed);

    // Forefoot cross strap
    const frontStrap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.46, 0.88, 24, 1, true, 0, Math.PI),
      strapMat
    );
    frontStrap.name = 'Upper_FrontStrap';
    frontStrap.rotation.z = Math.PI / 2;
    frontStrap.scale.set(0.5, 1.0, 1.0);
    frontStrap.position.set(0, 0.14, 0.5);
    scene.add(frontStrap);

    // Instep midfoot strap
    const midStrap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.9, 24, 1, true, 0, Math.PI),
      strapMat
    );
    midStrap.name = 'Upper_MidStrap';
    midStrap.rotation.z = Math.PI / 2;
    midStrap.scale.set(0.55, 1.0, 1.0);
    midStrap.position.set(0, 0.18, 0.05);
    scene.add(midStrap);

    // Heel wrap ankle strap
    const heelStrap = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.04, 12, 32), strapMat);
    heelStrap.name = 'Upper_HeelStrap';
    heelStrap.rotation.z = Math.PI / 2;
    heelStrap.scale.set(0.55, 1.0, 1.0);
    heelStrap.position.set(0, 0.18, -0.55);
    scene.add(heelStrap);

    // Triangular metal anchor rings on lateral & medial side
    [-0.45, 0.45].forEach((x, i) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 16), ringMat);
      ring.name = `Accent_BuckleRing_${i === 0 ? 'Left' : 'Right'}`;
      ring.position.set(x, 0.08, 0.05);
      ring.rotation.y = Math.PI / 2;
      scene.add(ring);
    });

    await exportToGLB(scene, 'sandal.glb');
  }

  // =========================================================================
  // 3. FORMAL DRESS SHOE GLB (Oxford / Derby / Polished Leather Dress Shoe)
  // =========================================================================
  {
    const scene = new THREE.Scene();
    scene.name = 'Formal_Derby_DressShoe_Model';

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.28,
      metalness: 0.18,
      name: 'PolishedLeatherUpper',
    });
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x29180c,
      roughness: 0.65,
      metalness: 0.08,
      name: 'DressSoleMaterial',
    });
    const laceMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
      metalness: 0.05,
      name: 'LacesMaterial',
    });

    // Welted formal outsole
    const outsole = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.045, 2.28), soleMat);
    outsole.name = 'Outsole_LeatherWelt';
    outsole.position.set(0, -0.06, 0);
    scene.add(outsole);

    // Stacked dress heel block
    const heel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.085, 0.6), soleMat);
    heel.name = 'Outsole_StackedHeel';
    heel.position.set(0, -0.02, -0.66);
    scene.add(heel);

    // Sculpted vamp forefoot
    const vamp = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.43, 1.15, 32), leatherMat);
    vamp.name = 'Upper_Vamp';
    vamp.rotation.x = Math.PI / 2;
    vamp.scale.set(1.0, 0.55, 1.0);
    vamp.position.set(0, 0.1, 0.35);
    scene.add(vamp);

    // Almond toe cap
    const toeCap = new THREE.Mesh(new THREE.SphereGeometry(0.39, 32, 16), leatherMat);
    toeCap.name = 'Upper_ToeCap';
    toeCap.scale.set(1.0, 0.52, 1.22);
    toeCap.position.set(0, 0.08, 0.85);
    scene.add(toeCap);

    // Quarters & heel counter
    const quarters = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.28, 0.9), leatherMat);
    quarters.name = 'Upper_QuartersHeel';
    quarters.scale.set(1.0, 0.85, 1.0);
    quarters.position.set(0, 0.14, -0.35);
    scene.add(quarters);

    // Ankle opening collar ring
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 14, 32), leatherMat);
    collar.name = 'Upper_AnkleCollar';
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.26, -0.25);
    scene.add(collar);

    // Lacing throat facing
    const throat = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.55), leatherMat);
    throat.name = 'Upper_LacingFacing';
    throat.rotation.x = -0.2;
    throat.position.set(0, 0.22, 0.15);
    scene.add(throat);

    // Waxed laces crossbars
    [-0.12, -0.04, 0.04, 0.12].forEach((z, idx) => {
      const lace = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.015, 0.035), laceMat);
      lace.name = `Laces_Crossbar_${idx + 1}`;
      lace.position.set(0, 0.26 + idx * 0.012, 0.15 + z);
      scene.add(lace);
    });

    await exportToGLB(scene, 'formal.glb');
  }

  // =========================================================================
  // 4. LOAFER GLB (Penny Loafer / Moccasin / Slip-On)
  // =========================================================================
  {
    const scene = new THREE.Scene();
    scene.name = 'Penny_Loafer_Model';

    const upperMat = new THREE.MeshStandardMaterial({
      color: 0x3e2723,
      roughness: 0.35,
      metalness: 0.16,
      name: 'LoaferLeatherUpper',
    });
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.7,
      metalness: 0.05,
      name: 'SoleMaterial',
    });

    // Low-profile dress sole
    const outsole = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.04, 2.2), soleMat);
    outsole.name = 'Outsole_Base';
    outsole.position.set(0, -0.06, 0);
    scene.add(outsole);

    // Low heel block
    const heel = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.055, 0.6), soleMat);
    heel.name = 'Outsole_Heel';
    heel.position.set(0, -0.03, -0.65);
    scene.add(heel);

    // Forefoot vamp
    const vamp = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.42, 1.1, 32), upperMat);
    vamp.name = 'Upper_Vamp';
    vamp.rotation.x = Math.PI / 2;
    vamp.scale.set(1.0, 0.52, 1.0);
    vamp.position.set(0, 0.09, 0.35);
    scene.add(vamp);

    // Moccasin toe curve
    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 16), upperMat);
    toe.name = 'Upper_MocToe';
    toe.scale.set(1.0, 0.5, 1.1);
    toe.position.set(0, 0.08, 0.82);
    scene.add(toe);

    // Raised moc-toe apron welt stitch piping
    const apronWelt = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.028, 12, 32, Math.PI * 1.1),
      upperMat
    );
    apronWelt.name = 'Upper_ApronWelt';
    apronWelt.rotation.x = Math.PI / 2;
    apronWelt.scale.set(1.0, 0.52, 1.0);
    apronWelt.position.set(0, 0.17, 0.48);
    scene.add(apronWelt);

    // Penny loafer cross saddle strap
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.18), upperMat);
    saddle.name = 'Upper_PennySaddle';
    saddle.rotation.x = -0.1;
    saddle.position.set(0, 0.19, 0.1);
    scene.add(saddle);

    // Low slip-on quarters
    const quarters = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.22, 0.9), upperMat);
    quarters.name = 'Upper_Quarters';
    quarters.position.set(0, 0.12, -0.35);
    scene.add(quarters);

    await exportToGLB(scene, 'loafer.glb');
  }

  // =========================================================================
  // 5. BOOT GLB (Trekker High-Ankle / Tactical Outdoor / Woodland)
  // =========================================================================
  {
    const scene = new THREE.Scene();
    scene.name = 'Outdoor_Trekker_Boot_Model';

    const bootMat = new THREE.MeshStandardMaterial({
      color: 0xc19a6b,
      roughness: 0.55,
      metalness: 0.12,
      name: 'BootSuedeLeatherUpper',
    });
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.08,
      name: 'CommandoLuggedSole',
    });
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x3f2e22,
      roughness: 0.7,
      metalness: 0.08,
      name: 'PaddedCollarMaterial',
    });

    // Heavy-duty lugged commando outsole
    const outsole = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.09, 2.3), soleMat);
    outsole.name = 'Outsole_CommandoBase';
    outsole.position.set(0, -0.06, 0);
    scene.add(outsole);

    // Deep trekker heel block
    const heel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.7), soleMat);
    heel.name = 'Outsole_TrekkerHeel';
    heel.position.set(0, 0.01, -0.65);
    scene.add(heel);

    // Outsole cleat grips
    [-0.8, -0.4, 0, 0.4, 0.8].forEach((z, idx) => {
      const cleat = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.035, 0.08), soleMat);
      cleat.name = `Outsole_TractionCleat_${idx + 1}`;
      cleat.position.set(0, -0.11, z);
      scene.add(cleat);
    });

    // Forefoot upper
    const vamp = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 1.1, 32), bootMat);
    vamp.name = 'Upper_BootVamp';
    vamp.rotation.x = Math.PI / 2;
    vamp.scale.set(1.0, 0.65, 1.0);
    vamp.position.set(0, 0.12, 0.35);
    scene.add(vamp);

    // Reinforced toe box
    const toeBox = new THREE.Mesh(new THREE.SphereGeometry(0.44, 32, 16), bootMat);
    toeBox.name = 'Upper_ReinforcedToeBox';
    toeBox.scale.set(1.0, 0.65, 1.1);
    toeBox.position.set(0, 0.1, 0.85);
    scene.add(toeBox);

    // High ankle shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.7, 32), bootMat);
    shaft.name = 'Upper_HighAnkleShaft';
    shaft.position.set(0, 0.48, -0.3);
    scene.add(shaft);

    // Padded comfort collar rim
    const paddedCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.065, 16, 32),
      collarMat
    );
    paddedCollar.name = 'Upper_PaddedAnkleCollar';
    paddedCollar.rotation.x = Math.PI / 2;
    paddedCollar.position.set(0, 0.82, -0.3);
    scene.add(paddedCollar);

    // Gusseted tongue
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.65, 0.15), bootMat);
    tongue.name = 'Upper_GussetedTongue';
    tongue.rotation.x = -0.32;
    tongue.position.set(0, 0.42, 0.04);
    scene.add(tongue);

    await exportToGLB(scene, 'boot.glb');
  }

  console.log('\n🎉 ALL 5 FOOTWEAR GLB MODELS GENERATED SUCCESSFULLY!');
}

buildAllModels().catch((err) => {
  console.error('Error generating models:', err);
  process.exit(1);
});
