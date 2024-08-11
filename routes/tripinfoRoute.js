import express from "express";
import * as tripInfo from "../controllers/tripinfoController.js";

const router = express.Router();

router.route("/tripinfo").get(tripInfo.tripInfo).post(tripInfo.createTrip);

export default router;
