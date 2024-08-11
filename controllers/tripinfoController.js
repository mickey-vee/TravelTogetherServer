import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const tripinfo = async (_req, res) => {
  try {
    const response = await knex("events").select("*");
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

export default tripinfo;
