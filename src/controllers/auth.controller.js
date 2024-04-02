import User from "../schemas/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();

    jwt.sign(
      {
        id: userSaved._id,
      },
      "secret123"
    );

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });

    res.send("registrando");
  } catch (error) {
    console.log(error);
  }
};

export const login = (req, res) => res.send("Login");
