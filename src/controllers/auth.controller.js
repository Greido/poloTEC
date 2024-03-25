export const register = (req, res) => {
  const { email, password, username } = req.body;
  res.send("registrando");
};

export const login = (req, res) => res.send("Login");
