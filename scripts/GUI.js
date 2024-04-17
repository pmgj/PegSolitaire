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
    play(evt) {
        let td = evt.currentTarget;
        if (this.origin) {
            this.innerPlay(this.origin, td, true);
        } else {
            this.origin = td;
        }
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
        this.innerPlay(this.origin, td, false);
    }
    innerPlay(beginTD, endTD, animation) {
        let beginCell = this.coordinates(beginTD);
        let endCell = this.coordinates(endTD);
        try {
            let mr = this.game.move(beginCell, endCell);
            let image = beginTD.firstChild;
            const time = 1000;
            let removePiece = ({ x: or, y: oc }, { x: dr, y: dc }) => {
                let img = document.querySelector(`tr:nth-child(${(or + dr) / 2 + 1}) td:nth-child(${(oc + dc) / 2 + 1}) img`);
                let anim = img.animate([{ opacity: 1 }, { opacity: 0 }], time);
                anim.onfinish = () => img.parentNode.innerHTML = "";
            }
            let animatePiece = (startPosition, endPosition) => {
                let piece = this.getTableData(startPosition).firstChild;
                let { x: a, y: b } = startPosition;
                let { x: c, y: d } = endPosition;
                let td = document.querySelector("td");
                let size = td.offsetWidth;
                let anim = piece.animate([{ top: 0, left: 0 }, { top: `${(c - a) * size}px`, left: `${(d - b) * size}px` }], time);
                removePiece(startPosition, endPosition);
                anim.onfinish = () => endTD.appendChild(piece);
            };
            if (animation) {
                animatePiece(beginCell, endCell);
            } else {
                removePiece(beginCell, endCell);
                endTD.appendChild(image);
            }
            this.changeMessage(mr);
        } catch (ex) {
            this.setMessage(ex.message);
        }
        this.origin = null;
    }
    getTableData({ x, y }) {
        let table = document.querySelector("table");
        return table.rows[x].cells[y];
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
    init() {
        this.game = new PegSolitaire();
        let board = this.game.getBoard();
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
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
                td.onclick = this.play.bind(this);
                td.ondragover = this.allowDrop.bind(this);
                td.ondrop = this.drop.bind(this);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
    registerEvents() {
        this.init();
        let iniciar = document.querySelector("input[type='button']");
        iniciar.onclick = this.init.bind(this);
    }
}
let gui = new GUI();
gui.registerEvents();