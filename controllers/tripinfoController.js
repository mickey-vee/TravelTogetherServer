import initKnex from "knex";
import configuration from "../knexfile.js";
import { randomUUID } from "crypto";

const knex = initKnex(configuration);

const tripInfo = async (_req, res) => {
  try {
    const response = await knex("events").select("eventId", "name");
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving events" });
  }
};

const createTrip = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Please make sure to provide event name",
    });
  }

  try {
    const eventId = randomUUID();
    await knex("events").insert({ eventId, name });

    const newTrip = await knex("events").where({ eventId }).first();
    res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event" });
  }
};

export { tripInfo, createTrip };
