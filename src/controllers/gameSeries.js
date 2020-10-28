import dataImportES6 from "../import/ES6";
import { db } from '../import/connector';

const gameSeriesController = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    db.query('USE amiibos; SELECT * FROM gameseries', (err, results) => {
        if (err) throw err;

        let gameSeriesArray = [];

        results[1].forEach(type => {
            gameSeriesArray.push({
                name: type.name
            });
        });

        res.status(200).json({ amiibo: gameSeriesArray });
    });
};

export default gameSeriesController;