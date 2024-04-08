import User from "../schemas/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  // Extrae el correo electrónico, la contraseña y el nombre de usuario del cuerpo de la solicitud
  const { email, password, username } = req.body;

  try {
    // Genera el hash de la contraseña usando bcrypt con un factor de coste de 10
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
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      message: "Register successful",
    });
  } catch (error) {
    // Maneja cualquier error ocurrido durante el proceso de registro
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(400).json({ message: "Not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token);

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      message: "Login successful",
    });
  } catch (error) {
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
