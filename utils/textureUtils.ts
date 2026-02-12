
import { SKIN_SIZE } from '../constants';

/**
 * Creates a material with pixelated texture from a specific UV part of the skin.
 */
export const createFaceTexture = (
  originalCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  w: number,
  h: number
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Use nearest neighbor for pixel art look
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(originalCanvas, x, y, w, h, 0, 0, w, h);
  
  return canvas.toDataURL();
};

/**
 * Checks if a skin is likely to be a 64x32 legacy skin (not supported by this viewer's complex UV mapping, but we can detect it).
 */
export const isLegacySkin = (img: HTMLImageElement): boolean => {
  return img.height === 32;
};
