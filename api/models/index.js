const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      timestamps: false,
    }
  );

  const Patient = sequelize.define(
    "patient",
    {
      id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: true },
      phoneNumber: { type: DataTypes.TEXT, allowNull: true },
      appointment: { type: DataTypes.STRING, allowNull: false },
      idCliente: { type: DataTypes.INTEGER, allowNull: true },
      ocupado: {
        type: DataTypes.STRING,
        defaultValue: "Patient",
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  const Message = sequelize.define("message", {
    message: { type: DataTypes.TEXT, allowNull: true },
  });
};
