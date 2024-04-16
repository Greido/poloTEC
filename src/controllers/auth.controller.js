import User from "../schemas/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  // Extrae el correo electrónico, la contraseña y el nombre de usuario del cuerpo de la solicitud
  const { email, password, username } = req.body;

  try {
    // Verifica si el correo electrónico ya está registrado en la base de datos
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(203)
        .json({ message: "El correo electrónico ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Crea una nueva instancia de usuario con el nombre de usuario, correo electrónico y contraseña hash
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // Guarda el nuevo usuario en la base de datos
    const userSaved = await newUser.save();

    // Crea un token de acceso para el usuario recién registrado
    const token = await createAccessToken({ id: userSaved._id });

    // Establece el token como una cookie en la respuesta
    res.cookie("token", token);

    // Responde con la información básica del usuario recién registrado
    res.status(200).json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      message: "Registro exitoso",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;

  try {
    // Find a user with the provided email
    const userFound = await User.findOne({ email });

    // If no user is found, return a 400 status with a "Not found" message
    if (!userFound) return res.status(400).json({ message: "Not found" });

    // Compare the provided password with the user's stored password
    const isMatch = await bcrypt.compare(password, userFound.password);

    // If the passwords do not match, return a 400 status with an "Incorrect password" message
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // Create an access token for the user
    const token = await createAccessToken({ id: userFound._id });

    // Set a cookie with the token
    res.cookie("token", token);

    // Return a JSON response with the user's details and a "Login successful" message
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      message: "Login successful",
    });
  } catch (error) {
    // Log any errors that occur
    console.log(error);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const UserFound = await User.findById(req.user.id);

  if (!UserFound) {
    return res.status(400).json({ message: "User not found" });
  }
  return res.json({
    id: UserFound._id,
    username: UserFound.username,
    emai: UserFound.email,
  });
  res.send("profile");
};

export const seeAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
