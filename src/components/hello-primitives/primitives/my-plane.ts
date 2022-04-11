import { PlaneBufferGeometry } from "three";

const width = 9;
const height = 9;
const widthSegments = 2;
const heightSegments = 2;

export const myPlane = new PlaneBufferGeometry(
  width,
  height,
  widthSegments,
  heightSegments
);
