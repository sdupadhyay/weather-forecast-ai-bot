import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
	id: "weather-tool",
	description: "Get the current live weather for a specific city.",
	inputSchema: z.object({
		city: z
			.string()
			.describe(
				"The city name (ex. Mumbai, Ahmedabad, London) Note that the city can be small also like small village and town.",
			),
	}),
	outputSchema: z.object({
		location: z.string(),
		temperature: z.string(),
		condition: z.string(),
		humidity: z.string(),
		wind: z.string(),
		local_time: z.string(),
		error: z.string().optional(),
	}),
	execute: async (inputData) => {
		const { city } = inputData;
		const apiKey = process.env.WEATHER_API_KEY;
		if (!apiKey) {
			throw new Error("Missing WEATHER_API_KEY in .env file");
		}
		console.log(`🌍 Fetching real weather data for: ${city}...`);
		try {
			const response = await fetch(
				`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`,
			);

			if (!response.ok) {
				return { error: `Could not find weather for city: ${city}` };
			}

			const data = await response.json();

			// 3. Return ONLY what matters
			// (Don't return the whole huge JSON, save tokens!)
			return {
				location: `${data.location.name}, ${data.location.country}`,
				temperature: `${data.current.temp_c}°C`,
				condition: data.current.condition.text,
				humidity: `${data.current.humidity}%`,
				wind: `${data.current.wind_kph} kph`,
				local_time: data.location.localtime,
			};
		} catch (error) {
			console.error("❌ Weather API error:", error);
			return {
				error: "Failed to fetch weather data. Please try again.",
			};
		}
	},
});
