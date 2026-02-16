import express from "express";
import { agentMemory } from "./mastra/memory/index.ts";
import { weatherAgent } from "./mastra/agents/index.ts";
import crypto from "crypto";
import { sendSSE } from "./utils.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
	console.log("Incoming:", req.method, req.url);
	next();
});
app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.post("/api/chat/stream", async (req, res) => {
	try {
		let { message, threadId, userId } = req.body;
		// input validation
		if (!message || !userId) {
			return res
				.status(400)
				.json({ error: "Missing required fields: message, userId" });
		}

		if (!threadId) {
			threadId = crypto.randomUUID();
		}

		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.setHeader("X-Accel-Buffering", "no");

		sendSSE(res, { type: "session", data: threadId });
		sendSSE(res, { type: "thinking", data: "Thinking..." });

		const response = await weatherAgent.stream(message, {
			memory: {
				thread: {
					id: threadId,
				},
				resource: userId,
			},
		});
		const reader = response.textStream.getReader();
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			sendSSE(res, { type: "token", data: value });
		}
		res.end();
	} catch (error) {
		console.log("Error", error);
		res.status(500).json({ error: "Failed to generate response" });
	}
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
