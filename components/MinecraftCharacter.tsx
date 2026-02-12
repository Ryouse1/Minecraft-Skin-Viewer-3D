
import React from 'react';
import { GET_PART_CONFIGS } from '../constants';
import SkinPart from './SkinPart';
import { ModelType } from '../types';

interface MinecraftCharacterProps {
  canvas: HTMLCanvasElement | null;
  modelType: ModelType;
  showOuter: boolean;
}

const MinecraftCharacter: React.FC<MinecraftCharacterProps> = ({ canvas, modelType, showOuter }) => {
  const configs = GET_PART_CONFIGS(modelType === 'slim');

  return (
    <group>
      <SkinPart config={configs.head} canvas={canvas} showOuter={showOuter} />
      <SkinPart config={configs.body} canvas={canvas} showOuter={showOuter} />
      <SkinPart config={configs.rightArm} canvas={canvas} showOuter={showOuter} />
      <SkinPart config={configs.leftArm} canvas={canvas} showOuter={showOuter} />
      <SkinPart config={configs.rightLeg} canvas={canvas} showOuter={showOuter} />
      <SkinPart config={configs.leftLeg} canvas={canvas} showOuter={showOuter} />
    </group>
  );
};

export default MinecraftCharacter;
