/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import axios from 'axios';
import express from 'express';

import * as path from 'path';

import { data } from './sample.js';
import { wait } from './wait';

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to temp-proxy-server!' });
});

const sampleRequestBody = '{"startLat":37.4927926,"startLng":127.0137287,"endLat":37.49530933333333,"endLng":127.02255496666666,"zoomLevel":17,"cnstGodsNoitm":100,"cnstGodsPolygonNoitm":15000,"landNoitm":100,"landPolygonNoitm":15000,"분석구분":"99","조회시작월":"202201","조회종료월":"202202","조회시작월Sprice":"202208","조회시작월Eprice":"202110","조회종료월Sprice":"202209","조회종료월Eprice":"202201","조회시작월Spricereal":"202208","조회시작월Epricereal":"202110","조회종료월Spricereal":"202209","조회종료월Epricereal":"202201","가격SubMenu":"1","가격타입":"1","조회시작월S":"202208","조회시작월E":"202110","조회종료월S":"202209","조회종료월E":"202201","최소범위gap":"-1","최대범위gap":"-1","조회시작월Egap":"202110","조회종료월Egap":"202201","조회시작월Eold":"202110","조회종료월Eold":"202201","가격모델":99,"면적구분":"01","유형":"01,02,03,04,05,07","법정동코드":0,"정렬구분유형":"01","정렬구분":"PD","지목":"전,답,대,과수원,목장용지,공장용지,주유소용지","최대대지면적":-1,"최대면적":-1,"최대범위":-1,"최대세대수":-1,"최대연차":-1,"최대추정가":-1,"최대층수":-1,"최소대지면적":-1,"최소면적":-1,"최소범위":-1,"최소세대수":-1,"최소연차":-1,"최소추정가":-1,"최소층수":-1,"추정가면적당가구분":"01","추정가유형구분":"01","추정가표시구분":"01","토지용도지역":"","페이지갯수":10,"현재페이지":1}';

app.post('/area', async (req, res) => {
  
  const { body } = req;
  const { sw, ne, zoomLevel } = body;

  if (zoomLevel < 17) {
    res.status(500).send('zoomLevel < 17 error');
    return;
  }

  const requestBody = JSON.parse(sampleRequestBody);
  requestBody.startLat = sw.lat;
  requestBody.startLng = sw.lng;
  requestBody.endLat = ne.lat;
  requestBody.endLng = ne.lng;

  await wait(Math.random() * 100 + 100);

  // const { data } = await axios.post('https://data-api.kbland.kr/bfmavm/api/v1/map/cmpxPolygonList', requestBody);

  res.send(data);

});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);