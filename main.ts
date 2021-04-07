interface snek{
    next:snek|null
    xPos:number
    yPos:number
}

const createArr = ():number[][] => {
    let arr:number[][] = new Array(30);
    let i = 0;
    while(i < 30){
        arr[i] = new Array(30);
        let j = 0;
        while(j < 30){
            arr[i][j] = 0;
            j++;
        }
        i++;
    }
    return arr;
}

const square = (arr:number[][]) => (context:CanvasRenderingContext2D) => (colour:number) => (x:number) => (y:number):void => {
    if(colour === 0){
        context.fillStyle = "#000000";
    }else if(colour === 1){
        context.fillStyle = "#00FF00";
    }else if(colour === 2){
        context.fillStyle = "#FF0000";
    }
    arr[y][x] = colour;
    context.fillRect(x * 20 , y * 20, 20, 20);
    context.stroke();
}

const snekNode = (x:number) => (y:number) => <snek> ({next:null, xPos:x, yPos:y});

const drawWholeSnek = (arr:number[][]) => (context:CanvasRenderingContext2D) => (input:snek):void =>{
    square(arr)(context)(1)(input.xPos)(input.yPos);
    if(input.next){
        drawWholeSnek(arr)(context)(input.next);
    }
}

const newApple = (arr:number[][]) => (context:CanvasRenderingContext2D):void => {
    let x;
    let y;
    do{
        x = Math.floor(Math.random() * 30);
        y = Math.floor(Math.random() * 30);
    }while(arr[y][x] !== 0);
    square(arr)(context)(2)(x)(y);
    console.log(x);
    console.log(y);
}

const iterate = (arr:number[][]) => (context:CanvasRenderingContext2D) => (node:snek) => (x:number) => (y:number):void => {
    if(node.next){
        const tempX = node.xPos;
        const tempY = node.yPos;
        node.xPos = x;
        node.yPos = y;
        iterate(arr)(context)(node.next)(tempX)(tempY);
    }else{
        square(arr)(context)(0)(node.xPos)(node.yPos);
        node.xPos = x;
        node.yPos = y;
    }
}
const move = (arr:number[][]) => (context:CanvasRenderingContext2D) => (node:snek) => (x:number) => (y:number):void =>{
    if(0 <= x && x < 30 && 0 <= y && y < 30){
        if(!arr[y][x]){
            square(arr)(context)(1)(x)(y);
            iterate(arr)(context)(node)(x)(y);
        }else if(arr[y][x] === 2){
            square(arr)(context)(1)(x)(y);
            const temp = snek.next;
            snek.next = snekNode(snek.xPos)(snek.yPos);
            snek.next.next = temp;
            snek.xPos = x;
            snek.yPos = y;
            newApple(arr)(context);
        }else if(arr[y][x] === 1){
            clearInterval(intervalID);
            alert("Ouchie, you bit yourself and lost ):");
        }
    }else{
        clearInterval(intervalID);
        alert("You lost :(");
    }
}

//Canvas starting conditions
const canvas = <HTMLCanvasElement> document.createElement("canvas");
document.body.innerHTML = "";
document.body.appendChild(canvas);
const context = <CanvasRenderingContext2D> canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
context.fillRect(0,0,600,600);
context.stroke();

const up = (arr:number[][]) => (node:snek):void => move(arr)(context)(node)(node.xPos)(node.yPos - 1);
const down = (arr:number[][]) => (node:snek):void => move(arr)(context)(node)(node.xPos)(node.yPos + 1);
const left = (arr:number[][]) => (node:snek):void => move(arr)(context)(node)(node.xPos - 1)(node.yPos);
const right = (arr:number[][]) => (node:snek):void => move(arr)(context)(node)(node.xPos + 1)(node.yPos);

//draw starnting snake and apple
const arr = createArr();
const snek = snekNode(7)(15);
snek.next = snekNode(6)(15);
snek.next.next = snekNode(5)(15);
snek.next.next.next = snekNode(4)(15);
const tail = snek.next.next.next;
drawWholeSnek(arr)(context)(snek);
newApple(arr)(context);

const dir = [right];

const intervalID = setInterval(() => {
    dir[0](arr)(snek);
    if(dir.length > 1){
        dir.shift();
    }
}, 100);

document.addEventListener("keypress", (e) => {
    if(e.code === "KeyW"){
        if(dir[0] !== down){
            dir.push(up);
        }
    }else if(e.code === "KeyS"){
        if(dir[0] !== up){
            dir.push(down);
        }
    }else if(e.code === "KeyA"){
        if(dir[0] !== right){
            dir.push(left);
        }
    }else if(e.code === "KeyD"){
        if(dir[0] !== left){
            dir.push(right);
        }
    }e
});