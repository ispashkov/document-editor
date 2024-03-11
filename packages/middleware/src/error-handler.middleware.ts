import { Context } from 'koa';

export const errorHandlerMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>
): Promise<void> => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      error: error.message || 'Internal Server Error',
    };
  }
};
