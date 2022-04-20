import { useEffect, useRef } from "react";
import * as Three from "three";

import "./index.scss";
import texture01 from "@/src/assets/images/texture-01.jpg"; //引入图片资源
import texture02 from "@/src/assets/images/texture-02.jpg"; //引入图片资源
import texture03 from "@/src/assets/images/texture-03.jpg"; //引入图片资源

const HelloTexture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const renderer = new Three.WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement,
    });

    const camera = new Three.PerspectiveCamera(40, 2, 0.1, 1000);
    camera.position.set(0, 0, 40);

    const scene = new Three.Scene();
    scene.background = new Three.Color(0xcccccc);

    const loadingManager = new Three.LoadingManager();
    const loader = new Three.TextureLoader(loadingManager);

    //添加加载管理器的各种事件处理函数
    loadingManager.onLoad = () => {
      console.log("纹理图片资源加载完成");
    };
    loadingManager.onProgress = (url, loaded, total) => {
      console.log(`图片加载中, 共 ${total} 张，当前已加载 ${loaded} 张 ${url}`);
    };
    loadingManager.onError = (url) => {
      console.log(`加载失败 ${url}`);
    };

    const material = [
      texture01,
      texture02,
      texture03,
      texture01,
      texture02,
      texture03,
    ].map((image) => {
      const texture = loader.load(image);
      texture.offset.set(0.25, 0.25);
      texture.minFilter = Three.LinearMipMapLinearFilter;
      texture.wrapS = Three.RepeatWrapping;
      texture.wrapT = Three.RepeatWrapping;
      texture.rotation = Three.MathUtils.degToRad(45);
      return new Three.MeshBasicMaterial({
        map: texture,
      });
    });

    const box = new Three.BoxBufferGeometry(10, 10, 10);
    const mesh = new Three.Mesh(box, material);
    scene.add(mesh);
    const render = (time: number) => {
      time = time * 0.001;

      mesh.rotation.x = time;
      mesh.rotation.y = time;
      renderer.render(scene, camera);

      window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);

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

export default HelloTexture;
