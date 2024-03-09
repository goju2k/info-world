import { useEffect, useRef, useState } from 'react';

import { ThreeContext } from '../core/three-context';

export interface Canvas3dRendererParams<T> {
  context:ThreeContext;
  payload:T;
}
export type Canvas3dRenderer<T> = (params:Canvas3dRendererParams<T>) => void;
export interface Canvas3dProps<T> {
  parentElement:HTMLElement;
  renderer:Canvas3dRenderer<T>;
  payload:T;
}

export function Canvas3d<T>({ parentElement, renderer, payload }:Canvas3dProps<T>) {

  const { offsetWidth, offsetHeight } = parentElement;

  console.log('render canvas 3d');
  
  // three context
  const [ threeContext, setThreeContext ] = useState<ThreeContext>();
  const threeContextRef = useRef(threeContext);

  useEffect(() => {

    const newContext = new ThreeContext({ width: offsetWidth, height: offsetHeight });
    setThreeContext(newContext);
    threeContextRef.current = newContext;

    return () => {
      if (threeContextRef.current) {
        const { domElement } = threeContextRef.current.renderer;
        parentElement.childNodes.forEach((node) => node === domElement && parentElement.removeChild(domElement));
        threeContextRef.current.clearObjectAll();
        threeContextRef.current.scene.clear();
        threeContextRef.current.renderer.dispose();
        console.log('three-context disposed');
      }
    };
  }, []);

  // dom append
  const prevParentElementRef = useRef<HTMLElement>();
  useEffect(() => {

    console.log('parentElement effect');
    
    if (threeContextRef.current) {
      
      const { domElement } = threeContextRef.current.renderer;
  
      if (domElement && prevParentElementRef.current) {
        console.log('remove prev canvas');
        parentElement.childNodes.forEach((node) => node === domElement && parentElement.removeChild(domElement));
      }
      
      parentElement.appendChild(domElement);

    }

    prevParentElementRef.current = parentElement;

  }, [ parentElement ]);

  // render
  if (threeContext) {
    threeContext.clearObjectAll();
    renderer({ context: threeContext, payload });
  }

  return (
    <></>
  );

}