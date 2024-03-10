import { MapControlWrapper, MapType } from '@mint-ui/map';
import styled from 'styled-components';

type StateSetter<T> = (val:T)=>void;

interface MapControlProps {
  mapType:MapType;
  setMapType:StateSetter<MapType>;
  renderRatio:number;
  setRenderRatio:StateSetter<number>;
  mode:number;
  setMode:StateSetter<1|2|3>;
  control3d:boolean;
  setControl3d:StateSetter<boolean>;
  dataLength:number;
}

const MapControlContainer = styled.div({
  width: '220px', 
  height: 'fit-content',
  border: '1px solid gray',
  background: 'white',
  padding: '20px',
  marginRight: '10px',
  marginTop: '10px', 
});

const ConfigBox = styled.div<{topElement?:boolean;}>(
  ({ topElement }) => ({ marginTop: topElement ? undefined : '10px' }),
);

const Label = styled.span({});
const LabelLine = styled.div({});

export const MapKeys = {
  naver: 'yc2mrw1mz8',
  google: 'AIzaSyBgPrwr9buZ0EjOxFumRyXyqrkVtEZEtkk',
} as Record<MapType, string>;

export function MapControl({
  mapType,
  setMapType,
  renderRatio, 
  setRenderRatio,
  mode,
  setMode,
  control3d,
  setControl3d,
  dataLength,
}:MapControlProps) {
  return (
    <MapControlWrapper positionHorizontal='right' positionVertical='top'>
    
      <MapControlContainer>
    
        <ConfigBox topElement>
          <Label>지도 종류</Label>
          <select
            style={{ marginLeft: '10px' }}
            onChange={(e) => {
              setMapType(e.target.value as MapType);
            }}
            value={mapType}
          >
            <option value='naver'>네이버</option>
            <option value='google'>구글</option>
          </select>
        </ConfigBox>

        <ConfigBox>
          <LabelLine>렌더링비율</LabelLine>
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
        </ConfigBox>

        <ConfigBox>
          <LabelLine>렌더링된 마커 수</LabelLine>
          <div>{`${Math.floor(dataLength * (renderRatio / 100))} / ${dataLength} 개`}</div>
        </ConfigBox>

        <ConfigBox>
          <Label>마커 종류</Label>
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
        </ConfigBox>

        {mode === 3 && (
          <ConfigBox>
            <Label>3d 컨트롤 </Label>
            <select 
              onChange={(e) => {
                setControl3d(e.target.value === 'true');
              }}
              value={control3d ? 'true' : 'false'}
            >
              <option value='true'>ON</option>
              <option value='false'>OFF</option>
            </select>
          </ConfigBox>
        )}
  
      </MapControlContainer>

    </MapControlWrapper>
  );
}