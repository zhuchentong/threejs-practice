import { ConeGeometry } from "three";

const radius = 6;
const height = 8;
const segments = 16;

export const myCone = new ConeGeometry(radius, height, segments);
