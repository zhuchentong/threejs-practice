import {
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PointLight,
  SphereBufferGeometry,
} from "three";

// 创建6边形球体
const sphere = new SphereBufferGeometry(1, 10, 10);

// 创建太阳
const sunMaterial = new MeshPhongMaterial({ emissive: 0xffff00 });
const sunMesh = new Mesh(sphere, sunMaterial);
sunMesh.scale.set(4, 4, 4);

// 创建地球
const earthMaterial = new MeshPhongMaterial({
  emissive: 0x2233ff,
  color: 0x888888,
});
const earthMesh = new Mesh(sphere, earthMaterial);

// 创建月亮
const moonMaterial = new MeshPhongMaterial({
  emissive: 0x222222,
  color: 0x888888,
});
const moonMesh = new Mesh(sphere, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5);

// 创建月球轨道空间
export const moomOrbit = new Object3D();
moomOrbit.position.x = 2;
moomOrbit.add(moonMesh);

// 创建地球轨道空间
export const earthOrbit = new Object3D();
earthOrbit.position.x = 10;
earthOrbit.add(earthMesh);
earthOrbit.add(moomOrbit);

// 创建太阳轨道空间
export const solarSystem = new Object3D();
solarSystem.add(sunMesh);
solarSystem.add(earthOrbit);

// 创建点光源
export const pointLight = new PointLight(0xffffff, 3);
