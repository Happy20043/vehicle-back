const { Blog } = require("../models");

const blogData = async () => {
  try {
    const insertRecords = [];

    await Blog.bulkCreate(insertRecords);
    console.log("Blog data seeded successfully ");
  } catch (error) {
    console.log("Blog seeded error :" , error)
  }
};

module.exports = {blogData}