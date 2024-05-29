# Sequelize-PostgreSQL-Relationships

This project demonstrates how to implement one-to-one, one-to-many, and many-to-many relationships using Sequelize ORM with PostgreSQL.

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM

## Prerequisites
- Node.js (v14 or above)
- PostgreSQL
- npm (Node Package Manager)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Mahi12333/Sequelize-PostgreSql-Relationships.git
    cd Sequelize-PostgreSql-Relationships
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up your PostgreSQL database and update the `config/db.js` file with your database credentials.

4. Run the Sequelize migrations:
    ```sh
    npx sequelize-cli db:migrate
    ```

## Relationships Overview

### One-to-One Relationship
- **User** has one **Address**.
- **Address** belongs to **User**.

```js
User.hasOne(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });
