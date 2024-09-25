import { Workspace } from '@rbxts/services';

import getMaterialColor from './getMaterialColor';

const utilsFolder = script.Parent! as Folder;
const rootFolder = utilsFolder.Parent! as Folder;
const sharedFolder = rootFolder.FindFirstChild('shared') as Folder;
const loadModule = sharedFolder.FindFirstChild('load') as ModuleScript;

const RESOLUTION = 4;

export default function terrainToRegions(
  selectionExtends: Vector3,
  horizontalRegionQuantity: number,
  verticalRegionQuantity: number,
) {
  const terrain = game.Workspace.Terrain;

  const exportFolder = new Instance('Folder');
  exportFolder.Name = 'TerrainRegions';
  exportFolder.Parent = Workspace;

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

  const terrainMin = new Vector3(
    -(selectionExtends.X / 2),
    0,
    -(selectionExtends.Z / 2),
  );

  const regionSizeX = selectionExtends.X / horizontalRegionQuantity;
  const regionSizeZ = selectionExtends.Z / verticalRegionQuantity;

  for (let xIndex = 0; xIndex < horizontalRegionQuantity; xIndex += 1)
    for (let zIndex = 0; zIndex < verticalRegionQuantity; zIndex += 1) {
      const minCorner = new Vector3(
        terrainMin.X + xIndex * regionSizeX,
        terrain.MaxExtents.Min.Y,
        terrainMin.Z + zIndex * regionSizeZ,
      );
      const maxCorner = new Vector3(
        minCorner.X + regionSizeX,
        terrain.MaxExtents.Max.Y,
        minCorner.Z + regionSizeZ,
      );

      const region = new Region3int16(
        new Vector3int16(
          minCorner.X / RESOLUTION,
          minCorner.Y / RESOLUTION,
          minCorner.Z / RESOLUTION,
        ),
        new Vector3int16(
          maxCorner.X / RESOLUTION,
          maxCorner.Y / RESOLUTION,
          maxCorner.Z / RESOLUTION,
        ),
      );

      const terrainRegion = terrain.CopyRegion(region);
      terrainRegion.Name = `Region ${xIndex}-${zIndex}`;
      terrainRegion.SetAttribute('MinCorner', minCorner);
      terrainRegion.SetAttribute('MaxCorner', maxCorner);
      terrainRegion.Parent = exportFolder;
    }

  const loadModuleClone = loadModule.Clone();
  loadModuleClone.Name = 'LoadAPI';
  loadModuleClone.Parent = exportFolder;

  return exportFolder;
}
