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
  const { name, startDate, endDate } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({
      message: "Please make sure to provide event name, start and end date",
    });
  }

  try {
    const eventId = randomUUID();
    await knex("events").insert({ eventId, name, startDate, endDate });

    const newTrip = await knex("events").where({ eventId }).first();
    res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event" });
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
    await knex("expenses").insert({
      description,
      amount,
      date,
      notes,
      eventId: id,
    });

    const newExpense = await knex("expenses").where("eventId", id);
    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding expense" });
  }
};

export { tripInfo, createTrip, addExpense };
