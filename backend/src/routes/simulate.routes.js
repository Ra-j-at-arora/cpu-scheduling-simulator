const express = require('express');
const { simulateFCFS } = require('../algorithms/fcfs');
const { simulateRR } = require('../algorithms/rr');
const { simulateSJF } = require('../algorithms/sjf');
const { simulateSRTF } = require('../algorithms/srtf');
const { simulatePriority } = require('../algorithms/priority');
const { simulateLJF } = require('../algorithms/ljf');
const { simulateLRTF } = require('../algorithms/lrtf');
const { simulateFCLS } = require('../algorithms/fcls');

const router = express.Router();

const handleSimulation = (algorithmFunc) => (req, res) => {
    try {
        const { processes, timeQuantum, isPreemptive } = req.body;
        if (!processes || !Array.isArray(processes)) {
            return res.status(400).json({ error: 'Invalid input: processes array is required.' });
        }
        let result;
        if (algorithmFunc === simulateRR) {
            result = algorithmFunc(processes, timeQuantum);
        } else if (algorithmFunc === simulatePriority) {
            result = algorithmFunc(processes, isPreemptive);
        } else {
            result = algorithmFunc(processes);
        }
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error during simulation' });
    }
};

router.post('/fcfs', handleSimulation(simulateFCFS));
router.post('/rr', handleSimulation(simulateRR));
router.post('/sjf', handleSimulation(simulateSJF));
router.post('/srtf', handleSimulation(simulateSRTF));
router.post('/priority', handleSimulation(simulatePriority));
router.post('/ljf', handleSimulation(simulateLJF));
router.post('/lrtf', handleSimulation(simulateLRTF));
router.post('/fcls', handleSimulation(simulateFCLS));

module.exports = router;
