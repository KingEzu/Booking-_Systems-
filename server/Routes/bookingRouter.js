import express from "express";
import { createBooking, getOccupidesSeats } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupidesSeats)

export default bookingRouter;