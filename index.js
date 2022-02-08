function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getNewFood(obstacles){
    const prev = {
        x: Math.floor(Math.random()*17+1) * box,
        y: Math.floor(Math.random()*15+3) * box
    };
    for (let i = 0; i < obstacles.length; i++) {
        if(obstacles[i][0] === prev.x && obstacles[i][1] === prev.y){
            return getNewFood(obstacles);
        }
    }
    return prev;
}

// Canvas
const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

const piedra = new Image();
piedra.src = "img/piedra.png";

// load audio files
let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// create the snake
let snake = [];
snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the food
let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create obstacles 1 to 15 objects;
let obstacles = Array.from({length: getRandomInt(1, 15)})
.map(()=>[getRandomInt(3, 17)*box, getRandomInt(3, 15)*box])
.filter((item) => !(item[0] === snake[0].x && item[1] === snake[0].y))


// create the score var
let score = 0;

//control the snake
let d;

document.addEventListener("keydown",direction);
function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();
    }
}

// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

function collisionToPiedra(head, obstacles){
    for(let i = 0; i < obstacles.length; i++){
        if(head.x == (obstacles[i][0]) && head.y == (obstacles[i][1])){
            return true;
        }
    }
    return false;
}

// draw everything to the canvas
function draw(){
    ctx.drawImage(ground,0,0);
    
    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "black" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    
    ctx.drawImage(foodImg, food.x, food.y);

    for(let i = 0; i < obstacles.length; i++){
        ctx.drawImage(piedra, obstacles[i][0], obstacles[i][1], 32, 32);
    }
    
    // Winner
    if(score === 30){
        document.querySelector('#victory').style.display = "block";
        clearInterval(game);
    }

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    // if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = getNewFood(obstacles)
        // we don't remove the tail
    }else{
        // remove the tail
        snake.pop();
    }
    
    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    // game over
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box){
        clearInterval(game);
        dead.play();
    } else if(collision(newHead, snake) || collisionToPiedra(newHead, obstacles)){
        clearInterval(game);
        dead.play();
    }

    
    snake.unshift(newHead);
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
}

let game = setInterval(draw, 120);
document.querySelector('#restart').addEventListener('click', function(){
    clearInterval(game);
    snake = [{ x : 9 * box, y : 10 * box }];
    d = null;
    score = 0;
    food = getNewFood(obstacles)
    obstacles = Array.from({length: getRandomInt(1, 10)})
    .map(()=>[getRandomInt(3, 17)*box, getRandomInt(3, 15)*box])
    .filter((item) => !(item[0] === snake[0].x && item[1] === snake[0].y))
    game = setInterval(draw, 120);
})
