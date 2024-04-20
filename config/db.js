import { Sequelize } from 'sequelize';
import dotenv from "dotenv"


dotenv.config()
const sequelize = new Sequelize(process.env.DB_DATABASE, 'postgres', 'Admin', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false // Toggle based on your needs
});


const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

export { connectDB, sequelize };

