import { useEffect, useRef } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ShadowPng from "@/src/assets/images/checker.png";

import "./index.scss";

const HelloShadow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });
    renderer.shadowMap.enabled = true;
    //     renderer.physicallyCorrectLights = true;

    const scene = new Three.Scene();
    scene.background = new Three.Color(0x333333);

    //     const hemisphereLight = new Three.HemisphereLight(0xffffff, 0x000000, 2);
    //     scene.add(hemisphereLight);

    const camera = new Three.PerspectiveCamera(45, 2, 5, 100);
    camera.position.set(0, 10, 20);
    scene.add(camera);

    const helperCamera = new Three.PerspectiveCamera(45, 2, 5, 100);
    helperCamera.position.set(20, 10, 20);
    helperCamera.lookAt(0, 5, 0);
    scene.add(helperCamera);

    const cameraHelper = new Three.CameraHelper(helperCamera);
    scene.add(cameraHelper);

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.target.set(0, 5, 0);
    controls.update();

    //     const light = new Three.DirectionalLight(0xffffff, 1);
    //     const light = new Three.SpotLight(0xffffff, 1);
    const light = new Three.PointLight(0xffffff, 1);

    light.castShadow = true;
    light.position.set(0, 10, 0);
    //     light.target.position.set(-4, 0, -4);
    light.castShadow = true;
    scene.add(light);
    //     scene.add(light.target);

    const shadowCamera = light.shadow.camera;
    //     shadowCamera.left = -10;
    //     shadowCamera.right = 10;
    //     shadowCamera.top = 10;
    //     shadowCamera.bottom = -10;
    shadowCamera.updateProjectionMatrix();

    //     const lightHelper = new Three.DirectionalLightHelper(light);
    //     const lightHelper = new Three.SpotLightHelper(light);
    const lightHelper = new Three.PointLightHelper(light);
    scene.add(lightHelper);

    const shadowHelper = new Three.CameraHelper(shadowCamera);
    scene.add(shadowHelper);

    const rootMat = new Three.MeshPhongMaterial({
      color: 0xcccccc,
      side: Three.BackSide,
    });

    const roomGeo = new Three.BoxBufferGeometry(30, 30, 30);
    const roomMesh = new Three.Mesh(roomGeo, rootMat);
    roomMesh.receiveShadow = true;
    roomMesh.position.set(0, 14.9, 0);
    scene.add(roomMesh);

    const planeSize = 40;

    const loader = new Three.TextureLoader();
    const texture = loader.load(ShadowPng);
    texture.wrapS = Three.RepeatWrapping;
    texture.wrapT = Three.RepeatWrapping;
    texture.magFilter = Three.NearestFilter;
    texture.repeat.set(planeSize / 2, planeSize / 2);

    const planGeo = new Three.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new Three.MeshPhongMaterial({
      map: texture,
      side: Three.DoubleSide,
    });
    const planeMesh = new Three.Mesh(planGeo, planeMat);
    planeMesh.receiveShadow = true;
    planeMesh.rotation.x = Math.PI * -0.5;
    scene.add(planeMesh);

    const material = new Three.MeshPhongMaterial({
      color: 0x88aacc,
    });
    const boxMat = new Three.BoxBufferGeometry(4, 4, 4);
    const boxMesh = new Three.Mesh(boxMat, material);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxMesh.position.set(5, 3, 0);
    scene.add(boxMesh);

    const sphereMat = new Three.SphereBufferGeometry(3, 32, 16);
    const sphereMesh = new Three.Mesh(sphereMat, material);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    sphereMesh.position.set(-4, 5, 0);
    scene.add(sphereMesh);

    const render = () => {
      cameraHelper.update();
      lightHelper.update();
      shadowHelper.update();

      renderer.render(scene, camera);
      window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);

    const handleResize = () => {
      if (canvasRef.current === null) {
        return;
      }

      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default HelloShadow;
