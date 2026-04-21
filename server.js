require('dotenv').config();

const app = require('./app');
const { verifyDatabaseConnection } = require('./config/db');

const port = Number(process.env.PORT) || 5000;

async function startServer() {
	try {
		await verifyDatabaseConnection();

		const server = app.listen(port, () => {
			console.log(`School Management API listening on port ${port}`);
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
