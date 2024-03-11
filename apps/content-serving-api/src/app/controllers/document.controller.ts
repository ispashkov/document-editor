import type { Context } from 'koa';

import * as documentService from '../services/document.service';

export const getAllPublishedVersions = async (ctx: Context): Promise<void> => {
  ctx.body = await documentService.getAllPublishedDocuments();
};

export const getAllPublishedVersionsOfDocument = async (
  ctx: Context
): Promise<void> => {
  const { id } = ctx.params;

  ctx.body = await documentService.getAllPublishedVersionsOfDocument(id);
};

export const getLatestPublishedVersionOfDocument = async (
  ctx: Context
): Promise<void> => {
  const { id } = ctx.params;

  ctx.body = await documentService.getLatestPublishedVersionOfDocument(id);
};
