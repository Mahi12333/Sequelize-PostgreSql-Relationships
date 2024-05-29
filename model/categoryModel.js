

import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const Category = sequelize.define('Category', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      createdAt: {
      
        type: DataTypes.DATE
      },
      updatedAt: {
      
        type: DataTypes.DATE
      }
},{
    tableName: 'tbl_category_details',
    timestamps: true,
});


// Category.sync({force:true});
export default Category;