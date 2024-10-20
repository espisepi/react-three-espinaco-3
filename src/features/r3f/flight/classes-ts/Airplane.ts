import * as CANNON from "cannon-es";
import * as THREE from "three";
import { Vehicle } from "./Vehicle";

export class Airplane extends Vehicle {
  private rotor!: THREE.Object3D;
  private leftAileron!: THREE.Object3D;
  private rightAileron!: THREE.Object3D;
  private elevators: THREE.Object3D[] = [];
  private rudder!: THREE.Object3D;

  constructor(gltf: any) {
    super(gltf, {
      radius: 0.12,
      suspensionStiffness: 150,
      suspensionRestLength: 0.25,
      dampingRelaxation: 5,
      dampingCompression: 5,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(),
    });

    this.readAirplaneData(gltf);
  }

  private readAirplaneData(gltf: any): void {
    gltf.scene.traverse((child: any) => {
      if (child.hasOwnProperty("userData")) {
        if (child.userData.hasOwnProperty("data")) {
          if (child.userData.data === "rotor") {
            this.rotor = child;
          }
          if (child.userData.data === "rudder") {
            this.rudder = child;
          }
          if (child.userData.data === "elevator") {
            this.elevators.push(child);
          }
          if (child.userData.data === "aileron") {
            if (child.userData.hasOwnProperty("side")) {
              if (child.userData.side === "left") {
                this.leftAileron = child;
              } else if (child.userData.side === "right") {
                this.rightAileron = child;
              }
            }
          }
        }
      }
    });
  }
}
