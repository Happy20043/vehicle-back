const { Blog, Category, Sequelize } = require("../models");

const getIndex = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (page - 1) * limit;

    const searchCondition = search
      ? {
          title: {
            [Sequelize.Op.iLike]: `%${search}%`,
          },
        }
      : {};

    const blogs = await Blog.findAll({
      where: searchCondition,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      limit: parseInt(limit),
      offset: offset,
    });

    const totalBlogs = await Blog.count({
      where: searchCondition,
    });

    const totalPages = Math.ceil(totalBlogs / limit);
    res.render("blogs/index", {
      blogs,
      title: "Blogs List",
      currentPage: parseInt(page),
      totalPages,
      search,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Internal Server Error");
  }
};

const create = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.render("blogs/create", {
      title: "Create Blog",
      formdata: {},
      categories,
      errorMsg: "",
    });
  } catch (error) {
    console.error("Error rendering create blog page:", error);
    res.status(500).send("Internal Server Error");
  }
};

const store = async (req, res) => {
  const { title, description, source_by, status, category_id } = req.body;

  try {
    let images = [];
    if (req.files) {
      images = req.files.map((file) => file.location);
    }

    const blog = await Blog.create({
      title,
      description,
      images: images,
      source_by,
      status,
      category_id,
    });

    if (blog) {
      return res.redirect("/admin/blogs");
    } else {
      return res.render("blogs/create", {
        title: "Create Blog",
        formdata: req.body,
        errorMsg: "Failed to create blog. Please try again.",
      });
    }
  } catch (error) {
    res.render("blogs/create", {
      title: "Create Blog",
      formdata: req.body,
      errorMsg: "Error: " + error.message,
    });
  }
};

const edit = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    const categories = await Category.findAll();

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    res.render("blogs/edit", {
      title: "Edit Blog",
      details: blog,
      images: JSON.parse(blog.images),
      categories,
      errorMsg: "",
    });
  } catch (error) {
    console.error("Error rendering edit blog page:", error);
    res.status(500).send("Internal Server Error");
  }
};

const update = async (req, res) => {
  const { title, description, source_by, status, category_id } = req.body;
  const { id } = req.params;

  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    let images = [];

    if (req.files) {
      images = req.files.map((file) => file.location);
    }

    await blog.update({
      title,
      description,
      images: images.length > 0 ? images : blog.images,
      source_by,
      status,
      category_id,
    });

    res.redirect("/admin/blogs");
  } catch (error) {
    console.error(error);
    res.render("blogs/edit", {
      title: "Edit Blog",
      details: req.body,
      errorMsg: "Error: " + error.message,
    });
  }
};

// Delete blog from database
const destroy = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    await blog.destroy();
    res.redirect("/admin/blogs");
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getIndex, create, store, edit, update, destroy };
