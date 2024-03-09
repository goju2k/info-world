import { MapPolygonWrapper } from '@mint-ui/map';

import { MarkerProps } from './marker-types';

export function Marker({ data, renderPercent }:MarkerProps) {

  return (
    <>
      {data.slice(0, Math.floor(data.length * (renderPercent / 100))).map((item, idx) => <MapPolygonWrapper key={`marker-${idx}`} position={item.coord[0]} />)}
    </>
  );
}