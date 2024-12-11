const { Category, Sequelize } = require("../models");

// Get all categories
const getIndex = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (page - 1) * limit;

    const searchCondition = search
      ? {
          name: {
            [Sequelize.Op.iLike]: `%${search}%`,
          },
        }
      : {};
    // Fetch categories with search and pagination
    const categories = await Category.findAll({
      where: searchCondition, 
      limit: parseInt(limit),
      offset: offset,
    });

    // Calculate total pages
    const totalCategories = await Category.count({
      where: searchCondition,
    });

    const totalPages = Math.ceil(totalCategories / limit);

     res.render("category/index", {
      categories,
      title: "Category List",
      search,
      currentPage: parseInt(page),
      totalPages: totalPages,  
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Internal Server Error");
  }
};


// Render create category form
const create = async (req, res) => {
  try {
    res.render("category/create", {
      title: "Create Category",
      formdata: {},
      errorMsg: "",
    });
  } catch (error) {
    console.error("Error rendering create category page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Store a new category
const store = async (req, res) => {
  const { name } = req.body;
  try {
    const data = await Category.create({ name });
    if (data) {
      return res.redirect("/admin/category");
    } else {
      return res.render("category/create", {
        title: "Create Category",
        formdata: req.body,
        errorMsg: "Failed to create category. Please try again.",
      });
    }
  } catch (error) {
    res.render("category/create", {
      title: "Create Category",
      formdata: req.body,
      errorMsg: "Error: " + error.message,
    });
  }
};

// Render edit category form
const edit = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.render("category/edit", {
      title: "Edit Category",
      formdata: category,
      errorMsg: "",
    });
  } catch (error) {
    console.error("Error fetching category for editing:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Update an existing category
const update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    await category.update({ name });
    return res.redirect("/admin/category");
  } catch (error) {
    res.render("category/edit", {
      title: "Edit Category",
      formdata: { id, name },
      errorMsg: "Error: " + error.message,
    });
  }
};

// Delete a category
const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    await category.destroy();
    res.redirect("/admin/category");
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getIndex, create, store, edit, update, destroy };
