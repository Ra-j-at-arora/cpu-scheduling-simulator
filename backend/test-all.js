const http = require('http');

const processes = [
    {pid:'P1', arrivalTime:0, burstTime:5, priority:1},
    {pid:'P2', arrivalTime:1, burstTime:3, priority:2},
    {pid:'P3', arrivalTime:2, burstTime:1, priority:3}
];

const algos = ['fcfs', 'rr', 'sjf', 'srtf', 'priority', 'priority_p', 'ljf', 'lrtf', 'fcls'];

async function run() {
    for (let algo of algos) {
        console.log(`Testing ${algo}...`);
        await new Promise((resolve, reject) => {
            const req = http.request(`http://localhost:5000/simulate/${algo}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    console.log(`Success ${algo}`);
                    resolve();
                });
            });
            req.on('error', reject);
            let body = { processes };
            if (algo === 'rr') body.timeQuantum = 2;
            if (algo === 'priority_p') body.isPreemptive = true;
            req.write(JSON.stringify(body));
            req.end();
        });
    }
}
run().catch(console.error);
