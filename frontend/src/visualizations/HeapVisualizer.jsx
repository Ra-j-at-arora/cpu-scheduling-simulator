import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu } from 'lucide-react';

export default function HeapVisualizer({ queueState, runningProcess, isMinHeap = true, comparisonKey = 'remainingTime' }) {
    const heap = queueState || [];

    // Helper to calculate tree positions
    const getLevelAndIndex = (index) => {
        const level = Math.floor(Math.log2(index + 1));
        const indexInLevel = index - (Math.pow(2, level) - 1);
        return { level, indexInLevel, nodesInLevel: Math.pow(2, level) };
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Ready Queue ({isMinHeap ? 'Min Heap' : 'Max Heap'})
            </h2>
            
            <div className="flex flex-col xl:flex-row gap-8 items-center xl:items-start">
                {/* CPU Running Process */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 relative shadow-lg xl:mt-8">
                    <div className="absolute -top-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                        <Cpu className="w-3 h-3 mr-1" /> CPU
                    </div>
                    {runningProcess ? (
                        <motion.div
                            key={runningProcess.pid}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-black text-green-600 dark:text-green-400">{runningProcess.pid}</div>
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                                {comparisonKey}: <span className="text-gray-800 dark:text-gray-200">{runningProcess[comparisonKey]}</span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-gray-400 dark:text-gray-500 font-semibold text-sm">IDLE</div>
                    )}
                </div>

                <div className="flex-1 w-full space-y-6">
                    {/* Array Representation */}
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Array View</div>
                        {heap.length === 0 ? (
                            <div className="w-full text-center text-gray-400 dark:text-gray-500 italic text-sm py-2">Heap is empty</div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                <AnimatePresence>
                                    {heap.map((p, idx) => (
                                        <motion.div
                                            layout
                                            key={`${p.pid}-${idx}`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            className="w-14 h-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center relative shadow-sm"
                                        >
                                            <div className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                                {idx}
                                            </div>
                                            <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">{p.pid}</div>
                                            <div className="text-xs text-green-500 font-mono font-bold">{p[comparisonKey]}</div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Tree Representation (Only display if not too large) */}
                    {heap.length > 0 && heap.length <= 15 && (
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tree View</div>
                            <div className="relative w-full h-[200px] bg-gray-50 dark:bg-gray-900/50 rounded-xl overflow-hidden">
                                {heap.map((p, idx) => {
                                    const { level, indexInLevel, nodesInLevel } = getLevelAndIndex(idx);
                                    const totalLevels = Math.ceil(Math.log2(heap.length + 1));
                                    
                                    // Calculate x and y positions
                                    const y = (level + 1) * (200 / (totalLevels + 1));
                                    const sectionWidth = 100 / nodesInLevel;
                                    const x = (indexInLevel * sectionWidth) + (sectionWidth / 2);
                                    
                                    // Calculate parent position to draw line
                                    let lineProps = null;
                                    if (idx > 0) {
                                        const parentIdx = Math.floor((idx - 1) / 2);
                                        const pInfo = getLevelAndIndex(parentIdx);
                                        const pY = (pInfo.level + 1) * (200 / (totalLevels + 1));
                                        const pSectionWidth = 100 / pInfo.nodesInLevel;
                                        const pX = (pInfo.indexInLevel * pSectionWidth) + (pSectionWidth / 2);
                                        
                                        lineProps = {
                                            x1: `${pX}%`,
                                            y1: `${pY}px`,
                                            x2: `${x}%`,
                                            y2: `${y}px`
                                        };
                                    }

                                    return (
                                        <React.Fragment key={`tree-${p.pid}-${idx}`}>
                                            {/* Line to parent */}
                                            {lineProps && (
                                                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                                    <line {...lineProps} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="2" />
                                                </svg>
                                            )}
                                            
                                            {/* Node */}
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute w-12 h-12 bg-white dark:bg-gray-800 border-2 border-green-400 rounded-full shadow-md flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-10"
                                                style={{ left: `${x}%`, top: `${y}px` }}
                                            >
                                                <div className="font-bold text-gray-800 dark:text-gray-200 text-xs">{p.pid}</div>
                                                <div className="text-[10px] text-green-500 font-mono font-bold">{p[comparisonKey]}</div>
                                            </motion.div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {heap.length > 15 && (
                         <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                             <div className="text-xs text-gray-400 italic">Tree view hidden for queues larger than 15 items.</div>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
}
