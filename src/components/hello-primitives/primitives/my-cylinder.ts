import { CylinderBufferGeometry } from "three";

const radiusTop = 4;
const radiusBottom = 4;
const height = 8;
const radialSegments = 12;

export const myCylinder = new CylinderBufferGeometry(
  radiusTop,
  radiusBottom,
  height,
  radialSegments
);
