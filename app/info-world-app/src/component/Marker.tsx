import { MapPolygonWrapper } from '@mint-ui/map';

import { MarkerProps } from './marker-types';

export function Marker({ data }:MarkerProps) {

  return (
    <>
      {data.map((item, idx) => <MapPolygonWrapper key={`marker-${idx}`} position={item.coord[0]} />)}
    </>
  );
}