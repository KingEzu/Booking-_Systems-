import axios from "axios"
import { err } from "inngest/types";

export const getNowPlayingMovies = async (req, res)=>{
    try{
       const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing',{
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`

            }
        })
        const movies = data.results;
        res.json({success: true, movies: movies})
        
    }catch(error){
        console.error(error);
        res.json({success: false, message: error.message})

    }
    
}


//api to add a new show

export const addShow = async (req, res) =>{
    try{
        const {movieId, showInput, ShowPrice} =req.body

        let movie = await Movie.findById(movieId)

    }catch(error){
        console.error(error);
        res.json({success: false, message:error.message})
    }
}