import { BoxBufferGeometry, EdgesGeometry } from "three";

const width = 8;
const height = 8;
const depth = 8;
const thresholdAngle = 15;

export const myEdge = new EdgesGeometry(
  new BoxBufferGeometry(width, height, depth),
  thresholdAngle
);
