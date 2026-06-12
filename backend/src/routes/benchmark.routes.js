const express = require('express');
const { simulateFCFS } = require('../algorithms/fcfs');
const { simulateRR } = require('../algorithms/rr');
const { simulateSJF } = require('../algorithms/sjf');
const { simulateSRTF } = require('../algorithms/srtf');
const { simulatePriority } = require('../algorithms/priority');
const { simulateLJF } = require('../algorithms/ljf');
const { simulateLRTF } = require('../algorithms/lrtf');
const { simulateFCLS } = require('../algorithms/fcls');

const routerInstance = express.Router();

const generateProcesses = (num) => {
    const processes = [];
    for (let i = 0; i < num; i++) {
        processes.push({
            pid: `P${i + 1}`,
            arrivalTime: Math.floor(Math.random() * num),
            burstTime: Math.floor(Math.random() * 20) + 1,
            priority: Math.floor(Math.random() * 10) + 1
        });
    }
    return processes;
};

routerInstance.post('/', (req, res) => {
    const { sizes = [100, 500, 1000] } = req.body;
    
    const algos = [
        { id: 'FCFS', func: simulateFCFS },
        { id: 'RR', func: (p) => simulateRR(p, 2) },
        { id: 'SJF', func: simulateSJF },
        { id: 'SRTF', func: simulateSRTF },
        { id: 'Priority (NP)', func: (p) => simulatePriority(p, false) },
        { id: 'Priority (P)', func: (p) => simulatePriority(p, true) },
        { id: 'LJF', func: simulateLJF },
        { id: 'LRTF', func: simulateLRTF },
        { id: 'FCLS', func: simulateFCLS },
    ];

    const results = [];

    for (const size of sizes) {
        const processes = generateProcesses(size);
        
        const sizeResult = { size };
        
        for (const algo of algos) {
            const start = process.hrtime.bigint();
            
            try {
                algo.func(processes);
            } catch (e) {
                console.error(`Error in ${algo.id} for size ${size}:`, e);
            }

            const end = process.hrtime.bigint();
            const durationMs = Number(end - start) / 1000000.0;
            
            sizeResult[algo.id] = parseFloat(durationMs.toFixed(2));
        }
        
        results.push(sizeResult);
    }

    res.json(results);
});

module.exports = routerInstance;
