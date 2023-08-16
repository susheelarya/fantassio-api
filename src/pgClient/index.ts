import pg, { Pool, PoolConfig } from 'pg';

class PgClient {
  _pool: null | Pool = null;

  connect(options: PoolConfig) {
    this._pool = new pg.Pool(options);

    return this._pool.query('SELECT 1 + 1;');
  }

  close() {
    return this._pool?.end();
  }

  query(sql: string, params?: string[]) {
    return this._pool?.query(sql, params);
  }
}

const pgClient = new PgClient();

export { pgClient };
