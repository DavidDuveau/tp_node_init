import mysql from "mysql";

const databaseName = "AmiiboDB";

const connector = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

connector.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
  connector.query(
    `SELECT SCHEMA_NAME
      FROM INFORMATION_SCHEMA.SCHEMATA
     WHERE SCHEMA_NAME = ${databaseName}
    `,
    (err, result, field) => {
      if (err) throw err;
      if (result.length) {
        console.log(`Database : ${databaseName} already created`);
        loadES6Data();
      } else {
        connector.query(`CREATE DATABASE ${databaseName}`, (err, result) => {
          if (err) throw err;
          console.log(`Database created`);
          loadES6Data();
        });
      }
    }
  );
});

export default connector;
