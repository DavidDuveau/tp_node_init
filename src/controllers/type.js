import {createJSONData, addTypeDatabase} from "../db/connector.js"

const typeController = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  console.log("Z1");

  createJSONData('type').then(result => {
    console.log("X0");
    res.status(200).json(result)
    console.log("Z2");
  })
};

const addTypeController = async (req, res) => {
  console.log("X1");
  await addTypeDatabase(req.body.value);
  console.log("X2");
  res.status(200).json({ result: true });
}

export default typeController;
export {addTypeController};
