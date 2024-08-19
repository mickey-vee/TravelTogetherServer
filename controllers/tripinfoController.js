import initKnex from "knex";
import configuration from "../knexfile.js";
import { randomUUID } from "crypto";

const knex = initKnex(configuration);

const tripInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await knex("events")
      .select(
        "eventId",
        "name",
        "startDate",
        "endDate",
        "latitude",
        "longitude",
        "address"
      )
      .where("eventId", id)
      .first();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const users = await knex("users")
      .select("userid", "name", "email")
      .where("eventid", id);

    res.status(200).json({ event, users });
  } catch (error) {
    console.error("Error retrieving event and users:", error);
    res.status(500).json({ message: "Error retrieving event and users" });
  }
};

const createTrip = async (req, res) => {
  const { name, startDate, endDate, latitude, longitude, sessionToken } =
    req.body;

  if (!name || !startDate || !endDate || !latitude || !longitude) {
    return res.status(400).json({
      message: "Please make sure to provide event name, start and end date",
    });
  }

  try {
    const eventId = randomUUID();
    await knex("events").insert({
      eventId,
      name,
      startDate,
      endDate,
      latitude,
      longitude,
    });

    await knex("users")
      .where({ sessionToken: sessionToken })
      .update({ eventid: eventId });

    const newTrip = await knex("events").where({ eventId }).first();
    res.status(201).json(newTrip);
  } catch (error) {
    console.error("Error creating event:", error);
    res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
};

const addExpense = async (req, res) => {
  const { id } = req.params;
  const { description, amount, date, notes, userid } = req.body;

  if (!description || !amount || !date) {
    return res.status(400).json({
      message: "Please make sure to provide expense name, amount and date",
    });
  }

  try {
    const expenseId = randomUUID();

    await knex("expenses").insert({
      expenseId,
      description,
      amount,
      date,
      notes,
      eventId: id,
      userid,
      amount_paid: amount,
    });

    const users = await knex("users").where("eventId", id).select("userid");

    const numberOfUsers = users.length;
    const amountPerUser = amount / (numberOfUsers - 1);

    const updatePromises = users
      .filter((user) => user.userid !== userid)
      .map((user) => {
        return knex("expenses").insert({
          expenseId: randomUUID(),
          description: description,
          amount_owed: amountPerUser,
          date: date,
          notes: notes,
          eventId: id,
          userid: user.userid,
        });
      });

    await Promise.all(updatePromises);

    const newExpense = await knex("expenses").where({ expenseId }).first();

    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding expense" });
  }
};

const getExpenses = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await knex("expenses")
      .select(
        "expenseId",
        "description",
        "amount",
        "date",
        "notes",
        "created_at",
        "userid",
        "amount_paid",
        "amount_owed"
      )
      .where("eventId", id)
      .andWhere("amount_paid", ">", 0.0);

    const [{ total }] = await knex("expenses")
      .where("eventId", id)
      .andWhere("amount_paid", ">", 0.0)
      .sum("amount_paid as total");

    res.status(200).json({ response, total: total || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving expenses" });
  }
};

const getAmountsOwed = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await knex("expenses")
      .select(
        "expenseId",
        "description",
        "date",
        "notes",
        "created_at",
        "userid",
        "amount_owed"
      )
      .where("eventId", id)
      .andWhere("amount_owed", ">", 0.0);

    res.status(200).json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving expenses" });
  }
};

const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const rowsDeleted = await knex("expenses").where({ expenseId }).delete();

    if (rowsDeleted === 0) {
      return res.status(404).json({
        message: `Expense ID ${expenseId} not found`,
      });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(`Error deleting expense with ID ${expenseId}:`, error);
    res.status(500).json({
      message: `Unable to delete expense: ${error.message}`,
    });
  }
};

export {
  tripInfo,
  createTrip,
  addExpense,
  getExpenses,
  deleteExpense,
  getAmountsOwed,
};
