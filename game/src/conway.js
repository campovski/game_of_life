window.onload = function() {
    // get size of board
    speed = document.getElementById("simulSpeed").value;
    document.getElementById("speedSpan").innerHTML = speed;

    initEmptyBoard();
}


calculateCellSize = function(n) {
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return Math.min(width, height * 0.7) / n;
}


initEmptyBoard = function() {
    size = document.getElementById("fieldSize").value;
    cellSize = calculateCellSize(size);

    var boardString = "<table>\n";
    for (var i = 0; i < size; i++) {
        boardString += '\t<tr id="row' + i.toString() + '" class="row" style="height: ' +
        cellSize.toString() + 'px;">\n';
        for (var j = 0; j < size; j++) {
            boardString += '\t\t<td id="row' + i.toString() + 'col' + j.toString()
            + '" class="cell" + style="width: ' + cellSize.toString() + 'px;"></td>\n';
        }
        boardString += '\t</tr>\n';
    }
    boardString += "</table>\n";

    document.getElementById("gridHolder").innerHTML = boardString;
}
