import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const PostCategory = sequelize.define('PostCategory', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      postId: {
        type: DataTypes.INTEGER
      },
      categoryId: {
        type: DataTypes.INTEGER
      }
},{
    tableName: 'tbl_postCategory',
    timestamps: false,
});

// PostCategory.sync({force:true});

export default PostCategory;