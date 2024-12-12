const { Category } = require("../models");

const categoryData = async () => {
  try {
    const insertRecords = [
      {
        id: "1",
        name: "Cars",
        created_at: "2024-12-11 04:15:55",
        updated_at: "2024-12-11 04:15:55",
        deleted_at: null,
      },
      {
        id: "2",
        name: "Motorcycles",
        created_at: "2024-12-11 04:16:12",
        updated_at: "2024-12-11 04:16:12",
        deleted_at: null,
      },
      {
        id: "3",
        name: "Commercial",
        created_at: "2024-12-11 04:16:25",
        updated_at: "2024-12-11 04:16:25",
        deleted_at: null,
      },
      {
        id: "4",
        name: "Electric",
        created_at: "2024-12-11 04:16:34",
        updated_at: "2024-12-11 04:16:34",
        deleted_at: null,
      },
      {
        id: "5",
        name: "Luxury",
        created_at: "2024-12-11 04:16:41",
        updated_at: "2024-12-11 04:16:41",
        deleted_at: null,
      },
    ];

    await Category.bulkCreate(insertRecords);
    console.log("Category data seeded successfully");
  } catch (error) {
    console.log("Category seeder error: ", error);
  }
};

module.exports = { categoryData };
