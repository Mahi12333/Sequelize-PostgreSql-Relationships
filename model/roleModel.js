import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const Role = sequelize.define('Role', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      }
},{
    tableName: 'tbl_role',
    timestamps: false,
});

// Role.sync({force:true});

export default Role;