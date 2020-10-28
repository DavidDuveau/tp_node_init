import dataImportES6 from "../import/ES6";
import {
    db
} from '../import/connector';

const amiiboSeriesController = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    db.query('USE amiibos; SELECT * FROM amiiboseries', (err, results) => {
        if (err) throw err;

        let amiiboSeriesArray = [];

        results[1].forEach(type => {
            amiiboSeriesArray.push({
                name: type.name
            });
        });

        res.status(200).json({ amiibo: amiiboSeriesArray });
    });
};

export default amiiboSeriesController;