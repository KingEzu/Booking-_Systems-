import express from "express";
import {
  addUpcoming,
  deleteUpcoming,
  getUpcomingById,
  getUpcomings,
} from "../controllers/upcomingController.js"; // make sure to include .js for ES modules
import { protectAdmin } from "../middleware/auth.js";

const upcomingRouter = express.Router();

// Add new upcoming movie
upcomingRouter.post("/add",protectAdmin, addUpcoming);

// Get all upcoming movies
upcomingRouter.get("/get-upcomings", getUpcomings);

upcomingRouter.get("/get-Upcoming/:id", getUpcomingById);

// Delete specific upcoming movie by ID
upcomingRouter.delete("/delete/:id", protectAdmin, deleteUpcoming);

export default upcomingRouter;
