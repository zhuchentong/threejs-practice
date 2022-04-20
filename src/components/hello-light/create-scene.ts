import * as Three from "three";
import CheckerPng from "@/src/assets/images/checker.png";

export enum MaterialType {
  MESH_PHONE_MATERIAL = "MESH_PHONE_MATERIAL",
  MESH_STANDARD_MATERIAL = "MESH_STANDARD_MATERIAL",
}

const createScene: (type?: keyof typeof MaterialType) => Three.Scene = (
  type = MaterialType.MESH_PHONE_MATERIAL
) => {
  const scene = new Three.Scene();
  const planeSize = 40;

  const loader = new Three.TextureLoader();
  const texture = loader.load(CheckerPng);

  texture.wrapS = Three.RepeatWrapping;
  texture.wrapT = Three.RepeatWrapping;

  texture.magFilter = Three.NearestFilter;
  texture.repeat.set(planeSize / 2, planeSize / 2);

  let planeMat: Three.Material;
  let cubeMat: Three.Material;
  let sphereMat: Three.Material;

  switch (type) {
    case MaterialType.MESH_STANDARD_MATERIAL:
      planeMat = new Three.MeshStandardMaterial({
        map: texture,
        side: Three.DoubleSide,
      });
      cubeMat = new Three.MeshStandardMaterial({
        color: "#8AC",
      });
      sphereMat = new Three.MeshStandardMaterial({
        color: "#8AC",
      });
      break;
    default:
      planeMat = new Three.MeshPhongMaterial({
        color: "#8AC",
      });
      cubeMat = new Three.MeshPhongMaterial({ color: "#CA8" });
      sphereMat = new Three.MeshPhongMaterial({ color: "#8AC" });
  }

  const planeGeo = new Three.PlaneBufferGeometry(planeSize, planeSize);
  const planeMesh = new Three.Mesh(planeGeo, planeMat);
  planeMesh.rotation.x = Math.PI * -0.5;
  scene.add(planeMesh);

  const cubeGeo = new Three.BoxBufferGeometry(4, 4, 4);
  const cubeMesh = new Three.Mesh(cubeGeo, cubeMat);
  cubeMesh.position.set(5, 2.5, 0);
  scene.add(cubeMesh);

  const sphereGeo = new Three.SphereBufferGeometry(3, 32, 16);
  const sphereMesh = new Three.Mesh(sphereGeo, sphereMat);
  sphereMesh.position.set(-4, 5, 0);
  scene.add(sphereMesh);

  return scene;
};

export default createScene;
