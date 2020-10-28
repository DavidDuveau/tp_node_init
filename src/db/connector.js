import dataImportES from '../import/ES6'
import mysql from 'mysql';
import Importer from 'mysql-import';

const host = 'localhost';
const user = 'root';
const password = '';
const databaseName = 'amiibo';

const importer = new Importer({ host, user, password, databaseName });

const connector = mysql.createConnection({ host, user, password });

const createDatabase = (err) => {
  importer.import('./src/db/test.sql')
    .then(() => {
      const files_imported = importer.getImported();
      console.log(`${files_imported.length} SQL file(s) imported.`);
    })
    .catch(
      err => {
        console.error(err);
    });
}

const loadDatabase = (successCallback, errorCallback) => {
  connector.connect(
    err => {
      if(err) errorCallback(err);
      connector.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}'`,
        (err, result, field) => {
          if(err) errorCallback(err);
          if (result.length) {
            console.log(`Database : ${databaseName} already created`);
            connector.query(
              `DROP DATABASE IF EXISTS ${databaseName}`, createDatabase(err)
            )
            console.log("Connected!");
            successCallback();
        } else {
          createDatabase(err);
          console.log("Connected!");
          successCallback();
        }
      });
  });
}
export default loadDatabase;
