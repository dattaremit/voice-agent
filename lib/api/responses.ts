export const errorResponse = (status: number, error: string) => Response.json({ error }, { status });
