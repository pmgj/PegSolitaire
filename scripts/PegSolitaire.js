import CellState from "./CellState.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";

export default class PegSolitaire {
    constructor() {
        this.board = [
            [CellState.BLOCKED, CellState.BLOCKED, CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.BLOCKED, CellState.BLOCKED],
            [CellState.BLOCKED, CellState.BLOCKED, CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.BLOCKED, CellState.BLOCKED],
            [CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.PIECE],
            [CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.EMPTY, CellState.PIECE, CellState.PIECE, CellState.PIECE],
            [CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.PIECE],
            [CellState.BLOCKED, CellState.BLOCKED, CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.BLOCKED, CellState.BLOCKED],
            [CellState.BLOCKED, CellState.BLOCKED, CellState.PIECE, CellState.PIECE, CellState.PIECE, CellState.BLOCKED, CellState.BLOCKED]
        ];    
    }
    getBoard() {
        return this.board;
    }
    move(beginCell, endCell) {
        this.isValidMove(beginCell, endCell);
        let middleCell = this.getMiddleCell(beginCell, endCell);
        this.setCellState(beginCell, CellState.EMPTY);
        this.setCellState(endCell, CellState.PIECE);
        this.setCellState(middleCell, CellState.EMPTY);
        return this.endOfGame();
    }
    isValidMove(beginCell, endCell) {
        if (!this.onBoard(beginCell) || !this.onBoard(endCell)) {
            throw new Error("Origin or destination cell is not on the board.");
        }
        if (this.getCellState(beginCell) !== CellState.PIECE) {
            throw new Error("Origin does not contain a piece.");
        }
        if (this.getCellState(endCell) !== CellState.EMPTY) {
            throw new Error("Destination is not empty.");
        }
        let { x: i, y: j } = beginCell;
        let moves = [new Cell(i + 2, j), new Cell(i - 2, j), new Cell(i, j + 2), new Cell(i, j - 2)];
        if (!moves.some(m => m.equals(endCell))) {
            throw new Error("This move is invalid.");
        }
        let middleCell = this.getMiddleCell(beginCell, endCell);
        if (this.getCellState(middleCell) !== CellState.PIECE) {
            throw new Error("This move does not capture a piece.");
        }
    }
    endOfGame() {
        let count = this.countPieces(CellState.PIECE);
        if (count === 1) {
            return Winner.WIN;
        } else if (!this.possibleMoves()) {
            return Winner.LOSE;
        }
        return Winner.NONE;
    }
    possibleMoves() {
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                let beginCell = new Cell(i, j);
                if (this.board[i][j] === CellState.PIECE) {
                    let moves = [new Cell(i + 2, j), new Cell(i - 2, j), new Cell(i, j + 2), new Cell(i, j - 2)];
                    for (let m of moves) {
                        try {
                            this.isValidMove(beginCell, m);
                            if (this.onBoard(m)) {
                                return true;
                            }
                        } catch (ex) {

                        }
                    }
                }
            }
        }
        return false;
    }
    countPieces(player) {
        return this.board.flat().filter(a => a === player).length;
    }
    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, this.board.length) && inLimit(y, this.board[0].length));
    }
    setCellState({ x, y }, value) {
        this.board[x][y] = value;
    }
    getCellState({ x, y }) {
        return this.board[x][y];
    }
    getMiddleCell({ x: or, y: oc }, { x: dr, y: dc }) {
        return new Cell((or + dr) / 2, (oc + dc) / 2);
    }
}