import express from "express";
import { agentMemory } from "./mastra/memory/index.ts";
const app = express();
app.use(express.json());
app.use((req, res, next) => {
	console.log("Incoming:", req.method, req.url);
	next();
});
app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.get("/api/history/:threadId", async (req, res) => {
	console.log("History requested");
	try {
		const { threadId } = req.params;
		console.log("Thread ID", threadId);
		const history = await agentMemory.recall({
			threadId,
		});
		console.log("History", history);
		res.json(history);
	} catch (error) {
		console.log("Error", error);
		res.status(500).json({ error: "Failed to fetch history" });
	}
});

app.listen(8000, () => {
	console.log("Server is running on http://localhost:8000");
});
