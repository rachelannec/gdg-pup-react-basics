import React, { useState, useEffect } from "react";
import "./TenziesProject.css";
import Die from "./Die";
import Stopwatch from "./timer"

export default function TenziesProject() {
    const [players, setPlayers] = useState([]); // list of player
    const [currentPlayer, setCurrentPlayer] = useState("") // current playing player
    const [dice, setDice] = useState(() => generateAllNewDice());
    const [times, setTimes] =useState([]); // store time for each player
    const [gameWon, setGameWon] = useState(false);
    

    //gameWOn
    // const gameWon = dice.every(die => die.isClicked) && dice.every(die => die.value === dice[0].value)

    // generateAllNewDice function
    function generateAllNewDice() {
        const newDice = [];
        for (let i = 0; i < 10; i++) {
            const rand = { 
                value: Math.ceil(Math.random() * 6), 
                isClicked: false,
                id: i + 1 
            };
            newDice.push(rand);
        }
        return newDice;
    }

    //rollDice function
    function rollDice() {
        if (!gameWon) {
            setDice(oldDice =>
                oldDice.map(die => 
                    die.isClicked ? die : { ...die, value: Math.ceil(Math.random() * 6) }
                )
            );
        } else {
            setDice(generateAllNewDice());
            setGameWon(false);
        }
    }

    //hold function - freeze the die
    function hold(id) {
        setDice(oldDice =>
            oldDice.map(die =>
                die.id === id ? { ...die, isClicked: !die.isClicked } : die
            )
        );
    }

    // check if the game is won
    useEffect(() =>{
        const gameIsWon = 
        dice.every(die => die.isClicked) && 
        dice.every(die => die.value === dice[0].value);

        if (gameIsWon) {
            setGameWon(true);
        }
    }, [dice]);


    // add player to list
    function addPlayer() {
        if (currentPlayer.trim() === "") return;

        setPlayers([...players, { name: currentPlayer, time: null}]);
        setCurrentPlayer("");
    }

    //update timee for each player
    function updateTime(playerName, elapsedTime) {
        setTimes(prevTimes => [
            ...prevTimes,
            { name: playerName, time: elapsedTime }
        ]);
    }

    // determeine winner
    function determineWinner() {
        const completedTimes = times.filter(player => player.time !== null);
        if (completedTimes.length === 0) return null;
    
        return completedTimes.reduce((best, player) =>
            player.time < best.time ? player : best
        );
    }
    
    const winner = determineWinner();

    const diceElements = dice.map(dieObj => (
        <Die
            key = {dieObj.id}
            value = {dieObj.value}
            isClicked = {dieObj.isClicked}
            hold = {hold}
            id = {dieObj.id}
        />
    ));

    const playerTimer = players.map(player => (
        <Stopwatch
            key = {player.name}
            updateTime = {updateTime}
            playerName = {player.name}

        />
    ))

    return (
        <div className="project-container">
          <main className="game-main">
            <header className="game-header">
              <h1 className="title">{gameWon ? "🎉 Congrats, You Won! 🎉" : "Tenzies"}</h1>
              <p className="instructions">
                Roll until all dice are the same. Click each die to freeze it at its 
                current value between rolls.
              </p>
            </header>
      
            <section className="player-section">
              <div className="player-management">
                <input
                  type="text"
                  placeholder="Enter player name"
                  value={currentPlayer}
                  onChange={e => setCurrentPlayer(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addPlayer()}
                  aria-label="Player name input"
                  disabled={gameWon}
                />
                <button 
                  onClick={addPlayer} 
                  disabled={!currentPlayer.trim() || gameWon}
                  aria-label="Add player"
                >
                  Add Player
                </button>
              </div>
      
              {players.length > 0 && (
                <div className="players-list">
                  <h3>Current Players:</h3>
                  <ul aria-label="Player list">
                    {players.map((player) => (
                      <li 
                        key={player.name}
                        className={winner?.name === player.name ? 'winner' : ''}
                      >
                        <span className="player-name">{player.name}</span>
                        <span className="player-status">
                          {player.time ? `Finished in ${player.time}s` : 'Playing...'}
                        </span>
                        {winner?.name === player.name && (
                          <span className="winner-badge" aria-hidden="true">🏆</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
      
            <section className="game-section" aria-live="polite">
              <div className="dice-container">
                {diceElements}
              </div>
      
              <button 
                className="roll-dice-btn" 
                onClick={rollDice}
                disabled={players.length === 0}
                aria-label={gameWon ? "Start new game" : "Roll dice"}
              >
                {gameWon ? "New Game" : "Roll"}
              </button>
            </section>
      
            {gameWon && winner && (
              <section className="winner-section" aria-live="assertive">
                <h2 className="winner-message">
                  {winner.name} with {winner.time}s!
                </h2>
              </section>
            )}
          </main>
        </div>
      );
}
