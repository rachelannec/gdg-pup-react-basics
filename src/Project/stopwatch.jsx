import React, { useState, useEffect } from "react";

export default function Stopwatch({ updateTime, stopTimer, resetTimer }) {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        let timer;

        if (isRunning && !stopTimer) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isRunning, stopTimer]);

    useEffect(() => {
        if (stopTimer) {
            setIsRunning(false);
            updateTime(time); // Pass elapsed time back
        }
    }, [stopTimer]);

    useEffect(() => {
        if (resetTimer) {
            setTime(0);
            setIsRunning(true);
        }
    }, [resetTimer]);


    return <h2>Elapsed Time: {time}s</h2>;
}