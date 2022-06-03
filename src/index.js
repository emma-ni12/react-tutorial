import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}   //these are the props that get passed to Square
                onClick={() => this.props.onClick(i)}  //this is the prop onClick, a function that calls handleClick(i)
            />
        );
    }
  
    render() {
        let rows = [];
        for (let i = 0; i< 3; i++) {
            let row = [];
            for (let j=0; j<3; j++) {
                let box = this.renderSquare((3*i)+j);
                row.push(box);
            }
            rows.push(row);
        };
        // console.log(rows);
        // let frows = [];
        // for (let el in rows) {
        //     frows.push(<div className="board-row">{el}</div>);
        // }
        // rows.map((el)=> {
        //     return <div className="board-row">
        //         {el}
        //     </div>;
        // })
        console.log(rows);
        return (
            <div>
                <div className="board-row">
                    {rows[0]}
                </div>
                <div className="board-row">
                    {rows[1]}
                </div>
                <div className="board-row">
                    {rows[2]}
                </div>
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                pos: null,
                // bold: false,
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }
    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares: squares, pos: i, /*bold: false*/}]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {  //steps refers to the current history element value, move refers to current history element index
            const row = Math.floor(step.pos / 3) + 1;
            const col = step.pos % 3 + 1;
            const desc = move ? 'Go to move #' + move + ': row ' + row + ', col ' + col : 'Go to game start';
            // const b = step.bold ? "bold" : "regular";
            return (
                <li key={move}>
                    <button id={move} onClick={(e) => {
                        this.jumpTo(move); 
                        // //e.currentTarget.style.fontWeight = 'bold';
                        // for (let i=0; i < history.length; i++) {
                        //     if (i !== move) {
                        //         history[i].bold = false;
                        //         this.render();
                        //     } else history[i].bold = true;
                        // }
                    }} /*style={{fontWeight: b}}*/ >{desc}</button>
                </li>
            );
        });
        //bold();
        let status;
        if (winner === "draw") {
            status = 'Result is a draw';
        } else if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
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
            // lines[i].forEach((index) => {
            //     // const square = squares[index];
            //     // square.style = {backgroundColor: "yellow"};
            // });
            return squares[a];
        }
    }
    let draw = true;
    squares.forEach((square) => {
        if (square == null) {
            draw = false;
        }
    });
    if (draw) {
        return "draw";
    }
    return null;
}

