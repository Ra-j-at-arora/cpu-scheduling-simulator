import React from 'react';
import { BookOpen, Info, CheckCircle, XCircle, FileText } from 'lucide-react';

const algoInfo = {
    FCFS: {
        name: "First Come First Serve (FCFS)",
        definition: "FCFS is the simplest scheduling algorithm that schedules according to arrival times of processes.",
        working: "Processes are dispatched according to their arrival time on the ready queue. Being a non-preemptive discipline, once a process has a CPU, it runs to completion.",
        complexity: "O(N log N) for sorting by arrival, then O(N) execution.",
        advantages: ["Simple to understand and implement", "Fair, no starvation"],
        disadvantages: ["Convoy effect (short processes wait for long ones)", "Not suitable for time-sharing systems"],
        applications: "Batch processing systems",
        pseudocode: `Sort processes by arrival_time
For each process in sorted list:
  Wait until arrival_time <= current_time
  Execute process for burst_time
  current_time += burst_time`
    },
    RR: {
        name: "Round Robin (RR)",
        definition: "A preemptive process scheduling algorithm designed especially for time-sharing systems.",
        working: "A small unit of time, called a time quantum or time slice, is defined. The CPU scheduler goes around the ready queue, allocating the CPU to each process for a time interval of up to 1 time quantum.",
        complexity: "O(N) per pass.",
        advantages: ["Fairness, every process gets equal share", "Good response time for interactive processes"],
        disadvantages: ["Performance depends heavily on time quantum", "Too short quantum leads to high context switch overhead"],
        applications: "Time-sharing operating systems (Linux, Unix)",
        pseudocode: `Initialize ready_queue as Circular Linked List
While ready_queue is not empty:
  p = dequeue()
  time_executed = min(p.remaining_time, quantum)
  current_time += time_executed
  p.remaining_time -= time_executed
  If p.remaining_time > 0:
    enqueue(p)
  Else:
    Mark p as completed`
    },
    SJF: {
        name: "Shortest Job First (SJF)",
        definition: "SJF associates with each process the length of the process's next CPU burst. When the CPU is available, it is assigned to the process that has the smallest next CPU burst.",
        working: "A non-preemptive algorithm that uses a Min Heap to always select the process with the lowest burst time from the ready queue.",
        complexity: "O(N log N) using a Min Heap.",
        advantages: ["Gives minimum average waiting time for a given set of processes"],
        disadvantages: ["Cannot be implemented precisely because it's hard to predict burst time", "May cause starvation for longer processes"],
        applications: "Long-term scheduling in batch systems",
        pseudocode: `While processes are incomplete:
  Insert available processes into MinHeap based on burst_time
  If MinHeap is empty, increment time
  Else:
    p = MinHeap.extractMin()
    Execute p until completion`
    },
    SRTF: {
        name: "Shortest Remaining Time First (SRTF)",
        definition: "The preemptive version of SJF scheduling.",
        working: "If a new process arrives with a CPU burst length less than the remaining time of the currently executing process, the current process is preempted.",
        complexity: "O(N log N) with Min Heap.",
        advantages: ["Better average waiting time than SJF for arriving processes"],
        disadvantages: ["Higher context switching overhead", "Starvation of longer processes"],
        applications: "Environments where response time is critical and jobs are short",
        pseudocode: `While processes are incomplete:
  Insert available processes into MinHeap by remaining_time
  p = MinHeap.extractMin()
  Execute p for 1 time unit
  If p.remaining_time > 0:
    MinHeap.insert(p)`
    },
    Priority: {
        name: "Priority Scheduling",
        definition: "A priority is associated with each process, and the CPU is allocated to the process with the highest priority.",
        working: "Uses a Max Heap to keep track of highest priority. Can be preemptive or non-preemptive.",
        complexity: "O(N log N) with Max Heap.",
        advantages: ["Important processes get CPU first"],
        disadvantages: ["Indefinite blocking / starvation for low priority processes (solved by aging)"],
        applications: "Real-time operating systems",
        pseudocode: `While processes are incomplete:
  Insert available into MaxHeap based on Priority
  p = MaxHeap.extractMax()
  Execute p (preempt if higher priority arrives)
  Update remaining_time`
    },
    LJF: {
        name: "Longest Job First (LJF)",
        definition: "LJF assigns the CPU to the process with the largest burst time.",
        working: "Non-preemptive algorithm that uses a Max Heap based on burst time.",
        complexity: "O(N log N).",
        advantages: ["No process can dominate CPU forever if they eventually finish"],
        disadvantages: ["Terrible average waiting time", "Short processes starve"],
        applications: "Very specific niche processing where large tasks must complete first",
        pseudocode: `Same as SJF but use MaxHeap based on burst_time`
    },
    LRTF: {
        name: "Longest Remaining Time First (LRTF)",
        definition: "The preemptive version of Longest Job First.",
        working: "Always picks the process with the maximum remaining time. Often leads to processes executing in parallel-like fashion since they swap every tick.",
        complexity: "O(N log N).",
        advantages: ["Fair in terms of keeping all processes progressing"],
        disadvantages: ["Extreme context switching overhead", "Very poor turnaround times"],
        applications: "Theoretical study, rarely used practically",
        pseudocode: `Same as SRTF but use MaxHeap based on remaining_time`
    },
    FCLS: {
        name: "First Come Last Served (FCLS) / LIFO",
        definition: "A scheduling algorithm where the newest process gets the CPU first.",
        working: "Implemented using a Stack (Last In First Out). Non-preemptive.",
        complexity: "O(N).",
        advantages: ["Favors newest jobs, ensuring rapid response to latest requests"],
        disadvantages: ["Oldest processes can starve completely if new ones keep arriving"],
        applications: "Certain interrupt handling or sub-task systems",
        pseudocode: `While processes are incomplete:
  Push available processes to Stack
  p = Stack.pop()
  Execute p until completion`
    }
};

