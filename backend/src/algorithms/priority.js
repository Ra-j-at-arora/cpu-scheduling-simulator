const MaxHeap = require('../datastructures/MaxHeap');
const EventTypes = require('../engine/EventTypes');
const MetricsCalculator = require('../engine/MetricsCalculator');

function simulatePriority(processesInput, isPreemptive = false) {
    const processes = JSON.parse(JSON.stringify(processesInput));
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const timeline = [];
    const ganttChart = [];
    
    // Priority: Larger number means higher priority. Tie-breaker: earliest arrival.
    const readyQueue = new MaxHeap((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority > b.priority;
        }
        return a.arrivalTime < b.arrivalTime; // Earliest arrival wins tie
    });
    
    let currentTime = 0;
    let completedCount = 0;
    const n = processes.length;
    let processIndex = 0;
    let contextSwitches = 0;
    
    const completedProcesses = [];
    let runningProcess = null;
    let currentBlockStart = 0;

    while (completedCount < n) {
        let nextArrival = processIndex < n ? processes[processIndex].arrivalTime : Infinity;
        let runningCompletion = runningProcess !== null ? currentTime + runningProcess.remainingTime : Infinity;
        
        let nextEventTime = Math.min(nextArrival, runningCompletion);

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
            runningProcess.remainingTime -= (nextEventTime - currentTime);
            currentTime = nextEventTime;
        }

        let arrivalsOccurred = false;
        while (processIndex < n && processes[processIndex].arrivalTime === currentTime) {
            const p = processes[processIndex];
            p.remainingTime = p.burstTime;
            // Default priority if missing
            if (p.priority === undefined) p.priority = 1;
            readyQueue.insert(p);
            timeline.push({
                time: currentTime,
                type: EventTypes.ARRIVAL,
                process: { ...p },
                queueState: readyQueue.toArray(),
                runningProcess: runningProcess ? { ...runningProcess } : null
            });
            processIndex++;
            arrivalsOccurred = true;
        }

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
                startTime: currentBlockStart,
                endTime: currentTime
            });

            runningProcess = null;
            completedCount++;
        }

        // Preemption
        if (isPreemptive && runningProcess !== null && arrivalsOccurred) {
            const peekNext = readyQueue.peek();
            if (peekNext && peekNext.priority > runningProcess.priority) {
                readyQueue.insert(runningProcess);
                timeline.push({
                    time: currentTime,
                    type: EventTypes.PREEMPT,
                    process: { ...runningProcess },
                    queueState: readyQueue.toArray(),
                    runningProcess: null
                });
                
                if (currentTime > currentBlockStart) {
                    ganttChart.push({
                        pid: runningProcess.pid,
                        startTime: currentBlockStart,
                        endTime: currentTime
                    });
                }
                
                runningProcess = null;
                contextSwitches++;
            }
        }

        if (runningProcess === null && !readyQueue.isEmpty()) {
            runningProcess = readyQueue.extractMax();
            if (runningProcess.startTime === undefined) {
                runningProcess.startTime = currentTime;
            }
            currentBlockStart = currentTime;
            
            timeline.push({
                time: currentTime,
                type: EventTypes.EXECUTE,
                process: { ...runningProcess },
                queueState: readyQueue.toArray(),
                runningProcess: { ...runningProcess }
            });
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

module.exports = { simulatePriority };
