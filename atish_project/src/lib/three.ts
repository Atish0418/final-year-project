// Future React Three Fiber helpers can live here.
// Example shape to keep imports consistent across the app.
export type SceneConfig = {
  camera?: { fov?: number; position?: [number, number, number] };
  enableOrbitControls?: boolean;
};

export const defaultScene: SceneConfig = {
  camera: { fov: 60, position: [0, 1.5, 4] },
  enableOrbitControls: true,
};
