import dataImportES6 from "../import/ES6";

const amiiboController = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  let amiiboFilteredArray = dataImportES6.getDataAmiibo;

  for (const property in req.query) {
    amiiboFilteredArray = dataImportES6.getAmiiboByFilter(
      amiiboFilteredArray,
      property,
      req.query[property]
    );
  }

  res.status(200).json(amiiboFilteredArray);
};

export const addAmiiboController = (req, res) => {
  const newAmiibo = {
    type: req.body.type,
    gameSeries: req.body.gameSeries,
    amiiboSeries: req.body.amiiboSeries,
    name: req.body.name,
    character: req.body.character,
    image: req.body.image,
  };
  dataImportES6.addAmiibo(newAmiibo);
  res.status(200).json({ result: true });
};

export default amiiboController;
