'use client';

import { IComponent } from '@/features/3d-viewer/types';
import { TransformControls, useGLTF } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// 제품별 config 타입
export interface PartConfig {
  nodeName: string;
  displayName: string;
  fileName: string;
  originalPosition: [number, number, number];
  originalRotation: [number, number, number, number];
  originalScale: [number, number, number];
  explosionDirection?: [number, number, number];
}

export interface ProductConfig {
  productName: string;
  modelFolder: string;
  scale?: number;
  parts: PartConfig[];
}

// Explosion 기본 설정
const EXPLOSION_FACTOR = 0.5;

interface DynamicAssemblyProps {
  config: ProductConfig;
  onSelectPart?: (partName: string | null, displayName: string | null) => void;
  components?: IComponent[];
  assemblyStep: number;
}

export function DynamicAssembly({ config, onSelectPart, assemblyStep }: DynamicAssemblyProps) {
  const [selectedNodeName, setSelectedNodeName] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const partsRef = useRef<Record<string, THREE.Group>>({});

  // State for persisted transforms (Developer Mode)
  const [savedTransforms, setSavedTransforms] = useState<Record<string, Partial<PartConfig>>>({});

  // localStorage key based on product name
  const storageKey = `simvex-${config.productName.toLowerCase().replace(/\s/g, '-')}-transforms`;

  // Load saved transforms from localStorage on mount
  // Load saved transforms from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedTransforms(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load transforms', e);
    }
  }, [storageKey]);

  // Memoize the parts configuration with overrides
  const assemblyParts = useMemo(() => {
    return config.parts.map((partConfig) => {
      const override = savedTransforms[partConfig.nodeName];
      const finalConfig = override ? { ...partConfig, ...override } : partConfig;

      const modelUrl = `/models/${config.modelFolder}/${finalConfig.fileName}`;

      return {
        ...finalConfig,
        modelUrl,
      };
    });
  }, [config, savedTransforms]);

  // Handle Explosion Animation
  useFrame(() => {
    if (!groupRef.current) return;

    Object.keys(partsRef.current).forEach((nodeName) => {
      // Developer Mode: Skip animation for selected part to allow manual transform
      if (nodeName === selectedNodeName) return;

      const group = partsRef.current[nodeName];
      const part = assemblyParts.find((p) => p.nodeName === nodeName);

      if (group && part) {
        const initialPos = new THREE.Vector3(...part.originalPosition);

        // Use custom explosion direction or calculate from position
        let explosionDir: THREE.Vector3;
        if (part.explosionDirection) {
          explosionDir = new THREE.Vector3(...part.explosionDirection).normalize();
        } else {
          // Default: explode outward from center
          explosionDir = initialPos.clone().normalize();
          if (explosionDir.length() === 0) {
            explosionDir = new THREE.Vector3(0, 1, 0);
          }
        }

        const offset = explosionDir.multiplyScalar(assemblyStep * EXPLOSION_FACTOR);
        const targetPos = initialPos.clone().add(offset);

        group.position.lerp(targetPos, 0.1);
      }
    });
  });

  const handleClick = (e: ThreeEvent<MouseEvent>, nodeName: string, displayName: string) => {
    e.stopPropagation();
    console.log('Clicked part:', nodeName);

    if (nodeName === selectedNodeName) {
      setSelectedNodeName(null);
      setSelectedObject(null);
      onSelectPart?.(null, null);
    } else {
      setSelectedNodeName(nodeName);
      setSelectedObject(partsRef.current[nodeName]);
      onSelectPart?.(nodeName, displayName);
    }
  };

  const handleBackgroundClick = () => {
    setSelectedNodeName(null);
    setSelectedObject(null);
    onSelectPart?.(null, null);
  };

  const handleTransformChange = () => {
    const nodeName = selectedNodeName;
    if (!nodeName || !partsRef.current[nodeName]) return;

    const o = partsRef.current[nodeName];

    // Log to console for developer mode
    console.log(`Part: ${nodeName} Transformed`);
    console.log(`"originalPosition": [${o.position.x}, ${o.position.y}, ${o.position.z}],`);
    console.log(`"originalRotation": [${o.quaternion.x}, ${o.quaternion.y}, ${o.quaternion.z}, ${o.quaternion.w}],`);
    console.log(`"originalScale": [${o.scale.x}, ${o.scale.y}, ${o.scale.z}]`);
  };

  const handleTransformEnd = () => {
    const nodeName = selectedNodeName;
    if (!nodeName || !partsRef.current[nodeName]) return;

    const o = partsRef.current[nodeName];
    const newTransform = {
      originalPosition: [o.position.x, o.position.y, o.position.z] as [number, number, number],
      originalRotation: [o.quaternion.x, o.quaternion.y, o.quaternion.z, o.quaternion.w] as [
        number,
        number,
        number,
        number,
      ],
      originalScale: [o.scale.x, o.scale.y, o.scale.z] as [number, number, number],
    };

    // Update state and localStorage
    const newTransforms = { ...savedTransforms, [nodeName]: newTransform };
    setSavedTransforms(newTransforms);
    localStorage.setItem(storageKey, JSON.stringify(newTransforms));
    console.log('Saved transform to localStorage:', storageKey);
  };

  return (
    <group ref={groupRef} onClick={handleBackgroundClick} scale={config.scale || 1}>
      {assemblyParts.map((part) => (
        <PartRenderer
          key={part.nodeName}
          part={part}
          selected={selectedNodeName === part.nodeName}
          onClick={(e) => handleClick(e, part.nodeName, part.displayName)}
          ref={(el) => {
            if (el) partsRef.current[part.nodeName] = el;
          }}
        />
      ))}
      {selectedNodeName && selectedObject && (
        <TransformControls
          object={selectedObject}
          mode="translate"
          onObjectChange={handleTransformChange}
          onMouseUp={handleTransformEnd}
        />
      )}
    </group>
  );
}

