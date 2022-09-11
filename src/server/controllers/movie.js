const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwtSecret = "mysecret";

const getAllMovies = async (req, res) => {
  const movies = await prisma.movie.findMany();

  res.json({ data: movies });
};

const createMovie = async (req, res) => {
  const { title, description, runtimeMins } = req.body;

  try {
    const [_, token] = req.get("Authorization").split("");
    const decoded = jwt.verify(token, jwtSecret);
    const user = await prisma.user.findUnique({
      where: { username: decoded.username },
    });

    if (user) {
      const createdMovie = await prisma.movie.create({
        data: { title, description, runtimeMins },
      });
      res.json({ created: createdMovie });
    }
    // todo verify the token
  } catch (e) {
    return res.status(401).json({ error: "Invalid token provided." });
  }

  const createdMovie = null;

  res.json({ data: createdMovie });
};

module.exports = {
  getAllMovies,
  createMovie,
};
