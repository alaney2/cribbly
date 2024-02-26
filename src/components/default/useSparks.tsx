// useSparks.js
import { useState, useEffect, useRef } from 'react';

interface Spark {
  id: number;
  center: { x: number; y: number };
  rotation: number;
  aniName: string;
}

const useSparks = () => {
  const SPARK_ELEMENT_WIDTH = 20;
  const DISTANCE = 40;
  const RANDOMNESS_ON = true;

  const [sparks, setSparks] = useState<Spark[]>([]);
  const styleSheetRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
    styleSheetRef.current = styleSheet;

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const createTransformSteps = (...steps: string[]) => {
    const outputSteps = [steps.shift()];
    steps.forEach((step, i) => {
      outputSteps.push(`${outputSteps[i]} ${step}`);
    });
    return outputSteps;
  };

  const dynamicAnimation = (name: string, rotation: any) => {
    if (!styleSheetRef.current) {
      return;
    }

    const randomDist = RANDOMNESS_ON
      ? Math.floor((Math.random() - 0.5) * DISTANCE * 0.7)
      : 0;

    const [s1, s2, s3] = createTransformSteps(
      `translate(-50%, -50%) rotate(${rotation}deg) translate(10px, 0px)`,
      `translate(${DISTANCE + randomDist}px, 0px) scale(0.5, 0.5)`,
      `translate(${SPARK_ELEMENT_WIDTH / 2}px, 0) scale(0, 0)`
    );

    const keyframes = `@keyframes ${name} {
      0% {
        transform: ${s1};
      }
      70% {
        transform: ${s2};
      }
      100% {
        transform: ${s3};
      }
    }`;
    if (styleSheetRef.current.sheet) {
      styleSheetRef.current.sheet.insertRule(keyframes, styleSheetRef.current.sheet.cssRules.length);
    }
  };

  const makeSpark = (center: { x: any; y: any; }, rotation: number) => {
    const aniName = `disappear_${rotation}`;
    dynamicAnimation(aniName, rotation);

    setSparks(currentSparks => [
      ...currentSparks,
      { id: Math.random(), center, rotation, aniName }
    ]);
  };

  const makeBurst = (center: { x: any; y: any; }) => {
    for (let i = 0; i < 8; i++) {
      const randomSpace = RANDOMNESS_ON ? Math.floor(-17 + Math.random() * 34) : 0;
      makeSpark(center, 45 * i + randomSpace);
    }
  };

  return { makeBurst, sparks };
};

export default useSparks;
