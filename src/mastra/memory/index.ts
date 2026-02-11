import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

// 1. Create a Postgres storage adapter
export const storage = new PostgresStore({
	connectionString: process.env.DATABASE_URL,
	id: "pg-storage",
});

// 2. Export the Memory instance
export const agentMemory = new Memory({ storage });
