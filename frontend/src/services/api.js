export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const simulateAlgorithm = async (algorithm, processes, config = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/simulate/${algorithm.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                processes,
                timeQuantum: config.timeQuantum,
                isPreemptive: config.isPreemptive
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to simulate ${algorithm}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Keeping FCFS for backward compatibility during transition if needed
export const simulateFCFS = async (processes) => {
    return simulateAlgorithm('fcfs', processes);
};
