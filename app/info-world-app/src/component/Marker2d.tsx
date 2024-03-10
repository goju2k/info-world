import { CanvasMarker, useMintMapController } from '@mint-ui/map';

import { MarkerProps } from './marker-types';

import { getPropTypeColor } from '../util/prop-type';

export function Marker2d({ data }:MarkerProps) {
  
  const controller = useMintMapController();

  return (
    <CanvasMarker
      renderer={({ context, payload }) => {
        
        context.beginPath();

        const offset = payload ? payload.coord[0].map((cor) => controller.positionToOffset(cor)) : [];
        const [ start ] = offset;
        context.moveTo(start.x, start.y);
        offset?.forEach((off, idx) => {
          if (idx !== 0) {
            context.lineTo(off.x, off.y);
          }
        });

        const color = getPropTypeColor(payload?.property.유형 || '07');
        context.lineTo(start.x, start.y);
        context.fillStyle = color;
        context.globalAlpha = 0.3;
        context.fill();

        context.strokeStyle = color;
        context.globalAlpha = 1;
        context.stroke();

        context.closePath();

      }}
      data={data}
    />
  );
}