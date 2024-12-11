const express = require("express");
const cors = require("cors");
const db = require("./models");
require("dotenv").config();
const adminRoutes = require("./routes/admin");
const apiRoutes = require("./routes/api");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const app = express();
app.use(methodOverride("_method")); // This will allow you to simulate DELETE requests using the _method query parameter or hidden input field.

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);
app.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

const synchronizeAndSeed = async () => {
  try {
    await db.sequelize.sync({ force: true });
    await require("./seeders/categorySeed").categoryData();
    await require("./seeders/blogSeed").blogData();
  } catch (error) {
    console.error("Error during synchronization and seeding:", error);
  }
};

// synchronizeAndSeed();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
