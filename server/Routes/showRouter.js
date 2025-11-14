import  express  from 'express';
import { getNowPlayingMovies } from '../controllers/showControllers.js';

const showRouter = express.Router();
showRouter.get('/now-playing', getNowPlayingMovies) 


export default showRouter;


//http://localhost:3000/api/show/now-playing