const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

//CREATE

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      // res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//UPDATE

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//DELETE

router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("The movie has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//GET

router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET

router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let movie = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        movie = await Movie.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        movie = await Movie.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      movie = await Movie.find();
      res.status(200).json(movie);
    }
  } catch (err) {
    // res.status(500).json(err);
  }
});

//GET RANDOM

router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        // { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        // { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
    // res.status(500).json(err);
  }
});

// GET RANDOM BY GENRE
router.get("/random/genre", verify, async (req, res) => {
  const genre = req.query.genre;
  let movie;
  try {
    if (genre) {
      movie = await Movie.aggregate([{ $match: { genre: genre } }]);
    } else {
      movie = await Movie.find();
    }
    res.status(200).json(movie);
  } catch (err) {
    throw err;
  }
});

//GET ALL

router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

module.exports = router;
