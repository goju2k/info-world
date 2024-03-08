import { Euler, PerspectiveCamera, Quaternion } from 'three';

import { ThreeContext } from '../three-context';

export class CameraControl {

  context:ThreeContext;

  isDragging = false;
  previousMousePosition = {
    x: 0,
    y: 0,
  };

  domElement:HTMLCanvasElement;
  camera:PerspectiveCamera;
  
  constructor(context:ThreeContext) {
    this.context = context;
    this.domElement = context.renderer.domElement;
    this.camera = context.camera;
  }

  attach() {

    this.domElement.addEventListener('contextmenu', this.contextmenu.bind(this));
    this.domElement.addEventListener('mousedown', this.mousedown.bind(this));
    this.domElement.addEventListener('mousemove', this.mousemove.bind(this));
    this.domElement.addEventListener('mouseup', this.mouseup.bind(this));
    
  }

  detach() {

    this.domElement.removeEventListener('contextmenu', this.contextmenu);
    this.domElement.removeEventListener('mousedown', this.mousedown);
    this.domElement.removeEventListener('mousemove', this.mousemove);
    this.domElement.removeEventListener('mouseup', this.mouseup);

  }

  private contextmenu(event:MouseEvent) {
    event.preventDefault();
  }

  private mousedown(event:MouseEvent) {
    if (event.button === 2) {
      this.isDragging = true;
    }
  }

  private mousemove(event:MouseEvent) {
    
    const deltaMove = {
      x: event.offsetX - this.previousMousePosition.x,
      y: event.offsetY - this.previousMousePosition.y,
    };
  
    if (this.isDragging) {
      
      const deltaRotationQuaternion = new Quaternion()
        .setFromEuler(new Euler(
          this.toRadians(deltaMove.y * -1),
          this.toRadians(deltaMove.x * -1),
          0,
          'XYZ',
        ));
  
      this.camera.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.camera.quaternion);
      this.context.render();
      
    }
  
    this.previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY,
    };

  }

  private mouseup(event:MouseEvent) {
    if (event.button === 2) {
      this.isDragging = false;
    }
  }

  private toRadians(angle:number) {
    return angle * (Math.PI / 180);
  }

}