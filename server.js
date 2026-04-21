require('dotenv').config();

const app = require('./app');
const { verifyDatabaseConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
	try {
		await verifyDatabaseConnection();

		const server = app.listen(PORT, () => {
			console.log(`School Management API listening on port ${PORT}`);
		});

		server.on('error', (error) => {
			console.error('Failed to start server:', error.message);
			process.exit(1);
		});
	} catch (error) {
		console.error('Startup failed:', error.message);
		process.exit(1);
	}
}

startServer();
