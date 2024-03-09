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
    const aspectRatio = width / height;
    const focalLength = 100;
    const verticalFOV = Math.atan(height / (2 * aspectRatio * focalLength)) * 2 * (180 / Math.PI);
    console.log('aspectRatio', aspectRatio, 'verticalFOV', verticalFOV);
    this.camera = new PerspectiveCamera(fov = verticalFOV, width / height, near, far);
    const cameraDistance = (height / 2) / Math.tan((verticalFOV / 2) * (Math.PI / 180));

    console.log('cameraDistance', cameraDistance);
    this.camera.position.set(0, 0, cameraDistance);

    // renderer
    this.renderer = new WebGLRenderer({ alpha: true });
    this.renderer.setSize(width, height);

    // camera control
    this.cameraControl = new CameraControlFps(this);
    this.cameraControl.attach();

    console.log('new context');

  }

  addBaseAxis(size:number = 1000) {
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
    return new Promise<void>((resolve) => {
      const textureLoader = new TextureLoader();
      textureLoader.load(url, (texture) => {
        texture.colorSpace = SRGBColorSpace;
        const geometry = new PlaneGeometry(size, size * (texture.image.height / texture.image.width));
        const material = new MeshBasicMaterial({ map: texture, side: DoubleSide });
        const plain = new Mesh(geometry, material);
        this.scene.add(plain);
        this.render();
        resolve();
      });
    });
  }

  addPlain(width:number = 100, height:number = 100) {
    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial({ color: 'green', side: DoubleSide });
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