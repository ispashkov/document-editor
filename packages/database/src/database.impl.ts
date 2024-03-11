import type { Database, DatabaseConfig } from './database.interface';
import { Pool, PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg';

export class DatabaseImpl implements Database {
  private client: PoolClient;
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool(config);
  }

  public async connect(): Promise<void> {
    this.client = await this.pool.connect();
  }

  public query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: I
  ): Promise<QueryResult<R>> {
    return this.client.query(queryTextOrConfig, values);
  }

  public release(): void {
    this.client?.release();
  }
}
