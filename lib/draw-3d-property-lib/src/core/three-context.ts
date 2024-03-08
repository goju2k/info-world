import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import { CameraControl } from './camera/camera-control';

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

  cameraControl:CameraControl;

  constructor({ fov, width, height, near, far }:ThreeContextConfig) {

    // scene
    this.scene = new Scene();
    
    // camera
    this.camera = new PerspectiveCamera(fov, width / height, near, far);
    this.camera.position.set(0, 1.5, 0);

    // renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(width, height);

    // camera control
    this.cameraControl = new CameraControl(this);
    this.cameraControl.attach();

  }
  
  addCube() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 'red' });
    const cube = new Mesh(geometry, material);
    this.scene.add(cube);

    this.camera.position.z = 5;

    return cube;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

}