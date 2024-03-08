import { PerspectiveCamera, Vector3 } from 'three';
// @ts-ignore : ts not supported
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { ThreeContext } from '../three-context';

export class CameraControlFps {

  context:ThreeContext;

  domElement:HTMLCanvasElement;
  camera:PerspectiveCamera;
  controls:PointerLockControls;

  moveForward = false;
  moveBackward = false;
  moveLeft = false;
  moveRight = false;
  moveTop = false;

  delta = 0.05;
  moveSpeed = 1;

  renderFlag = false;
  
  constructor(context:ThreeContext) {
    this.context = context;
    this.domElement = context.renderer.domElement;
    this.camera = context.camera;

    // Add controls for movement
    this.controls = new PointerLockControls(this.camera, document.body);
    this.context.scene.add(this.controls.getObject());

    // loop
    this.renderLoop();
  }

  attach() {

    this.domElement.addEventListener('contextmenu', this.contextmenu.bind(this));
    this.domElement.addEventListener('click', this.click.bind(this));
    
    document.body.addEventListener('keydown', this.keydown.bind(this));
    document.body.addEventListener('keyup', this.keyup.bind(this));
    document.body.addEventListener('mousemove', this.mousemove.bind(this));
    
  }

  detach() {

    this.domElement.removeEventListener('contextmenu', this.contextmenu);
    this.domElement.removeEventListener('click', this.click);
    
    document.body.removeEventListener('keydown', this.keydown);
    document.body.removeEventListener('keyup', this.keyup);
    document.body.removeEventListener('mousemove', this.mousemove);

  }

  private click() {
    this.controls.lock();
  }

  private mousemove() {
    if (this.controls.isLocked) {
      this.context.render();
    }
  }

  private renderLoop() {
    requestAnimationFrame(this.renderLoop.bind(this));
    if (this.renderFlag) {
      this.moveCamera();
      this.context.render();
    }
  }

  private moveCamera() {

    // Update camera position based on controls
    if (this.controls.isLocked === true) {

      const direction = new Vector3();
      this.controls.getDirection(direction);
      
      if (this.moveForward) {
        // this.controls.getObject().position.add(direction.multiplyScalar(this.delta * this.moveSpeed));
        // this.controls.getDirection(direction);
        this.controls.moveForward(this.delta * this.moveSpeed);
      }
      if (this.moveBackward) {
        // this.controls.getObject().position.sub(direction.multiplyScalar(this.delta * this.moveSpeed));
        // this.controls.getDirection(direction);
        this.controls.moveForward(this.delta * this.moveSpeed * -1);
      }
      
      if (this.moveLeft) {
        // this.controls.getObject().position.add(direction.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2).multiplyScalar(this.delta * this.moveSpeed));
        // this.controls.getDirection(direction);
        this.controls.moveRight(this.delta * this.moveSpeed * -1);
      }
      
      if (this.moveRight) {
        // this.controls.getObject().position.sub(direction.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2).multiplyScalar(this.delta * this.moveSpeed));
        // this.controls.getDirection(direction);
        this.controls.moveRight(this.delta * this.moveSpeed);
      }

      if (this.moveTop) {
        this.camera.position.y += this.delta * this.moveSpeed;
      }
      
    }

  }

  private updateRenderFlag() {
    this.renderFlag = this.moveForward || this.moveBackward || this.moveLeft || this.moveRight || this.moveTop;
  }

  private keydown(event:KeyboardEvent) {
    switch (event.keyCode) {
      case 87: // W
        this.moveForward = true;
        break;
      case 83: // S
        this.moveBackward = true;
        break;
      case 65: // A
        this.moveLeft = true;
        break;
      case 68: // D
        this.moveRight = true;
        break;
      case 32: // space
        this.moveTop = true;
        break;
      default:
        break;
    }

    this.updateRenderFlag();
  }

  private keyup(event:KeyboardEvent) {
    switch (event.keyCode) {
      case 87: // W
        this.moveForward = false;
        break;
      case 83: // S
        this.moveBackward = false;
        break;
      case 65: // A
        this.moveLeft = false;
        break;
      case 68: // D
        this.moveRight = false;
        break;
      case 32: // space
        this.moveTop = false;
        break;
      default:
        break;
    }

    this.updateRenderFlag();
  }

  private contextmenu(event:MouseEvent) {
    event.preventDefault();
  }

}