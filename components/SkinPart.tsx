
import React, { useMemo } from 'react';
import { BoxGeometry, MeshStandardMaterial, TextureLoader, NearestFilter, DoubleSide } from 'three';
import { PartConfig } from '../constants';

interface SkinPartProps {
  config: PartConfig;
  canvas: HTMLCanvasElement | null;
  showOuter?: boolean;
}

const SkinPart: React.FC<SkinPartProps> = ({ config, canvas, showOuter = true }) => {
  const loader = useMemo(() => new TextureLoader(), []);

  const createMaterials = (isOuter: boolean) => {
    if (!canvas) return Array(6).fill(new MeshStandardMaterial({ color: '#334155' }));

    const uvBase = isOuter ? config.uv.outer : config.uv.inner;
    if (!uvBase) return null;

    const [w, h, d] = config.size;

    /**
     * Three.js BoxGeometry material order:
     * 0: +X (Right side of the cube)
     * 1: -X (Left side of the cube)
     * 2: +Y (Top)
     * 3: -Y (Bottom)
     * 4: +Z (Front)
     * 5: -Z (Back)
     * 
     * In Minecraft skin mapping when character faces +Z:
     * - The character's LEFT side is at +X (viewer's right)
     * - The character's RIGHT side is at -X (viewer's left)
     */
    const faces = [
      { uv: uvBase.left, w: d, h: h },   // +X: Character Left (Viewer Right)
      { uv: uvBase.right, w: d, h: h },  // -X: Character Right (Viewer Left)
      { uv: uvBase.top, w: w, h: d },    // +Y: Top
      { uv: uvBase.bottom, w: w, h: d }, // -Y: Bottom
      { uv: uvBase.front, w: w, h: h },  // +Z: Front
      { uv: uvBase.back, w: w, h: h },   // -Z: Back
    ];

    return faces.map((face) => {
      const faceCanvas = document.createElement('canvas');
      faceCanvas.width = face.w;
      faceCanvas.height = face.h;
      const ctx = faceCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        // Draw the specific part of the skin texture onto this face's canvas
        ctx.drawImage(canvas, face.uv[0], face.uv[1], face.w, face.h, 0, 0, face.w, face.h);
      }

      const texture = loader.load(faceCanvas.toDataURL());
      texture.magFilter = NearestFilter;
      texture.minFilter = NearestFilter;

      return new MeshStandardMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1,
        side: DoubleSide,
      });
    });
  };

  const innerMaterials = useMemo(() => createMaterials(false), [canvas, config, loader]);
  const outerMaterials = useMemo(() => createMaterials(true), [canvas, config, loader]);

  return (
    <group position={config.pos}>
      {/* Inner Layer */}
      {innerMaterials && (
        <mesh material={innerMaterials}>
          <boxGeometry args={config.size} />
        </mesh>
      )}

      {/* Outer Layer */}
      {showOuter && outerMaterials && (
        <mesh material={outerMaterials} scale={1.08}>
          <boxGeometry args={config.size} />
        </mesh>
      )}
    </group>
  );
};

export default SkinPart;
