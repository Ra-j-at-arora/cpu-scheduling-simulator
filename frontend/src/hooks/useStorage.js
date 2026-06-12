import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cpu_scheduler_saved_simulations';

export function useStorage() {
    const [savedSimulations, setSavedSimulations] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setSavedSimulations(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse stored simulations', e);
            }
        }
    }, []);

    const saveSimulation = (name, processes, algorithm, config) => {
        const newSim = {
            id: Date.now().toString(),
            name,
            timestamp: new Date().toISOString(),
            processes,
            algorithm,
            config
        };

        const updated = [newSim, ...savedSimulations];
        setSavedSimulations(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const loadSimulation = (id) => {
        return savedSimulations.find(sim => sim.id === id);
    };

    const deleteSimulation = (id) => {
        const updated = savedSimulations.filter(sim => sim.id !== id);
        setSavedSimulations(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return {
        savedSimulations,
        saveSimulation,
        loadSimulation,
        deleteSimulation
    };
}
