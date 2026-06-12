import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Cpu } from 'lucide-react';

export default function StackVisualizer({ queueState, runningProcess }) {
    const stack = queueState || [];
    // Display top of stack at the top of the container
    const displayStack = [...stack].reverse();

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                Ready Stack (FCLS)
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                {/* CPU Running Process */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 relative shadow-lg">
                    <div className="absolute -top-3 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                        <Cpu className="w-3 h-3 mr-1" /> CPU
                    </div>
                    {runningProcess ? (
                        <motion.div
                            key={runningProcess.pid}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{runningProcess.pid}</div>
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                                RT: <span className="text-gray-800 dark:text-gray-200">{runningProcess.remainingTime}</span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-gray-400 dark:text-gray-500 font-semibold text-sm">IDLE</div>
                    )}
                </div>

                {/* Stack Container */}
                <div className="flex-1 w-full max-w-[200px] border-b-4 border-l-4 border-r-4 border-gray-300 dark:border-gray-600 rounded-b-xl p-4 min-h-[200px] flex flex-col justify-end relative bg-gray-50 dark:bg-gray-900/50">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-400 uppercase tracking-wider">Top</div>
                    {displayStack.length === 0 ? (
                        <div className="w-full text-center text-gray-400 dark:text-gray-500 italic text-sm py-4">Stack is empty</div>
                    ) : (
                        <div className="flex flex-col space-y-2 w-full">
                            <AnimatePresence mode="popLayout">
                                {displayStack.map((p, idx) => (
                                    <motion.div
                                        layout
                                        key={`${p.pid}-${idx}`}
                                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, x: 50 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm flex items-center justify-between px-4 transition-colors"
                                    >
                                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{p.pid}</div>
                                        <div className="text-sm font-mono font-bold text-purple-500">{p.remainingTime}</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
