import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import {authorizeModification} from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = express.Router();

router.use(authenticate); // ← Semua route di bawah ini butuh autentikasi

// ─────────────────────────────────────────
// GET /api/watchlist/:userId
// Mengambil semua film dalam watchlist milik seorang user
// ─────────────────────────────────────────
router.get("/:userId",  (req, res) => {
  const userId = Number(req.params.userId);

  const watchlist = getWatchlist(userId);

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(watchlist);
});

// ─────────────────────────────────────────
// POST /api/watchlist/:userId/movies
// Menambahkan film baru ke watchlist user
// ─────────────────────────────────────────
router.post("/:userId/movies", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const { title, genre } = req.body;

  if (!title || !genre) {
    return res.status(400).json({ error: "title and genre are required" });
  }

  const movie = addMovie(userId, { title, genre });

  if (movie === null) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(201).json(movie);
});

// ─────────────────────────────────────────
// PUT /api/watchlist/:userId/movies/:movieId
// Mengupdate data film (misalnya menandai sudah ditonton)
// ─────────────────────────────────────────
router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);
  const updates = req.body;

  const updated = updateMovie(userId, movieId, updates);

  if (updated === null) {
    return res.status(404).json({ error: "Movie or user not found" });
  }

  res.json(updated);
});

// ─────────────────────────────────────────
// DELETE /api/watchlist/:userId/movies/:movieId
// Menghapus film dari watchlist
// ─────────────────────────────────────────
router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);

  const result = deleteMovie(userId, movieId);

  if (result === null) {
    return res.status(404).json({ error: "Movie or user not found" });
  }

  res.json({ message: "Movie deleted successfully" });
});

export default router;
