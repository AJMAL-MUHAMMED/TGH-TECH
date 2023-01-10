const router = require("express").Router();
const {
  createTodo,
  getTodos,
  deleteTodo,
  completeTodo,
  cancelTodo,
} = require("../controller/todo");
const { register, login } = require("../controller/user");
const { authUser } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);

router.get("/", authUser, getTodos);
router.post("/createTodo", authUser, createTodo);
router.delete("/deleteTodo/:id", authUser, deleteTodo);
router.patch("/completeTodo/:id", authUser, completeTodo);
router.patch("/cancelTodo/:id", authUser, cancelTodo);

module.exports = router;
