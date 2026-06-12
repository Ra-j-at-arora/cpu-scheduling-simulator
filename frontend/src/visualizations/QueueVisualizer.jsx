import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ListOrdered } from 'lucide-react';

export default function QueueVisualizer({ queueState, runningProcess }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                    <ListOrdered className="w-4 h-4 mr-2" />
                    Ready Queue
                </h2>
                <div className="flex bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[120px] overflow-x-auto border border-gray-200 dark:border-gray-700 items-center gap-3">
                    <AnimatePresence>
                        {(!queueState || queueState.length === 0) && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="w-full text-center text-gray-400 dark:text-gray-500 italic text-sm"
                            >
                                Queue is empty
                            </motion.div>
                        )}
                        {queueState && queueState.map((proc, index) => (
                            <motion.div
                                key={proc.pid}
                                layout
                                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 border-2 border-blue-400 dark:border-blue-500 rounded-lg min-w-[80px] h-[80px] shadow-sm flex-shrink-0"
                            >
                                <span className="font-bold text-blue-700 dark:text-blue-400 text-lg">{proc.pid}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">RT: {proc.remainingTime}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div className="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 flex flex-col">
                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                    <Cpu className="w-4 h-4 mr-2" />
                    CPU
                </h2>
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden p-4">
                    <AnimatePresence mode="wait">
                        {runningProcess ? (
                            <motion.div
                                key={runningProcess.pid}
                                layout
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.5, opacity: 0 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="relative z-10 w-full h-full max-h-[120px] max-w-[120px] rounded-full bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 shadow-lg shadow-green-500/30 flex flex-col items-center justify-center text-white border-4 border-white dark:border-gray-800"
                            >
                                <span className="text-2xl font-black tracking-tight">{runningProcess.pid}</span>
                                <span className="text-xs font-semibold bg-black/20 px-2 py-0.5 rounded-full mt-1">
                                    {runningProcess.remainingTime} left
                                </span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-gray-400 dark:text-gray-600 font-bold tracking-widest text-lg"
                            >
                                IDLE
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* CPU Pulse effect when running */}
                    {runningProcess && (
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 m-auto w-32 h-32 bg-green-400 dark:bg-green-500 rounded-full blur-xl z-0"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
