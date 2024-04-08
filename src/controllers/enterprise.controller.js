import Enterprise from "../schemas/enterprise.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const enterpriseRegister = async (req, res) => {
  const { email, password, name, cuil } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newEnterprise = new Enterprise({
      name,
      email,
      cuil,
      password: passwordHash,
    });

    const enterpriseSaved = await newEnterprise.save();

    const token = await createAccessToken({ id: enterpriseSaved._id });
    res.cookie("token", token);

    res.json({
      id: enterpriseSaved._id,
      name: enterpriseSaved.name,
      message: "Enterprise register successful",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ocurrió un error al registrar la empresa." });
  }
};

export const enterpriseLogin = async (req, res) => {
  const { cuil, password } = req.body;

  try {
    const CompanyFound = await Enterprise.findOne({ cuil });
    if (!CompanyFound)
      return res.status(400).json({ message: "Empresa no encontrada" });
  } catch (error) {}
};
