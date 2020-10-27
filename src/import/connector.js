import mysql from "mysql";
import dataImportES6 from "./ES6";

const databaseName = "amiibos";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  multipleStatements: true
});

const loadDatabase = () => {
    return new Promise((resolve, reject) => {
        db.connect(err => {
            if (err) reject(err);
            console.log(`Connected to ${databaseName} database.`);

            db.query(`SHOW DATABASES LIKE "${databaseName}"`,
                (err, result) => {
                    if (result.length) {
                        if (err) reject(err);
                        resolve();
                    } else {
                        db.query(
                            'CREATE DATABASE ' + databaseName + ' CHARACTER SET "utf8";' +
                            'USE ' + databaseName + ';' +
                            'CREATE TABLE characters (name VARCHAR(255) PRIMARY KEY) ENGINE = InnoDB;' +
                            'CREATE TABLE amiiboseries (name VARCHAR(255) PRIMARY KEY) ENGINE = InnoDB;' +
                            'CREATE TABLE gameseries (name VARCHAR(255) PRIMARY KEY) ENGINE = InnoDB;' +
                            'CREATE TABLE types (name VARCHAR(255) PRIMARY KEY) ENGINE = InnoDB;' +
                            'CREATE TABLE amiibos (' +
                                'id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,' +
                                'name VARCHAR(255),' +
                                'image VARCHAR(255),' +
                                'fk_amiiboseries VARCHAR(255),' +
                                'fk_characters VARCHAR(255),' +
                                'fk_gameseries VARCHAR(255),' +
                                'fk_types VARCHAR(255),' +
                                'FOREIGN KEY (fk_amiiboseries) REFERENCES amiiboseries(name),' +
                                'FOREIGN KEY (fk_characters) REFERENCES characters(name),' +
                                'FOREIGN KEY (fk_gameseries) REFERENCES gameseries(name),' +
                                'FOREIGN KEY (fk_types) REFERENCES types(name)' +
                            ') ENGINE = InnoDB;'
                            , async (err) => {
                                if (err) reject(err);
                                console.log('Database and tables created.');

                                dataImportES6.load(async () => {
                                    await populateDatabase('amiiboseries', dataImportES6.getAmiiboSeries);
                                    await populateDatabase('characters', dataImportES6.getCharacters);
                                    await populateDatabase('gameseries', dataImportES6.getGameSeries);
                                    await populateDatabase('types', dataImportES6.getTypes);

                                    console.log(`Populating ${databaseName} table...`);

                                    let sql = `USE ${databaseName}; `;

                                    dataImportES6.getDataAmiibo.amiibo.forEach(element => {
                                        sql += `INSERT INTO ${databaseName}(name, image, fk_amiiboSeries, fk_characters, fk_gameSeries, fk_types) VALUES("${element.name}", "${element.image}", "${element.amiiboSeries}", "${element.character}", "${element.gameSeries}", "${element.type}"); `;
                                    });

                                    db.query(sql, (err) => {
                                        if (err) reject(err);
                                        console.log(`Table ${databaseName} populated with ${dataImportES6.getDataAmiibo.amiibo.length} elements.`);
                                        setTimeout(() => {
                                            console.log('All done !');
                                            resolve();
                                        }, 500);
                                    });
                                }, () => {
                                    console.error('An error occured while loading datas from API');
                                });
                            }
                        );
                    }
                }
            );
        });
    });
}

const populateDatabase = (tableName, amiiboSet) => {
    return new Promise((resolve) => {
        db.query(`USE ${databaseName}; SELECT COUNT(*) FROM ${tableName}`, (err, result) => {
            if (err) throw err;

            let sql = '';

            if (!result[0]['COUNT(*)']) {
                console.log(`Populating ${tableName} table...`);

                amiiboSet.amiibo.forEach(element => {
                    sql += `INSERT INTO ${tableName} VALUES("${element.name}"); `;
                });

                db.query(sql);
            } else {
                console.log('Table already populated.');
            }

            console.log(`Table ${tableName} populated with ${amiiboSet.amiibo.length} elements.`);
            resolve();
        });
    });
}

export default loadDatabase;
