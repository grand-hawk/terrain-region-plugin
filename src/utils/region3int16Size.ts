export default function region3int16Size(region: Region3int16): Vector3 {
  return new Vector3(
    region.Max.X - region.Min.X,
    region.Max.Y - region.Min.Y,
    region.Max.Z - region.Min.Z,
  );
}
