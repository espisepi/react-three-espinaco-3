import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export class PhysicsWorld {
  physicsWorld!: CANNON.World;

  constructor() {
    this.initPhysicsWorld();
  }

  private initPhysicsWorld(): void {
    // Physics
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -9.81, 0);
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    // this.physicsWorld.solver.iterations = 10;
    this.physicsWorld.allowSleep = true;
  }
}
