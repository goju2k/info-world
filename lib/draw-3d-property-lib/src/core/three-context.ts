import { BoxGeometry, BufferGeometry, ColorRepresentation, DoubleSide, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneGeometry, SRGBColorSpace, Scene, Shape, ShapeGeometry, TextureLoader, Vector3, WebGLRenderer } from 'three';

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

  halfWidth:number;
  halfHeight:number;

  objectList:Object3D[] = [];

  initVerticalFOV:number;
  initCameraDistance:number;

  constructor({ fov, width, height, near, far }:ThreeContextConfig) {

    this.halfWidth = width / 2;
    this.halfHeight = height / 2;

    // scene
    this.scene = new Scene();
    
    // camera
    const aspectRatio = width / height;
    const focalLength = 100;
    this.initVerticalFOV = fov || Math.atan(height / (2 * aspectRatio * focalLength)) * 2 * (180 / Math.PI);
    this.initCameraDistance = this.halfHeight / Math.tan((this.initVerticalFOV / 2) * (Math.PI / 180));

    this.camera = new PerspectiveCamera(this.initVerticalFOV, aspectRatio, near, far);
    this.initCamera();

    // renderer
    this.renderer = new WebGLRenderer({ alpha: true });
    this.renderer.setSize(width, height);

    // camera control
    this.cameraControl = new CameraControlFps(this);
    this.cameraControl.attach();

    console.log('new context created');

  }

  initCamera() {
    console.log('initCamera');
    this.camera.fov = this.initVerticalFOV;
    this.camera.position.set(this.toDomX(this.halfWidth), this.toDomY(this.halfHeight), this.initCameraDistance);
  }

  toDomX(val:number) {
    return val;
  }
  toDomY(val:number) {
    return val * -1;
  }
  
  addBaseAxis(size:number = 1000) {
    this.addLine([ new Vector3(0, 0, 0), new Vector3(this.toDomX(size), 0, 0) ], 'red');
    this.addLine([ new Vector3(0, 0, 0), new Vector3(0, this.toDomY(size), 0) ], 'green');
    this.addLine([ new Vector3(0, 0, 0), new Vector3(0, 0, size) ], 'blue');
  }

  addLine(path:Vector3[], color:ColorRepresentation = 'gray') {
    const lineGeometry = new BufferGeometry().setFromPoints(path);
    const lineMaterial = new LineBasicMaterial({ color });
    const line = new Line(lineGeometry, lineMaterial);
    this.scene.add(line);
    this.objectList.push(line);
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
        this.objectList.push(plain);
        this.render();
        resolve();
      });
    });
  }

  addPlain(width:number = 100, height:number = 100) {
    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial({ color: 'green', side: DoubleSide });
    const plain = new Mesh(geometry, material);
    this.objectList.push(plain);
    this.scene.add(plain);
  }
  
  addPlainPolygon(position:[number, number][], color:ColorRepresentation) {

    // Create a shape
    const shape = new Shape();
    shape.moveTo(this.toDomX(position[0][0]), this.toDomY(position[0][1])); // Move to the starting point of the shape
    position.forEach((pos, idx) => {
      if (idx !== 0) {
        shape.lineTo(this.toDomX(pos[0]), this.toDomY(pos[1])); // Draw a line to the next point
      }
    });
    // shape.lineTo(this.toDomX(position[0][0]), this.toDomY(position[0][1])); // start line back

    // Create geometry from the shape
    const geometry = new ShapeGeometry(shape);
    
    // Create a material
    const material = new MeshBasicMaterial({ color, side: DoubleSide, transparent: true, opacity: 0.2 });

    // Create a mesh with the geometry and material
    const polygon = new Mesh(geometry, material);

    // Add the mesh to the scene
    this.objectList.push(polygon);
    this.scene.add(polygon);

    // line
    // const lineMaterial = new LineBasicMaterial({ color });
    // const line = new Line(geometry, lineMaterial);
    // this.scene.add(line);
    // this.objectList.push(line);
    
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
    this.objectList.push(cube);
    this.objectList.push(line);

    return cube;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  clearObjectAll() {
    
    this.objectList.forEach((obj) => {
      const target = obj as Mesh | Line;
      target.geometry.dispose();
      const mat = Array.isArray(target.material) ? target.material : [ target.material ];
      mat.forEach((m) => m.dispose());
      this.scene.remove(obj);
    });

    this.objectList.length = 0;
    
  }

}