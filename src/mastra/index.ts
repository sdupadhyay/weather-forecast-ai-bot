import { Mastra } from "@mastra/core";
import { weatherAgent } from "./agents";

export const mastra = new Mastra({
	agents: { weatherAgent },
});
