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
import React, { useState } from '@rbxts/react';

import { Selection } from 'services';
import { load } from 'shared/load';
import terrainToRegions from 'utils/terrainToRegions';

export default function Index() {
  const [selectionExtends, setSelectionExtends] = useState<Vector3>(
    Vector3.zero,
  );
  const [horizontalRegionQuantity, setHorizontalRegionQuantity] =
    useState<number>(1);
  const [verticalRegionQuantity, setVerticalRegionQuantity] =
    useState<number>(1);

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
          <Box
            Direction={Enum.FillDirection.Horizontal}
            Gap={1}
            ListLayoutProps={{
              HorizontalFlex: Enum.UIFlexAlignment.Fill,
            }}
          >
            <Box Gap={1}>
              <Typography Bold Text="Selection extends X" />
              <Input
                Change={{
                  Text: (rbx) => {
                    const newX = math.floor(
                      tonumber(rbx.Text) || selectionExtends.X,
                    );

                    setSelectionExtends(
                      new Vector3(newX, 0, selectionExtends.Z),
                    );

                    rbx.Text = tostring(newX);
                  },
                }}
                PaddingX={1}
                PaddingY={1}
                Text={tostring(selectionExtends.X)}
                TextSize={10}
              />
            </Box>

            <Box Gap={1}>
              <Typography Bold Text="Selection extends Z" />
              <Input
                Change={{
                  Text: (rbx) => {
                    const newZ = math.floor(
                      tonumber(rbx.Text) || selectionExtends.Z,
                    );

                    setSelectionExtends(
                      new Vector3(selectionExtends.X, 0, newZ),
                    );

                    rbx.Text = tostring(newZ);
                  },
                }}
                PaddingX={1}
                PaddingY={1}
                Text={tostring(selectionExtends.Y)}
                TextSize={10}
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
            <Box Gap={1}>
              <Typography Bold Text="Horizontal region quantity" />
              <Input
                Change={{
                  Text: (rbx) => {
                    const newValue = math.floor(
                      tonumber(rbx.Text) || horizontalRegionQuantity,
                    );

                    setHorizontalRegionQuantity(newValue);
                    rbx.Text = tostring(newValue);
                  },
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
                  Text: (rbx) => {
                    const newValue = math.floor(
                      tonumber(rbx.Text) || verticalRegionQuantity,
                    );

                    setVerticalRegionQuantity(newValue);
                    rbx.Text = tostring(newValue);
                  },
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
                selectionExtends.X / horizontalRegionQuantity,
                selectionExtends.Z / verticalRegionQuantity,
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
                    selectionExtends,
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
