const { Sequelize, DataTypes, Op } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Admin = require("./adminModel")(sequelize, Sequelize, DataTypes);
db.Category = require("./categoryModel")(sequelize, Sequelize, DataTypes);
db.Blog = require("./blogsModel")(sequelize, Sequelize, DataTypes);

db.Blog.belongsTo(db.Category, { foreignKey: "category_id" });

db.Category.hasMany(db.Blog, { foreignKey: "category_id" });

module.exports = db;
