import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const User = sequelize.define('User', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      createdAt: {
       
        type: DataTypes.DATE
      },
      updatedAt: {
        
        type: DataTypes.DATE
      }
},{
    tableName: 'tbl_user_details',
    timestamps: true,
});



// User.sync({force:true});
export default User;