import express from "express";
const router = express.Router();
import passport from "passport";
import User from "../models/user.js";
import { storeReturnTo } from "../middleware/middleware.js";

//setup authentication
router.get("/signin", (req, res) => {
    res.render("sign_in_page");
});

router.post("/signup", storeReturnTo, async (req, res, next) => {
    try {
        const { name, email, username, password } = req.body;
        const user = new User({ name, email, username, role: "user" });
        const newUser = await User.register(user, password);
        req.login(newUser, function (err) {
            if (err) {
                return next(err);
            }
            req.flash("success", "Successfully Signed Up!");
            return res.redirect(res.locals.returnTo || "/");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signin");
    }
});

router.post(
    "/signin",
    storeReturnTo,
    passport.authenticate("local", {
        failureRedirect: "/signin",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "welcome back!!");
        res.redirect(res.locals.returnTo || "/");
    }
);

router.post("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully Logged Out!");
        res.redirect("/");
    });
});

export default router;
