import Enterprise from "../schemas/enterprise.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const enterpriseRegister = async (req, res) => {
  const { email, password, name, cuil, role } = req.body;

  try {
    if (!email || !password || !name || !cuil || !role) {
      return res.status(400).json({ message: "Falta uno o más campos requeridos" });
    }

    const validRoles = ['admin', 'ent'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Rol no válido" });
    }

    const existingEnterprise = await Enterprise.findOne({ email });

    if (existingEnterprise) {
      return res.status(403).json({ message: "El correo electrónico ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newEnterprise = new Enterprise({
      name,
      email,
      cuil,
      password: passwordHash,
      role, 
    });

    const enterpriseSaved = await newEnterprise.save();

    const token = createAccessToken({ id: enterpriseSaved._id, role: enterpriseSaved.role });
    res.cookie("token", token);

    res.status(201).json({
      id: enterpriseSaved._id,
      name: enterpriseSaved.name,
      role: enterpriseSaved.role,
      message: "Registro de empresa exitoso",
    });
  } catch (error) {
    console.error("Error al registrar la empresa:", error);
    res.status(500).json({ message: "Ocurrió un error al registrar la empresa." });
  }
};

export const enterpriseLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const enterpriseFound = await Enterprise.findOne({ email });

    if (!enterpriseFound) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    const passwordMatch = await bcrypt.compare(password, enterpriseFound.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Incluir el rol en la información del token JWT
    const token = createAccessToken({ id: enterpriseFound._id, role: 'enterprise' });
    res.cookie("token", token);

    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Ocurrió un error al iniciar sesión." });
  }
};

export const enterpriseLogout = async (req, res) => {
  try {
    // Limpiar la cookie del token
    res.clearCookie('token').json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ message: 'Error interno al cerrar sesión' });
  }
};

export const enterpriseProfile = async (req, res) => {
  try {
    // Obtener datos del usuario desde el token (middleware validateRequired)
    const enterprise = res.locals.enterprise;

    // Buscar la información detallada de la empresa en la base de datos
    const enterpriseDetails = await Enterprise.findById(enterprise._id).select('-password');

    if (!enterpriseDetails) {
      return res.status(404).json({ message: "No se encontraron detalles de la empresa" });
    }

    res.status(200).json(enterpriseDetails);
  } catch (error) {
    console.error('Error al obtener perfil de empresa:', error);
    res.status(500).json({ message: 'Error interno al obtener perfil de empresa' });
  }
};

export const enterpriseForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const enterprise = await Enterprise.findOne({ email });

    if (!enterprise) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    enterprise.resetPasswordToken = token;
    enterprise.resetPasswordExpires = Date.now() + 3600000; // 1 hora

    await enterprise.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: enterprise.email,
      from: process.env.EMAIL_USER,
      subject: "Restablecimiento de contraseña",
      text: `
        Has solicitado restablecer tu contraseña para tu cuenta de empresa.

        Por favor, haz clic en el siguiente enlace o pega este enlace en tu navegador para completar el proceso:
        http://${req.headers.host}/enterprise/reset/${token}

        Si no solicitaste esto, ignora este correo y tu contraseña permanecerá sin cambios.
      `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error al enviar el correo de restablecimiento de contraseña:", error);
        res.status(500).json({ message: "Error interno al enviar el correo" });
      } else {
        console.log("Correo enviado para restablecimiento de contraseña");
        res.status(200).json({ message: "Correo enviado para restablecimiento de contraseña" });
      }
    });
  } catch (error) {
    console.error("Error al procesar la solicitud de restablecimiento de contraseña:", error);
    res.status(500).json({ message: "Error interno al procesar la solicitud" });
  }
};

export const enterpriseResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const enterprise = await Enterprise.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!enterprise) {
      return res.status(403).json({ message: "El token de restablecimiento de contraseña es inválido o ha expirado" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    enterprise.password = hashedPassword;
    enterprise.resetPasswordToken = undefined;
    enterprise.resetPasswordExpires = undefined;

    await enterprise.save();

    res.status(200).json({ message: "Contraseña restablecida correctamente" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ message: "Error interno al restablecer la contraseña" });
  }
};

