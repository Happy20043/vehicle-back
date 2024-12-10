const { Blog, Category } = require("../models");

const getIndex = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [{
        model: Category,
        as: "category",  
        attributes: ["id", "name"],   
      }],
      order: [["created_at", "DESC"]],
    });
 
    res.render("blogs/index", { blogs, title: "Blogs List" });
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
  const { title, description, sourceBy, status, category_id } = req.body;

  try {
    // Handle the multiple image uploads
    let images = [];
    if (req.files) {
      images = req.files.map((file) => file.location || file.path); // Save the file locations (URLs or paths)
    }

    const blog = await Blog.create({
      title,
      description,
      images: images, // Store multiple images as an array of URLs/paths
      sourceBy,
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
  const { title, description, sourceBy, status, category_id } = req.body;
  const { id } = req.params;

  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // If files are uploaded, handle them
    let images = blog.images || []; // Default to existing images if any

    // Check if there are uploaded files
    if (req.files) {
      images = req.files.map((file) => file.path); // Save the file paths (or URLs if using cloud storage)
    }

    // Update the blog entry
    await blog.update({
      title,
      description,
      images, // Save the array of image paths
      sourceBy,
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
