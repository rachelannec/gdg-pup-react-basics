import React, {useState, useEffect} from "react";

export default function Stopwatch() {
    const [time, setTime] = useState(0); 
    const [isRunning, setIsRunning] = useState(false); // tracks if its running

    useEffect(() => {
        let timer; 

        if (isRunning) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isRunning]);

    const handleStart = () => setIsRunning(true);
    const handleStop = () => setIsRunning(false);
    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    };

    // return (
    //     <div>
    //         <h1>Elapsed Time: {time} seconds</h1>
    //         <button onClick={handleStart}>Start</button>
    //         <button onClick={handleStop}>Stop</button>
    //         <button onClick={handleReset}>Reset</button>
    //     </div>
    // );
}
