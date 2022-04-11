import { BoxBufferGeometry, WireframeGeometry } from "three";

const width = 9;
const height = 9;
const depth = 8;

export const myWireframe = new WireframeGeometry(
  new BoxBufferGeometry(width, height, depth)
);
