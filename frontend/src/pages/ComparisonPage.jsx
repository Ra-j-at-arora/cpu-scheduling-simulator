import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, Play, Shuffle, Settings2, Download, FileText, Table as TableIcon, Trophy, Medal } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import ProcessInput from '../components/ProcessInput';
import { simulateAlgorithm } from '../services/api';

const ALGORITHMS = [
    { id: 'FCFS', name: 'FCFS' },
    { id: 'RR', name: 'RR (q=2)' },
    { id: 'SJF', name: 'SJF' },
    { id: 'SRTF', name: 'SRTF' },
    { id: 'Priority', name: 'Priority (NP)' },
    { id: 'Priority_P', name: 'Priority (P)' },
    { id: 'LJF', name: 'LJF' },
    { id: 'LRTF', name: 'LRTF' },
    { id: 'FCLS', name: 'FCLS' },
];

export default function ComparisonPage() {
    const [processes, setProcesses] = useState([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const runComparison = async () => {
        if (processes.length === 0) return alert('Add processes first!');
        setLoading(true);
        try {
            const promises = ALGORITHMS.map(async (algo) => {
                let algoId = algo.id;
                let config = {};
                
                if (algoId === 'RR') {
                    config.timeQuantum = 2;
                } else if (algoId === 'Priority_P') {
                    algoId = 'Priority';
                    config.isPreemptive = true;
                } else if (algoId === 'Priority') {
                    config.isPreemptive = false;
                }

                const data = await simulateAlgorithm(algoId, processes, config);
                return {
                    name: algo.name,
                    avgWT: parseFloat(data.metrics.avgWT.toFixed(2)),
                    avgTAT: parseFloat(data.metrics.avgTAT.toFixed(2)),
                    avgRT: parseFloat(data.metrics.avgRT.toFixed(2)),
                    cpuUtilization: parseFloat(data.metrics.cpuUtilization.toFixed(1)),
                    throughput: parseFloat(data.metrics.throughput.toFixed(3)),
                    contextSwitches: data.metrics.contextSwitches
                };
            });

            let comparisonData = await Promise.all(promises);

            // Compute Ranking Score
            // Formula: CPU% (0.4) + Throughput (0.3) - TAT penalty - WT penalty - CS penalty
            comparisonData = comparisonData.map(res => {
                const score = (res.cpuUtilization * 0.4) 
                            + (res.throughput * 100 * 0.3) 
                            - (res.avgTAT * 0.1) 
                            - (res.avgWT * 0.1)
                            - (res.contextSwitches * 0.1);
                return { ...res, score };
            });

            // Sort by score descending
            comparisonData.sort((a, b) => b.score - a.score);

            // Assign ranks
            comparisonData = comparisonData.map((res, index) => ({ ...res, rank: index + 1 }));

            setResults(comparisonData);
        } catch (error) {
            console.error('Comparison error', error);
            alert('Failed to run comparison');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-xl font-black text-gray-800 dark:text-white flex items-center">
                    <Activity className="w-6 h-6 mr-3 text-blue-500 flex-shrink-0" />
                    Algorithm Comparison Dashboard
                </h1>
                <button 
                    onClick={runComparison}
                    disabled={loading || processes.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow font-semibold transition-colors flex items-center disabled:opacity-50 w-full sm:w-auto justify-center"
                >
                    {loading ? <Activity className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
                    Run Analysis
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1">
                    <ProcessInput processes={processes} setProcesses={setProcesses} />
                </div>

                <div className="xl:col-span-2 space-y-6">
                    {results ? (
                        <div id="comparison-report" className="space-y-6">
                            <div className="flex justify-end gap-3 mb-2">
                                <button onClick={() => exportToCSV(results, 'comparison_metrics.csv')} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center shadow-sm">
                                    <TableIcon className="w-4 h-4 mr-2" /> Export CSV
                                </button>
                                <button onClick={() => exportToPDF('comparison-report', 'comparison_report.pdf')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center shadow-sm">
                                    <FileText className="w-4 h-4 mr-2" /> Export PDF
                                </button>
                            </div>

                            {/* Ranking Leaderboard */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-700/50">
                                <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-500 uppercase tracking-wider mb-4 flex items-center">
                                    <Trophy className="w-5 h-5 mr-2" />
                                    Algorithm Leaderboard
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {results.slice(0, 3).map((res, idx) => (
                                        <div key={res.name} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-yellow-100 dark:border-gray-700 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-gray-300 text-gray-800' : 'bg-amber-600 text-white'}`}>
                                                    #{res.rank}
                                                </div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200">{res.name}</div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                Score: {res.score.toFixed(1)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bar Chart - Times */}
                            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Average Times Comparison</h3>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={results} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                            <XAxis dataKey="name" tick={{fill: '#6B7280', fontSize: 10}} angle={-45} textAnchor="end" height={60} />
                                            <YAxis tick={{fill: '#6B7280', fontSize: 12}} />
                                            <RechartsTooltip contentStyle={{backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff'}} />
                                            <Legend wrapperStyle={{fontSize: '12px'}} />
                                            <Bar dataKey="avgWT" name="Waiting Time" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="avgTAT" name="Turnaround Time" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="avgRT" name="Response Time" fill="#10B981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Context Switches Line Chart */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Context Switches Overhead</h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={results}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                                <XAxis dataKey="name" tick={{fill: '#6B7280', fontSize: 10}} angle={-45} textAnchor="end" height={60} />
                                                <YAxis tick={{fill: '#6B7280', fontSize: 12}} />
                                                <RechartsTooltip contentStyle={{backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff'}} />
                                                <Line type="monotone" dataKey="contextSwitches" name="Context Switches" stroke="#EF4444" strokeWidth={3} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* CPU Metrics Radar */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Efficiency Radar</h3>
                                    <div className="text-xs text-gray-400 mb-4 italic">Normalized view of CPU Utilization & Throughput</div>
                                    <div className="h-60 w-full flex justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={results}>
                                                <PolarGrid stroke="#374151" opacity={0.3} />
                                                <PolarAngleAxis dataKey="name" tick={{fill: '#6B7280', fontSize: 10}} />
                                                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} />
                                                <Radar name="CPU Utilization %" dataKey="cpuUtilization" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} />
                                                <RechartsTooltip contentStyle={{backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff'}} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-12 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 h-full min-h-[400px]">
                            <Activity className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600" />
                            <p className="text-lg font-bold">Awaiting Analysis</p>
                            <p className="text-sm text-center max-w-md mt-2">Configure processes on the left and click "Run Analysis" to compare all algorithms simultaneously.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
