const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 7,
      acquire: 2000,
      idle: 10000,
    },
  }
);

export const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    await sequelize.sync({ alter: true });
    console.log("Tables synced!");
  } catch (error) {
    console.error("Unable to start server:", error);
  }
};
export default sequelize;
