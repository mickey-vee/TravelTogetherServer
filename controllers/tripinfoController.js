import initKnex from "knex";
import configuration from "../knexfile.js";
import { randomUUID } from "crypto";

const knex = initKnex(configuration);

const tripInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await knex("events")
      .select("eventId", "name", "startDate", "endDate")
      .where("eventId", id);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving events" });
  }
};

const createTrip = async (req, res) => {
  const userId = req.userId;
  const { name, startDate, endDate } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({
      message: "Please make sure to provide event name, start and end date",
    });
  }

  try {
    const eventId = randomUUID();
    await knex("events").insert({ eventId, name, startDate, endDate });

    await knex("users").where({ userid: userId }).update({ eventid: eventId });

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

  const { description, amount, date, notes } = req.body;

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
    });

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
        "created_at"
      )
      .where("eventId", id);

    const [{ total }] = await knex("expenses")
      .where("eventId", id)
      .sum("amount as total");

    res.status(200).json({ response, total: total || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving expense" });
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

export { tripInfo, createTrip, addExpense, getExpenses, deleteExpense };
