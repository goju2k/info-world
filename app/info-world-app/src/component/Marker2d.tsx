import { CanvasMarker, useMintMapController } from '@mint-ui/map';

import { MarkerProps } from './marker-types';

export function Marker2d({ data, renderPercent }:MarkerProps) {
  
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
        context.lineTo(start.x, start.y);
        context.fillStyle = 'orange';
        context.globalAlpha = 0.3;
        context.fill();

        context.strokeStyle = 'orange';
        context.globalAlpha = 1;
        context.stroke();

        context.closePath();

      }}
      data={data.slice(0, Math.floor(data.length * (renderPercent / 100)))}
    />
  );
}