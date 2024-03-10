import { GeoCalulator, MapMarkerWrapper, useMintMapController } from '@mint-ui/map';
import { Canvas3d, Canvas3dRenderer, ThreeContext } from 'draw-3d-property-lib';
import { toPng } from 'html-to-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { MarkerProps } from './marker-types';

import { getPropTypeColor } from '../util/prop-type';

const StyledCanvas = styled.div<{clickable?:boolean; visible?:boolean;}>`
  pointer-events: ${({ clickable }) => (clickable ? 'auto' : 'none')};
  visibility: ${({ visible }) => (visible ? '' : 'hidden')};
`;

export interface Marker3dProps extends MarkerProps {
  control3d?:boolean;
}

export function Marker3d({ data, control3d }:Marker3dProps) {

  const controller = useMintMapController();

  const [ pos, setPos ] = useState(controller.getCurrBounds().nw);
  const [ visible, setVisible ] = useState(true);
  useEffect(() => {

    const handleIdle = () => {
      setPos(controller.getCurrBounds().nw);
      setVisible(true);
    };

    const zoomstart = () => {
      setVisible(false);
    };

    controller.addEventListener('IDLE', handleIdle);
    controller.addEventListener('ZOOMSTART', zoomstart);
    
    return () => {
      controller.removeEventListener('IDLE', handleIdle);
      controller.removeEventListener('ZOOMSTART', zoomstart);
    };

  }, []);
  
  const container = useRef<HTMLDivElement|null>(null);
  const [ hasContainer, setHasContainer ] = useState(false);

  const [ mapImage, setMapImage ] = useState<string|null>(null);
  useEffect(() => {
    if (control3d) {
      toPng(controller.mapDivElement).then((data) => {
        setMapImage(data);
      });  
    } else {
      setMapImage(null);
    }
    
  }, [ control3d ]);

  const contextRef = useRef<ThreeContext|null>(null);
  const renderer:Canvas3dRenderer<{data:typeof data; map?:string;}> = useCallback(async ({
    context,
    payload,
  }) => {

    const time = Date.now();
    const { data, map } = payload;

    contextRef.current = context;

    // add map image
    map && context.addPlainImage(map, true);

    const bounds = controller.getCurrBounds();
    const meterOfLat = GeoCalulator.convertLatitudeToMeterValue(Math.abs(bounds.ne.lat - bounds.se.lat));
    const ratio = controller.mapDivElement.offsetHeight / meterOfLat;
    
    data.forEach((geo) => {
      const posList = geo.coord[0].map((position) => {
        const offset = controller.positionToOffset(position);

        return [ offset.x, offset.y ];
      }) as [number, number][];

      context.addPolygonalBox(
        posList, 
        Math.floor(geo.property.buildingHeightMeter * ratio), 
        getPropTypeColor(geo.property.유형),
      );
    });

    console.log(`add polygon in ${Date.now() - time} ms`);

    // add base axis draw
    // context.addBaseAxis();

    // render
    context.render();
    
  }, []);

  return (
    <MapMarkerWrapper position={pos}>
      <StyledCanvas
        clickable={control3d}
        visible={visible}
        style={{
          width: controller.mapDivElement.offsetWidth,
          height: controller.mapDivElement.offsetHeight,
        }}
        ref={(ref) => {
          container.current = ref;
          setHasContainer(container.current !== null);
        }}
      >
        {
          hasContainer 
        && container.current 
        && (
          <>
            {control3d && mapImage && <Canvas3d parentElement={container.current} payload={{ data, map: mapImage }} renderer={renderer} />}
            {!control3d && <Canvas3d parentElement={container.current} payload={{ data }} renderer={renderer} />}
          </>
        )
        
        }
      </StyledCanvas>
    </MapMarkerWrapper>
  );
}