$(document).ready(function() {
    var sizeInput = document.getElementById('area-size');

    sizeInput.addEventListener("keypress", function(e) {
            if (!String.fromCharCode(e.charCode).match(/[0-9]/)) e.preventDefault();
        });
    
    var gameCreator = new GameCreator(
        document.getElementById("btn-new-game"), function() {
            return parseInt(sizeInput.value);
        }, 
        $('#game-area')
    );
});

function GameCreator(trigger, getSize, gameArea) {
    this.getSize = getSize;
    this.gameArea = gameArea;
    trigger.addEventListener("click", this, false);
}

GameCreator.prototype.newGame = function() {
    var size = this.getSize();
    if (isNaN(size) || size == 0 || size > 10) alert("enter size from 1 to 10");
    else {
        alert("game in process. Area size is " + size);
        this.newTable(size);
    }
    this.turn = 'X';
    this.freeCells = size * size;
    this.winCond = (size < 5) ? 3 : 5;
}

GameCreator.prototype.handleEvent = function(event) {
    if (event.type == "click") {
        this.newGame();
    }
}

GameCreator.prototype.newTable = function(size) {
    this.table = []
    this.size = size;

    for(var i = 0; i < size; ++i) {
        this.table[i] = [];
        for(var j = 0; j < size; ++j) {
                this.table[i][j] = "-";
        }
    }

    var tableElem = $('<table>');

    for(var i = 0; i < size; ++i) {
        var row = $('<tr>');
        for(var j = 0; j < size; ++j) {
            var cellBtn = $('<div>').width('100%').height('100%').addClass('cell').addClass('smooth-change');

            cellBtn.click(this.clickHandler(cellBtn, i, j));

            var cell = $('<td>').width('50').height('50').append(cellBtn);
            row.append(cell);
        }
        tableElem.append(row);
    }

    this.gameArea.append(tableElem);
}

GameCreator.prototype.clickHandler = function(btn, i, j) {
    return () => {
        if (this.table[i][j] == '-') {
            this.table[i][j] = this.turn;
            this.freeCells--;

            btn.text(this.table[i][j]);

            if (this.freeCells == 0)  { 
                alert("n o w i n n e r");
                return;
            }

            if(this.checkWin(i, j)) {
                alert(this.turn + "won!");
                return;
            }

            if (this.turn == 'X') this.turn = 'O'
            else this.turn = 'X';
        }
    };
}

GameCreator.prototype.checkWin = function(x, y) {
    var stp = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    for(var i = 0; i < 3; ++i) {
        var total = 1;
        var sx = x + stp[i][0], sy = y + stp[i][1];
        while(sx < this.size && sy < this.size && this.table[sx][sy] == this.turn) 
        {
            sx += stp[i][0], sy += stp[i][1];
            ++total;
        }
        sx = x - stp[i][0], sy = y - stp[i][1];
        while(sx >= 0 && sy >= 0 && this.table[sx][sy] == this.turn) {
            sx -= stp[i][0], sy -= stp[i][1];
            ++total;
        }
        if (total >= this.winCond) {
            return true;
        }
    }
    return false;
}