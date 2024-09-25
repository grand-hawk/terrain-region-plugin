import { Workspace } from '@rbxts/services';

export default function getMaterialColor(
  material: Enum.Material,
): Color3 | undefined {
  const [success, value] = pcall(() =>
    Workspace.Terrain.GetMaterialColor(material),
  );
  if (success) return value;
}
