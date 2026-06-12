class MetricsCalculator {
    static calculateMetrics(processes) {
        let totalWT = 0;
        let totalTAT = 0;
        let totalRT = 0;
        let totalExecutionTime = 0;
        let maxCompletionTime = 0;
        const n = processes.length;

        const processStats = processes.map(p => {
            const tat = p.completionTime - p.arrivalTime;
            const wt = tat - p.burstTime;
            // responseTime assumes p.startTime is recorded when first EXECUTE event for this process happens
            const rt = p.startTime !== undefined ? p.startTime - p.arrivalTime : wt; 

            totalWT += wt;
            totalTAT += tat;
            totalRT += rt;
            totalExecutionTime += p.burstTime;
            if (p.completionTime > maxCompletionTime) {
                maxCompletionTime = p.completionTime;
            }

            return {
                pid: p.pid,
                arrivalTime: p.arrivalTime,
                burstTime: p.burstTime,
                priority: p.priority,
                completionTime: p.completionTime,
                waitingTime: wt,
                turnaroundTime: tat,
                responseTime: rt
            };
        });

        const avgWT = totalWT / n;
        const avgTAT = totalTAT / n;
        const avgRT = totalRT / n;
        // Total time from min arrival to max completion
        const minArrival = Math.min(...processes.map(p => p.arrivalTime));
        const totalTime = maxCompletionTime - minArrival;
        
        const cpuUtilization = totalTime === 0 ? 0 : (totalExecutionTime / totalTime) * 100;
        const throughput = totalTime === 0 ? 0 : n / totalTime;

        return {
            processStats,
            averages: {
                avgWT,
                avgTAT,
                avgRT,
                cpuUtilization,
                throughput
            }
        };
    }
}

module.exports = MetricsCalculator;
