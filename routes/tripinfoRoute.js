import express from "express";
import * as tripInfo from "../controllers/tripinfoController.js";
import * as userInfo from "../controllers/userController.js";
import initKnex from "knex";
import configuration from "../knexfile.js";

const router = express.Router();
const knex = initKnex(configuration);

router.route("/tripinfo").post(tripInfo.createTrip);

router.route("/tripinfo/:id").get(tripInfo.tripInfo);

router
  .route("/expenses/:id")
  .post(tripInfo.addExpense)
  .get(tripInfo.getExpenses)
  .delete(tripInfo.deleteExpense);

router.route("/signup").post(userInfo.newUser);
router.route("/login").post(userInfo.userLogin);

export default router;
