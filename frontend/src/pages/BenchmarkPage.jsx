import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, Play } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

const theoreticalComplexities = {
    'FCFS': 'O(N)',
    'RR': 'O(N)',
    'SJF': 'O(N log N)',
    'SRTF': 'O(N log N)',
    'Priority (NP)': 'O(N log N)',
    'Priority (P)': 'O(N log N)',
    'LJF': 'O(N log N)',
    'LRTF': 'O(N log N)',
    'FCLS': 'O(N)'
};

export default function BenchmarkPage() {
    const [benchmarkData, setBenchmarkData] = useState(null);
    const [loading, setLoading] = useState(false);

    const runBenchmark = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/benchmark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sizes: [100, 500, 1000] })
            });
            const data = await res.json();
            setBenchmarkData(data);
        } catch (e) {
            console.error('Benchmark failed', e);
            alert('Benchmark failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-black text-gray-800 dark:text-white flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-yellow-500" />
                        Performance Benchmarking
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Measure the absolute execution time of algorithms across 100, 500, and 1000+ processes.</p>
                </div>
                <button 
                    onClick={runBenchmark}
                    disabled={loading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg shadow font-semibold transition-colors flex items-center disabled:opacity-50"
                >
                    {loading ? <Zap className="w-5 h-5 mr-2 animate-pulse" /> : <Play className="w-5 h-5 mr-2" />}
                    {loading ? 'Running Benchmark...' : 'Run Benchmark'}
                </button>
            </div>

            {benchmarkData && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Execution Time Scalability (ms)</h3>
                        <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={benchmarkData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                    <XAxis dataKey="size" tick={{fill: '#6B7280'}} label={{ value: 'Number of Processes (N)', position: 'insideBottom', offset: -5 }} />
                                    <YAxis tick={{fill: '#6B7280'}} label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip contentStyle={{backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff'}} />
                                    <Legend wrapperStyle={{paddingTop: '20px'}} />
                                    
                                    <Line type="monotone" dataKey="FCFS" stroke="#ef4444" strokeWidth={2} />
                                    <Line type="monotone" dataKey="RR" stroke="#f97316" strokeWidth={2} />
                                    <Line type="monotone" dataKey="SJF" stroke="#eab308" strokeWidth={2} />
                                    <Line type="monotone" dataKey="SRTF" stroke="#84cc16" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Priority (NP)" stroke="#06b6d4" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Priority (P)" stroke="#3b82f6" strokeWidth={2} />
                                    <Line type="monotone" dataKey="LJF" stroke="#8b5cf6" strokeWidth={2} />
                                    <Line type="monotone" dataKey="LRTF" stroke="#d946ef" strokeWidth={2} />
                                    <Line type="monotone" dataKey="FCLS" stroke="#f43f5e" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Observed vs Theoretical Complexity</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b dark:border-gray-700 p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Algorithm</th>
                                        <th className="border-b dark:border-gray-700 p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Theoretical</th>
                                        {benchmarkData.map(d => (
                                            <th key={d.size} className="border-b dark:border-gray-700 p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">N={d.size}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(theoreticalComplexities).map(algo => (
                                        <tr key={algo} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b dark:border-gray-700/50">
                                            <td className="p-3 text-sm font-medium text-gray-800 dark:text-gray-200">{algo}</td>
                                            <td className="p-3 text-sm font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 rounded my-1 inline-block px-2">{theoreticalComplexities[algo]}</td>
                                            {benchmarkData.map(d => (
                                                <td key={d.size} className="p-3 text-sm text-gray-600 dark:text-gray-400">{d[algo]} ms</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
