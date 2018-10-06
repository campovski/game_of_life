window.onload = function() {
    isMouseDown = 0;
    speed = document.getElementById("simulSpeed").value;
    document.getElementById("speedSpan").innerHTML = speed;
    document.getElementById("simulSpeed").oninput = function() {
        document.getElementById("speedSpan").innerHTML = this.value;
    }

    document.onmousedown = function() { isMouseDown = 1; };
    document.onmouseup = function() { isMouseDown = 0; };

    board = [];
    previousBoard = [];
    boardCtrl(true);
}


calculateCellSize = function(n) {
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return Math.min(width * 0.8, height * 0.6) / n;
}


boardCtrl = function(clear) {
    if (clear) {
        size = document.getElementById("fieldSize").value;
        cellSize = calculateCellSize(size);
        board = [];
    } else {
        previousBoard = board;
        board = calculateNewPosition();
    }

    document.getElementById("gridHolder").innerHTML = generateBoardString(clear);
}


generateBoardString = function(clear) {
    boardString = "<table>\n";
    for (var i = 0; i < size; i++) {
        boardString += '\t<tr id="row' + i.toString() + '" class="row" style="height: ' +
                        cellSize.toString() + 'px;">\n';
        if (clear) {
            board.push([]);
        }
        for (var j = 0; j < size; j++) {
            if (clear) {
                board[i].push(0);
            }
            boardString += '\t\t<td id="row' + i.toString() + 'col' + j.toString()
                            + '" onmousedown="isMouseDown = 1; selectField(' + i.toString() + ', ' + j.toString() +
                            ');" onmouseenter="selectField(' + i.toString() + ', ' + j.toString() +
                            ');" style="width: ' + cellSize.toString() + 'px;"';
            if (board[i][j]) {
                boardString += ' class="selected"';
            }
            boardString += '></td>\n';
        }
        boardString += '\t</tr>\n';
    }
    boardString += "</table>\n";

    return boardString;
}


selectField = function(i, j) {
    if (isMouseDown) {
        board[i][j] = 1;
        document.getElementById("row" + i.toString() + "col" + j.toString()).classList.add("selected");
    }
}


removeField = function(i, j) {
    board[i][j] = 0;
    document.getElementById("row" + i.toString() + "col" + j.toString()).classList.remove("selected");
}


calculateNewPosition = function() {
    tmpBoard = [];
    for (var i = 0; i < size; i++) {
        tmpBoard.push([]);
        for (var j = 0; j < size; j++) {
            tmpBoard[i].push(getNewValue(i, j));
        }
    }
    return tmpBoard;
}


getNewValue = function(i, j) {
    var sumOfNeighbours;
    if (i == 0) {
        if (j == 0) {
            sumOfNeighbours = board[i][j+1] + board[i+1][j] + board[i+1][j+1];
        } else if (j == size - 1) {
            sumOfNeighbours = board[i][j-1] + board[i+1][j] + board[i+1][j-1];
        } else {
            sumOfNeighbours = board[i][j+1] + board[i+1][j] + board[i+1][j+1] + board[i+1][j-1] + board[i][j-1];
        }
    } else if (i == size - 1) {
        if (j == 0) {
            sumOfNeighbours = board[i][j+1] + board[i-1][j] + board[i-1][j+1];
        } else if (j == size - 1) {
            sumOfNeighbours = board[i][j-1] + board[i-1][j] + board[i-1][j-1];
        } else {
            sumOfNeighbours = board[i][j+1] + board[i-1][j] + board[i-1][j+1] + board[i-1][j-1] + board[i][j-1];
        }
    } else if (j == 0) {
        sumOfNeighbours = board[i-1][j] + board[i-1][j+1] + board[i][j+1] + board[i+1][j+1] + board[i+1][j];
    } else if (j == size - 1) {
        sumOfNeighbours = board[i-1][j] + board[i-1][j-1] + board[i][j-1] + board[i+1][j-1] + board[i+1][j];
    } else {
        sumOfNeighbours = board[i-1][j] + board[i-1][j+1] + board[i][j+1] + board[i+1][j+1] + board[i+1][j] +
                          board[i+1][j-1] + board[i][j-1] + board[i-1][j-1];
    }

    if (board[i][j]) {
        return (sumOfNeighbours == 3 || sumOfNeighbours == 2) ? 1 : 0;
    }
    return (sumOfNeighbours == 3) ? 1 : 0;
}


sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


simulate = async function() {
    stopSimul = false;
    do {
        speed = document.getElementById("simulSpeed").value;
        await sleep(1000 / speed);
        boardCtrl(false);
        if (stopSimul) {
            return;
        }
    } while (!boardsEqual(board, previousBoard));
    stopSimul = true;
}


boardsEqual = function(arr1, arr2) {
    if (arr1.length != arr2.length || arr1[0].length != arr2[0].length) {
        return false;
    }

    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr1.length; j++) {
            if (arr1[i][j] != arr2[i][j]) {
                return false;
            }
        }
    }
    return true;
}
