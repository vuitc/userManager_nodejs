const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./database");
const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.INTEGER,
  },
  gender: {
    type: DataTypes.BOOLEAN,
  },
  password: {
    type: DataTypes.STRING,
  },
});
sequelize.sync();
module.exports = User;
