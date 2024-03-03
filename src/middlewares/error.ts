import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utils-class.js";
import { ControllerType } from "../types/types.js";
export const errorMiddleware = (
// err: Error, changed to   err: ErrorHandler, uitlclass custom error handler
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // err.message = err.message || ""
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

if(err.name === "CastError") err.message = "invalid Id"

  return res.status(err.statusCode).json({
    success: true,
    message: err.message,
  });
};
export const TryCatch =
  (func: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };



  