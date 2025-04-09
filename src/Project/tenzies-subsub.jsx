import React, { useState, useEffect, useRef } from "react";
import "./TenziesProject.css";
import Die from "./Die";
import Stopwatch from "./stopwatch";

export default function TenziesProject() {
    const [dice, setDice] = useState(generateAllNewDice);
    const [gameWon, setGameWon] = useState(false);
    
    const [elapsedTime, setElapsedTime] = useState(0);
    const [resetTimer, setResetTimer] = useState(false);


    // new dice
    function generateAllNewDice() {
        return Array.from({ length: 10 }, (_, i) => ({
            value: Math.ceil(Math.random() * 6),
            isClicked: false,
            id: i + 1
        }));
    }

    // Roll dice or start new game
    function rollDice() {
        if (!gameWon) {
            setDice(prevDice => 
                prevDice.map(die => 
                    die.isClicked ? die : { ...die, value: Math.ceil(Math.random() * 6) }
                )
            );
        } else {
            resetGame();
           
        }
    }

    // Toggle dice hold state
    function holdDice(id) {
        setDice(prevDice =>
            prevDice.map(die =>
                die.id === id ? { ...die, isClicked: !die.isClicked } : die
            )
        );
    }

    // check win
    useEffect(() => {
        const allDiceHeld = dice.every(die => die.isClicked);
        const allSameValue = dice.every(die => die.value === dice[0].value);
        
        if (allDiceHeld && allSameValue) {
            setGameWon(true);

        }
    }, [dice]);





    // Reset game state
    function resetGame() {
        setDice(generateAllNewDice());
        setGameWon(false);
        setElapsedTime(0);
        setResetTimer(prev => !prev); // trigger to reset
    }

    
    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            isClicked={die.isClicked}
            hold={() => holdDice(die.id)}
            disabled={gameWon}
        />
    ));

    return (
        <div className="project-container">
            <main className="game-container">
                <h1 className="title">
                    {gameWon ? <span>"🎉 Congrats, <br />You Won! 🎉"</span> : "Tenzies"}
                </h1>
                
                <p className="instructions">
                    Roll until all dice are the same. Click each die to freeze it 
                    at its current value between rolls.
                </p>


                <div className="stopwatch-container">
                    <Stopwatch
                        updateTime = {(time) =>setElapsedTime(time)}
                        stopTimer= {gameWon}
                        resetTimer={resetTimer}
                    />
                </div>

                <div className="dice-container">
                    {diceElements}
                </div>

                <button 
                    className="roll-dice-btn" 
                    onClick={rollDice}
                >
                    {gameWon ? "Restart Game" : "Roll"}
                </button>

            </main>
        </div>
    );
}