import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseName = process.env.POSTGRES_DB;
  const databaseConnectionsResult = await database.query({
    text: `select count(*)::int from pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        max_connections: parseInt(
          databaseMaxConnectionsResult.rows[0].max_connections,
        ),
        opened_connections: databaseConnectionsResult.rows[0].count,
        version: databaseVersionResult.rows[0].server_version,
      },
    },
  });
}

export default status;
