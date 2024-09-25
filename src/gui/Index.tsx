import {
  Box,
  Button,
  darkTheme,
  Input,
  SecondaryButton,
  Sheet,
  ThemeProvider,
  Typography,
} from '@grand-hawk/ui-components';
import React, { useEffect, useState } from '@rbxts/react';

import { load } from 'load';
import { Selection } from 'services';
import formatRegion3int16Size from 'utils/formatRegion3int16Size';
import region3int16Size from 'utils/region3int16Size';
import terrainToRegions from 'utils/terrainToRegions';

export default function Index() {
  const [terrainMaxExtents, setTerrainMaxExtents] = useState<Region3int16>(
    game.Workspace.Terrain.MaxExtents,
  );
  const [horizontalRegionQuantity, setHorizontalRegionQuantity] =
    useState<number>(1);
  const [verticalRegionQuantity, setVerticalRegionQuantity] =
    useState<number>(1);

  useEffect(() => {
    const connection = game.Workspace.Terrain.GetPropertyChangedSignal(
      'MaxExtents',
    ).Connect(() => setTerrainMaxExtents(game.Workspace.Terrain.MaxExtents));

    return () => connection.Disconnect();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Sheet
        Background
        Gap={1}
        ListLayoutProps={{
          VerticalFlex: Enum.UIFlexAlignment.SpaceBetween,
          HorizontalFlex: Enum.UIFlexAlignment.Fill,
        }}
        Padding={2}
        Size={UDim2.fromScale(1, 1)}
      >
        <Box Gap={1}>
          <Box Direction={Enum.FillDirection.Horizontal} Gap={0.5}>
            <Typography Bold Text="Map extents:" />
            <Typography
              Font={Enum.Font.RobotoMono}
              Text={formatRegion3int16Size(terrainMaxExtents)}
            />
          </Box>

          <Box
            Direction={Enum.FillDirection.Horizontal}
            Gap={1}
            ListLayoutProps={{
              HorizontalFlex: Enum.UIFlexAlignment.Fill,
            }}
          >
            <Box Gap={1}>
              <Typography Bold Text="Horizontal region quantity" />
              <Input
                Change={{
                  Text: (rbx) =>
                    setHorizontalRegionQuantity(
                      math.floor(
                        tonumber(rbx.Text) || horizontalRegionQuantity,
                      ),
                    ),
                }}
                PaddingX={1}
                PaddingY={1}
                Text={tostring(horizontalRegionQuantity)}
                TextSize={10}
              />
            </Box>

            <Box Gap={1}>
              <Typography Bold Text="Vertical region quantity" />
              <Input
                Change={{
                  Text: (rbx) =>
                    setVerticalRegionQuantity(
                      math.floor(tonumber(rbx.Text) || verticalRegionQuantity),
                    ),
                }}
                PaddingX={1}
                PaddingY={1}
                Text={tostring(verticalRegionQuantity)}
                TextSize={10}
              />
            </Box>
          </Box>

          <Box Direction={Enum.FillDirection.Horizontal} Gap={0.5}>
            <Typography Bold Text="Region size:" />
            <Typography
              Font={Enum.Font.RobotoMono}
              Text={string.format(
                '%.2f, %.2f',
                region3int16Size(terrainMaxExtents).X /
                  horizontalRegionQuantity,
                region3int16Size(terrainMaxExtents).Z / verticalRegionQuantity,
              )}
            />
          </Box>
        </Box>

        <Box
          Direction={Enum.FillDirection.Horizontal}
          Gap={1}
          ListLayoutProps={{
            HorizontalFlex: Enum.UIFlexAlignment.Fill,
          }}
        >
          <Button
            BorderRadius={1 * 8}
            Event={{
              MouseButton1Click: () =>
                Selection.Set([
                  terrainToRegions(
                    horizontalRegionQuantity,
                    verticalRegionQuantity,
                  ),
                ]),
            }}
            Text="Generate regions"
          />

          <SecondaryButton
            BorderRadius={1 * 8}
            Event={{
              MouseButton1Click: () => {
                const selections = Selection.Get();
                if (!selections.size()) return;

                const selection = selections[0];
                if (!selection.IsA('Folder')) return;

                load(selection);
              },
            }}
            Text="Load regions"
          />
        </Box>
      </Sheet>
    </ThemeProvider>
  );
}
