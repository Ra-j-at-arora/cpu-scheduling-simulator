# Project Architecture

The CPU Scheduling Simulator utilizes a modern, decoupled client-server architecture to provide a seamless user experience while offloading heavy algorithmic computations to a dedicated backend.

## 1. High-Level Overview

- **Frontend (Client)**: Built with React (Vite) and Tailwind CSS. It acts as the presentation layer. It captures user input, orchestrates playback animations, visualizes complex data structures, and renders Recharts.
- **Backend (Server)**: Built with Node.js and Express. It acts as the simulation engine. It contains the core logic for all 9 scheduling algorithms, manages custom data structures (Heaps, Linked Lists), and computes time metrics.

## 2. Data Flow

1. **Input Phase**: The user configures processes (Arrival Time, Burst Time, Priority) and selects an algorithm on the React frontend.
2. **API Request**: The frontend sends a JSON payload containing the processes and configuration (e.g., `timeQuantum`, `isPreemptive`) to the specific algorithm endpoint (e.g., `POST /simulate/rr`).
3. **Simulation Execution (Backend)**:
   - The backend initializes an empty `timeline` array and a `ganttChart` array.
   - It runs the selected algorithm using a custom event-loop simulation.
   - At every crucial state change (Arrival, Execution, Preemption, Completion), a snapshot of the current time, the running process, and the queue state is pushed to the `timeline`.
4. **Metrics Calculation**: After the simulation completes, the `MetricsCalculator` parses the completed processes to calculate Waiting Time, Turnaround Time, CPU Utilization, and Throughput.
5. **API Response**: The backend returns `{ timeline, ganttChart, metrics, processStatistics }`.
6. **Playback Phase (Frontend)**: A custom React Hook (`useTimelinePlayback`) consumes the `timeline` array. It provides `play`, `pause`, and `stepNext` functions to update the UI frame-by-frame, driving the queue visualizers and the live status bar.

## 3. Custom Data Structures

Instead of using basic JavaScript arrays for everything, the backend implements computer science data structures to emulate real-world OS behavior:
- **Min/Max Heaps**: Used by SJF, SRTF, Priority, LJF, and LRTF. Ensures $O(\log N)$ insertions and extractions, accurately reflecting theoretical time complexities.
- **Circular Linked List**: Used by Round Robin to easily pass the time slice around in an endless loop.
- **Stack**: Used by First Come Last Served (FCLS) to demonstrate LIFO scheduling.

## 4. Benchmarking Engine

The `/benchmark` endpoint stress-tests the application. It dynamically generates up to 1,000 randomized processes in memory and executes all algorithms consecutively, using Node.js's high-resolution `process.hrtime.bigint()` to track execution duration down to the nanosecond. This raw performance data is shipped back to the frontend to plot Empirical Time Complexity charts.
