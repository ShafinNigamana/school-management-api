const express = require('express');
const cors = require('cors');
const schoolRoutes = require('./routes/schoolRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
	res.status(200).json({ success: true, message: 'API is running' });
});

app.use('/api', schoolRoutes);
app.use(errorHandler);

module.exports = app;
