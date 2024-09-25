import region3int16Size from './region3int16Size';

export default function formatRegion3int16Size(region: Region3int16): string {
  const size = region3int16Size(region);

  return string.format('%.2f, %.2f, %.2f', size.X, size.Y, size.Z);
}
