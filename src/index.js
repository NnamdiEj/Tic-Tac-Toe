import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Function used to render square
// Creates a button that will hold and display its state "onClick"
// Functional component of board class
function Square(props) {
    return (
        <button className="square"
                onClick={props.onClick}
        >
            <span className={props.color}>{props.value}</span>
        </button>
    );
}

// Board Class
class Board extends React.Component {

    // Function used to render squares to the screen
    // Looks for "ith" square in aforementioned array
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                color={this.squareColor(i)}
            />
        );
    }

    // Logic driving color of characters inside of squares
    // If three squares constitute a win, those squares change colors
    squareColor(i) {

        if (this.props.gameWon) {
            for (let j = 0; j < 3; j++) {
                if (i === this.props.gameWon.winner[j])
                    return 'red';
            }
        }
        return 'black';
    }

    // Function used to render board to the screen
    // Renders square in rows (separated by divs) to simulate tic-tac-toe board
    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }

}

// Scoreboard class
class Scoreboard extends React.Component {

    // Scoreboard constructor
    constructor(props) {
        super(props);
        this.state = {
            playerOneName: 'Player 1',
            playerTwoName: 'Player 2',
        };
    }

    // Function to handle change of each player's name
    // Updates player name in "scoreboard's" state
    handleChange(evt) {
        if (evt.target.className === 'playerOne') {
            this.setState({
                playerOneName: evt.target.value
            });
        } else if (evt.target.className === 'playerTwo') {
            this.setState({
                playerTwoName: evt.target.value
            });
        }
    }

    // Sets list item "class" property depending on current score
    handleScore(player) {
        if (player === 'one') {
            if (this.props.playerOneScore > this.props.playerTwoScore) {
                return 'green';
            } else if (this.props.playerOneScore < this.props.playerTwoScore) {
                return 'red';
            }
        } else if (player === 'two') {
            if (this.props.playerOneScore < this.props.playerTwoScore) {
                return 'green';
            } else if (this.props.playerOneScore > this.props.playerTwoScore) {
                return 'red';
            }
        }
    }

    // Scoreboard render function
    render() {

        // Status to be displayed in 'status' block below
        let status;

        // Updates 'winning' status based on which character created winning sequence
        // and which player was in control of that character
        if (this.props.winner) {

            // X is the winner
            if (this.props.winner.square === 'X') {
                if (this.props.playerOneX) {
                    status = 'Winner is: ' + this.state.playerOneName + '!';
                } else {
                    status = 'Winner is: ' + this.state.playerTwoName + '!';
                }
            }

            // O is the winner
            else {
                if (this.props.playerOneX) {
                    status = 'Winner is: ' + this.state.playerTwoName + '!';
                } else {
                    status = 'Winner is: ' + this.state.playerOneName + '!';
                }
            }

        }

        // Game is over but there is no winner
        // AKA 'Draw'
        else if (this.props.gameOver) {
            status = "It's a Draw!";
        }

        // Game has been started but has not yet concluded
        // Drives logic to display which player's turn it is
        else if (this.props.gameStarted) {

            if (this.props.xIsNext) {
                if (this.props.playerOneX) {
                    status = this.state.playerOneName + "'s Turn: X";
                } else {
                    status = this.state.playerTwoName + "'s Turn: X";
                }
            } else {
                if (this.props.playerOneX) {
                    status = this.state.playerTwoName + "'s Turn: O";
                } else {
                    status = this.state.playerOneName + "'s Turn: O";
                }
            }

        }

        // Rendered when game has been started
        // Includes game status, players, and their scores
        if (this.props.gameStarted) {
                let scoreOne = this.state.playerOneName + ': ' + this.props.playerOneScore + ' points.';
                let scoreTwo = this.state.playerTwoName + ': ' + this.props.playerTwoScore + ' points.';
                return (
                    <div className="game-stats">
                        <div className="score">
                            <div className="game-info">
                                <span id="game-status" className={this.props.gameStatus} onChange={this.updateScore}>{status}</span>
                                <ul onChange={this.updateScore}>{this.props.moves}</ul>
                            </div>
                        </div>
                        <div className="scoreboard">
                            <ul className="player-scores">
                                <u>Score</u>
                                <li className={this.handleScore('one')}>{scoreOne}</li>
                                <li className={this.handleScore('two')}>{scoreTwo}</li>
                            </ul>
                        </div>
                    </div>
                )
        }

        // Rendered when game has not been started
        // Includes name entry
        else if (!this.props.gameStarted) {

            return (
                    <div className="scoreboard">
                        Player 1: <input type="text" onChange={ (evt) => this.handleChange(evt) } className="playerOne" placeholder="Enter Player 1's Name"></input>
                        <br/>
                        Player 2: <input type="text" value={this.state.value} onChange={ (evt) => this.handleChange(evt) } className="playerTwo" placeholder="Enter Player 2's Name"></input>
                    </div>
            );
        }

    }

}

// Game class
class Game extends React.Component {

