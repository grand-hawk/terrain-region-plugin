const PART_SIZE = 2048;

export default function createLargePlane(position: Vector3, size: Vector3) {
  const numPartsX = math.ceil(size.X / PART_SIZE);
  const numPartsY = math.ceil(size.Y / PART_SIZE);
  const numPartsZ = math.ceil(size.Z / PART_SIZE);

  const startX = position.X - size.X / 2;
  const startY = position.Y - size.Y / 2;
  const startZ = position.Z - size.Z / 2;

  const model = new Instance('Model');

  for (let xIndex = 0; xIndex < numPartsX; xIndex += 1)
    for (let yIndex = 0; yIndex < numPartsY; yIndex += 1)
      for (let zIndex = 0; zIndex < numPartsZ; zIndex += 1) {
        const partWidth = math.min(PART_SIZE, size.X - xIndex * PART_SIZE);
        const partHeight = math.min(PART_SIZE, size.Y - yIndex * PART_SIZE);
        const partDepth = math.min(PART_SIZE, size.Z - zIndex * PART_SIZE);

        const part = new Instance('Part');
        part.Size = new Vector3(partWidth, partHeight, partDepth);
        part.Anchored = true;
        part.Position = new Vector3(
          startX + xIndex * PART_SIZE + partWidth / 2,
          startY + yIndex * PART_SIZE + partHeight / 2,
          startZ + zIndex * PART_SIZE + partDepth / 2,
        );
        part.Parent = model;
      }

  return model;
}
