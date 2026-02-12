
export type ModelType = 'classic' | 'slim';

export interface SkinPartData {
  u: number;
  v: number;
  w: number;
  h: number;
  d: number;
}

export interface SkinUVMapping {
  inner: {
    top: [number, number];
    bottom: [number, number];
    right: [number, number];
    front: [number, number];
    left: [number, number];
    back: [number, number];
  };
  outer?: {
    top: [number, number];
    bottom: [number, number];
    right: [number, number];
    front: [number, number];
    left: [number, number];
    back: [number, number];
  };
}
