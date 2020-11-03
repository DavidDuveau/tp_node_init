import path from "path";
import express from "express";
import createRoutes from "./routes";
import dataImportES6 from "./import/ES6";
import bodyParser from "body-parser";
import loadDatabase, { createJSONData, createJSONAmiibo} from "./db/connector.js"

const dataLoadedSuccess = () => {
  const app = express();

  // Lors du lancement du serveur avec npm run local, le port doit être préciser en troisième arguement, ex: npm run local 8853;
  // Si le port n'est pas spécifié, alors le port par defaut sera 8888.
  const port = process.argv[2] || 8888;

  app.set("view engine", "ejs");

  app.set("views", path.join(__dirname, "resources/ejsViews/"));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use("/", express.static("src/resources/static/jquery-amiibo"));
  app.use("/", createRoutes());

  app.get("/", (req, res) => {
    res.render("index", { port: port });
  });

  app.get("/addType", async (req, res) =>{
  const data = await createJSONData('type');
  console.log(data);
  res.render("addType", { types:  data.amiibo })
  });

  app.get("/addAmiibo", async (req, res) =>{
    const typeData = await createJSONData('type');
    const characterData = await createJSONData('characters');
    const gameSerieData = await createJSONData('gameseries');
    const amiiboSerieData = await createJSONData('amiiboseries');

    res.render("addAmiibo", {
      types: typeData.amiibo,
      characters: characterData.amiibo,
      gameSeries:gameSerieData.amiibo,
      amiiboSeries: amiiboSerieData.amiibo,
    })
  });

  app.use("/", function (req, res, next) {
    res.status(404).sendFile(__dirname + "/404.png");
  });

  app.use("/", function (err, req, res, next) {
    res.status(500).send("Une erreur 500 est survenue!");
  });
  console.log(`Server started on port : ${port}`);

  app.listen(port);
};

const dataLoadedError = () => {
  console.log("An error occured loading datas");
};

// dataImportES6.load(dataLoadedSuccess, dataLoadedError);

loadDatabase(dataLoadedSuccess, dataLoadedError);
