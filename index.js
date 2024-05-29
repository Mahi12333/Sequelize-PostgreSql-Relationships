import  express  from "express";
import path from "path"
import dotenv from "dotenv"
import cors from "cors"
import {connectDB, sequelize} from "./config/db.js";
import userRoutes from './routes/userRouter.js';
import cookieParser from "cookie-parser";
import postRoutes from './routes/postRoute.js';
import testRoutes from './routes/testRoute.js';
import commentRoutes from './routes/commentRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import addressRoutes from './routes/addressRoute.js';
import postCategoryRoutes from './routes/postCategoryRoute.js'


dotenv.config()




const port = process.env.PORT || 5000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
connectDB()

app.use(cookieParser());


app.use(cors())

app.use('/api/users', userRoutes);
app.use('/api/users',postRoutes);
app.use('/api/users',testRoutes);
app.use('/api/users',commentRoutes)
app.use('/api/users',categoryRoutes);
app.use('/api/users',addressRoutes);
app.use('/api/users',postCategoryRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// if (process.env.NODE_ENV === 'development') {
//     const __dirname = path.resolve();
//     app.use(express.static(path.join(__dirname, 'frontend/dist')))
//     app.get('*' , (req, res) => res.sendFile(path.resolve(__dirname, 'frontend' , 'dist', 'index.html')));
// }
// else{
    // app.get('*', (res,req) => res.send('Server is ready'));
// }




// sequelize.sync()

app.listen(port , () => console.log(`Server started on port ${port}`));

// /zassj