export default function EducationalPage() {
    const [selected, setSelected] = React.useState('FCFS');
    const info = algoInfo[selected];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h1 className="text-2xl font-black text-gray-800 dark:text-white flex items-center mb-6">
                    <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
                    Educational Mode
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
                    {Object.keys(algoInfo).map(key => (
                        <button
                            key={key}
                            onClick={() => setSelected(key)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                                selected === key 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {key}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{info.name}</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                {info.definition}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                                <Info className="w-4 h-4 mr-2" /> Working Mechanism
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{info.working}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Time Complexity</h3>
                            <code className="bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg text-sm font-mono text-purple-600 dark:text-purple-400 border border-gray-200 dark:border-gray-700">
                                {info.complexity}
                            </code>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Real-world Application</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{info.applications}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-800/30">
                            <h3 className="text-sm font-bold text-green-700 dark:text-green-500 uppercase tracking-wider mb-3 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" /> Advantages
                            </h3>
                            <ul className="space-y-2">
                                {info.advantages.map((adv, i) => (
                                    <li key={i} className="text-sm text-green-800 dark:text-green-300 flex items-start">
                                        <span className="mr-2 mt-1">•</span> {adv}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-800/30">
                            <h3 className="text-sm font-bold text-red-700 dark:text-red-500 uppercase tracking-wider mb-3 flex items-center">
                                <XCircle className="w-4 h-4 mr-2" /> Disadvantages
                            </h3>
                            <ul className="space-y-2">
                                {info.disadvantages.map((dis, i) => (
                                    <li key={i} className="text-sm text-red-800 dark:text-red-300 flex items-start">
                                        <span className="mr-2 mt-1">•</span> {dis}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-inner">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                <FileText className="w-4 h-4 mr-2" /> Pseudocode
                            </h3>
                            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                                {info.pseudocode}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
