import type { QueryResult } from 'pg';
import * as uuid from 'uuid';
import type { Document } from '@document-editor/models';

import { database } from '../../infrastructure/database.infrastructure';
import type { CreateDocumentDto } from '../dto/create-document.dto';
import type { UpdateDocumentDraftDto } from '../dto/update-document-draft.dto';
import { CreateDocumentDraftDto } from '../dto/create-document-draft.dto';

const createdByUUID = uuid.v4();
const updatedByUUID = uuid.v4();

export const createDocument = async (
  createDocumentDto: CreateDocumentDto
): Promise<Document | null> => {
  try {
    await database.connect();

    const query = `
        INSERT INTO documents (title, content, created_by)
            VALUES ($1, $2, $3)
            RETURNING *
    `;

    const values = [
      createDocumentDto.title,
      createDocumentDto.content,
      createdByUUID,
    ];

    const result = await database.query(query, values);

    return result.rows[0];
  } finally {
    database.release();
  }
};

export const getDocumentVersions = async (
  documentId: string
): Promise<Document[]> => {
  try {
    await database.connect();

    const query = `
        SELECT * FROM documents
        WHERE id = $1
        ORDER BY updated_at DESC
    `;
    const values = [documentId];

    const result: QueryResult<Document> = await database.query(query, values);

    return result.rows;
  } finally {
    database.release();
  }
};

export const createDocumentDraft = async (
  documentId: string,
  createDocumentDraftDto: CreateDocumentDraftDto
): Promise<Document | null> => {
  try {
    await database.connect();

    await database.query('BEGIN');

    const query = `
        INSERT INTO documents (id, version, title, content, created_by)
            VALUES ($1, (SELECT COALESCE(MAX(version), 0) + 1 FROM documents WHERE id = $1), $2, $3, $4)
            RETURNING *
    `;

    const values = [
      documentId,
      createDocumentDraftDto.title,
      createDocumentDraftDto.content,
      createdByUUID,
    ];

    const result = await database.query(query, values);

    await database.query('COMMIT');

    return result.rows[0];
  } catch (error) {
    await database.query('ROLLBACK');
    throw error;
  } finally {
    database.release();
  }
};

export const updateDocumentDraft = async (
  documentId: string,
  version: number,
  updateDocumentDraftDto: UpdateDocumentDraftDto
): Promise<Document> => {
  try {
    await database.connect();

    const query = `
        UPDATE documents
            SET title = $3, content = $4, updated_at = now(), updated_by = $5
            WHERE id = $1 AND version = $2
            RETURNING *;
    `;

    const values = [
      documentId,
      version,
      updateDocumentDraftDto.title,
      updateDocumentDraftDto.content,
      updatedByUUID,
    ];

    const result = await database.query(query, values);

    return result.rows[0];
  } finally {
    database.release();
  }
};

export const publishDocumentDraft = async (
  documentId: string,
  version: number
): Promise<Document> => {
  try {
    await database.connect();

    await database.query('BEGIN');

    const query = `
        WITH latest_versions AS (
            INSERT into document_versions (doc_id, version)
            VALUES ($1, $2)
            ON CONFLICT(doc_id, version)
            DO UPDATE SET version = EXCLUDED.version
            RETURNING *
        )
        SELECT d.id, d.title, d.content, d.created_at, d.created_by, d.updated_at, d.updated_by, d.version
        FROM documents d
        JOIN latest_versions lv ON d.id = lv.doc_id AND d.version = lv.version
    `;

    const values = [documentId, version];

    const result = await database.query(query, values);

    await database.query('COMMIT');

    return result.rows[0];
  } catch (error) {
    await database.query('ROLLBACK');
    throw error;
  } finally {
    database.release();
  }
};
