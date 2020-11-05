import dataImportES6 from "../import/ES6";
import { db } from '../import/connector';
import fs from 'fs';
import path from 'path';

const amiiboController = (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");

    db.query('USE amiibos; SELECT * FROM amiibos', (err, results) => {
        if (err) throw err;

        let amiiboFilteredArray = { amiibo: [] };

        results[1].forEach(amiibo => {
            amiiboFilteredArray.amiibo.push({
                name: amiibo.name,
                image: amiibo.image,
                amiiboSeries: amiibo.fk_amiiboseries,
                character: amiibo.fk_characters,
                gameSeries: amiibo.fk_gameseries,
                type: amiibo.fk_types,
            });
        });

        for (const property in req.query) {
            amiiboFilteredArray = dataImportES6.getAmiiboByFilter(amiiboFilteredArray, property, req.query[property]);
        }
    
        res.status(200).json(amiiboFilteredArray);
    });
};

export const addAmiiboController = (req, res) => {
    // TODO : Prendre en compte tous les types d'images
    // TODO : URLizer les noms de fichiers
    const imgName = `${req.body.name}_${req.body.amiiboSeries}_${req.body.character}_${req.body.type}.png`
    const imgData = req.body.image.replace(/^data:image\/\w+;base64,/, '');

    fs.writeFile('src/img/' + imgName, imgData, 'base64', (err) => {
        if (err) throw err;
        console.log('File created!');
        db.query(
            'USE amiibos;' +
            'INSERT INTO amiibos(name, image, fk_amiiboseries, fk_characters, fk_gameseries, fk_types) ' +
            'VALUES(' +
                db.escape(req.body.name) + ',' +
                db.escape('img/' + imgName) + ',' +
                db.escape(req.body.amiiboSeries) + ',' +
                db.escape(req.body.character) + ',' +
                db.escape(req.body.gameSeries) + ',' +
                db.escape(req.body.type) +
            ');'
            , (err) => {
                console.log('test');
                if (err) throw err;
                res.status(200).json({ result: true });
            }
        );
    });
};

export default amiiboController;