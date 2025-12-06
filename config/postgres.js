const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

sequelize.authenticate()
  .then(() => console.log("PostgreSQL Connected"))
  .catch((err) => console.log("POSTGRES ERROR:", err));

const TaskModel = require("../models/Task");
const Task = TaskModel(sequelize, DataTypes);

module.exports = { sequelize, Task };
