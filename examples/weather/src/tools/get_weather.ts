import { z } from "zod";
import { PaidMcpServer } from "@getalby/paidmcp";

export function registerGetWeatherTool(server: PaidMcpServer) {
  server.registerPaidTool(
    "get_weather",
    {
      title: "Get Weather",
      description: "Get the weather in a given city",
      inputSchema: {
        city: z.string().describe("the city to get the weather for"),
      },
      outputSchema: {
        temperature_celcius: z
          .number()
          .describe("The temperature in degrees celcius"),
      },
    },
    async (params) => ({
      description: "Weather payment for " + params.city,
      satoshi: 21,
    }),
    async (params) => {
      const locationResponse = (await fetch(
        `https://nominatim.openstreetmap.org/search?city=${params.city}&format=json&limit=1`
      ).then((response) => response.json())) as { lat: number; lon: number }[];
      const weatherResponse = (await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${locationResponse[0].lat}&longitude=${locationResponse[0].lon}&current_weather=true`
      ).then((response) => response.json())) as {
        current_weather: {
          time: string;
          interval: number;
          temperature: number;
          windspeed: number;
          winddirection: number;
          is_day: boolean;
        };
      };

      const result = {
        temperature_celcius: weatherResponse.current_weather.temperature,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
    }
  );
}
