import type { Context } from 'koa';

import * as documentService from '../services/document.service';
import type { CreateDocumentDto } from '../dto/create-document.dto';
import type { UpdateDocumentDraftDto } from '../dto/update-document-draft.dto';
import type { CreateDocumentDraftDto } from '../dto/create-document-draft.dto';

export const createDocument = async (ctx: Context): Promise<void> => {
  const createDocumentDto: CreateDocumentDto = ctx.request
    .body as CreateDocumentDto;

  ctx.body = await documentService.createDocument(createDocumentDto);
};

export const getDocumentVersions = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params;

  ctx.body = await documentService.getDocumentVersions(id);
};

export const createDocumentDraft = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params;

  const createDocumentDraftDto: CreateDocumentDraftDto = ctx.request
    .body as CreateDocumentDraftDto;

  ctx.body = await documentService.createDocumentDraft(
    id,
    createDocumentDraftDto
  );
};

export const updateDocumentDraft = async (ctx: Context): Promise<void> => {
  const { id, version } = ctx.params;

  const updateDocumentDraftDto: UpdateDocumentDraftDto = ctx.request
    .body as UpdateDocumentDraftDto;

  ctx.body = await documentService.updateDocumentDraft(
    id,
    version,
    updateDocumentDraftDto
  );
};

export const publishDocumentDraft = async (ctx: Context): Promise<void> => {
  const { id, version } = ctx.params;

  ctx.body = await documentService.publishDocumentDraft(id, version);
};
