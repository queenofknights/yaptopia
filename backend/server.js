require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');

// Ensure models and relationships are registered
require('./models'); 

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test Database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database (Use { alter: true } during active dev to update schema safely)
    await sequelize.sync({ alter: true });
    console.log('Database models synced.');

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`Yaptopia Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();