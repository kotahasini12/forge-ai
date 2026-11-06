
import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    exerciseName: {
      type: String,
      required: true,
      trim: true
    },

    muscleGroup: {
      type: String,
      default: "General"
    },

    sets: {
      type: Number,
      required: true,
      min: 1
    },

    reps: {
      type: Number,
      required: true,
      min: 1
    },

    duration: {
      type: Number,
      default: 0,
      min: 0
    },

    weight: {
      type: Number,
      default: 0,
      min: 0
    },

    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
