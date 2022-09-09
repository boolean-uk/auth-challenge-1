const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwtSecret = "mysecret";

const register = async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const createdUser = await prisma.user.create({ data: { username, hash } });

  res.json({ data: createdUser });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await prisma.user.findUnique({ where: { username } });

  if (!foundUser) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const passwordsMatch = await bycrpt.compare(password, foundUser.password);

  if (!passwordsMatch) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, jwtSecret);

  res.json({ data: token });
};

module.exports = {
  register,
  login,
};
