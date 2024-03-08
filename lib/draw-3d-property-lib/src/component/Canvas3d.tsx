import { useEffect, useRef } from 'react';

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

  // three context
  const threeContextRef = useRef<ThreeContext>(new ThreeContext({ fov: 75, width: offsetWidth, height: offsetHeight }));

  // dom append
  const prevParentElementRef = useRef<HTMLElement>();
  useEffect(() => {

    const { domElement } = threeContextRef.current.renderer;

    if (domElement && prevParentElementRef.current) {
      prevParentElementRef.current.removeChild(domElement);
    }

    prevParentElementRef.current = parentElement;

    parentElement.appendChild(domElement);

  }, [ parentElement ]);

  // render
  renderer({ context: threeContextRef.current, payload });

  return (
    <></>
  );

}