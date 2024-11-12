const draggable = document.querySelector(".box");
const ball = document.querySelector(".circle");

let offsetX = 0, offsetY = 0, isDragging = false;
let max_left = document.querySelector(".lefthit").getBoundingClientRect().right;
let max_right = document.querySelector(".righthit").getBoundingClientRect().left;
let max_top = document.querySelector(".up").getBoundingClientRect().bottom;
let max_down = document.querySelector(".down").getBoundingClientRect().top;

let isMoving = false;
let angle, velocityX, velocityY;

function startMovement() {
    if (!isMoving) {
        angle = 35 + Math.random() * 90;
        const radians = angle * (Math.PI / 180);
        const speed = 2;

        velocityX = Math.cos(radians) * speed;
        velocityY = -Math.sin(radians) * speed;

        isMoving = true;
        requestAnimationFrame(moveBall);
    }
}

function moveBall() {
    const currentLeft = parseFloat(ball.style.left); 
    const currentTop = parseFloat(ball.style.top);  

    let newX = currentLeft + velocityX;
    let newY = currentTop + velocityY; 

    if (newX <= max_left || newX >= max_right - ball.offsetWidth) {
        velocityX = -velocityX;
    }

    if (newY <= max_top) {
        velocityY = -velocityY;
    }

    if (newY >= max_down - ball.offsetHeight) {
        location.reload();
    }

    const boxRect = draggable.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    if (ballRect.bottom > boxRect.top && ballRect.top < boxRect.top && 
        ballRect.right > boxRect.left && ballRect.left < boxRect.right) {
        newY = boxRect.top - ball.offsetHeight;
        velocityY = -velocityY;
    }

    ball.style.left = `${newX}px`;
    ball.style.top = `${newY}px`;  

    requestAnimationFrame(moveBall);
}

ball.style.left = "705px";
ball.style.top = "500px";

draggable.addEventListener("mousedown", (e) => {
    offsetX = e.clientX - draggable.getBoundingClientRect().left;
    offsetY = e.clientY - draggable.getBoundingClientRect().top;
    isDragging = true;
    draggable.style.cursor = "grabbing";
    startMovement();
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        let newLeft = e.clientX - offsetX;
        const rect = draggable.getBoundingClientRect();
        const draggableWidth = rect.width;

        if (newLeft < max_left - 10) {
            newLeft = max_left - 9;
        } else if (newLeft + draggableWidth > max_right + 10) {
            newLeft = max_right - draggableWidth;
        }

        draggable.style.left = `${newLeft}px`;
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        return;
    }

    const currentLeft = parseInt(draggable.style.left, 10);
    let newLeft = currentLeft;
    const rect = draggable.getBoundingClientRect();
    const draggableWidth = rect.width;

    const moveDistance = 15;

    if (e.key === "ArrowLeft") {
        newLeft = currentLeft - moveDistance;
        if (newLeft < max_left - 10) newLeft = max_left - 9;
        draggable.style.left = `${newLeft}px`;
    }

    if (e.key === "ArrowRight") {
        newLeft = currentLeft + moveDistance;
        if (newLeft + draggableWidth > max_right + 10) newLeft = max_right - draggableWidth;
        draggable.style.left = `${newLeft}px`;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    draggable.style.cursor = "grab";
});
