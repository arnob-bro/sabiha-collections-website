class DatabaseInspectorService {
  constructor(db) {
    this.db = db;
  }

  async getTablesSnapshot() {
    const tablesResult = await this.db.query(
      `
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name
      `
    );

    const snapshot = [];

    for (const { table_schema: schema, table_name: table } of tablesResult.rows) {
      const columnsResult = await this.db.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position
        `,
        [schema, table]
      );

      const rowsResult = await this.db.query(
        `SELECT * FROM ${this.escapeIdentifier(schema)}.${this.escapeIdentifier(table)}`
      );

      snapshot.push({
        schema,
        table,
        columns: columnsResult.rows,
        rows: rowsResult.rows,
      });
    }

    return snapshot;
  }

  escapeIdentifier(identifier) {
    if (!/^[A-Za-z0-9_]+$/.test(identifier)) {
      throw new Error(`Invalid identifier: ${identifier}`);
    }
    return `"${identifier}"`;
  }
}

module.exports = DatabaseInspectorService;

