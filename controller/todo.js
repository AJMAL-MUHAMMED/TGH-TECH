const Todo = require("../models/todoSchema");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose')

exports.getTodos = asyncHandler(async (req, res) => {
  const allTodos = await Todo.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $ne: "DELETED",
            }
          }, {
            user: {
              $eq: mongoose.Types.ObjectId(req.user.id)
            }
          }
        ]
      },
    },
    { $sort: { priority: 1 } },
  ]);

  //////   Count of pending tasks, canceled tasks, deleted tasks, completed tasks  /

  const pendingCount = await Todo.find({ user: req.user.id, status: "PENDING" }).count()
  const cancelCount = await Todo.find({ user: req.user.id, status: "CANCELED" }).count()
  const deleteCount = await Todo.find({ user: req.user.id, status: "DELETED" }).count()
  const completedCount = await Todo.find({ user: req.user.id, status: "COMPLETED" }).count()

  res.json({ allTodos, pendingCount, cancelCount, deleteCount, completedCount });
});

exports.createTodo = asyncHandler(async (req, res) => {
  const { todo, date, priority } = req.body;
  if (!todo) {
    return res.status(400).json({ message: "please enter todo" });
  }
  const newTodo = new Todo({ todo, date, priority, user: req.user.id });
  const task = await newTodo.save();
  console.log(task,"newtdooooooooooooooo")
  res.json(task);
});

exports.deletTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return res.status(400).json({ message: "Invalid todo id." });
  }
  await todo.remove();
  res.json({ message: "Successfully deleted." });
});

exports.completeTodo = asyncHandler(async (req, res) => {
  console.log(req.params.id, "asdf");
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return res.status(400).json({ message: "invalid todo id" });
  }
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
    status: "COMPLETED",
  });
  res.json({ updatedTodo, message: "Status Updated successfully" });
});

exports.cancelTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return res.status(400).json({ message: "invalid todo id" });
  }
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
    status: "CANCELED",
  });
  res.json({ updatedTodo, message: "Status Updated successfully" });
});

exports.deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return res.status(400).json({ message: "invalid todo id" });
  }
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
    status: "DELETED",
  });
  res.json({ updatedTodo, message: "Status Updated successfully" });
});
