import { Sequelize } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();


const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging:true
  
});


const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully zaid.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

export { connectDB, sequelize };