    // Game constructor
    // Keeps track of move history using 'history' array
    constructor(props) {
        super(props);
        this.state = {
            history : [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            gameStarted: false,
            playerOneX: true,
            playerOneScore: 0,
            playerTwoScore: 0
        };
    }

    // Callback function when reset button is clicked
    handleReset() {
        this.updateScore();
        this.setState({
            history : [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            playerOneX: !this.state.playerOneX
        });
    }

    // Callback function when start button is clicked
    handleStart() {
        this.setState({
            gameStarted: true
        });
    }

    // Function that sends current game status to scoreboard
    gameStatus() {
        let history = this.state.history;

        if (calculateWinner(history[history.length-1].squares)) {
            return 'winner';
        } else if (this.state.history.length === 10) {
            return 'draw';
        } else {
            return 'in-progress';
        }
    }

    updateScore() {
        console.log('Score updated');

        let history = this.state.history;
        let winner = calculateWinner(history[history.length-1].squares);

        if (winner) {
            if (winner.square === 'X') {
                if (this.state.playerOneX) {
                    this.setState({
                        playerOneScore: this.state.playerOneScore + 1
                    });
                } else {
                    this.setState({
                        playerTwoScore: this.state.playerTwoScore + 1
                    });
                }
            } else {
                console.log('O wins!');
                if (this.state.playerOneX) {
                    this.setState({
                        playerTwoScore: this.state.playerTwoScore + 1
                    });
                } else {
                    this.setState({
                        playerOneScore: this.state.playerOneScore + 1
                    });
                }
            }
        }
    }

    // Function used to render game to the screen
    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves;
        if (this.state.gameStarted) {
            moves = history.map((step, move) => {
                let desc = move ?
                    'Go to Move #' + move :
                    'Go to Game Start';
                desc = this.state.stepNumber === move ? <b><span className='step-button-text'>{desc}</span></b> :
                    <span className='step-button-text'>{desc}</span>;
                return (
                    <li key={move}>
                        <button className="step-button" onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                    </li>
                )
            });
        }

        return (
            <div className="content">
                <div className="introduction">
                    Tic-Tac-Toe
                </div>
                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                            gameWon={winner}
                        />
                        <button className="game-button" onClick={() => this.handleStart()}>
                            <span>Start Game</span>
                        </button>
                        <button className="game-button" onClick={() => this.handleReset()}>
                            <span>Reset Game</span>
                        </button>
                    </div>
                        <Scoreboard
                            gameStarted={this.state.gameStarted}
                            moves={moves}
                            winner={winner}
                            gameOver={this.state.history.length === 10}
                            xIsNext={this.state.xIsNext}
                            playerOneX={this.state.playerOneX}
                            playerOneScore={this.state.playerOneScore}
                            playerTwoScore={this.state.playerTwoScore}
                            gameStatus={this.gameStatus()}
                        />
                </div>
            </div>
        );
    }

    // Callback function when any square has been clicked
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();

        if (this.state.gameStarted && squares[i] === null && !calculateWinner(squares)) {
            squares[i] = (this.state.xIsNext ? 'X' : 'O');

            this.setState({
                history: history.concat([{
                    squares: squares
                }]),
                xIsNext : !this.state.xIsNext,
                stepNumber: history.length
            });
        }

    }

    // Callback function when any button in 'moves' list is clicked
    // Allows user to 'time travel' back to right after desired move was made
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: ((step % 2) === 0)
        });
    }

}

// ================================

// Render game to DOM in place of 'root' element
ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
    /*const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;*/

    const calcRows = checkRows(squares);
    const calcCols = checkColumns(squares);
    const calcDiags = checkDiagonals(squares);

    if (calcRows) {
        return calcRows;
    } else if (calcCols) {
        return calcCols;
    } else if (calcDiags) {
        return calcDiags;
    } else {
        return null;
    }



}

function checkRows(squares) {

    for (let row = 0; row < 3; row++) {
    let square = squares[row*3];
        if (square && square === squares[row*3+1] && square === squares[row*3+2]) {
            return {
                square: square,
                winner: [row*3, row*3+1, row*3+2]
            };
        }

    }
    return null;

}

function checkColumns(squares) {

    for (let col = 0; col < 3; col++) {

        let square = squares[col];
        if (square && square === squares[col + 3] && square === squares[col + 6]) {
            return {
                square: square,
                winner: [col, col+3, col+6]
            };
        }
    }
    return null;
}

function checkDiagonals(squares) {
    let leftSquare = squares[0];
    let rightSquare = squares[2];

    // Left Diagonal
    if (leftSquare) {
        if (leftSquare === squares[4] && leftSquare === squares[8]) {
            return {
                square: leftSquare,
                winner: [0, 4, 8]
            };
        }

    }

    // Right Diagonal
    if (rightSquare) {
        if (rightSquare === squares[4] && rightSquare === squares[6]) {
            return {
                square: rightSquare,
                winner: [2, 4, 6]
            };
        }
    }
    return null;
}