const router = require("express").Router();
const auth = require("../middleware/auth");
const { Task } = require("../config/postgres");

// Dashboard
router.get("/dashboard", auth, async (req, res) => {
  const total = await Task.count({ where: { userId: req.session.user.id } });
  res.render("dashboard", { user: req.session.user, total });
});

// All tasks
router.get("/tasks", auth, async (req, res) => {
  const tasks = await Task.findAll({
    where: { userId: req.session.user.id },
  });
  res.render("tasks", { tasks });
});

// Add task form
router.get("/tasks/add", auth, (req, res) => {
  res.render("add-task");
});

// Add task POST
router.post("/tasks/add", auth, async (req, res) => {
  await Task.create({ ...req.body, userId: req.session.user.id });
  res.redirect("/tasks");
});

// Edit form
router.get("/tasks/edit/:id", auth, async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  res.render("edit-task", { task });
});

// Update task
router.post("/tasks/edit/:id", auth, async (req, res) => {
  await Task.update(req.body, { where: { id: req.params.id } });
  res.redirect("/tasks");
});

// Delete task
router.post("/tasks/delete/:id", auth, async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.redirect("/tasks");
});

// Status update
router.post("/tasks/status/:id", auth, async (req, res) => {
  await Task.update(
    { status: req.body.status },
    { where: { id: req.params.id } }
  );
  res.redirect("/tasks");
});

module.exports = router;
