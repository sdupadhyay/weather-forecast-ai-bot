import { weatherAgent } from "./mastra/agents";
import * as readline from "readline";
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
console.log("---------------------------------------------------------");
console.log("🌤️  WEATHER AGENT CLI");
console.log("   Type a city name to get the weather.");
console.log("   Type 'exit' to quit.");
console.log("---------------------------------------------------------");
// 2. Define the recursive chat loop
const chatLoop = () => {
	rl.question("\n👤 You: ", async (userInput) => {
		// Exit condition
		if (userInput.toLowerCase() === "exit") {
			console.log("👋 Goodbye!");
			rl.close();
			return;
		}

		try {
			console.log("🤖 Agent is thinking...");

			// 3. Call the Agent
			const response = await weatherAgent.generate(userInput);

			// 4. Print the result
			console.log(`\n🤖 Agent: ${response.text}`);
		} catch (error) {
			console.error("❌ Error:", error);
		}

		// 5. Restart the loop to ask another question
		chatLoop();
	});
};

// Start the loop
chatLoop();
