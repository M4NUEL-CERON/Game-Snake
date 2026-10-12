const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const gameOverOverlay = document.querySelector(".game-over-overlay");
const finalScoreElement = document.querySelector(".final-score");
const restartBtn = document.querySelector(".restart-btn");

let gameOver = false
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody=[];
let velocityX=0, velocityY = 0;
let setIntervalid;
let score =0;



let highscore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML= `High Score : ${highscore}`;



const changFoodposition =() =>{
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;

}
const handleGamerOver = () => {
    clearInterval(setIntervalid);
    finalScoreElement.textContent = `Puntaje final: ${score}`;
    gameOverOverlay.classList.add("show");
}

const restartGame = () => {
    clearInterval(setIntervalid);
    gameOver = false;
    foodX = foodY = undefined;
    snakeX = 5;
    snakeY = 10;
    snakeBody = [];
    velocityX = 0;
    velocityY = 0;
    score = 0;
    scoreElement.innerHTML = `score :${score}`;
    gameOverOverlay.classList.remove("show");
    changFoodposition();
    setIntervalid = setInterval(initgame, 125);
}

const setDirection = (dir) => {
    if(dir === "up" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(dir === "down" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(dir === "left" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(dir === "right" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

const changeDirection = (e) => {
     if(e.key === "ArrowUp") setDirection("up");
     else if(e.key === "ArrowDown") setDirection("down");
     else if(e.key === "ArrowLeft") setDirection("left");
     else if(e.key === "ArrowRight") setDirection("right");
}

const initgame = ()=> {
    if(gameOver)return handleGamerOver();
    let htmlmarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if(snakeX=== foodX && snakeY === foodY){
        changFoodposition();
        snakeBody.push([foodX,foodY]);
        score++;

        highscore = score >= highscore ? score : highscore;
        localStorage.setItem("high-score",highscore);    
        scoreElement.innerHTML = `score :${score}`;
        highScoreElement.innerHTML= `High Score : ${highscore}`;
      
    }
    for( let i = snakeBody.length - 1 ; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
  snakeBody[0] = [snakeX, snakeY];
    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
       gameOver = true;

    }

    for(let i = 0; i < snakeBody.length; i++){
        htmlmarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if(i!== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver=true;


        }
    }
    playBoard.innerHTML = htmlmarkup;
}

changFoodposition();

setIntervalid = setInterval(initgame,125);

document.addEventListener("keydown",changeDirection);

restartBtn.addEventListener("click", restartGame);

document.querySelectorAll(".touch-btn").forEach((btn) => {
    btn.addEventListener("click", () => setDirection(btn.dataset.dir));
});

let touchStartX = 0, touchStartY = 0;
playBoard.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

playBoard.addEventListener("touchend", (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    if(Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) return;

    if(Math.abs(deltaX) > Math.abs(deltaY)) {
        setDirection(deltaX > 0 ? "right" : "left");
    } else {
        setDirection(deltaY > 0 ? "down" : "up");
    }
}, { passive: true });
