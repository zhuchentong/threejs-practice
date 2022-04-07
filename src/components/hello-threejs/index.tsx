import React, { useEffect, useRef } from "react";
import {
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import "./index.scss";

const HelloThreejs: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resizeHandleRef = useRef<() => void>();

  useEffect(() => {
    if (canvasRef.current) {
      // 创建渲染器
      const renderer = new WebGLRenderer({ canvas: canvasRef.current });

      // 创建镜头
      const camera = new PerspectiveCamera(75, 2, 0.1, 5);

      // 创建场景
      const scene = new Scene();

      //创建几何体
      const geometry = new BoxGeometry(1, 1, 1);

      // 创建材质
      const material1 = new MeshPhongMaterial({ color: 0x44aa88 });
      const material2 = new MeshPhongMaterial({ color: 0xc50d0d });
      const material3 = new MeshPhongMaterial({ color: 0x39b20a });

      // 创建网格
      const cube1 = new Mesh(geometry, material1);
      cube1.position.x = -2;
      scene.add(cube1);

      const cube2 = new Mesh(geometry, material2);
      cube2.position.x = -0;
      scene.add(cube2);

      const cube3 = new Mesh(geometry, material3);
      cube3.position.x = 2;
      scene.add(cube3);

      const cubes = [cube1, cube2, cube3];
      // 创建光源
      const light = new DirectionalLight(0xffffff, 1);

      // 设置光源位置
      light.position.set(-1, 2, 4);
      scene.add(light);

      camera.position.z = 2;

      const render = (time: number) => {
        time = time * 0.001;

        cubes.forEach((cube) => {
          cube.rotation.x = time;
          cube.rotation.y = time;
        });

        renderer.render(scene, camera);
        window.requestAnimationFrame(render);
      };

      window.requestAnimationFrame(render);

      const handleResize = () => {
        // 修改形变比例
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        // 设置渲染尺寸
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      };

      handleResize();

      resizeHandleRef.current = handleResize; //将 resizeHandleRef.current 与 useEffect() 中声明的函数进行绑定

      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });

      resizeObserver.observe(canvasRef.current);

      return () => {
        if (resizeHandleRef && resizeHandleRef.current) {
          resizeObserver.disconnect();
        }
      };
    }
  }, [canvasRef]);

  return <canvas className="full-screen" ref={canvasRef}></canvas>;
};

export default HelloThreejs;
