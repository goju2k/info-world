import { BoxGeometry, BufferGeometry, ColorRepresentation, DoubleSide, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, SRGBColorSpace, Scene, TextureLoader, Vector3, WebGLRenderer } from 'three';

import { CameraControlFps } from './camera/camera-control-fps';

interface ThreeContextConfig {
  width:number;
  height:number;
  fov?: number;
  near?:number;
  far?:number;
}

export class ThreeContext {

  scene:Scene;
  camera:PerspectiveCamera;
  renderer:WebGLRenderer;

  cameraControl:CameraControlFps;

  constructor({ fov, width, height, near, far }:ThreeContextConfig) {

    // scene
    this.scene = new Scene();
    
    // camera
    this.camera = new PerspectiveCamera(fov, width / height, near, far);
    this.camera.position.set(0, 1.5, 5);

    // renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(width, height);

    // camera control
    this.cameraControl = new CameraControlFps(this);
    this.cameraControl.attach();

  }

  addBaseAxis(size:number = 100) {
    this.addLine([ new Vector3(0, 0, 0), new Vector3(size, 0, 0) ], 'red');
    this.addLine([ new Vector3(0, 0, 0), new Vector3(0, size, 0) ], 'green');
    this.addLine([ new Vector3(0, 0, 0), new Vector3(0, 0, size) ], 'blue');
  }

  addLine(path:Vector3[], color:ColorRepresentation = 'gray') {
    const lineGeometry = new BufferGeometry().setFromPoints(path);
    const lineMaterial = new LineBasicMaterial({ color });
    const line = new Line(lineGeometry, lineMaterial);
    this.scene.add(line);
  }

  addPlainImage(url:string, size:number) {
    const textureLoader = new TextureLoader();
    textureLoader.load(url, (texture) => {
      texture.colorSpace = SRGBColorSpace;
      const geometry = new PlaneGeometry(size, size * (texture.image.height / texture.image.width));
      const material = new MeshBasicMaterial({ map: texture, side: DoubleSide });
      const plain = new Mesh(geometry, material);
      this.scene.add(plain);
    });
  }

  addPlain(width:number = 1, height:number = 1) {
    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial({ color: 'lightgray', side: DoubleSide });
    const plain = new Mesh(geometry, material);
    this.scene.add(plain);
  }
  
  addCube(width:number = 1, height:number = 1, depth:number = 1) {

    // Create a cube
    const geometry = new BoxGeometry(width, height, depth);
    const material = new MeshBasicMaterial({ color: 'red' });
    const cube = new Mesh(geometry, material);
    
    // Create a line
    const lineGeometry = new BufferGeometry().setFromPoints([
      new Vector3(-0.5, -0.5, -0.5),
      new Vector3(-0.5, 0.5, -0.5),
      new Vector3(0.5, 0.5, -0.5),
      new Vector3(0.5, -0.5, -0.5),
      new Vector3(-0.5, -0.5, -0.5),
      // new Vector3(1, 0, 0),
    ]);
    const lineMaterial = new LineBasicMaterial({ color: 'white', linewidth: 2 });
    const line = new Line(lineGeometry, lineMaterial);

    this.scene.add(cube);
    this.scene.add(line);

    return cube;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

}