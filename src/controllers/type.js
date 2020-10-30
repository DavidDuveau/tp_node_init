import dataImportES6 from "../import/ES6";
import {createJSONData} from "../db/connector.js"

const typeController = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

  createJSONData('type').then(result => {
    res.status(200).json(result)
  })
};

export const addTypeController = (req, res) => {
  dataImportES6.addType(req.body.value)
  res.status(200).json({
    result: true
  });
}

export default typeController;
