import { MapType, MintMap, Position } from '@mint-ui/map';
import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { MapControl, MapKeys } from '../component/map-control/MapControl.js';
import { Marker } from '../component/Marker';
import { Marker2d } from '../component/Marker2d';
import { Marker3d } from '../component/Marker3d';
import { Switch } from '../component/semantic/Switch.js';
import { AreaGeoJSON, useGetAreaApi } from '../hook/get-area-api-hook.js';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing:border-box;
    font-size: 14px;
  }
  body{
    margin:0;
  }
`;

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
`;

function sliceData(data:AreaGeoJSON[], renderPercent:number) {
  return data.slice(0, Math.floor(data.length * (renderPercent / 100)));
}

export function App() {

  // area data
  const orgData = useGetAreaApi();

  // control config: render ratio
  const [ mapType, setMapType ] = useState<MapType>('naver');

  // control config: render ratio
  const [ renderRatio, setRenderRatio ] = useState(10);

  // control config: marker mode
  const [ mode, setMode ] = useState<1|2|3>(1);

  // control config: control 3d
  const [ control3d, setControl3d ] = useState(false);

  // render data
  const [ data, setData ] = useState<AreaGeoJSON[]>();
  useEffect(() => {
    setData(sliceData(orgData, renderRatio));
  }, [ orgData, renderRatio ]);

  return (
    <>

      <GlobalStyle />

      <StyledApp>

        <MintMap
          mapType={mapType}
          mapKey={MapKeys[mapType]}
          base={{
            center: new Position(37.496837, 127.028104),
            zoomLevel: 16,
          }}
        >

          <MapControl
            mapType={mapType}
            setMapType={setMapType}
            renderRatio={renderRatio}
            setRenderRatio={setRenderRatio} 
            mode={mode}
            setMode={setMode}
            control3d={control3d}
            setControl3d={setControl3d}
            dataLength={orgData.length}
          />
          
          {data && (
            <Switch condition={[
              { if: mode === 1, then: <Marker data={data} /> },
              { if: mode === 2, then: <Marker2d data={data} /> },
              { if: mode === 3, then: <Marker3d data={data} control3d={control3d} /> },
            ]}
            />
          )}
        </MintMap>

      </StyledApp>

    </>
  );
}

export default App;