const express = require("express");
const router = express.Router();

const { Equipment, UnsavedEquipment } = require("../models/equipment");
const DraftEquipment = require("../models/draftEquipment");

const { isLoggedIn } = require("../middleware/middleware");

router.get("/dashboard", isLoggedIn, async (req, res) => {
    const id = res.locals.currentUser._id;
    if (res.locals.currentUser.role === "administrator") {
        try {
            const draftEquipments = await DraftEquipment.find({ user: id });
            const savedEquipments = await Equipment.find({ user: id });
            const unsavedEquipments = await UnsavedEquipment.find({});
            return res.render("adminDashboard", { draftEquipments, savedEquipments, unsavedEquipments });
        } catch {
            return res.status(500).send("Invalid ID")
        }
    }
    try {
        const draftEquipments = await DraftEquipment.find({ user: id });
        const savedEquipments = await Equipment.find({ user: id });
        const unsavedEquipments = await UnsavedEquipment.find({ user: id });
        return res.render("dashboard", { draftEquipments, savedEquipments, unsavedEquipments });
    } catch {
        return res.status(500).send("Invalid ID")
    }
});

module.exports = router;
