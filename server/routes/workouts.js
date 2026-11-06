
import express from "express";
import jwt from "jsonwebtoken";
import Workout from "../models/Workout.js";

const router = express.Router();

// Verify logged-in user
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};

// SAVE WORKOUT
router.post("/", protect, async (req, res) => {
  try {
    const {
      exerciseName,
      muscleGroup,
      sets,
      reps,
      duration,
      weight
    } = req.body;

    if (!exerciseName || !sets || !reps) {
      return res.status(400).json({
        message: "Exercise name, sets and reps are required."
      });
    }

    const workout = await Workout.create({
      user: req.userId,
      exerciseName,
      muscleGroup,
      sets,
      reps,
      duration,
      weight
    });

    res.status(201).json({
      message: "Workout saved successfully!",
      workout
    });
  } catch (error) {
    console.error("Save workout error:", error.message);
    res.status(500).json({
      message: "Could not save workout."
    });
  }
});

// GET USER WORKOUT HISTORY
router.get("/", protect, async (req, res) => {
  try {
    const workouts = await Workout.find({
      user: req.userId
    }).sort({ completedAt: -1 });

    res.json({
      message: "Workout history fetched successfully!",
      count: workouts.length,
      workouts
    });
  } catch (error) {
    console.error("Workout history error:", error.message);
    res.status(500).json({
      message: "Could not fetch workout history."
    });
  }
});

export default router;
