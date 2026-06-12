const CircularLinkedList = require('../datastructures/CircularLinkedList');
const EventTypes = require('../engine/EventTypes');
const MetricsCalculator = require('../engine/MetricsCalculator');

function simulateRR(processesInput, timeQuantumInput = 2) {
    const timeQuantum = parseInt(timeQuantumInput, 10) || 2;
    const processes = JSON.parse(JSON.stringify(processesInput));
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const timeline = [];
    const ganttChart = [];
    const readyQueue = new CircularLinkedList();
    
    let currentTime = 0;
    let completedCount = 0;
    const n = processes.length;
    let processIndex = 0;
    let contextSwitches = 0;
    
    const completedProcesses = [];
    let runningProcess = null;
    let currentSlice = 0;
    let currentBlockStart = 0;

    while (completedCount < n) {
        // Find next event time
        let nextArrival = processIndex < n ? processes[processIndex].arrivalTime : Infinity;
        let runningEvent = Infinity;
        
        if (runningProcess !== null) {
            // Either it finishes, or its time slice expires
            const timeToFinish = runningProcess.remainingTime;
            const timeToSliceEnd = timeQuantum - currentSlice;
            runningEvent = currentTime + Math.min(timeToFinish, timeToSliceEnd);
        }

        let nextEventTime = Math.min(nextArrival, runningEvent);

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
            const timeAdvanced = nextEventTime - currentTime;
            runningProcess.remainingTime -= timeAdvanced;
            currentSlice += timeAdvanced;
            currentTime = nextEventTime;
        }

        // Handle Arrivals
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

        if (runningProcess !== null) {
            // Check completion
            if (runningProcess.remainingTime === 0) {
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
            // Check preemption (time slice expired)
            else if (currentSlice === timeQuantum) {
                // Preempt only if queue is not empty, otherwise just reset slice
                if (!readyQueue.isEmpty()) {
                    readyQueue.enqueue(runningProcess);
                    timeline.push({
                        time: currentTime,
                        type: EventTypes.PREEMPT,
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
                    contextSwitches++;
                } else {
                    currentSlice = 0; // continue execution
                }
            }
        }

        // Start next process
        if (runningProcess === null && !readyQueue.isEmpty()) {
            runningProcess = readyQueue.dequeue();
            if (runningProcess.startTime === undefined) {
                runningProcess.startTime = currentTime;
            }
            currentBlockStart = currentTime;
            currentSlice = 0;
            
            timeline.push({
                time: currentTime,
                type: EventTypes.EXECUTE,
                process: { ...runningProcess },
                queueState: readyQueue.toArray(),
                runningProcess: { ...runningProcess }
            });
            
            // Context switch counting for initial start isn't always counted as a switch, 
            // but for simplicity we count every DEQUEUE -> EXECUTE as a switch or just track preemption switches.
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

module.exports = { simulateRR };
