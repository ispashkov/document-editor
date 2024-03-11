import type { QueryResult } from 'pg';
import type { Document } from '@document-editor/models';

import { database } from '../../infrastructure/database.infrastructure';

export const getAllPublishedDocuments = async (): Promise<Document[]> => {
  try {
    await database.connect();

    const query = `
        WITH latest_versions AS (
            SELECT doc_id, MAX(version) AS max_version
            FROM document_versions
            GROUP BY doc_id
        )
        SELECT d.id, d.title, d.content, d.created_at, d.created_by, d.updated_at, d.updated_by, d.version
        FROM documents d
        JOIN latest_versions lv ON d.id = lv.doc_id AND d.version = lv.max_version;
    `;

    const result: QueryResult = await database.query(query);
    return result.rows;
  } finally {
    database.release();
  }
};

export const getAllPublishedVersionsOfDocument = async (
  documentId: string
): Promise<Document[]> => {
  try {
    await database.connect();

    const query = `
        WITH published_documents AS (
            SELECT doc_id, version
            FROM document_versions
            WHERE doc_id = $1
        )
        SELECT d.id, d.title, d.content, d.created_at, d.created_by, d.updated_at, d.updated_by, d.version
        FROM documents d
        JOIN published_documents pd ON d.id = pd.doc_id AND d.version = pd.version;
    `;

    const values = [documentId];

    const result: QueryResult = await database.query(query, values);

    return result.rows;
  } finally {
    database.release();
  }
};

export const getLatestPublishedVersionOfDocument = async (
  documentId: string
): Promise<Document | null> => {
  try {
    await database.connect();

    const query = `
        WITH latest_versions AS (
            SELECT doc_id, MAX(version) AS max_version
            FROM document_versions
            WHERE doc_id = $1
            GROUP BY doc_id
        )
        SELECT d.id, d.title, d.content, d.created_at, d.created_by, d.updated_at, d.updated_by, d.version
        FROM documents d
        JOIN latest_versions lv ON d.id = lv.doc_id AND d.version = lv.max_version;
    `;
    const values = [documentId];

    const result: QueryResult = await database.query(query, values);

    return result.rows.length > 0 ? result.rows.at(0) : null;
  } finally {
    database.release();
  }
};
