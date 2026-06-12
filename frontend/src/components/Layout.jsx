import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Cpu, LayoutDashboard, Settings, Info, Activity, Menu, X, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

export default function Layout({ children }) {
    const { darkMode, toggleDarkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 transform lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center">
                        <Cpu className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                        <span className="text-xl font-bold text-gray-800 dark:text-white">OS Simulator</span>
                    </div>
                    <button onClick={closeSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        <li>
                            <NavLink 
                                to="/simulator" 
                                onClick={closeSidebar}
                                className={({isActive}) => `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                            >
                                <LayoutDashboard className="h-5 w-5 mr-3" />
                                <span className="font-medium">Simulator</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/comparison" 
                                onClick={closeSidebar}
                                className={({isActive}) => `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                            >
                                <Activity className="h-5 w-5 mr-3" />
                                <span className="font-medium">Comparison Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/educational" 
                                onClick={closeSidebar}
                                className={({isActive}) => `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                            >
                                <Info className="h-5 w-5 mr-3" />
                                <span className="font-medium">Educational</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/benchmark" 
                                onClick={closeSidebar}
                                className={({isActive}) => `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                            >
                                <Zap className="h-5 w-5 mr-3 text-yellow-500" />
                                <span className="font-medium">Benchmarking</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button 
                        onClick={toggleDarkMode}
                        className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg"
                    >
                        {darkMode ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
                        <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 transition-colors duration-300 flex-shrink-0">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="mr-4 lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">CPU Scheduling</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                            Status: Online
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </main>
            </div>
        </div>
    );
}
