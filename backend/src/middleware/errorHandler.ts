import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: "Not Found", message: `Route ${req.method} ${req.path} does not exist.` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.name, message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "CastError", message: "Invalid identifier or value supplied." });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "ValidationError", message: err.message });
  }

  // eslint-disable-next-line no-console
  console.error("[error]", err);
  return res.status(500).json({ error: "InternalServerError", message: "An unexpected error occurred." });
}
