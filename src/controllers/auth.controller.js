import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../schemas/user.model.js';
import { createAccessToken } from '../libs/jwt.js';

export const register = async (req, res) => {
  const { username, email, password, role } = req.body; 

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Asegúrate de que el rol proporcionado es válido
    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno al registrar usuario' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const accessToken = createAccessToken({ id: user._id, email: user.email, role: 'user' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    }).json({ message: 'Inicio de sesión exitoso', token: accessToken });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno al iniciar sesión' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken').json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ message: 'Error interno al cerrar sesión' });
  }
};

export const profile = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({ message: 'Error interno al obtener perfil de usuario' });
  }
};

export const seeAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno al obtener usuarios' });
  }
};

export const sendEmail = async (req, res) => {
  const { subject, text, email } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error interno al enviar el correo' });
      } else {
        res.status(200).json({ message: 'Correo enviado correctamente' });
      }
    });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error interno al enviar el correo' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Restablecimiento de contraseña',
      text: `
        Has solicitado restablecer tu contraseña.

        Por favor, haz clic en el siguiente enlace o pega este enlace en tu navegador para completar el proceso:
        http://${req.headers.host}/reset/${token}

        Si no solicitaste esto, ignora este correo y tu contraseña permanecerá sin cambios.
      `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
        res.status(500).json({ message: 'Error interno al enviar el correo' });
      } else {
        console.log('Correo enviado para restablecimiento de contraseña');
        res.status(200).json({ message: 'Correo enviado para restablecimiento de contraseña' });
      }
    });
  } catch (error) {
    console.error('Error al procesar la solicitud de restablecimiento de contraseña:', error);
    res.status(500).json({ message: 'Error interno al procesar la solicitud' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(403).json({ message: 'El token de restablecimiento de contraseña es inválido o ha expirado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error interno al restablecer la contraseña' });
  }
};
