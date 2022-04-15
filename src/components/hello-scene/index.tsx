import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Color,
  AxesHelper,
  Material,
} from "three";
import {
  earthOrbit,
  moomOrbit,
  pointLight,
  solarSystem,
} from "./create-something";
import "./index.scss";

const nodeArr = [solarSystem, earthOrbit, moomOrbit];

const HelloScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    // 创建渲染器
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement,
    });

    rendererRef.current = renderer;

    // 创建镜头
    const camera = new PerspectiveCamera(40, 2, 0.1, 1000);

    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    cameraRef.current = camera;

    // 创建场景

    const scene = new Scene();
    scene.background = new Color(0x111111);
    sceneRef.current = scene;

    // 添加场景内容
    scene.add(solarSystem);
    scene.add(pointLight);

    nodeArr.forEach((item) => {
      const axes = new AxesHelper();
      const material = axes.material as Material;
      material.depthTest = false;
      axes.renderOrder = 1;
      item.add(axes);
    });

    //创建循环渲染的动画
    const render = (time: number) => {
      time = time * 0.001;
      nodeArr.forEach((item) => {
        item.rotation.y = time;
      });
      renderer.render(scene, camera);
      window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);

    //添加窗口尺寸变化的监听
    const resizeHandle = () => {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    resizeHandle();
    window.addEventListener("resize", resizeHandle);

    return () => {
      window.removeEventListener("resize", resizeHandle);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default HelloScene;
