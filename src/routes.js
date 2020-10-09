import { Router } from "express";
import amiiboController from "./controllers/amiibo";
import amiiboSeriesController from "./controllers/amiiboSeries";
import charactersController from "./controllers/character";
import gameSeriesController from "./controllers/gameSeries";
import typeController, {addTypeController} from "./controllers/type";

const createRoutes = () => {
  const routes = Router();
  routes.post("/api/type", addTypeController)

  routes.get("/api/amiibo", amiiboController);
  routes.get("/api/type", typeController);
  routes.get("/api/gameseries", gameSeriesController);
  routes.get("/api/character", charactersController);
  routes.get("/api/amiiboseries", amiiboSeriesController);
  return routes;
};

export default createRoutes;
