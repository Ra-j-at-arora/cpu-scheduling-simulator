const Queue = require('../datastructures/Queue');
const EventTypes = require('../engine/EventTypes');
const MetricsCalculator = require('../engine/MetricsCalculator');

function simulateFCFS(processesInput) {
    const processes = JSON.parse(JSON.stringify(processesInput));
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const timeline = [];
    const ganttChart = [];
    const readyQueue = new Queue();
    
    let currentTime = 0;
    let completedCount = 0;
    const n = processes.length;
    let processIndex = 0;
    let contextSwitches = 0;
    
    const completedProcesses = [];
    let runningProcess = null;

    while (completedCount < n) {
        // Find next event time:
        // Either the next arrival, or the completion of the running process.
        let nextEventTime = Infinity;
        if (processIndex < n) {
            nextEventTime = Math.min(nextEventTime, processes[processIndex].arrivalTime);
        }
        if (runningProcess !== null) {
            nextEventTime = Math.min(nextEventTime, currentTime + runningProcess.remainingTime);
        }

        // If CPU is idle and no processes are arriving exactly now, jump to next arrival
        if (runningProcess === null && readyQueue.isEmpty() && processIndex < n) {
            if (currentTime < nextEventTime) {
                timeline.push({
                    time: currentTime,
                    type: EventTypes.IDLE,
                    process: null,
                    queueState: readyQueue.toArray(),
                    runningProcess: null
                });
                currentTime = nextEventTime;
            }
        } else if (currentTime < nextEventTime && runningProcess !== null) {
            // Fast forward execution
            runningProcess.remainingTime -= (nextEventTime - currentTime);
            currentTime = nextEventTime;
        }

        // Process Arrivals
        while (processIndex < n && processes[processIndex].arrivalTime === currentTime) {
            const p = processes[processIndex];
            p.remainingTime = p.burstTime;
            readyQueue.enqueue(p);
            timeline.push({
                time: currentTime,
                type: EventTypes.ARRIVAL,
                process: { ...p },
                queueState: readyQueue.toArray(),
                runningProcess: runningProcess ? { ...runningProcess } : null
            });
            processIndex++;
        }

        // Process Completion
        if (runningProcess !== null && runningProcess.remainingTime === 0) {
            runningProcess.completionTime = currentTime;
            completedProcesses.push({ ...runningProcess });
            
            timeline.push({
                time: currentTime,
                type: EventTypes.COMPLETE,
                process: { ...runningProcess },
                queueState: readyQueue.toArray(),
                runningProcess: null
            });
            
            ganttChart.push({
                pid: runningProcess.pid,
                startTime: runningProcess.startTime,
                endTime: runningProcess.completionTime
            });

            runningProcess = null;
            completedCount++;
        }

        // Dequeue and Execute
        if (runningProcess === null && !readyQueue.isEmpty()) {
            runningProcess = readyQueue.dequeue();
            if (runningProcess.startTime === undefined) {
                runningProcess.startTime = currentTime;
            }
            
            timeline.push({
                time: currentTime,
                type: EventTypes.EXECUTE,
                process: { ...runningProcess },
                queueState: readyQueue.toArray(),
                runningProcess: { ...runningProcess }
            });

            if (completedCount > 0 || currentTime > 0) {
                 contextSwitches++;
            }
        }
    }

    const fullGantt = [];
    let lastTime = 0;
    for (let g of ganttChart) {
        if (g.startTime > lastTime) {
            fullGantt.push({ pid: 'IDLE', startTime: lastTime, endTime: g.startTime });
        }
        fullGantt.push(g);
        lastTime = g.endTime;
    }

    const { processStats, averages } = MetricsCalculator.calculateMetrics(completedProcesses);

    return {
        timeline,
        ganttChart: fullGantt,
        metrics: { ...averages, contextSwitches },
        processStatistics: processStats
    };
}

module.exports = { simulateFCFS };
