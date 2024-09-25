import React from '@rbxts/react';
import { createPortal, createRoot } from '@rbxts/react-roblox';

import Index from 'gui/Index';

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

  const button = toolbar.CreateButton(
    id,
    '',
    'rbxassetid://140019172180622',
    pluginGui.Title,
  );

  pluginGui.BindToClose(() => {
    pluginGui.Enabled = false;
    button.SetActive(false);
  });

  button.Click.Connect(() => {
    pluginGui.Enabled = !pluginGui.Enabled;
    button.SetActive(pluginGui.Enabled);
  });
}

init();
