import * as THREE from "three";
import * as CANNON from "cannon-es";
import { CollisionGroups } from "./enums/CollisionGroups";
import { Wheel } from "./Wheel";
import * as Utils from './FunctionLibrary';


export class Vehicle extends THREE.Object3D {
  public collision: CANNON.Body;
  public camera: any;
  public wheels: Wheel[] = [];
  private modelContainer: THREE.Group;
  public rayCastVehicle: CANNON.RaycastVehicle;
  public help: THREE.AxesHelper;

  constructor(gltf: any, handlingSetup?: any) {
    super();

    if (handlingSetup === undefined) handlingSetup = {};
    (handlingSetup.chassisConnectionPointLocal = new CANNON.Vec3()),
      (handlingSetup.axleLocal = new CANNON.Vec3(-1, 0, 0));
    handlingSetup.directionLocal = new CANNON.Vec3(0, -1, 0);

    // Physics mat
    let mat = new CANNON.Material("Mat");
    mat.friction = 0.01;

    // Collision body
    this.collision = new CANNON.Body({ mass: 50 });
    this.collision.material = mat;

    // Read GLTF
    this.readVehicleData(gltf);

    this.modelContainer = new THREE.Group();
    this.add(this.modelContainer);
    this.modelContainer.add(gltf.scene);
    // this.setModel(gltf.scene);

    // Raycast vehicle component
    this.rayCastVehicle = new CANNON.RaycastVehicle({
      chassisBody: this.collision,
      indexUpAxis: 1,
      indexRightAxis: 0,
      indexForwardAxis: 2,
    });

    this.wheels.forEach((wheel) => {
      handlingSetup.chassisConnectionPointLocal.set(
        wheel.position.x,
        wheel.position.y + 0.2,
        wheel.position.z
      );
      const index = this.rayCastVehicle.addWheel(handlingSetup);
      wheel.rayCastWheelInfoIndex = index;
    });

    this.help = new THREE.AxesHelper(2);
  }

  public readVehicleData(gltf: any): void {
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        // Utils.setupMeshProperties(child);
        // if (child.material !== undefined)
        // {
        // 	this.materials.push(child.material);
        // }
      }

      if (child.hasOwnProperty("userData")) {
        if (child.userData.hasOwnProperty("data")) {
          if (child.userData.data === "seat") {
            // this.seats.push(new VehicleSeat(this, child, gltf));
          }
          if (child.userData.data === "camera") {
            this.camera = child;
          }
          if (child.userData.data === "wheel") {
            this.wheels.push(new Wheel(child));
          }
          if (child.userData.data === "collision") {
            if (child.userData.shape === "box") {
              child.visible = false;

              let phys = new CANNON.Box(
                new CANNON.Vec3(child.scale.x, child.scale.y, child.scale.z)
              );
              phys.collisionFilterMask = CollisionGroups.TrimeshColliders;
              this.collision.addShape(
                phys,
                new CANNON.Vec3(
                  child.position.x,
                  child.position.y,
                  child.position.z
                )
              );
            } else if (child.userData.shape === "sphere") {
              child.visible = false;

              let phys = new CANNON.Sphere(child.scale.x);
              phys.collisionFilterGroup = CollisionGroups.TrimeshColliders;
              this.collision.addShape(
                phys,
                new CANNON.Vec3(
                  child.position.x,
                  child.position.y,
                  child.position.z
                )
              );
            }
          }
          if (child.userData.data === "navmesh") {
            child.visible = false;
          }
        }
      }
    });
  }

  public update(timeStep: number): void
	{
		this.position.set(
			this.collision.interpolatedPosition.x,
			this.collision.interpolatedPosition.y,
			this.collision.interpolatedPosition.z
		);

		this.quaternion.set(
			this.collision.interpolatedQuaternion.x,
			this.collision.interpolatedQuaternion.y,
			this.collision.interpolatedQuaternion.z,
			this.collision.interpolatedQuaternion.w
		);

		// this.seats.forEach((seat: VehicleSeat) => {
		// 	seat.update(timeStep);
		// });

		for (let i = 0; i < this.rayCastVehicle.wheelInfos.length; i++)
		{
			this.rayCastVehicle.updateWheelTransform(i);
			let transform = this.rayCastVehicle.wheelInfos[i].worldTransform;

			let wheelObject = this.wheels[i].wheelObject;
			wheelObject.position.copy(Utils.threeVector(transform.position));
			wheelObject.quaternion.copy(Utils.threeQuat(transform.quaternion));

			let upAxisWorld = new CANNON.Vec3();
			this.rayCastVehicle.getVehicleAxisWorld(this.rayCastVehicle.indexUpAxis, upAxisWorld);
		}

		this.updateMatrixWorld();
	}

}
