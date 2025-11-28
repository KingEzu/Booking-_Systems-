import mongoose from "mongoose";
import { type } from "os";

const reserveSchema = new mongoose.Schema({
    SenderName:{
        type: String,
        minLength: [2, "Name must contain at least 2 character"],
    },
    email:{
        type: String,

    },
    phone: {
        type: Number,

    },
    events: {
        type: String,
        enum: ["Business Meetings" || "Private Screening" || "School Package" || "Special Events" || "Corporate Celebrations" || "Movies" ]

    },    
    message:{
        type: String,
    },

    ReservedDate:{
        type: Date
    },
     createdAt:{
        type: Date,
        default: Date.now(), 
    },

},
  { timestamps: true }
)