--[[
	Copyright 2024 git@astrid.email

	Use of this source code is governed by an MIT-style
	license that can be found in the LICENSE file at https://github.com/grand-hawk/terrain-region-plugin
]]

local module = {}

local RESOLUTION = 4

function module.loadRegion(region: TerrainRegion)
	local minCorner = region:GetAttribute("MinCorner") :: Vector3

	workspace.Terrain:PasteRegion(
		region,
		Vector3int16.new(minCorner.X / RESOLUTION, minCorner.Y / RESOLUTION, minCorner.Z / RESOLUTION),
		true
	)
end

function module.loadWaterProperties(waterProperties: Configuration)
	for attributeName, attributeValue in waterProperties:GetAttributes() do
		workspace.Terrain[attributeName] = attributeValue
	end
end

function module.loadMaterialColors(materialColors: Configuration)
	for _, materialColor in materialColors:GetChildren() do
		if not materialColor:IsA("Color3Value") then
			continue
		end

		workspace.Terrain:SetMaterialColor(materialColor.Name, materialColor.Value)
	end
end

function module.load(folder: Folder)
	local waterProperties = folder:FindFirstChild("WaterProperties") :: Configuration
	module.loadWaterProperties(waterProperties)

	local materialColors = folder:FindFirstChild("MaterialColors") :: Configuration
	module.loadMaterialColors(materialColors)

	local terrainRegions = {} :: { TerrainRegion }
	for _, child in folder:GetChildren() do
		if child:IsA("TerrainRegion") then
			table.insert(terrainRegions, child)
		end
	end

	for _, terrainRegion in terrainRegions do
		module.loadRegion(terrainRegion)
	end
end

return module
