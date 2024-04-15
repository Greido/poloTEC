import Enterprise from "../schemas/enterprise.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const enterpriseRegister = async (req, res) => {
  const { email, password, name, cuil } = req.body;

  try {
    if (!email || !password || !name || !cuil) {
      return res
        .status(400)
        .json({ message: "Falta uno o más campos requeridos" });
    }

    const existingEnterprise = await Enterprise.findOne({ email });

    if (existingEnterprise) {
      return res
        .status(403)
        .json({ message: "El correo electrónico ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newEnterprise = new Enterprise({
      name,
      email,
      cuil,
      password: passwordHash,
      image: {
        data: fs.readFileSync(image.path),
        contentType: image.mimetype,
      },
    });

    const enterpriseSaved = await newEnterprise.save();

    const token = await createAccessToken({ id: enterpriseSaved._id });
    res.cookie("token", token);

    res.json({
      id: enterpriseSaved._id,
      name: enterpriseSaved.name,
      message: "Registro de empresa exitoso",
    });
  } catch (error) {
    console.error("Error al registrar la empresa:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al registrar la empresa." });
  }
};
