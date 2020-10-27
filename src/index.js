import path from "path";
import express from "express";
import createRoutes from "./routes";
import dataImportES6 from "./import/ES6";
import bodyParser from "body-parser";
import loadDatabase from "./import/connector";

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

  app.get("/addAmiibo", (req, res) =>
    res.render("addAmiibo", {
      types: dataImportES6.getTypes.amiibo,
      characters: dataImportES6.getCharacters.amiibo,
      gameSeries: dataImportES6.getGameSeries.amiibo,
      amiiboSeries: dataImportES6.getAmiiboSeries.amiibo,
    })
  );
  app.get("/addType", (req, res) =>
    res.render("addType", { types: dataImportES6.getTypes.amiibo })
  );

  app.use("/", function (req, res, next) {
    res.status(404).sendFile(__dirname + "/404.png");
  });

  app.use("/", function (err, req, res, next) {
    res.status(500).send("Une erreur 500 est survenue!");
  });
  console.log(`Server started on port : ${port}`);

  app.listen(port);
};

const dataLoadedError = (err) => {
  console.log("An error occured while loading datas : " + err);
};

// dataImportES6.load(dataLoadedSuccess, dataLoadedError);
loadDatabase().then(dataLoadedSuccess).catch(dataLoadedError);
