import dataImportES6 from '../import/ES6'
import {createJSONAmiibo} from "../db/connector.js"

const amiiboController = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");

  console.log("C1");

  createJSONAmiibo().then(amiiboFilteredArray => {
    for (const property in req.query) {
      amiiboFilteredArray = dataImportES6.getAmiiboByFilter(
        amiiboFilteredArray,
        property,
        req.query[property]
      );
    }
    console.log("C2");
    res.status(200).json(amiiboFilteredArray);
    console.log("C3");
  })
};

export const addAmiiboController = (req, res) => {
  console.log("Y1");
  const newAmiibo = {
    type: req.body.type,
    gameSeries: req.body.gameSeries,
    amiiboSeries: req.body.amiiboSeries,
    name: req.body.name,
    character: req.body.character,
    image: req.body.image,
  };
  dataImportES6.addAmiibo(newAmiibo);
  res.status(200).json({result: true});
};
export default amiiboController;
