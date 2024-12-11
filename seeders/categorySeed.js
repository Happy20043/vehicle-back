const { Category } = require("../models");

const categoryData = async () => {
  try {
    const insertRecords = [];

    await Category.bulkCreate(insertRecords);
    console.log("Category data seeded successfully");
  } catch (error) {
    console.log("Category seeder error: ", error);
  }
};

module.exports = {categoryData}