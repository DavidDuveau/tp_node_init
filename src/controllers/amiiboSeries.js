import dataImportES6 from "../import/ES6";
import {createJSONData} from "../db/connector.js";

const amiiboSeriesController = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  createJSONData('amiiboseries').then(result => {
    res.status(200).json(result)
  })
};

export default amiiboSeriesController;
