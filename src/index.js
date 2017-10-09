import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor() {
    super();
    this.width = 3;
    this.height = 3;
  }

  renderSquare(i) {
    return <Square
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
            />;
  }

  render() {
    const rows = [];
    for (let y = 0; y < this.height; y++) {
      const squares = [];
      for (let x = 0; x < this.width; x++) {
        squares[x] = this.renderSquare(x + y * this.height);
      }
      rows[y] = <div className="board-row">{squares}</div>;
    }

    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        placeTo: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
    };
  }

  getNextPlayer() {
    return this.state.xIsNext ? 'X': 'O';
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.getNextPlayer();
    this.setState({
      history: history.concat([{
        squares,
        placeTo: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  setMovesSortOrder(isAsc) {
    this.setState({isAsc});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const status = winner ?
                    `Winner: ${winner}` :
                    `Next player: ${this.getNextPlayer()}`;
    const moves = history.map((step,move) => {
      const desc = move ?
        `Go to move #${move} (${step.placeTo % 3 + 1}, ${Math.floor(step.placeTo / 3) + 1})`:
        'Go to game start';
      const buttonChild = move === this.state.stepNumber ?
        <b>{desc}</b> :
        desc;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{buttonChild}</button>
        </li>
      );
    });
    const ol = this.state.isAsc ? <ol>{moves}</ol> : <ol reversed>{moves.reverse()}</ol>;
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <input type="radio" name="sortOrder" checked={this.state.isAsc} onChange={() => this.setMovesSortOrder(true)}/>asc
          <input type="radio" name="sortOrder" checked={!this.state.isAsc} onChange={() => this.setMovesSortOrder(false)}/>desc
          {ol}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
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
  return null;
}