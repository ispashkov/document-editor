import { Database } from './database.interface';

export const createTables = async (database: Database): Promise<void> => {
  try {
    await database.connect();

    await database.query('BEGIN')

    await database.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    // region ---- documents table
    await database.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by UUID NOT NULL,
        updated_at TIMESTAMP,
        updated_by UUID,
        version INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY (id, version)
      )
    `);

    await database.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS documents_id_index ON documents(id);'
    );
    // endregion

    // region ---- document_versions table
    await database.query(`
      CREATE TABLE IF NOT EXISTS document_versions (
        doc_id UUID NOT NULL,
        version INTEGER NOT NULL,
        PRIMARY KEY (doc_id, version)
      )
    `);

    await database.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS document_versions_doc_id_version_index ON document_versions(doc_id, version);'
    );
    // endregion

    await database.query('COMMIT')
  } catch (error) {
    await database.query('ROLLBACK')
    throw error
  } finally {
    database.release();
  }
};
