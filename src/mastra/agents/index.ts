import "dotenv/config";

import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools/weather-tool";
import { google } from "@ai-sdk/google";
import { forecastTool } from "../tools/forecast-tool";
import { agentMemory } from "../memory";
import { weatherForcastPrompt } from "../../constants";

export const weatherAgent = new Agent({
	id: "weather-agent",
	name: "Weather Agent",
	instructions: weatherForcastPrompt,
	model: google("gemini-2.5-flash"),
	tools: { weatherTool, forecastTool },
	memory: agentMemory,
});
