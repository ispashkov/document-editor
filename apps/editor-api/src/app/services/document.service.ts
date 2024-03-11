import type { Document } from '@document-editor/models';

import * as documentRepository from '../repositories/document.repository';
import type { CreateDocumentDto } from '../dto/create-document.dto';
import type { UpdateDocumentDraftDto } from '../dto/update-document-draft.dto';

export const createDocument = async (
  createDocumentDto: CreateDocumentDto
): Promise<Document | null> => {
  return await documentRepository.createDocument(createDocumentDto);
};

export const getDocumentVersions = async (
  documentId: string
): Promise<Document[]> => {
  return await documentRepository.getDocumentVersions(documentId);
};

export const createDocumentDraft = async (
  id: string,
  updateDocumentDto: UpdateDocumentDraftDto
): Promise<Document> => {
  return await documentRepository.createDocumentDraft(id, updateDocumentDto);
};

export const updateDocumentDraft = async (
  id: string,
  version: number,
  updateDocumentDto: UpdateDocumentDraftDto
): Promise<Document> => {
  return await documentRepository.updateDocumentDraft(
    id,
    version,
    updateDocumentDto
  );
};

export const publishDocumentDraft = async (
  documentId: string,
  version: number
): Promise<Document> => {
  return await documentRepository.publishDocumentDraft(documentId, version);
};
