import { Position } from '@mint-ui/map';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { data as testdata } from '../assets/sample.js';

const MaxFloorByType = {
  '01': 18,
  '02': 15,
  '03': 5,
  '04': 5,
  '05': 4,
  '06': 6,
  '07': 3,
} as Record<string, number>;

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
  floors: number;
  heightMeterPerFloor: number;
  buildingHeightMeter: number;
}

export interface AreaGeoJSON {
  property:Property;
  coord:Position[][];
}

export function useGetAreaApi() {

  const [ data, setData ] = useState<AreaGeoJSON[]>([]);
  useEffect(() => {

    // fetch
    (async () => {

      const res = { data: testdata }; // local file에서 읽기
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

      // api data to GeoJSON type
      const parsedData = res.data.dataBody.data.list[1].features.map((item:any) => {
        
        const coord = [ item.geometry.coordinates[0][0].map((pos:number[]) => new Position(pos[1], pos[0])) ];
        const { property } = item;

        property.floors = Math.floor(Math.random() * MaxFloorByType[property.유형]);
        property.heightMeterPerFloor = 3; // 1층 = 3미터
        property.buildingHeightMeter = property.floors * property.heightMeterPerFloor;

        return {
          property,
          coord,
        } as AreaGeoJSON;

      }) as AreaGeoJSON[];

      setData(parsedData);

    })();

  }, []);

  return data;

}