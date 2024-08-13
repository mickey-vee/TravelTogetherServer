import express from "express";
import * as tripInfo from "../controllers/tripinfoController.js";

const router = express.Router();

router.route("/tripinfo").post(tripInfo.createTrip);

router.route("/tripinfo/:id").get(tripInfo.tripInfo);

router.route("/expenses/:id").post(tripInfo.addExpense);

export default router;
