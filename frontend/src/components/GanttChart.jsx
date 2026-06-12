import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';

export default function GanttChart({ ganttData }) {
    if (!ganttData || ganttData.length === 0) return null;

    const totalTime = ganttData[ganttData.length - 1].endTime;

    // Filter out zero-length blocks
    const validBlocks = ganttData.filter(b => b.endTime > b.startTime);

    return (
        <div id="gantt-chart-container" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 mb-6">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 flex items-center">
                <BarChart2 className="w-4 h-4 mr-2" />
                Gantt Chart
            </h2>
            
            <div className="overflow-x-auto pb-4">
                <div className="relative pt-4 pb-8 px-2 min-w-[600px]">
                    <div className="relative h-14 w-full bg-gray-100 dark:bg-gray-900 flex rounded-md overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                        {validBlocks.map((block, idx) => {
                            const widthPercent = ((block.endTime - block.startTime) / totalTime) * 100;
                            const isIdle = block.pid === 'IDLE';
                            
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: `${widthPercent}%` }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className={`h-full border-r border-white/20 dark:border-gray-800/50 flex flex-col items-center justify-center relative group ${
                                        isIdle 
                                        ? 'bg-repeating-linear-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 opacity-60' 
                                        : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer transition-colors'
                                    }`}
                                    style={isIdle ? {
                                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
                                    } : {}}
                                >
                                    {widthPercent > 5 && (
                                        <span className={`text-sm font-bold ${isIdle ? 'text-gray-600 dark:text-gray-400' : 'text-white'}`}>
                                            {isIdle ? 'IDLE' : block.pid}
                                        </span>
                                    )}
                                    
                                    {/* Tooltip */}
                                    {!isIdle && (
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                                            {block.pid} ({block.startTime} - {block.endTime})
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                    
                    {/* Time Axis */}
                    <div className="absolute left-0 right-0 bottom-0 h-6">
                        {validBlocks.map((block, idx) => {
                            const leftPercent = (block.startTime / totalTime) * 100;
                            return (
                                <div 
                                    key={'tick' + idx} 
                                    style={{ left: `${leftPercent}%` }} 
                                    className="absolute top-0 -ml-2 w-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                                >
                                    <div className="h-2 w-px bg-gray-300 dark:bg-gray-600 mx-auto mb-1"></div>
                                    {block.startTime}
                                </div>
                            );
                        })}
                        {/* Final Tick */}
                        <div 
                            style={{ left: '100%' }} 
                            className="absolute top-0 -ml-2 w-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                        >
                            <div className="h-2 w-px bg-gray-300 dark:bg-gray-600 mx-auto mb-1"></div>
                            {totalTime}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
