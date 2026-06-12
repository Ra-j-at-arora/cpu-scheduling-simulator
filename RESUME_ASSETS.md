# Resume & Interview Assets

This document contains tailored bullet points, project summaries, and interview talking points designed to help you showcase this project effectively to recruiters and hiring managers.

## 📝 Resume Bullet Points

*Choose 2-3 bullet points that best fit your resume's space and target role.*

- **Full-Stack Development**: Architected and developed a comprehensive Operating System CPU Scheduling Simulator using React, Node.js, and Express, successfully bridging complex OS concepts with an intuitive, highly interactive web interface.
- **Algorithm Engineering**: Implemented 9 distinct CPU scheduling algorithms (including Preemptive Priority, SRTF, and Round Robin) entirely from scratch in Node.js, managing edge cases like infinite loops, idle states, and accurate context-switch tracking.
- **Data Structures in Practice**: Engineered custom data structures (Min/Max Heaps, Circular Linked Lists, Stacks) on the backend to enforce true theoretical time complexities (e.g., $O(\log N)$ for Priority queues), rejecting the use of basic array sorting for authenticity.
- **Performance Benchmarking**: Built a robust benchmarking engine utilizing Node.js high-resolution timers (`process.hrtime`) to execute simulations against 1,000+ dynamically generated processes, proving empirical scalability and algorithm efficiency.
- **Data Visualization**: Leveraged Recharts and Framer Motion to build an immersive "Comparison Dashboard," featuring efficiency radar charts, throughput analysis, and an automated algorithm ranking leaderboard.
- **Production Readiness**: Hardened the application with React Error Boundaries, local storage persistence for saving/loading simulation configurations, and modular export functionalities (PDF, PNG, CSV) using `jsPDF` and `html2canvas`.

## 🎤 Interview Discussion Points

### 1. "Can you walk me through a challenging bug you faced while building this?"
**The Time-Travel Bug (Priority Non-Preemptive):**
"While building the Comparison Dashboard that runs all algorithms simultaneously, my Node.js server kept freezing due to an infinite loop in the Non-Preemptive Priority algorithm. The root cause was a 'fast-forward' optimization I wrote. If a process was currently executing, I told the timeline to jump straight to its completion time. However, by skipping intermediate ticks, any new processes that arrived *during* that execution were ignored because the loop only checked for exact time matches. When the running process finished, the queue was empty, but the simulation knew there were more processes waiting in the 'past'. I fixed it by forcing the timeline event loop to always pause at `Math.min(nextArrival, runningCompletion)`, guaranteeing every arrival is safely enqueued."

### 2. "Why did you choose to separate the frontend and backend instead of doing it all in React?"
"I separated them to emulate a true client-server architecture and to keep the frontend highly performant. The scheduling algorithms can be computationally intensive, especially when running the Benchmark suite against 1,000+ processes across 9 algorithms. If I ran that in the browser, it would block the JavaScript main thread, causing the UI to freeze and stutter. By offloading it to a Node.js backend, the frontend remains buttery smooth for animations and charts. It also allowed me to use Node's `process.hrtime` for nanosecond-precision benchmarking."

### 3. "How did you handle the animations and step-by-step playback?"
"I built a custom React Hook called `useTimelinePlayback`. The backend doesn't just return the final metrics; it returns an array of 'Timeline Events'—a snapshot of the system state (time, running process, queue) at every critical moment (Arrival, Execution, Preemption). The hook takes this array and manages a `currentIndex`, providing `play`, `pause`, and `stepNext` functions. This decoupled the visualization logic from the algorithmic logic perfectly."

## 🚀 Technical Challenges Solved

- **State Management**: Managing complex, deeply nested state in React without redundant re-renders. Solved using localized component state and carefully memoized playback hooks.
- **Type Casting Bugs**: Handling edge cases where form inputs (like `timeQuantum`) were passed as Strings instead of Numbers, which broke strict equality checks in Round Robin. Solved via rigorous parsing on the API layer.
- **Complex UI Synchronization**: Synchronizing the Gantt Chart, Live Status Bar, and Data Structure visualizers to accurately reflect the exact same point in time during playback.
