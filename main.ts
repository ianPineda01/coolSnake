interface snek{
    next:snek|null
    xPos:number
    yPos:number
}

const createArr: () => Array<Array<number>> = () =>  {
    let arr:Array<any> = new Array(30);
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

const arr:Array<Array<number>> = createArr();

const square = (colour:number) => (x:number) => (y:number):void => {
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

const drawWholeSnek = (input:snek):void =>{
    square(1)(input.xPos)(input.yPos);
    console.log(input.yPos);
    console.log(input.xPos);
    if(input.next){
        drawWholeSnek(input.next);
    }
}

const newApple = ():void => {
    let x;
    let y;
    do{
        x = Math.floor(Math.random() * 30);
        y = Math.floor(Math.random() * 30);
    }while(arr[y][x] !== 0);
    square(2)(x)(y);
}

const iterate = (node:snek) => (x:number) => (y:number):void => {
    if(node.next){
        const tempX = node.xPos;
        const tempY = node.yPos;
        node.xPos = x;
        node.yPos = y;
        iterate(node.next)(tempX)(tempY);
    }else{
        square(0)(node.xPos)(node.yPos);
        node.xPos = x;
        node.yPos = y;
    }
}

const move = (node:snek) => (x:number) => (y:number):void =>{
    if(0 <= x && x < 30 && 0 <= y && y < 30 && !arr[y][x]){
        square(1)(x)(y);
        iterate(node)(x)(y);
    }else if(arr[y][x] === 2){
        square(1)(x)(y);
        newApple();
        const temp = snek.next;
        snek.next = snekNode(snek.xPos)(snek.yPos);
        snek.next.next = temp;
        snek.xPos = x;
        snek.yPos = y;
        newApple();
    }else{
        alert("oh no, anyways");
    }
}

const up = (node:snek):void => move(node)(node.xPos)(node.yPos - 1);
const down = (node:snek):void => move(node)(node.xPos)(node.yPos + 1);
const left = (node:snek):void => move(node)(node.xPos - 1)(node.yPos);
const right = (node:snek):void => move(node)(node.xPos + 1)(node.yPos);

//Canvas starting conditions
const canvas = <HTMLCanvasElement> document.querySelector("canvas");
const context = <CanvasRenderingContext2D> canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
context.fillRect(0,0,600,600);
context.stroke();

//draw starnting snake and apple
const snek = snekNode(7)(15);
snek.next = snekNode(6)(15);
snek.next.next = snekNode(5)(15);
snek.next.next.next = snekNode(4)(15);
drawWholeSnek(snek);
newApple();