import { Canvas3d, Canvas3dRenderer } from 'draw-3d-property-lib';
import { useRef, useState } from 'react';
import styled from 'styled-components';

import mapImage from '../assets/map.png';

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
`;

const StyledCanvas = styled.div`
  width: 640px;
  height: 480px;
`;

export function App() {

  const container = useRef<HTMLDivElement|null>(null);
  const [ hasContainer, setHasContainer ] = useState(false);

  const [ testData ] = useState({ aa: '111' });

  const renderer:Canvas3dRenderer<typeof testData> = ({
    context,
    payload,
  }) => {
    // add cube test
    context.addBaseAxis();
    context.addPlainImage(mapImage, 15);
    // context.addPlain(100, 100);
    context.addCube();
    context.render();
    // function animate() {
    //   requestAnimationFrame(animate);
    //   context.render();
    // }
    
    // animate();

  };

  return (
    <StyledApp>
      <StyledCanvas ref={(ref) => {
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
      <img src={mapImage} alt='map 예시' />
    </StyledApp>
  );
}

export default App;