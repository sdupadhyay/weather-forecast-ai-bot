import { Response } from "express";

export const sendSSE = (
	res: Response,
	data: { type: string; data: string | object },
) => {
	res.write(`data: ${JSON.stringify(data)}\n\n`);
};
