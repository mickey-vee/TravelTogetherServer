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

    await knex("users").insert({
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

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  try {
    const user = await knex("users").where({ email, password }).first();

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const sessionToken = randomUUID();
    await knex("users").where({ userId: user.userid }).update({ sessionToken });

    res.status(200).json({
      user: { userid: user.userId, name: user.name, email: user.email },
      sessionToken,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user" });
  }
};

export { newUser, userLogin };
