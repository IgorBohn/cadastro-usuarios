const { Router } = require("express");
const UserController = require("./controllers/UserController");

const routes = Router();

routes.get("/health", (req, res) => {
  return res.status(200).json({ message: "Server on" });
});

routes.post("/users", UserController.createUser);
routes.get("/users", UserController.listUsers);
routes.get("/users/:id", UserController.getUserById);
routes.put("/users/:id", UserController.modifyUser);
routes.delete("/users/:id", UserController.removeUser);

module.exports = routes;
