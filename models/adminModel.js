module.exports = (sequelize, Sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "admins",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      status: {
        type: DataTypes.ENUM("Active", "InActive"),
        default: "Active",
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      deletedAt: "deleted_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Admin;
};
