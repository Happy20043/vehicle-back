const dashBoard = (req, res) => {
  
    res.render("admin/dashboard", {
      title: "Dashboard",
      activePage: "dashboard",
    });
  };
  
  module.exports = { dashBoard };
  