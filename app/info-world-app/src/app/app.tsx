import { Canvas3d, Canvas3dRenderer } from 'draw-3d-property-lib';
import { useRef, useState } from 'react';
import styled from 'styled-components';

const StyledApp = styled.div`
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
    const cube = context.addCube();
    cube.rotation.x += 0.5;
    cube.rotation.y += 0.5;
    
    context.render();
    
  };

  return (
    <StyledApp ref={(ref) => {
      container.current = ref;
      setHasContainer(container.current !== null);
    }}
    >
      {
        hasContainer 
      && container.current 
      && <Canvas3d parentElement={container.current} payload={testData} renderer={renderer} />
      }
    </StyledApp>
  );
}

export default App;