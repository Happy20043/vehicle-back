const { Contact, Sequelize } = require("../models");

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

    const contactData = await Contact.findAll({
      where: searchCondition,
      limit: parseInt(limit),
      offset: offset,
    });
    const totalContact = await Contact.count({
      where: searchCondition,
    });

    const totalPages = Math.ceil(totalContact / limit);
    res.render("contact/index", {
      contactData,
      title: "Contact List",
      currentPage: parseInt(page),
      totalPages,
      search,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getIndex };
