--[[
	Copyright 2025 git@astrid.email

	Use of this source code is governed by an MIT-style
	license that can be found in the LICENSE file at https://github.com/grand-hawk/terrain-region-plugin
]]

local module = {}

local RunService = game:GetService("RunService")

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
	for _, value in materialColors:GetChildren() do
		if not value:IsA("Color3Value") then
			continue
		end

		workspace.Terrain:SetMaterialColor(value.Name, value.Value)
	end
end

function module.load(folder: Folder)
	local waterProperties = folder:FindFirstChild("WaterProperties") :: Configuration
	module.loadWaterProperties(waterProperties)

	local materialColors = folder:FindFirstChild("MaterialColors") :: Configuration
	module.loadMaterialColors(materialColors)

	local priorityTerrainRegions = {} :: { TerrainRegion }
	local normalTerrainRegions = {} :: { TerrainRegion }
	for _, child in folder:GetChildren() do
		if child:IsA("TerrainRegion") then
			table.insert(if child.Name:match("-Priority$") then priorityTerrainRegions else normalTerrainRegions, child)
		end
	end

	local sortedTerrainRegions = priorityTerrainRegions
	for _, terrainRegion in normalTerrainRegions do
		table.insert(sortedTerrainRegions, terrainRegion)
	end

	workspace.Terrain:Clear()

	RunService.Heartbeat:Wait()

	for _, terrainRegion in sortedTerrainRegions do
		module.loadRegion(terrainRegion)

		RunService.Heartbeat:Wait()
	end
end

return module
