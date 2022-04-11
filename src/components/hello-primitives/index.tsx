import React, { useCallback, useEffect, useRef } from "react";
import {
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import "./index.scss";
import {
  createText,
  myBox,
  myCircle,
  myCone,
  myCylinder,
  myEdge,
  myPlane,
  myWireframe,
} from "./primitives";

// 形状数组
const meshArr: (Mesh | LineSegments | Object3D)[] = [];

export const createMaterial = () => {
  const material = new MeshPhongMaterial({ side: DoubleSide });

  const hue = Math.floor(Math.random() * 100) / 100;

  const saturation = 1;
  const luminance = 0.5;

  material.color.setHSL(hue, saturation, luminance);

  return material;
};

const HelloPrimitives: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);

  /**
   * 创建材质
   * @returns
   */

  /**
   * 创建Canvas
   */
  const createInit = useCallback(async () => {
    if (!canvasRef.current) {
      return;
    }

    // 清空数组
    meshArr.length = 0;

    // 创建场景
    const scene = new Scene();
    scene.background = new Color(0x00aacc);

    // 初始化镜头
    const camera = new PerspectiveCamera(40, 2, 0.1, 1000);
    camera.position.z = 120;
    cameraRef.current = camera;

    // 初始化渲染器
    const renderer = new WebGLRenderer({ canvas: canvasRef.current });
    rendererRef.current = renderer;

    // 添加灯光1
    const light0 = new DirectionalLight(0xffffff, 1);
    light0.position.set(-1, 2, 4);
    scene.add(light0);

    // 添加灯光2
    const light1 = new DirectionalLight(0xffffff, 1);
    light1.position.set(1, -2, -4);
    scene.add(light1);

    //添加图元
    const solidPrimitivesArr: BufferGeometry[] = [
      myBox,
      myCircle,
      myCone,
      myCylinder,
      myPlane,
    ];
    const linePrimitivesArr: BufferGeometry[] = [myWireframe, myEdge];

    solidPrimitivesArr.forEach((item) => {
      const material = createMaterial();
      const mesh = new Mesh(item, material);
      meshArr.push(mesh);
    });

    meshArr.push(await createText());

    linePrimitivesArr.forEach((item) => {
      const material = new LineBasicMaterial({ color: 0x000000 });
      const mesh = new LineSegments(item, material);
      meshArr.push(mesh);
    });

    // 定义物体在画面中显示的网格布局
    const eachRow = 5;
    const spread = 15;

    // 配置图元实例,转化为网格
    meshArr.forEach((mesh, index) => {
      const row = Math.floor(index / eachRow);
      const column = index % eachRow;

      mesh.position.x = (column - 2) * spread;
      mesh.position.y = (2 - row) * spread;

      scene.add(mesh);
    });

    const render = (time: number) => {
      time = time * 0.001;

      meshArr.forEach((item) => {
        item.rotation.x = time;
        item.rotation.y = time;
      });

      renderer.render(scene, camera);
      window.requestAnimationFrame(render);
    };

    window.requestAnimationFrame(render);
  }, [canvasRef]);

  const resizeHandle = () => {
    if (rendererRef.current === null || cameraRef.current === null) {
      return;
    }
    // 修改形变比例
    const canvas = rendererRef.current.domElement;
    cameraRef.current.aspect = canvas.clientWidth / canvas.clientHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false);
  };

  useEffect(() => {
    createInit();
    resizeHandle();

    const resizeObserver = new ResizeObserver(() => {
      resizeHandle();
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }
  }, [canvasRef, createInit]);

  return <canvas className="full-screen" ref={canvasRef}></canvas>;
};

export default HelloPrimitives;
