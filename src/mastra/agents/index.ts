import "dotenv/config";

import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools/weather-tool";
import { google } from "@ai-sdk/google";
import { forecastTool } from "../tools/forecast-tool";
import { agentMemory } from "../memory";

export const weatherAgent = new Agent({
	id: "weather-agent",
	name: "Weather Agent",
	instructions: `
      You are a helpful weather assistant.
      Use the weatherTool to fetch current weather data.`,
	model: google("gemini-2.5-flash"),
	tools: { weatherTool, forecastTool },
	memory: agentMemory,
});
