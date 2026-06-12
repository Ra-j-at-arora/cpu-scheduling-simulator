import { useState, useEffect, useRef } from 'react';

export function useTimelinePlayback(timelineData) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per event
    
    const timerRef = useRef(null);

    const currentEvent = timelineData && timelineData.length > 0 ? timelineData[currentIndex] : null;

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);
    
    const stepNext = () => {
        if (timelineData && currentIndex < timelineData.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    };

    const reset = () => {
        setIsPlaying(false);
        setCurrentIndex(0);
    };

    const fastForward = () => {
        if (timelineData) {
            setCurrentIndex(timelineData.length - 1);
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentIndex(prev => {
                    if (timelineData && prev < timelineData.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        clearInterval(timerRef.current);
                        return prev;
                    }
                });
            }, playbackSpeed);
        } else {
            clearInterval(timerRef.current);
        }
        
        return () => clearInterval(timerRef.current);
    }, [isPlaying, playbackSpeed, timelineData]);

    return {
        currentEvent,
        currentIndex,
        totalEvents: timelineData ? timelineData.length : 0,
        isPlaying,
        play,
        pause,
        stepNext,
        reset,
        fastForward,
        setPlaybackSpeed
    };
}
