import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Cpu } from 'lucide-react';

export default function CircularLinkedListVisualizer({ queueState, runningProcess }) {
    const queue = queueState || [];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 flex items-center">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Circular Ready Queue (Round Robin)
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* CPU Running Process */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 relative shadow-lg">
                    <div className="absolute -top-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                        <Cpu className="w-3 h-3 mr-1" /> CPU
                    </div>
                    {runningProcess ? (
                        <motion.div
                            key={runningProcess.pid}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{runningProcess.pid}</div>
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                                RT: <span className="text-gray-800 dark:text-gray-200">{runningProcess.remainingTime}</span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-gray-400 dark:text-gray-500 font-semibold text-sm">IDLE</div>
                    )}
                </div>

                <div className="flex-1 relative w-full overflow-hidden min-h-[140px] flex items-center">
                    {queue.length === 0 ? (
                        <div className="w-full text-center text-gray-400 dark:text-gray-500 italic text-sm">Queue is empty</div>
                    ) : (
                        <div className="flex items-center space-x-3 w-full pb-6 pt-2 px-2 overflow-x-auto relative">
                            {/* Circular Link Back Arrow (visual representation) */}
                            {queue.length > 0 && (
                                <div className="absolute bottom-2 left-10 right-10 h-6 border-b-2 border-l-2 border-r-2 border-dashed border-gray-300 dark:border-gray-600 rounded-b-xl z-0"></div>
                            )}

                            <AnimatePresence mode="popLayout">
                                {queue.map((p, idx) => (
                                    <motion.div
                                        layout
                                        key={`${p.pid}-${idx}`}
                                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, y: -50 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="relative z-10 w-20 h-24 flex-shrink-0 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm flex flex-col items-center justify-center transition-colors"
                                    >
                                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{p.pid}</div>
                                        <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">Remaining</div>
                                        <div className="text-sm font-mono font-bold text-blue-500">{p.remainingTime}</div>
                                        
                                        {/* Next Pointer */}
                                        {idx < queue.length - 1 && (
                                            <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600">
                                                →
                                            </div>
                                        )}
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
