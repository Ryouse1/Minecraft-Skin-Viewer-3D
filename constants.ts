
import { SkinUVMapping } from './types';

// Minecraft skins are 64x64.
// Coordinates are in pixels (X, Y)
export const SKIN_SIZE = 64;

export interface PartConfig {
  size: [number, number, number]; // w, h, d
  pos: [number, number, number];
  uv: SkinUVMapping;
}

// Map skin parts to their pixel coordinates on the 64x64 texture
export const GET_PART_CONFIGS = (isSlim: boolean): Record<string, PartConfig> => ({
  head: {
    size: [8, 8, 8],
    pos: [0, 12, 0],
    uv: {
      inner: {
        top: [8, 0], bottom: [16, 0], right: [0, 8], front: [8, 8], left: [16, 8], back: [24, 8]
      },
      outer: {
        top: [40, 0], bottom: [48, 0], right: [32, 8], front: [40, 8], left: [48, 8], back: [56, 8]
      }
    }
  },
  body: {
    size: [8, 12, 4],
    pos: [0, 2, 0],
    uv: {
      inner: {
        top: [20, 16], bottom: [28, 16], right: [16, 20], front: [20, 20], left: [28, 20], back: [32, 20]
      },
      outer: {
        top: [20, 32], bottom: [28, 32], right: [16, 36], front: [20, 36], left: [28, 36], back: [32, 36]
      }
    }
  },
  rightArm: {
    size: [isSlim ? 3 : 4, 12, 4],
    pos: [isSlim ? -5.5 : -6, 2, 0],
    uv: {
      inner: {
        top: [44, 16], bottom: [48, 16], right: [40, 20], front: [44, 20], left: [48, 20], back: [52, 20]
      },
      outer: {
        top: [44, 32], bottom: [48, 32], right: [40, 36], front: [44, 36], left: [48, 36], back: [52, 36]
      }
    }
  },
  leftArm: {
    size: [isSlim ? 3 : 4, 12, 4],
    pos: [isSlim ? 5.5 : 6, 2, 0],
    uv: {
      inner: {
        top: [36, 48], bottom: [40, 48], right: [32, 52], front: [36, 52], left: [40, 52], back: [44, 52]
      },
      outer: {
        top: [52, 48], bottom: [56, 48], right: [48, 52], front: [52, 52], left: [56, 52], back: [60, 52]
      }
    }
  },
  rightLeg: {
    size: [4, 12, 4],
    pos: [-2, -10, 0],
    uv: {
      inner: {
        top: [4, 16], bottom: [8, 16], right: [0, 20], front: [4, 20], left: [8, 20], back: [12, 20]
      },
      outer: {
        top: [4, 32], bottom: [8, 32], right: [0, 36], front: [4, 36], left: [8, 36], back: [12, 36]
      }
    }
  },
  leftLeg: {
    size: [4, 12, 4],
    pos: [2, -10, 0],
    uv: {
      inner: {
        top: [20, 48], bottom: [24, 48], right: [16, 52], front: [20, 52], left: [24, 52], back: [28, 52]
      },
      outer: {
        top: [4, 48], bottom: [8, 48], right: [0, 52], front: [4, 52], left: [8, 52], back: [12, 52]
      }
    }
  }
});
