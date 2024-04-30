import User from "../schemas/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Exporta la función de registro de usuario
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

    // Crea una instancia del transporter de Nodemailer con las credenciales de autenticación
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "juanpablocorzobarrera@gmail.com", // Reemplaza con tu dirección de correo electrónico
        pass: "jxdg cdtb ryiv qjdt", // Reemplaza con tu contraseña de correo electrónico
      },
    });

    // Función para enviar correo electrónico
    const enviarCorreo = (destinatario, asunto, mensaje) => {
      const mailOptions = {
        from: "juanpablocorzobarrera@gmail.com", // Reemplaza con tu dirección de correo electrónico
        to: `${email}`,
        subject: "Registro exitoso",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <h2 style="color: #333;">Registro completado</h2>
          <p style="color: #555; font-size: 16px;">Bienvenido a la bolsa de trabajo</p>
          <p style="color: #777; font-size: 14px;">Gracias por registrarte en nuestra aplicación.</p>
        </div>
      `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Correo electrónico enviado: " + info.response);
        }
      });
    };

    // Llama a la función enviarCorreo para enviar un correo electrónico de registro
    enviarCorreo(
      email,
      "Registro exitoso",
      "¡Gracias por registrarte en nuestra aplicación!"
    );

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
      message:
        "Registro exitoso. Se ha enviado un correo electrónico de confirmación.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Error en el registro de usuario. Por favor, inténtalo de nuevo.",
    });
  }
};


// Exporta la función de inicio de sesión de usuario
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


//Exporta la función de cierre de sesión de usuario
export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};


//Exporta la función de perfil de usuario
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


//Exporta la función de ver todos los usuarios
export const seeAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};


//Exporta la función de ver un usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  await User.findByIdAndDelete(id);
  res.json({ message: "User deleted successfully" });
};

//Exporta la función de ver un usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {new: true,});
    res.json({ message: "User updated successfully", User: updatedUser });
  } catch (error) {
  console.log(error);
  return res.status(500).json({ message: "Error updating user" ,error: error.message});
}
}
