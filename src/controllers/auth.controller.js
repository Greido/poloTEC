import User from "../schemas/user.model.js";
import bcrypt from 'bcryptjs'


export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {

    const passwordHash = await bcrypt.hash(password,10)

    const newUser = new User({
      username,
      email,
      password:passwordHash,
    });
    await newUser.save();
    res.send("registrando");
  } catch (error) {
    console.log(error);
  }
};

export const login = (req, res) => res.send("Login");
