const MaxHeap = require('../datastructures/MaxHeap');
const EventTypes = require('../engine/EventTypes');
const MetricsCalculator = require('../engine/MetricsCalculator');

function simulateLRTF(processesInput) {
    const processes = JSON.parse(JSON.stringify(processesInput));
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const timeline = [];
    const ganttChart = [];
    
    // LRTF prioritizes longest remaining time, then earliest arrival
    const readyQueue = new MaxHeap((a, b) => {
        if (a.remainingTime !== b.remainingTime) {
            return a.remainingTime > b.remainingTime;
        }
        return a.arrivalTime < b.arrivalTime;
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
            // Because LRTF is preemptive and remaining time changes, 
            // another process might become longer than runningProcess!
            // Wait, if runningProcess time decreases, the process in the queue might have MORE time remaining.
            // So we MUST check tick by tick when there's someone in the queue!
            // If the queue is empty, we can jump to nextArrival.
            // If the queue is not empty, we can only jump by (runningTime - maxRemainingTimeInQueue) or 1 tick.
            // For true LRTF, preemption happens exactly when runningProcess.remainingTime < readyQueue.peek().remainingTime.
            
            if (!readyQueue.isEmpty()) {
                const maxQueueRT = readyQueue.peek().remainingTime;
                // If runningProcess currently has >= maxQueueRT, it can run until it drops below maxQueueRT.
                // It drops below when: runningProcess.remainingTime - timeElapsed < maxQueueRT 
                // => timeElapsed > runningProcess.remainingTime - maxQueueRT.
                // Preemption occurs at: timeElapsed = runningProcess.remainingTime - maxQueueRT + 1 (since we want strictly less? Usually strictly less, wait, tie breaker is arrival time).
                // Let's use tick-by-tick for LRTF execution phase when queue has items, it's safer and LRTF isn't used for massive bursts anyway.
                // Actually, let's optimize:
                let timeToPreempt = runningProcess.remainingTime - maxQueueRT;
                // If tie breaker favors earliest arrival, and runningProcess arrived earlier, it wins ties, so it needs to go below.
                // If runningProcess arrived later, it loses ties, so it needs to hit equal.
                if (runningProcess.arrivalTime > readyQueue.peek().arrivalTime) {
                    // Loses tie, preempts when equal
                } else {
                    // Wins tie, preempts when strictly less
                    timeToPreempt += 1;
                }
                
                if (timeToPreempt <= 0) timeToPreempt = 1; // Safeguard

                nextEventTime = Math.min(currentTime + timeToPreempt, nextEventTime);
            }
            
            runningProcess.remainingTime -= (nextEventTime - currentTime);
            currentTime = nextEventTime;
        }

        let arrivalsOccurred = false;
        while (processIndex < n && processes[processIndex].arrivalTime === currentTime) {
            const p = processes[processIndex];
            p.remainingTime = p.burstTime;
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

        // PREEMPTION LOGIC
        // Preempt if there's an arrival OR if execution made runningProcess shorter than queue max
        if (runningProcess !== null) {
            const peekNext = readyQueue.peek();
            if (peekNext) {
                let shouldPreempt = false;
                if (peekNext.remainingTime > runningProcess.remainingTime) {
                    shouldPreempt = true;
                } else if (peekNext.remainingTime === runningProcess.remainingTime) {
                    if (peekNext.arrivalTime < runningProcess.arrivalTime) {
                        shouldPreempt = true;
                    }
                }

                if (shouldPreempt) {
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

            if (completedCount > 0 || currentTime > 0) {
                 if (contextSwitches === 0 && completedCount === 0) {
                     contextSwitches++;
                 } else {
                     contextSwitches++;
                 }
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

module.exports = { simulateLRTF };
