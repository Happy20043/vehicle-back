const { methods: commonService } = require("../services/index");

const authCheck = async (req, res, next) => {
    const token = req?.cookies?._gmtls;
    if (!token) {
        return res.redirect("/admin/login");
    }
    const authUser = commonService.verifyToken(token);
    try {
        if (!authUser) {
            return res.redirect("/admin/login");
        }
        req.authUser = authUser;
        await authUser.then((authArray) => {
            req.auth = authArray;
        });
        next();
    } catch (error) {
        return res.redirect("/admin/login");
    }
}
module.exports = { authCheck };