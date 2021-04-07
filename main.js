"use strict";
var createArr = function () {
    var arr = new Array(30);
    var i = 0;
    while (i < 30) {
        arr[i] = new Array(30);
        var j = 0;
        while (j < 30) {
            arr[i][j] = 0;
            j++;
        }
        i++;
    }
    return arr;
};
var square = function (arr) { return function (context) { return function (colour) { return function (x) { return function (y) {
    if (colour === 0) {
        context.fillStyle = "#000000";
    }
    else if (colour === 1) {
        context.fillStyle = "#00FF00";
    }
    else if (colour === 2) {
        context.fillStyle = "#FF0000";
    }
    arr[y][x] = colour;
    context.fillRect(x * 20, y * 20, 20, 20);
    context.stroke();
}; }; }; }; };
var snekNode = function (x) { return function (y) { return ({ next: null, xPos: x, yPos: y }); }; };
var drawWholeSnek = function (arr) { return function (context) { return function (input) {
    square(arr)(context)(1)(input.xPos)(input.yPos);
    if (input.next) {
        drawWholeSnek(arr)(context)(input.next);
    }
}; }; };
var newApple = function (arr) { return function (context) {
    var x;
    var y;
    do {
        x = Math.floor(Math.random() * 30);
        y = Math.floor(Math.random() * 30);
    } while (arr[y][x] !== 0);
    square(arr)(context)(2)(x)(y);
    console.log(x);
    console.log(y);
}; };
var iterate = function (arr) { return function (context) { return function (node) { return function (x) { return function (y) {
    if (node.next) {
        var tempX = node.xPos;
        var tempY = node.yPos;
        node.xPos = x;
        node.yPos = y;
        iterate(arr)(context)(node.next)(tempX)(tempY);
    }
    else {
        square(arr)(context)(0)(node.xPos)(node.yPos);
        node.xPos = x;
        node.yPos = y;
    }
}; }; }; }; };
var move = function (arr) { return function (context) { return function (node) { return function (x) { return function (y) {
    if (0 <= x && x < 30 && 0 <= y && y < 30) {
        if (!arr[y][x]) {
            square(arr)(context)(1)(x)(y);
            iterate(arr)(context)(node)(x)(y);
        }
        else if (arr[y][x] === 2) {
            square(arr)(context)(1)(x)(y);
            var temp = snek.next;
            snek.next = snekNode(snek.xPos)(snek.yPos);
            snek.next.next = temp;
            snek.xPos = x;
            snek.yPos = y;
            newApple(arr)(context);
        }
        else if (arr[y][x] === 1) {
            clearInterval(intervalID);
            alert("Ouchie, you bit yourself and lost ):");
        }
    }
    else {
        clearInterval(intervalID);
        alert("You lost :(");
    }
}; }; }; }; };
//Canvas starting conditions
var canvas = document.createElement("canvas");
document.body.innerHTML = "";
document.body.appendChild(canvas);
var context = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
context.fillRect(0, 0, 600, 600);
context.stroke();
var up = function (arr) { return function (node) { return move(arr)(context)(node)(node.xPos)(node.yPos - 1); }; };
var down = function (arr) { return function (node) { return move(arr)(context)(node)(node.xPos)(node.yPos + 1); }; };
var left = function (arr) { return function (node) { return move(arr)(context)(node)(node.xPos - 1)(node.yPos); }; };
var right = function (arr) { return function (node) { return move(arr)(context)(node)(node.xPos + 1)(node.yPos); }; };
//draw starnting snake and apple
var arr = createArr();
var snek = snekNode(7)(15);
snek.next = snekNode(6)(15);
snek.next.next = snekNode(5)(15);
snek.next.next.next = snekNode(4)(15);
var tail = snek.next.next.next;
drawWholeSnek(arr)(context)(snek);
newApple(arr)(context);
var dir = [right];
var intervalID = setInterval(function () {
    dir[0](arr)(snek);
    if (dir.length > 1) {
        dir.shift();
    }
}, 100);
document.addEventListener("keypress", function (e) {
    if (e.code === "KeyW") {
        if (dir[0] !== down) {
            dir.push(up);
        }
    }
    else if (e.code === "KeyS") {
        if (dir[0] !== up) {
            dir.push(down);
        }
    }
    else if (e.code === "KeyA") {
        if (dir[0] !== right) {
            dir.push(left);
        }
    }
    else if (e.code === "KeyD") {
        if (dir[0] !== left) {
            dir.push(right);
        }
    }
    e;
});
