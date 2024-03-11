import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import { errorHandlerMiddleware } from '@document-editor/middleware';
import { createTables } from '@document-editor/database';

import { database } from './infrastructure/database.infrastructure';
import documentRouter from './app/routes/document.router';

const HOST = process.env.HOST ?? 'localhost';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = new Koa();

app.use(bodyParser());
app.use(logger());
app.use(errorHandlerMiddleware);

app.use(documentRouter.routes());

async function start(): Promise<void> {
  await createTables(database);

  app.listen(PORT, () => {
    console.log(`[ ready ] http://${HOST}:${PORT}`);
  });
}

start();
