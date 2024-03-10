import { AreaGeoJSON } from '../hook/get-area-api-hook';

export interface MarkerProps {
  data:AreaGeoJSON[];
  renderPercent:number;
}