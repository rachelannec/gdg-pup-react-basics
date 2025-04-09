import React, { useState, useEffect, useRef } from "react";
import "./TenziesProject.css";
import Die from "./Die";
import Stopwatch from "./timer";

export default function TenziesProject() {
    // Game state
    const [dice, setDice] = useState(generateAllNewDice);
    const [gameWon, setGameWon] = useState(false);
    
    // Player management
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState("");
    const [times, setTimes] = useState([]);
    const startTimeRef = useRef(null);
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);

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
            // Move to next player or back to first player
            setActivePlayerIndex(prev => (prev + 1) % players.length);
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

    // Check for win condition
    useEffect(() => {
        const allDiceHeld = dice.every(die => die.isClicked);
        const allSameValue = dice.every(die => die.value === dice[0].value);
        
        if (allDiceHeld && allSameValue && players.length > 0) {
            setGameWon(true);
            if (startTimeRef.current) {
                const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
                updatePlayerTime(players[activePlayerIndex].name, elapsedTime);
            }
        }
    }, [dice, players, activePlayerIndex]);

    // Add new player
    function addPlayer() {
        const trimmedName = currentPlayer.trim();
        if (!trimmedName || players.some(p => p.name === trimmedName)) return;

        setPlayers(prevPlayers => [
            ...prevPlayers, 
            { name: trimmedName, time: null }
        ]);
        setCurrentPlayer("");
        if (players.length === 0) {
            startTimeRef.current = Date.now();
        }
    }

    // Update player time
    function updatePlayerTime(playerName, elapsedTime) {
        setTimes(prevTimes => [
            ...prevTimes,
            { name: playerName, time: elapsedTime }
        ]);
    }

    // Reset game state
    function resetGame() {
        setDice(generateAllNewDice());
        setGameWon(false);
        startTimeRef.current = Date.now();
    }

    // Determine winner
    function determineWinner() {
        const completedTimes = times.filter(player => player.time !== null);
        if (completedTimes.length === 0) return null;

        const minTime = Math.min(...completedTimes.map(p => p.time));
        return completedTimes.filter(player => player.time === minTime);
    }

    // Memoized derived values
    const winners = determineWinner();
    const currentPlayerName = players[activePlayerIndex]?.name || "";
    
    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            isClicked={die.isClicked}
            hold={() => holdDice(die.id)}
            disabled={players.length === 0 || gameWon}
        />
    ));

    return (
        <div className="project-container">
            <main className="game-container">
                <h1 className="title">
                    {gameWon ? "🎉 Congrats, You Won! 🎉" : "Tenzies"}
                </h1>
                
                <p className="instructions">
                    Roll until all dice are the same. Click each die to freeze it 
                    at its current value between rolls.
                </p>

                <div className="player-management">
                    <input
                        type="text"
                        placeholder="Enter player name"
                        value={currentPlayer}
                        onChange={(e) => setCurrentPlayer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                        disabled={gameWon}
                    />
                    <button 
                        onClick={addPlayer} 
                        disabled={!currentPlayer.trim() || gameWon}
                    >
                        Add Player
                    </button>
                </div>

                <div className="players-list">
                    <h3>Players {players.length > 0 ? `(${players.length})` : ''}:</h3>
                    {players.length === 0 ? (
                        <p className="no-players">No players added yet</p>
                    ) : (
                        <ul>
                            {players.map((player, index) => (
                                <li 
                                    key={player.name}
                                    className={`
                                        ${winners?.some(w => w.name === player.name) ? "winner" : ""}
                                        ${index === activePlayerIndex ? "active-player" : ""}
                                    `}
                                    aria-current={
                                        winners?.some(w => w.name === player.name) ? "true" : undefined
                                    }
                                >
                                    {player.name} - {player.time ? `${player.time}s` : "Playing..."}
                                    {index === activePlayerIndex && !gameWon && " (Current)"}
                                    {winners?.some(w => w.name === player.name) && (
                                        <span className="visually-hidden"> (BEST TIME)</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {players.length > 0 && (
                    <div className="current-player">
                        Current Turn: <strong>{currentPlayerName}</strong>
                    </div>
                )}

                <div className="dice-container">
                    {diceElements}
                </div>

                <button 
                    className="roll-dice-btn" 
                    onClick={rollDice}
                    disabled={players.length === 0}
                >
                    {gameWon ? "Next Player" : "Roll"}
                </button>

                {gameWon && winners && (
                    <div className="winner-announcement">
                        <h2> 
                            {winners.map(winner => (
                                <span key={winner.name}> {winner.name} ({winner.time}s)</span>
                            ))}!
                        </h2>
                    </div>
                )}
            </main>
        </div>
    );
}