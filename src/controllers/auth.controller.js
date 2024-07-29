import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../schemas/user.model.js';
import { createAccessToken } from '../libs/jwt.js';
import { token } from 'morgan';

// Registro de usuario
export const register = async (req, res) => {
  const { email, password, username, role } = req.body;

  try {
    if (!email || !password || !username || !role) {
      return res.status(400).json({ message: "Falta uno o más campos requeridos" });
    }

    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Rol no válido" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({ message: 'El correo electrónico ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: passwordHash, role });
    const userSaved = await newUser.save();

    const token = createAccessToken(userSaved); // Usar el objeto usuario completo

    res.cookie('token', token, {
      httpOnly: true, // La cookie solo debe ser accesible a través del HTTP
      secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
      sameSite: 'strict', // Protección contra CSRF
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Reemplaza con tu dirección de correo electrónico
        pass: process.env.EMAIL_PASS, // Reemplaza con tu contraseña de correo electrónico
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Reemplaza con tu dirección de correo electrónico
      to: email,
      subject: 'Registro exitoso',
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
        console.log('Correo electrónico enviado: ' + info.response);
      }
    });

    res.status(201).json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      role: userSaved.role,
      message: 'Registro exitoso. Se ha enviado un correo electrónico de confirmación.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error en el registro de usuario. Por favor, inténtalo de nuevo.',
    });
  }
};

// Inicio de sesión de usuario
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Credenciales inválidas' });
    }
    console.log('Datos recibidos:', { email, password ,token});
    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      console.log('Contraseña incorrecta');
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Crear un token de acceso
    const Token = createAccessToken(user); 

    // Configurar la cookie con el token
    res.cookie('token', Token, {
      httpOnly: true, // La cookie solo debe ser accesible a través del HTTP
      secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
      sameSite: 'strict', // Protección contra CSRF
    });

    // Enviar respuesta de éxito
    res.status(200).json({ message: 'Inicio de sesión exitoso',Token});
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Ocurrió un error al iniciar sesión.' });
  }
};

// Cierre de sesión de usuario
export const logout = async (req, res) => {
  try {
    res.clearCookie('token').json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ message: 'Error interno al cerrar sesión' });
  }
};

// Perfil de usuario
export const profile = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({ message: 'Error interno al obtener perfil de usuario' });
  }
};

// Ver todos los usuarios
export const seeAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno al obtener usuarios' });
  }
};

// Enviar correo electrónico
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

// Olvido de contraseña
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

// Restablecer contraseña
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
