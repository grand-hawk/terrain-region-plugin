import getMaterialColor from './getMaterialColor';
import region3int16Size from './region3int16Size';

const utilsFolder = script.Parent! as Folder;
const rootFolder = utilsFolder.Parent! as Folder;
const sharedFolder = rootFolder.FindFirstChild('shared') as Folder;
const loadModule = sharedFolder.FindFirstChild('load') as ModuleScript;

export default function terrainToRegions(
  horizontalRegionQuantity: number,
  verticalRegionQuantity: number,
) {
  const terrain = game.Workspace.Terrain;
  const terrainMaxExtents = terrain.MaxExtents;
  const terrainSize = region3int16Size(terrainMaxExtents);

  const exportFolder = new Instance('Folder');
  exportFolder.Name = 'TerrainRegions';
  exportFolder.Parent = game.Workspace;

  const propertiesFolder = new Instance('Configuration');
  propertiesFolder.Name = 'WaterProperties';
  propertiesFolder.SetAttribute('WaterColor', terrain.WaterColor);
  propertiesFolder.SetAttribute('WaterReflectance', terrain.WaterReflectance);
  propertiesFolder.SetAttribute('WaterTransparency', terrain.WaterTransparency);
  propertiesFolder.SetAttribute('WaterWaveSize', terrain.WaterWaveSize);
  propertiesFolder.SetAttribute('WaterWaveSpeed', terrain.WaterWaveSpeed);
  propertiesFolder.Parent = exportFolder;

  const materialColorsFolder = new Instance('Configuration');
  materialColorsFolder.Name = 'MaterialColors';
  for (const material of Enum.Material.GetEnumItems()) {
    const color = getMaterialColor(material);
    if (!color) continue;

    const colorValue = new Instance('Color3Value');
    colorValue.Name = material.Name;
    colorValue.Value = color;
    colorValue.Parent = materialColorsFolder;
  }
  materialColorsFolder.Parent = exportFolder;

  const regionSize = new Vector3(
    terrainSize.X / horizontalRegionQuantity,
    terrainSize.Y,
    terrainSize.Z / verticalRegionQuantity,
  );

  for (let xIndex = 0; xIndex < horizontalRegionQuantity; xIndex += 1) {
    const xOffset = xIndex * regionSize.X;

    for (let zIndex = 0; zIndex < verticalRegionQuantity; zIndex += 1) {
      const zOffset = zIndex * regionSize.Z;

      const minCorner = new Vector3(
        terrainMaxExtents.Min.X + xOffset,
        terrainMaxExtents.Min.Y,
        terrainMaxExtents.Min.Z + zOffset,
      );
      const maxCorner = new Vector3(
        terrainMaxExtents.Min.X + xOffset + regionSize.X,
        terrainMaxExtents.Min.Y + regionSize.Y,
        terrainMaxExtents.Min.Z + zOffset + regionSize.Z,
      );

      const region = new Region3int16(
        new Vector3int16(minCorner.X, minCorner.Y, minCorner.Z),
        new Vector3int16(maxCorner.X, maxCorner.Y, maxCorner.Z),
      );

      const terrainRegion = terrain.CopyRegion(region);
      terrainRegion.Name = `Region ${xIndex}x ${zIndex}y`;
      terrainRegion.Parent = exportFolder;
      terrainRegion.SetAttribute('MinCorner', minCorner);
      terrainRegion.SetAttribute('MaxCorner', maxCorner);
    }
  }

  const loadModuleClone = loadModule.Clone();
  loadModuleClone.Name = 'LoadAPI';
  loadModuleClone.Parent = exportFolder;

  return exportFolder;
}
