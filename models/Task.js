module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    dueDate: DataTypes.DATEONLY,
    status: DataTypes.STRING,
    userId: DataTypes.STRING, // Mongo user _id
  });

  return Task;
};
