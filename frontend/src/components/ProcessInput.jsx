import React, { useState } from 'react';
import { Plus, Shuffle, Trash2, Settings2 } from 'lucide-react';

export default function ProcessInput({ processes, setProcesses }) {
    const [pid, setPid] = useState(`P${processes.length + 1}`);
    const [arrivalTime, setArrivalTime] = useState(0);
    const [burstTime, setBurstTime] = useState(1);
    const [priority, setPriority] = useState(1);

    const handleAdd = (e) => {
        e.preventDefault();
        setProcesses([...processes, { 
            pid, 
            arrivalTime: Number(arrivalTime), 
            burstTime: Number(burstTime),
            priority: Number(priority)
        }]);
        setPid(`P${processes.length + 2}`);
        setArrivalTime(0);
        setBurstTime(1);
        setPriority(1);
    };

    const handleRemove = (indexToRemove) => {
        setProcesses(processes.filter((_, index) => index !== indexToRemove));
    };

    const generateRandom = () => {
        const num = Math.floor(Math.random() * 5) + 3; // 3 to 7 processes
        const randomProcesses = [];
        for (let i = 1; i <= num; i++) {
            randomProcesses.push({
                pid: `P${i}`,
                arrivalTime: Math.floor(Math.random() * 10),
                burstTime: Math.floor(Math.random() * 10) + 1,
                priority: Math.floor(Math.random() * 10) + 1,
            });
        }
        setProcesses(randomProcesses);
        setPid(`P${num + 1}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                    <Settings2 className="w-4 h-4 mr-2" />
                    Process Configuration
                </h2>
                <button 
                    type="button" 
                    onClick={generateRandom}
                    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1.5 px-3 rounded-lg flex items-center transition-colors font-semibold"
                >
                    <Shuffle className="w-3 h-3 mr-1" /> Random
                </button>
            </div>

            <form onSubmit={handleAdd} className="grid grid-cols-5 gap-3 mb-6">
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">PID</label>
                    <input 
                        type="text" 
                        value={pid} 
                        onChange={e => setPid(e.target.value)} 
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Arrival</label>
                    <input 
                        type="number" 
                        min="0"
                        value={arrivalTime} 
                        onChange={e => setArrivalTime(e.target.value)} 
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Burst</label>
                    <input 
                        type="number" 
                        min="1"
                        value={burstTime} 
                        onChange={e => setBurstTime(e.target.value)} 
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Priority</label>
                    <input 
                        type="number" 
                        min="1"
                        value={priority} 
                        onChange={e => setPriority(e.target.value)} 
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                        required 
                    />
                </div>
                <div className="flex items-end">
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg shadow-sm transition-colors flex items-center justify-center font-bold">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </form>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-4 py-3">PID</th>
                            <th className="px-4 py-3 text-center">Arrival</th>
                            <th className="px-4 py-3 text-center">Burst</th>
                            <th className="px-4 py-3 text-center">Priority</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {processes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 italic text-xs">
                                    No processes added yet. Add manually or generate random processes.
                                </td>
                            </tr>
                        ) : (
                            processes.map((p, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors group">
                                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-gray-200">{p.pid}</td>
                                    <td className="px-4 py-3 text-center font-mono text-gray-600 dark:text-gray-400">{p.arrivalTime}</td>
                                    <td className="px-4 py-3 text-center font-mono text-gray-600 dark:text-gray-400">{p.burstTime}</td>
                                    <td className="px-4 py-3 text-center font-mono text-gray-600 dark:text-gray-400">{p.priority}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={() => handleRemove(index)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
