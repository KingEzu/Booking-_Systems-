import mongoose from "mongoose";

const  upcomingSchema = new mongoose.Schema(
    {
        _id:{
            type: String,
            required:true
        },
        title: {
            type: String, required:true
        },
        backdrop_path: {
            type: String, required:true
        },  
        release_date: {
            type: String, required:true
        },
        language: {
            type: String
        },
        genres: {
            type: Array, required: true
        },
        casts: {
            type: Array, required: true
        },
        runtime: {
            type: Number, required: true
        },
        
    }
)