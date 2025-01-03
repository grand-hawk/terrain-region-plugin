import createLargePlane from './createLargePlane';
import { Selection } from 'services';

export default function visualizeSelectedRegions() {
  const selection = Selection.Get();
  const validRegions = selection.filter(
    (instance) =>
      instance.IsA('TerrainRegion') &&
      typeIs(instance.GetAttribute('MinCorner'), 'Vector3') &&
      typeIs(instance.GetAttribute('MaxCorner'), 'Vector3'),
  );
  if (!validRegions.size()) return print('No valid regions selected');

  const workspaceModel = new Instance('Model');
  workspaceModel.Name = 'TerrainRegionsVisualizer';
  workspaceModel.Archivable = true;
  workspaceModel.Parent = game.Workspace;

  for (const region of validRegions) {
    const minCorner = region.GetAttribute('MinCorner') as Vector3;
    const maxCorner = region.GetAttribute('MaxCorner') as Vector3;
    const center = minCorner.Lerp(maxCorner, 0.5);
    const size = maxCorner.sub(minCorner);

    const plane = createLargePlane(
      new Vector3(center.X, 0, center.Z),
      new Vector3(size.X, 16, size.Z),
    );
    plane.Name = region.Name;
    plane.Parent = workspaceModel;
  }
}
