import { QueryConfig, QueryResult, QueryResultRow } from 'pg';

export interface Database {
  connect(): Promise<void>;
  query<R extends QueryResultRow, I extends unknown[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: I
  ): Promise<QueryResult<R>>;
  release(): void;
}

export interface DatabaseConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}
