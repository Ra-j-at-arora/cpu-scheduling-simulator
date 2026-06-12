const express = require('express');
const cors = require('cors');
const simulateRoutes = require('./src/routes/simulate.routes');
const benchmarkRoutes = require('./src/routes/benchmark.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/simulate', simulateRoutes);
app.use('/benchmark', benchmarkRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
