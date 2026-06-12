import React, { useState } from 'react';
import ProcessInput from '../components/ProcessInput';
import GanttChart from '../components/GanttChart';
import QueueVisualizer from '../visualizations/QueueVisualizer';
import CircularLinkedListVisualizer from '../visualizations/CircularLinkedListVisualizer';
import StackVisualizer from '../visualizations/StackVisualizer';
import HeapVisualizer from '../visualizations/HeapVisualizer';
import { simulateAlgorithm } from '../services/api';
import { useTimelinePlayback } from '../hooks/useTimelinePlayback';
import { Play, Pause, SkipForward, RotateCcw, FastForward, Activity, Clock, Cpu as CpuIcon, Repeat, Settings, Download, FileText, Image as ImageIcon, Table as TableIcon, Save, FolderOpen, Trash2 } from 'lucide-react';
import { exportToCSV, exportToPNG, exportToPDF } from '../utils/exportUtils';
import { useStorage } from '../hooks/useStorage';
import Modal from '../components/Modal';

export default function SimulatorPage() {
    const [processes, setProcesses] = useState([]);
    const [simulationData, setSimulationData] = useState(null);
    const [algorithm, setAlgorithm] = useState('FCFS');
    const [timeQuantum, setTimeQuantum] = useState(2);
    const [isPreemptive, setIsPreemptive] = useState(false);
    
    const { savedSimulations, saveSimulation, loadSimulation, deleteSimulation } = useStorage();
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [saveName, setSaveName] = useState('');
    
    const {
        currentEvent,
        currentIndex,
        totalEvents,
        isPlaying,
        play,
        pause,
        stepNext,
        reset,
        fastForward,
        setPlaybackSpeed
    } = useTimelinePlayback(simulationData?.timeline || []);

    const handleSimulate = async () => {
        try {
            if (processes.length === 0) return alert('Add processes first!');
            const data = await simulateAlgorithm(algorithm, processes, { timeQuantum, isPreemptive });
            setSimulationData(data);
            reset();
        } catch (error) {
            console.error('Simulation error:', error);
            alert('Failed to simulate');
        }
    };

    const renderVisualizer = () => {
        const queueState = currentEvent?.queueState || null;
        const runningProcess = currentEvent?.runningProcess || null;

        switch (algorithm) {
            case 'RR':
                return <CircularLinkedListVisualizer queueState={queueState} runningProcess={runningProcess} />;
            case 'FCLS':
                return <StackVisualizer queueState={queueState} runningProcess={runningProcess} />;
            case 'SJF':
            case 'SRTF':
                return <HeapVisualizer queueState={queueState} runningProcess={runningProcess} isMinHeap={true} comparisonKey={algorithm === 'SJF' ? 'burstTime' : 'remainingTime'} />;
            case 'Priority':
                return <HeapVisualizer queueState={queueState} runningProcess={runningProcess} isMinHeap={false} comparisonKey="priority" />;
            case 'LJF':
            case 'LRTF':
                return <HeapVisualizer queueState={queueState} runningProcess={runningProcess} isMinHeap={false} comparisonKey={algorithm === 'LJF' ? 'burstTime' : 'remainingTime'} />;
            case 'FCFS':
            default:
                return <QueueVisualizer queueState={queueState} runningProcess={runningProcess} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Toolbar / Configuration */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between transition-colors duration-300">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Algorithm</label>
                        <select 
                            value={algorithm}
                            onChange={(e) => {
                                setAlgorithm(e.target.value);
                                setSimulationData(null);
                                reset();
                            }}
                            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium min-w-[200px]"
                        >
                            <option value="FCFS">First Come First Serve (Queue)</option>
                            <option value="RR">Round Robin (Circular Linked List)</option>
                            <option value="SJF">Shortest Job First (Min Heap)</option>
                            <option value="SRTF">Shortest Remaining Time (Min Heap)</option>
                            <option value="Priority">Priority Scheduling (Max Heap)</option>
                            <option value="LJF">Longest Job First (Max Heap)</option>
                            <option value="LRTF">Longest Remaining Time (Max Heap)</option>
                            <option value="FCLS">First Come Last Served (Stack)</option>
                        </select>
                    </div>

                    {algorithm === 'RR' && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Time Quantum</label>
                            <input 
                                type="number" 
                                min="1"
                                value={timeQuantum}
                                onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg w-24 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                            />
                        </div>
                    )}

                    {algorithm === 'Priority' && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Mode</label>
                            <select 
                                value={isPreemptive ? 'true' : 'false'}
                                onChange={(e) => setIsPreemptive(e.target.value === 'true')}
                                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                            >
                                <option value="false">Non-Preemptive</option>
                                <option value="true">Preemptive</option>
                            </select>
                        </div>
                    )}
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsLoadModalOpen(true)} 
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg shadow-sm font-semibold transition-colors flex items-center"
                    >
                        <FolderOpen className="w-5 h-5 mr-2" />
                        Load Saved
                    </button>
                    <button 
                        onClick={handleSimulate} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow font-semibold transition-colors flex items-center"
                    >
                        <Activity className="w-5 h-5 mr-2" />
                        Simulate
                    </button>
                </div>
            </div>

            {simulationData && (
                <div className="flex justify-end gap-3 mb-2">
                    <button onClick={() => exportToCSV(simulationData.processStatistics, `${algorithm}_metrics.csv`)} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center shadow-sm">
                        <TableIcon className="w-4 h-4 mr-2" /> CSV
                    </button>
                    <button onClick={() => exportToPNG('gantt-chart-container', `${algorithm}_gantt.png`)} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center shadow-sm">
                        <ImageIcon className="w-4 h-4 mr-2" /> Gantt PNG
                    </button>
                    <button onClick={() => exportToPDF('simulator-report', `${algorithm}_report.pdf`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center shadow-sm">
                        <FileText className="w-4 h-4 mr-2" /> Export PDF
                    </button>
                    <button onClick={() => setIsSaveModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center shadow-sm">
                        <Save className="w-4 h-4 mr-2" /> Save Run
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="xl:col-span-1 space-y-6">
                    <ProcessInput processes={processes} setProcesses={setProcesses} />

                    {/* Playback Controls */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Timeline Controls</h2>
                        
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <button onClick={reset} disabled={!simulationData} className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full disabled:opacity-40 transition-colors">
                                <RotateCcw className="w-5 h-5" />
                            </button>
                            <button onClick={isPlaying ? pause : play} disabled={!simulationData} className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full disabled:opacity-50 shadow-md transition-all transform hover:scale-105">
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                            </button>
                            <button onClick={stepNext} disabled={!simulationData || isPlaying} className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full disabled:opacity-40 transition-colors">
                                <SkipForward className="w-5 h-5" />
                            </button>
                            <button onClick={fastForward} disabled={!simulationData} className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full disabled:opacity-40 transition-colors">
                                <FastForward className="w-5 h-5" />
                            </button>
                        </div>

                        {simulationData && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    <span>Event {currentIndex + 1}</span>
                                    <span>Total {totalEvents}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${((currentIndex + 1) / totalEvents) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div id="simulator-report" className="xl:col-span-2 space-y-6">
                    {/* Live Status Bar */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-blue-200 dark:border-blue-900 flex justify-between items-center transition-colors duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Current Time</div>
                                <div className="text-xl font-mono font-bold text-gray-800 dark:text-white">{currentEvent ? currentEvent.time : 0}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-right">
                            <div>
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Event Trigger</div>
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {currentEvent ? currentEvent.type : 'READY TO START'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {renderVisualizer()}
                    
                    <GanttChart ganttData={simulationData?.ganttChart} />
                    
                    {simulationData && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Avg Wait Time</div>
                                    <Clock className="w-4 h-4 text-orange-500" />
                                </div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">{simulationData.metrics.avgWT.toFixed(2)}</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Avg Turnaround</div>
                                    <Activity className="w-4 h-4 text-purple-500" />
                                </div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">{simulationData.metrics.avgTAT.toFixed(2)}</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">CPU Utilization</div>
                                    <CpuIcon className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">{simulationData.metrics.cpuUtilization.toFixed(1)}%</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Context Switches</div>
                                    <Repeat className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">{simulationData.metrics.contextSwitches}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Modal */}
            <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title="Save Simulation">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Simulation Name</label>
                        <input 
                            type="text" 
                            value={saveName}
                            onChange={(e) => setSaveName(e.target.value)}
                            placeholder="e.g. Test Case 1 (High CPU Bound)"
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Cancel</button>
                        <button 
                            onClick={() => {
                                if (saveName.trim()) {
                                    saveSimulation(saveName, processes, algorithm, { timeQuantum, isPreemptive });
                                    setIsSaveModalOpen(false);
                                    setSaveName('');
                                }
                            }}
                            disabled={!saveName.trim()}
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Load Modal */}
            <Modal isOpen={isLoadModalOpen} onClose={() => setIsLoadModalOpen(false)} title="Saved Simulations">
                {savedSimulations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No saved simulations found.</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {savedSimulations.map(sim => (
                            <div key={sim.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center group">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200">{sim.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {sim.algorithm} • {sim.processes.length} Processes • {new Date(sim.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => {
                                            setProcesses(sim.processes);
                                            setAlgorithm(sim.algorithm);
                                            if (sim.config) {
                                                setTimeQuantum(sim.config.timeQuantum || 2);
                                                setIsPreemptive(sim.config.isPreemptive || false);
                                            }
                                            setSimulationData(null);
                                            setIsLoadModalOpen(false);
                                        }}
                                        className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-800/60 rounded-md text-sm font-semibold transition-colors"
                                    >
                                        Load
                                    </button>
                                    <button 
                                        onClick={() => deleteSimulation(sim.id)}
                                        className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
}
