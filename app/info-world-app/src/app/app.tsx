import { MintMap } from '@mint-ui/map';
import styled from 'styled-components';

import { Marker3d } from '../component/Marker3d';

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
`;

export function App() {

  return (
    <StyledApp>
      <MintMap mapKey='yc2mrw1mz8' mapType='naver'>
        <Marker3d />
      </MintMap>
    </StyledApp>
  );
}

export default App;