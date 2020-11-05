import dataImportES6 from "../import/ES6";
import { db } from '../import/connector';

const typeController = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    db.query('USE amiibos; SELECT * FROM types', (err, results) => {
        if (err) throw err;

        let typesArray = [];

        results[1].forEach(type => {
            typesArray.push({ name: type.name });
        });

        res.status(200).json({ amiibo: typesArray });
    });
};

export const addTypeController = (req, res) => {
    db.query('USE amiibos; INSERT INTO types VALUES(' + db.escape(req.body.value) + ');', (err) => {
        if (err) throw err;
        res.status(200).json({ result: true });
    });
}

export default typeController;