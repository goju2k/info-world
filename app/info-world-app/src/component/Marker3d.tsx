import { MapMarkerWrapper, useMintMapController } from '@mint-ui/map';
import { Canvas3d, Canvas3dRenderer, ThreeContext } from 'draw-3d-property-lib';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { MarkerProps } from './marker-types';

const StyledCanvas = styled.div<{clickable?:boolean;}>`
  pointer-events: ${({ clickable }) => (clickable ? 'auto' : 'none')};
`;

export interface Marker3dProps extends MarkerProps {
  control3d?:boolean;
}

export function Marker3d({ data, renderPercent, control3d }:Marker3dProps) {

  const controller = useMintMapController();

  const [ pos, setPos ] = useState(controller.getCurrBounds().nw);

  useEffect(() => {

    const handleIdle = () => {
      setPos(controller.getCurrBounds().nw);
    };

    controller.addEventListener('IDLE', handleIdle);

    return () => {
      controller.removeEventListener('IDLE', handleIdle);
    };

  }, []);
  
  const container = useRef<HTMLDivElement|null>(null);
  const [ hasContainer, setHasContainer ] = useState(false);

  const contextRef = useRef<ThreeContext|null>(null);
  const renderer:Canvas3dRenderer<typeof data> = async ({
    context,
    payload,
  }) => {

    contextRef.current = context;

    payload.forEach((geo) => {
      const posList = geo.coord[0].map((position) => {
        const offset = controller.positionToOffset(position);

        return [ offset.x, offset.y ];
      }) as [number, number][];
      context.addPlainPolygon(posList, 'red');
    });
    context.render();

    // add cube test
    context.addBaseAxis();
    // await context.addPlainImage(mapImage, 627);
    // context.addPlain(100, 100);
    // context.addCube();
    
    // function animate() {
    //   requestAnimationFrame(animate);
    //   context.render();
    // }
    
    // animate();

  };

  return (
    <MapMarkerWrapper position={pos}>
      <StyledCanvas
        clickable={control3d}
        style={{
          width: controller.mapDivElement.offsetWidth,
          height: controller.mapDivElement.offsetHeight,
        }}
        ref={(ref) => {
          container.current = ref;
          setHasContainer(container.current !== null);
        }}
      >
        {
          hasContainer 
        && container.current 
        && (
          <>
            {control3d && <Canvas3d parentElement={container.current} payload={data.slice(0, Math.floor(data.length * (renderPercent / 100)))} renderer={renderer} />}
            {!control3d && <Canvas3d parentElement={container.current} payload={data.slice(0, Math.floor(data.length * (renderPercent / 100)))} renderer={renderer} />}
          </>
        )
        
        }
      </StyledCanvas>
    </MapMarkerWrapper>
  );
}