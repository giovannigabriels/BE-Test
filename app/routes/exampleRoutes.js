const { exampleMiddleware } = require("../middleware");
const exampleController = require("../controllers/exampleController");
const authentication = require("../middleware/authentication");
const authorizationAdmin = require("../middleware/authorization");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const router = require("express").Router();

  router.post(
    "/login",
    exampleController.login
  );

  router.use(authentication);

  router.post(
    "/survey",
    exampleController.refactoreMe2
  );

  router.use(authorizationAdmin)

  router.get(
    "/surveys/average-results",
    exampleController.refactoreMe1
  );

  router.get(
    "/getdata",
    exampleController.getData
  );

  app.use("/api/data", router);
};
