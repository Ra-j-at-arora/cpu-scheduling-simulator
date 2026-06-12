import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl m-6 text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Something went wrong</h2>
                    <p className="text-red-600 dark:text-red-300 max-w-md">
                        A rendering error occurred in this component. Please try refreshing the page or clearing your inputs.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
