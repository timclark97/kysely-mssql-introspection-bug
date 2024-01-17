import * as tedious from "tedious";
import * as tarn from "tarn";
import { Kysely, MssqlDialect } from "kysely";

const dialect = new MssqlDialect({
  tarn: {
    ...tarn,
    options: {
      min: 0,
      max: 10,
    },
  },
  tedious: {
    ...tedious,
    connectionFactory: () =>
      new tedious.Connection({
        authentication: {
          options: {
            password: "password_01",
            userName: "sa",
          },
          type: "default",
        },
        options: {
          database: "test",
          port: 1433,
          trustServerCertificate: true,
        },
        server: "127.0.0.1",
      }),
  },
});

export const db = new Kysely<any>({
  dialect,
});

db.introspection
  .getTables()
  .then((tables) =>
    console.log(tables.find((t) => t.name === "test_table")?.columns)
  );
