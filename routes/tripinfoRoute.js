import express from "express";
import tripinfo from "../controllers/tripinfoController.js";

const router = express.Router();

router.route("/tripinfo").get(tripinfo);

export default router;
