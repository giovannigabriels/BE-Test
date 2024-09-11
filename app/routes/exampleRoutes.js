const { exampleMiddleware } = require("../middleware");
const exampleController = require("../controllers/exampleController");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const router = require("express").Router();

  router.get(
    "/surveys/average-results",
    // [exampleMiddleware.exampleMiddleware],
    exampleController.refactoreMe1
  );

  router.post(
    "/survey",
    // [exampleMiddleware.exampleMiddleware],
    exampleController.refactoreMe2
  );

  app.use("/api/data", router);
};
