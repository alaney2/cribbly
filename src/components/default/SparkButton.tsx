"use client"
import React, { useState, useEffect, useRef } from 'react';

interface Spark {
  id: number;
  center: { x: number; y: number };
  rotation: number;
  aniName: string;
}

const SparkButton = () => {
  const SPARK_ELEMENT_WIDTH = 30;
  const DISTANCE = 40;
  const RANDOMNESS_ON = true;

  const [sparks, setSparks] = useState<Spark[]>([]);
  const styleSheetRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    // styleSheet.type = "text/css";
    document.head.appendChild(styleSheet);
    styleSheetRef.current = styleSheet;

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  function createTransformSteps(...steps: string[]) {  
    const outputSteps = [steps.shift()];
    steps.forEach((step, i) => {
      outputSteps.push(`${outputSteps[i]} ${step}`);
    });
    return outputSteps;
  }
  
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

  const makeBurst = (center: { x: any; y: any; }) => {
    for (let i = 0; i < 8; i++) {
      const randomSpace = RANDOMNESS_ON ? Math.floor(-17 + Math.random() * 34) : 0;
      makeSpark(center, 45 * i + randomSpace);
    }
  };

  const makeSpark = (center: { x: any; y: any; }, rotation: number) => {
    console.log("Creating spark at: ", center, " with rotation: ", rotation);
    const aniName = `disappear_${rotation}`;
    dynamicAnimation(aniName, rotation); // Assuming this function is adapted to work with React

    // Update the state with new spark
    setSparks(currentSparks => [
      ...currentSparks,
      { id: Math.random(), center, rotation, aniName } // Adding unique id for key prop
    ]);
  };

  const handleClick = (e: { pageX: any; pageY: any; }) => {
    console.log("Button clicked");
    const center = { x: e.pageX, y: e.pageY };
    makeBurst(center);
  };

  return (
    <div className="flex justify-center rounded-lg items-center bg-[#1d1e22]">
      <button
        className="h-16 w-48 border-2 rounded-lg border-white bg-transparent cursor-pointer outline-none text-white text-lg"
        onClick={handleClick}
      >
        Spark!
      </button>
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="absolute w-6 h-2 rounded-sm bg-gray-500 z-50 transform-none" // Apply Tailwind classes here
          style={{
            left: `${spark.center.x}px`,
            top: `${spark.center.y}px`,
            animation: `${spark.aniName} 500ms ease-out both`
          }}
        />
      ))}
    </div>
  );
};

export default SparkButton;