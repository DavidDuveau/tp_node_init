import dataImportES6 from '../import/ES6'
import mysql from 'mysql';
import Importer from 'mysql-import';

const host = 'localhost';
const user = 'root';
const password = '';
const databaseName = 'amiibo';

//Importer object to import .sql file
const importer = new Importer({ host, user, password, databaseName });

//connection to db
const connector = mysql.createConnection({ host, user, password });

//data for linked tables (type, characters ...)
const populateMinorTable = (tableName, data) => {
  let tableMap = new Map();

  data.forEach((item, i) => {
    let sql = `INSERT INTO ${tableName} (id, name) VALUES (${i}+1,"${item.name}");`;

    tableMap.set(item.name, i + 1);

    console.log(sql);
    connector.query(sql);
  });
  console.table(tableMap);
  return tableMap;
};

const populateAmiiboTable = (typeMap, charactersMap, amiiboSeriesMap, gameSeriesMap) => {
  dataImportES6.getDataAmiibo.amiibo.forEach((item, i) => {
    let sql = `INSERT INTO amiibo (id, name, image, type_id, amiiboseries_id, gameseries_id, characters_id) VALUES (NULL,"${item.name}", "${item.image}", '${typeMap.get(item.type)}', '${amiiboSeriesMap.get(item.amiiboSeries)}', '${gameSeriesMap.get(item.gameSeries)}', '${charactersMap.get(item.character)}');`;
    console.log(sql);
    connector.query(sql)
  });

}

//import of data from API
const importES6Data = (successCallback, errorCallback) => {
  console.log('ready to import data');
  dataImportES6.load(
    () => {
      console.log('data ES6 imported');
      const typeMap = populateMinorTable('type', dataImportES6.getTypes.amiibo);
      const charactersMap = populateMinorTable('characters', dataImportES6.getCharacters.amiibo);
      const amiiboSeriesMap = populateMinorTable('amiiboseries', dataImportES6.getAmiiboSeries.amiibo);
      const gameSeriesMap = populateMinorTable('gameseries', dataImportES6.getGameSeries.amiibo);
      populateAmiiboTable(typeMap, charactersMap, amiiboSeriesMap, gameSeriesMap);
      successCallback();
    },
    errorCallback
  )
}
//db creation with .sql import
const createDatabase = (successCallback, errorCallback) => {
  importer.import('./src/db/test.sql')
    .then(() => {
      const files_imported = importer.getImported();
      console.log(`${files_imported.length} SQL file(s) imported.`);
      console.log(`DB created`);
      connector.query(
        `USE ${databaseName}`, (err, result) => {
          if(err) {
            errorCallback();
            return;
          }
          console.log("Connected!");
          importES6Data(successCallback, errorCallback);
        });
    })
    .catch(
      err => {
        errorCallback(err);
    });
}

//check if db exist, yes -> drop it and make it again, no -> make it
//function called in index.js
const loadDatabase = (successCallback, errorCallback) => {
  connector.connect(
    err => {
      if(err) {
        errorCallback();
        return;
      }
      connector.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}';`,
        (err, result) => {
          if(err){
            errorCallback();
            return;
          }
          if (result.length) {
            console.log(`Database : ${databaseName} already created`);
            connector.query(
              `DROP DATABASE IF EXISTS ${databaseName};`, (err, result) => {
                if (err) {
                  errorCallback();
                  return;
                }
                createDatabase(successCallback, errorCallback);
              });
        } else {
          createDatabase(successCallback, errorCallback);
        }
      });
  });
}
export default loadDatabase;
