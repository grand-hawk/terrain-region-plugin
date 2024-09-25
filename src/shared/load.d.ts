interface Module {
  loadRegion(region: TerrainRegion): void;
  loadWaterProperties(waterProperties: Configuration): void;
  loadMaterialColors(materialColors: Configuration): void;
  load(folder: Folder): void;
}

declare const Module: Module;

export = Module;
