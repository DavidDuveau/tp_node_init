import dataImportES6 from '../import/ES6'
import mysql from 'mysql';
import Importer from 'mysql-import';

const host = 'localhost';
const user = 'root';
const password = '';
const databaseName = 'amiibo';

//Importer object to import .sql file
const importer = new Importer({
  host,
  user,
  password,
  databaseName
});

//connection to db
const connector = mysql.createConnection({
  host,
  user,
  password,
  multipleStatements: true
});

//data for linked tables (type, characters ...)
const populateMinorTable = (tableName, data) => {
  let tableMap = new Map();

  data.forEach((item, i) => {
    let sql = `INSERT INTO ${tableName} (id, name) VALUES (${i}+1,"${item.name}");`;

    tableMap.set(item.name, i + 1);

    connector.query(sql);
  });
  return tableMap;
};

//data for amiibo amiibo table
const populateAmiiboTable = (typeMap, charactersMap, amiiboSeriesMap, gameSeriesMap) => {
  dataImportES6.getDataAmiibo.amiibo.forEach((item, i) => {

    let sql = `INSERT INTO amiibo (id, name, image, type_id, amiiboseries_id, gameseries_id, characters_id)
    VALUES (NULL,"${item.name}", "${item.image}", '${typeMap.get(item.type)}',
      '${amiiboSeriesMap.get(item.amiiboSeries)}', '${gameSeriesMap.get(item.gameSeries)}',
      '${charactersMap.get(item.character)}');`;

    connector.query(sql)
  });
}

//import of data from API
const importES6Data = (successCallback, errorCallback) => {
  console.log('-----> READY TO IMPORT DATA <-----');
  dataImportES6.load(
    () => {
      console.log('-----> DATA ES6 IMPORTED <-----');
      const typeMap = populateMinorTable('type', dataImportES6.getTypes.amiibo);
      const amiiboSeriesMap = populateMinorTable('amiiboseries', dataImportES6.getAmiiboSeries.amiibo);
      const gameSeriesMap = populateMinorTable('gameseries', dataImportES6.getGameSeries.amiibo);
      const charactersMap = populateMinorTable('characters', dataImportES6.getCharacters.amiibo)
      populateAmiiboTable(typeMap, charactersMap, amiiboSeriesMap, gameSeriesMap)
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
      console.log(`-----> SQL SUCCESSFULLY IMPORTED <-----`);
      console.log(`-----> DB CREATED <-----`);
      connector.query(
        `USE ${databaseName}`, (err, result) => {
          if (err) {
            errorCallback(err);
            return;
          }
          console.log("-----> CONNECTED ! <-----");
          importES6Data(successCallback, errorCallback);
        });
    })
    .catch(
      err => {
        errorCallback(err);
      });
}

//construction of json for type characters etc
export const createJSONData = (tableName) => {
  return new Promise(
    (resolve, reject) => {
      let jsonData = {
        amiibo: []
      };
      connector.query(
        `SELECT * FROM ${tableName};`, (err, result) => {
          if (err) {
            console.log("-----> ERROR MAKING JSON <-----");
            reject(err);
          }
          result.forEach(item => {
            jsonData.amiibo.push({
              name: item.name
            });
          });
          console.log("A1");
          resolve(jsonData);
        });
    })
}

//create json from db for amiibo
export const createJSONAmiibo = () => {
  return new Promise(
    (resolve, reject) => {
      connector.query(
        `SELECT
            amiibo.name,
            amiibo.image,
            type.name AS type,
            characters.name AS "character",
            amiiboseries.name AS amiiboSeries,
            gameseries.name AS gameSeries
        FROM amiibo
            INNER JOIN type
            INNER JOIN characters
            INNER JOIN amiiboseries
            INNER JOIN gameseries
        WHERE
            amiibo.type_id = type.id
            AND amiibo.characters_id = characters.id
            AND amiibo.amiiboseries_id = amiiboseries.id
            AND amiibo.gameseries_id = gameseries.id;`,
        (err, result) => {
          if (err) {
            console.log("-----> ERROR MAKING JSON AMIIBO <-----");
            reject(err);
          }
          console.log("B1");
          resolve({ amiibo: result});
        });
    })
}

//add type to db
export const addTypeDatabase = (type) => {
  console.log("dans addTypeDatabase");
  return new Promise((resolve, reject) => {
    connector.query(
      `INSERT INTO type (id, name) VALUES (NULL, "${type}");`,
      (err,result) => {
        if(err){
          console.log("-----> ERROR ADDING TYPE <-----");
          reject(err);
        }
        console.log(result);
        resolve();
      });
  })
}

//check if db exist, yes -> drop it and make it again, no -> make it
//function called in index.js
const loadDatabase = (successCallback, errorCallback) => {
  connector.connect(
    err => {
      if (err) {
        errorCallback(err);
        return;
      }
      connector.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}';`,
        (err, result) => {
          if (err) {
            errorCallback;
            return;
          }
          if (result.length) {
            console.log(`-----> DATABASE : ${databaseName} ALREADY CREATED <-----`);
            connector.query(
              `USE ${databaseName};`, (err, result) => {
                if (err) {
                  errorCallback(err);
                  return;
                }
                successCallback();
                console.log("-----> CONNECTED ! <-----")
              });
          } else {
            createDatabase(successCallback, errorCallback);
          }
        });
    });
}
export default loadDatabase;
