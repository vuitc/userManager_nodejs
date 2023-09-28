const { Sequelize } = require("sequelize");
// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize("dbmanager", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
sequelize.authenticate().then(() => {
  console.log("Connected successfully");
});
module.exports = sequelize;
