import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const forecastTool = createTool({
	id: "forecast-tool",
	description: "Get the weather forecast for future days (max 3 days).",
	inputSchema: z.object({
		city: z.string().describe("The city name (ex. Mumbai, Ahmedabad, London)"),
		days: z
			.number()
			.min(1)
			.max(3)
			.describe("How many days to forecast (1 to 3)"),
	}),
	outputSchema: z.object({
		location: z.string(),
		forecast: z.array(
			z.object({
				date: z.string(),
				condition: z.string(),
				max_temp: z.string(),
				min_temp: z.string(),
				rain_chance: z.string(),
			}),
		),
	}),
	async execute(input) {
		const { city, days } = input;
		const apiKey = process.env.WEATHER_API_KEY;

		console.log(`🔮 Fetching ${days}-day forecast for: ${city}...`);
		try {
			const response = await fetch(
				`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=no&alerts=no`,
			);

			const data = await response.json();

			if (data.error) {
				return { error: data.error.message };
			}

			// We map over the array to return a clean summary for each day
			return {
				location: data.location.name,
				forecast: data.forecast.forecastday.map((day: any) => ({
					date: day.date,
					condition: day.day.condition.text,
					max_temp: `${day.day.maxtemp_c}°C`,
					min_temp: `${day.day.mintemp_c}°C`,
					rain_chance: `${day.day.daily_chance_of_rain}%`,
				})),
			};
		} catch (error) {
			return { error: "Failed to fetch forecast." };
		}
	},
});
