import type { Document } from '@document-editor/models';

import * as documentRepository from '../repositories/document.repository';

export const getAllPublishedDocuments = async (): Promise<Document[]> => {
  return await documentRepository.getAllPublishedDocuments();
};

export const getAllPublishedVersionsOfDocument = async (
  documentId: string
): Promise<Document[]> => {
  return await documentRepository.getAllPublishedVersionsOfDocument(documentId);
};

export const getLatestPublishedVersionOfDocument = async (
  documentId: string
): Promise<Document> => {
  return await documentRepository.getLatestPublishedVersionOfDocument(
    documentId
  );
};
