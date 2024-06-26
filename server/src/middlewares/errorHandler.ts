import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import HttpException from './httpException'; // Ajuste conforme o caminho da importação

const errorHandler = (
  error: HttpException | ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status = 500;
  let message = 'Algo deu errado.';
  let errors: string[] = [];

  if (error instanceof ZodError) {
    status = 400;
    message = 'Erro de validação.';
    errors = error.errors.map(e => e.message);
  } else if (error instanceof HttpException) {
    status = error.status;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.error(`Status: ${status}, Message: ${message}, Stack: ${error.stack}`);

  res.status(status).json({ message, errors });
};

export default errorHandler;
