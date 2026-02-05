import { useGLTF } from '@react-three/drei';
import React from 'react';

export function Model({ url }: { url: string }) {
  // useGLTF를 사용하여 모델 로드
  const { scene } = useGLTF(url);

  // 로드된 scene을 primitive 컴포넌트로 렌더링
  return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />;
}
