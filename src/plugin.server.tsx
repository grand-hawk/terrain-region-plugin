import React from '@rbxts/react';
import { createPortal, createRoot } from '@rbxts/react-roblox';

import Index from 'gui/Index';
import visualizeSelectedRegions from 'utils/visualizeSelectedRegions';

function init() {
  if (!plugin) return;

  const toolbar = plugin.CreateToolbar('Terrain Regions');
  const id = 'terrain-region-plugin';
  const pluginGui = plugin.CreateDockWidgetPluginGui(
    id,
    new DockWidgetPluginGuiInfo(
      Enum.InitialDockState.Right,
      false,
      false,
      500,
      500,
      500,
      500,
    ),
  );
  pluginGui.Title = 'Generate terrain regions';

  const root = createRoot(new Instance('Folder'));
  root.render(createPortal(<Index />, pluginGui));

  const mainButton = toolbar.CreateButton(
    `${id}-main`,
    '',
    'rbxassetid://140019172180622',
    pluginGui.Title,
  );

  pluginGui.BindToClose(() => {
    pluginGui.Enabled = false;
    mainButton.SetActive(false);
  });

  mainButton.Click.Connect(() => {
    pluginGui.Enabled = !pluginGui.Enabled;
    mainButton.SetActive(pluginGui.Enabled);
  });

  const visualizeButton = toolbar.CreateButton(
    `${id}-visualize`,
    '',
    'rbxassetid://140019172180622',
    'Visualize selected regions',
  );

  visualizeButton.Click.Connect(() => visualizeSelectedRegions());
}

init();
