import { MapMarkerWrapper, useMintMapController } from '@mint-ui/map';
import { Canvas3d, Canvas3dRenderer } from 'draw-3d-property-lib';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StyledCanvas = styled.div`
  pointer-events: none;
`;

export function Marker3d() {
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

  const [ testData ] = useState({ aa: '111' });

  const renderer:Canvas3dRenderer<typeof testData> = async ({
    context,
    payload,
  }) => {
    // add cube test
    context.addBaseAxis();
    // await context.addPlainImage(mapImage, 627);
    context.addPlain(100, 100);
    context.addCube();
    context.render();
    // function animate() {
    //   requestAnimationFrame(animate);
    //   context.render();
    // }
    
    // animate();

  };

  return (
    <MapMarkerWrapper position={pos}>
      <StyledCanvas
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
        && <Canvas3d parentElement={container.current} payload={testData} renderer={renderer} />
        }
      </StyledCanvas>
    </MapMarkerWrapper>
  );
}