import CellState from "./CellState.js";
import PegSolitaire from "./PegSolitaire.js";
import Cell from "./Cell.js";

class GUI {
    constructor() {
        this.origin = null;
        this.game = null;
    }
    coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    drag(evt) {
        let img = evt.currentTarget;
        this.origin = img.parentNode;
    }
    allowDrop(evt) {
        evt.preventDefault();
    }
    drop(evt) {
        evt.preventDefault();
        let td = evt.currentTarget;
        let beginCell = this.coordinates(this.origin);
        let endCell = this.coordinates(td);
        try {
            let mr = this.game.move(beginCell, endCell);
            let img = this.origin.firstChild;
            td.appendChild(img);
            this.removePiece(beginCell, endCell);
            this.changeMessage(mr);
        } catch (ex) {
            this.setMessage(ex.message);
        }
    }
    changeMessage(m) {
        let objs = { WIN: "You win!", LOSE: "You lose!" };
        if (objs[m]) {
            this.setMessage(`Game Over! ${objs[m]}`);
        } else {
            this.setMessage("");
        }
    }
    setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    removePiece({ x: or, y: oc }, { x: dr, y: dc }) {
        var img = document.querySelector(`tr:nth-child(${(or + dr) / 2 + 1}) td:nth-child(${(oc + dc) / 2 + 1}) img`);
        img.className = "fade";
        setTimeout(() => img.parentNode.removeChild(img), 1000);
    }
    init() {
        this.game = new PegSolitaire();
        let board = this.game.getBoard();
        let tbody = document.querySelector("tbody");
        for (let i = 0; i < board.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < board[i].length; j++) {
                let c = board[i][j];
                let td = document.createElement("td");
                if (c === CellState.PIECE) {
                    let img = document.createElement("img");
                    img.src = "piece.svg";
                    img.ondragstart = this.drag.bind(this);
                    td.appendChild(img);
                }
                td.ondragover = this.allowDrop.bind(this);
                td.ondrop = this.drop.bind(this);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
}
let gui = new GUI();
gui.init();