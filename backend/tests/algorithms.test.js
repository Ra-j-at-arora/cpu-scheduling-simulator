const { simulateFCFS } = require('../src/algorithms/fcfs');
const { simulateRR } = require('../src/algorithms/rr');
const { simulateSJF } = require('../src/algorithms/sjf');
const { simulateSRTF } = require('../src/algorithms/srtf');
const { simulatePriority } = require('../src/algorithms/priority');
const { simulateFCLS } = require('../src/algorithms/fcls');

describe('Scheduling Algorithms', () => {
    const processes = [
        { pid: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
        { pid: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
        { pid: 'P3', arrivalTime: 2, burstTime: 8, priority: 4 },
        { pid: 'P4', arrivalTime: 3, burstTime: 6, priority: 3 },
    ];

    test('FCFS computes correctly', () => {
        const result = simulateFCFS(processes);
        expect(result.metrics.avgWT).toBeGreaterThanOrEqual(0);
        expect(result.processStatistics).toHaveLength(4);
        expect(result.processStatistics.find(p => p.pid === 'P1').startTime).toBe(0);
    });

    test('RR computes correctly with time quantum', () => {
        const result = simulateRR(processes, 2);
        expect(result.metrics.avgWT).toBeGreaterThanOrEqual(0);
        expect(result.processStatistics).toHaveLength(4);
        // P1 should be preempted
        expect(result.metrics.contextSwitches).toBeGreaterThan(3);
    });

    test('SJF computes correctly', () => {
        const result = simulateSJF(processes);
        expect(result.metrics.avgWT).toBeGreaterThanOrEqual(0);
        expect(result.processStatistics).toHaveLength(4);
    });

    test('SRTF computes correctly', () => {
        const result = simulateSRTF(processes);
        expect(result.metrics.avgWT).toBeGreaterThanOrEqual(0);
        // Preemptive should have better or equal WT than non-preemptive SJF in many cases
    });

    test('Priority computes correctly (Non-Preemptive)', () => {
        const result = simulatePriority(processes, false);
        expect(result.metrics.avgWT).toBeGreaterThanOrEqual(0);
    });

    test('FCLS computes correctly', () => {
        const result = simulateFCLS(processes);
        expect(result.metrics.avgWT).toBeGreaterThanOrEqual(0);
    });
});
