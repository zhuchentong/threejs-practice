import { useEffect, useRef } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as RTScene from "./render-target-scene";

import "./index.scss";

const HelloRenderTarget = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const rtScene = RTScene.default.scene;
    const rtBoxs = RTScene.default.boxs;
    const rtCamera = RTScene.default.camera;

    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });
    const rendererTarget = new Three.WebGLRenderTarget(512, 512, {
      depthBuffer: false,
      stencilBuffer: false,
    });

    const scene = new Three.Scene();
    scene.background = new Three.Color(0x333333);

    const light = new Three.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    light.target.position.set(-2, 2, 2);
    scene.add(light);
    scene.add(light.target);

    const camera = new Three.PerspectiveCamera(45, 2, 0.1, 100);
    camera.position.z = 15;

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.update();

    const material = new Three.MeshPhongMaterial({
      map: rendererTarget.texture,
    });

    const cubeGeo = new Three.BoxBufferGeometry(4, 4, 4);
    const cubeMesh = new Three.Mesh(cubeGeo, material);
    cubeMesh.position.x = 4;
    scene.add(cubeMesh);

    const circleGeo = new Three.CircleBufferGeometry(2.8, 36);
    const circleMesh = new Three.Mesh(circleGeo, material);
    circleMesh.position.x = -4;
    scene.add(circleMesh);

    const render = (time: number) => {
      time *= 0.001;

      rtBoxs.forEach((item) => {
        item.rotation.set(time, time, 0);
      });
      renderer.setRenderTarget(rendererTarget);
      renderer.render(rtScene, rtCamera);
      renderer.setRenderTarget(null);

      cubeMesh.rotation.set(time, time, 0);
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

export default HelloRenderTarget;
