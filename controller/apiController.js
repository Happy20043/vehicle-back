const { Category, Blog, Contact } = require("../models/index");

const getCategory = async (req, res) => {
  try {
    // Wait for the categories to be fetched
    const categories = await Category.findAll();

    // Check if no categories were found
    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);

    res.status(500).json({
      message: "An error occurred while fetching categories",
      error: error.message,
    });
  }
};

const getBlogs = async (req, res) => {
  try {
    // Extract the category name from the query parameters
    const { categoryName } = req.query;

    // Build the query options dynamically
    const queryOptions = {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"], // Corrected "attribute" to "attributes"
        },
      ],
      order: [["created_at", "DESC"]],
    };

    // Add category name filter if provided
    if (categoryName) {
      queryOptions.include[0].where = { name: categoryName };
    }

    // Fetch the blogs based on the query options
    const blogs = await Blog.findAll(queryOptions);

    // Check if no blogs were found
    if (blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);

    res.status(500).json({
      message: "An error occurred while fetching blogs",
      error: error.message,
    });
  }
};  

const getOneBlog = async (req, res) => {
  try {
    // Extract the blog ID from the request parameters
    const blogId = req.params.id;

    // Find the blog by ID, including its associated category
    const blog = await Blog.findOne({
      where: { id: blogId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Return the found blog
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching the blog:", error);

    res.status(500).json({
      message: "An error occurred while fetching the blog",
      error: error.message,
    });
  }
};

const createContact = async (req, res) => {
    try {
      const { name, email_address, message } = req.body;
  
      // Validate required fields
      if (!name || !email_address || !message) {
        return res.status(400).json({
          message: 'All fields are required (name, email_address, subject, message)',
        });
      }
  
      // If user_id is not provided, set it to null
      const contactData = {
        name,
        email_address,
        message, // If user_id is not provided, it will be set to null
        created_at: new Date(),
        updated_at: new Date(),
      };
  
      // Create the contact
      const newContact = await Contact.create(contactData);
  
      return res.status(201).json({
        message: 'Contact created successfully!',
        contact: newContact,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Error creating contact.',
        error: error.message,
      });
    }
  };

module.exports = { getCategory, getBlogs, getOneBlog, createContact };
