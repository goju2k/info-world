import { MapControlWrapper, MintMap, Position } from '@mint-ui/map';
// import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { data as testdata } from './sample.js';

import { Marker } from '../component/Marker';
import { Marker2d } from '../component/Marker2d';
import { Marker3d } from '../component/Marker3d';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing:border-box;
  }
  body{
    margin:0;
  }
`;

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  font-size: 14px;
`;

export interface Property {
  bsn: string;
  추정가격: number;
  추정가격변동률: number;
  건물추정가격: number;
  건물추정가격변동률: number;
  토지추정가격: number;
  토지추정가격변동률: number;
  제곱미터당추정가격: number;
  제곱미터당추정가격변동률: number;
  lsn: string;
  유형: string;
  nmvl: string;
  cat: string;
}

export interface GeoJSON {
  property:Property;
  coord:Position[][];
}

export function App() {

  const [ data, setData ] = useState<GeoJSON[]>([]);
  useEffect(() => {

    // fetch
    (async () => {

      const res = { data: testdata };
      // await axios.post( // API 로 부터 읽기
      //   'http://localhost:3333/area', 
      //   {
      //     sw: {
      //       lat: 37.4927926,
      //       lng: 127.0137287,
      //     },
      //     ne: {
      //       lat: 37.49530933333333,
      //       lng: 127.02255496666666,
      //     },
      //     zoomLevel: 17,
      //   },
      // );

      const parsedData = res.data.dataBody.data.list[1].features.map((item:any) => {
        
        const coord = [ item.geometry.coordinates[0][0].map((pos:number[]) => new Position(pos[1], pos[0])) ];
        const { property } = item;

        return {
          property,
          coord,
        } as GeoJSON;

      }) as GeoJSON[];

      setData(parsedData);

    })();

  }, []);

  const [ renderRatio, setRenderRatio ] = useState(10);
  const [ mode, setMode ] = useState<1|2|3>(1);

  const [ control3d, setControl3d ] = useState(false);

  return (
    <>
      <GlobalStyle />
      <StyledApp>
        <MintMap
          // mapKey='yc2mrw1mz8'
          // mapType='naver'
          mapKey='AIzaSyBgPrwr9buZ0EjOxFumRyXyqrkVtEZEtkk'
          mapType='google'
          base={{
            center: new Position(37.496837, 127.028104),
            zoomLevel: 16,
          }}
        >
          <MapControlWrapper positionHorizontal='right' positionVertical='top'>
            <div style={{ width: '200px', height: '170px', border: '1px solid gray', background: 'white', padding: '10px', marginRight: '10px', marginTop: '10px' }}>
              
              <div>
                <div>렌더링비율</div>
                <input
                  type='range'
                  min='1'
                  max='100'
                  style={{ width: '70%' }}
                  value={renderRatio}
                  onChange={(e) => {
                    setRenderRatio(Number(e.target.value));
                  }}
                /><span>{` ${renderRatio}%`}</span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div>렌더링된 마커 수</div>
                <div>{`${Math.floor(data.length * (renderRatio / 100))} / ${data.length} 개`}</div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <span>마커 종류</span>
                <select
                  onChange={(e) => {
                    setMode(Number(e.target.value) as 1|2|3);
                  }}
                  value={mode}
                  style={{ marginLeft: '10px' }}
                >
                  <option value={1}>일반 마커</option>
                  <option value={2}>2D 마커</option>
                  <option value={3}>3D 마커</option>
                </select>
              </div>

              {mode === 3 && (
                <div style={{ marginTop: '10px' }}>
                  <span>3d 컨트롤 </span>
                  <select 
                    onChange={(e) => {
                      setControl3d(e.target.value === 'true');
                    }}
                    value={control3d ? 'true' : 'false'}
                  >
                    <option value='true'>ON</option>
                    <option value='false'>OFF</option>
                  </select>
                </div>
              )}
            
            </div>
          </MapControlWrapper>
          {data && (
            <Switch condition={[
              { if: mode === 1, then: <Marker data={data} renderPercent={renderRatio} /> },
              { if: mode === 2, then: <Marker2d data={data} renderPercent={renderRatio} /> },
              { if: mode === 3, then: <Marker3d data={data} renderPercent={renderRatio} control3d={control3d} /> },
            ]}
            />
          )}
        </MintMap>
      </StyledApp>
    </>
  );
}

export function Switch({ condition }:{condition:{if:(()=>boolean) | boolean; then:React.ReactNode;}[];}) {
  return (
    <>
      {condition.map((item, idx) => {
        const val = item.if instanceof Function ? item.if() : item.if;
        if (!val) {
          return null;
        }
        return <Fragment key={`switch-item-${idx}`}>{item.then}</Fragment>;
      })}
    </>
  );
}

export default App;