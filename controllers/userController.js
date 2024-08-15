import initKnex from "knex";
import configuration from "../knexfile.js";
import { randomUUID } from "crypto";

const knex = initKnex(configuration);

const newUser = async (req, res) => {
  const { name, password, email } = req.body;

  if (!name || !password || !email) {
    return res.status(400).json({
      message: "Please make sure to provide Full name, password and email",
    });
  }
  try {
    const userId = randomUUID();
    const sessionToken = randomUUID();

    await knex("users").insert({
      sessionToken: sessionToken,
      userid: userId,
      name,
      email,
      password,
    });

    const newUser = await knex("users").where({ userId }).first();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Error adding user" });
  }
};

export { newUser };