// GLTF Result type
type GLTFResult = {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
  scene: THREE.Group;
};

interface PartRendererProps {
  part: PartConfig & { modelUrl: string };
  selected: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}

// Sub-component to load and render individual GLB
const PartRenderer = React.forwardRef<THREE.Group, PartRendererProps>(({ part, selected, onClick }, ref) => {
  const { scene } = useGLTF(part.modelUrl) as unknown as GLTFResult;
  const initializedRef = useRef(false);

  const clone = useMemo(() => {
    const c = scene.clone();
    c.userData.originalName = part.nodeName;
    return c;
  }, [scene, part.nodeName]);

  // Apply Highlight
  useEffect(() => {
    clone.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (selected) {
          material.emissive = new THREE.Color(0x00aaff);
          material.emissiveIntensity = 0.5;
        } else {
          material.emissive = new THREE.Color(0x000000);
          material.emissiveIntensity = 0;
        }
      }
    });
  }, [clone, selected]);

  // Apply Initial Transforms - only override if config has non-zero values
  useEffect(() => {
    if (ref && typeof ref !== 'function' && ref.current && !initializedRef.current) {
      initializedRef.current = true;

      // Check if originalPosition is non-zero (explicitly set in config)
      const hasCustomPosition = part.originalPosition.some((v) => v !== 0);
      const hasCustomRotation = part.originalRotation.some((v, i) => (i === 3 ? v !== 1 : v !== 0)); // quaternion default is [0,0,0,1]
      const hasCustomScale = part.originalScale.some((v) => v !== 1);

      // Only apply config transforms if they're explicitly set (non-default)
      if (hasCustomPosition) {
        ref.current.position.set(...part.originalPosition);
      }
      if (hasCustomRotation) {
        ref.current.quaternion.set(...part.originalRotation);
      }
      if (hasCustomScale) {
        ref.current.scale.set(...part.originalScale);
      }
    }
  }, [part, ref]);

  return (
    <group ref={ref} onClick={onClick}>
      <primitive object={clone} />
    </group>
  );
});

PartRenderer.displayName = 'PartRenderer';
