let initialPos = [];
let legalSQ=[];
let board = []; 
for(let i=0;i<8;i++)
{   board.push([]);
       for(let j=0;j<8;j++)
        {board[i].push(["",""]);}
}
let isWhiteTurn=true;
let selectedPiece = null;
const boardSQ=document.getElementsByClassName("square");
const pieces=document.getElementsByClassName("piece");
const piecesImages=document.getElementsByTagName("img");


setupBoardSQ()
setupPieces()
document.getElementById("topText").textContent="THE GAME IS ON!"


function setupBoardSQ(){
    for (let i=0;i<boardSQ.length;i++){
        boardSQ[i].addEventListener("dragover",allowDrop);
        boardSQ[i].addEventListener("drop",drop);
        
        let row=8-Math.floor(i/8);
        let column=String.fromCharCode(97+(i%8));
        let square=boardSQ[i]
        square.id=column+row;
    }
}


function setupPieces(){
    for(let i=0; i<pieces.length;i++){
        pieces[i].addEventListener("dragstart",drag);
        pieces[i].setAttribute("draggable",true);
        pieces[i].id=pieces[i].className.split(" ")[1]+pieces[i].parentElement.id;
        
        const row = parseInt(pieces[i].parentElement.id[1]-1);
        const col = parseInt(pieces[i].parentElement.id.charCodeAt(0)-97);
        console.log(pieces[i].getAttribute("color"));
        board[row][col]=[pieces[i].getAttribute("color"), pieces[i].getAttribute("piece")];
    }
    console.log(board);
    for(let i=0; i<piecesImages.length;i++){
        piecesImages[i].setAttribute("draggable",false);     
    }

}


function allowDrop(ev){
    ev.preventDefault();
}



function highlightPossibleMoves(row, col) {
    const cells = document.querySelectorAll('.square');
    cells.forEach(cell => {
        const ind =  cell.getAttribute("id");
        const row =parseInt(ind[1])-1;
        const col = ind.charCodeAt(0)-97;
        if (isValidMove(row, col)) {
            console.log("changing color");
            cell.style.backgroundColor = 'rgb(237, 214, 176)';
        } else {
            cell.style.backgroundColor = '';
        }
    });
}



function drag(ev){  
    const piece=ev.target;
    const square = piece.parentElement.id;
    console.log(square);
    const row =parseInt(square[1])-1;
    const col = square.charCodeAt(0)-97;
    const pieceColor = piece.getAttribute("color");
    console.log(isWhiteTurn);

    if((isWhiteTurn && pieceColor=="white")||(!isWhiteTurn && pieceColor=="black"))
        {
            ev.dataTransfer.setData("text",piece.id);
            const startingSquareId = piece.parentNode.id;
          
            selectedPiece =[row, col, board[row][col]];
            console.log(selectedPiece)
            // getPossibleMoves(startingSquareId,piece);
            highlightPossibleMoves(row,col);
        }
        
}



function rotate(ev){
    if((isWhiteTurn && pieceColor=="white")||(!isWhiteTurn && pieceColor=="black"))
        {
            ev.dataTransfer.setData("text",piece.id);
            const startingSquareId = piece.parentNode.id;
          
            selectedPiece =[row, col, board[row][col]];
            console.log(selectedPiece)
            // getPossibleMoves(startingSquareId,piece);
            highlightPossibleMoves(row,col);
        }
}



function isValidMove(row, col) {
    console.log(selectedPiece);
    const dRow = Math.abs(row - selectedPiece[0]);
    const dCol = Math.abs(col - selectedPiece[1]);
    console.log(selectedPiece);
    // Can't move to a cell that's occupied
    console.log(selectedPiece[2][1]);
    switch (selectedPiece[2][1]) {
        case "ttn":
        case "rr":
        case "sr":
            return (dRow <= 1 && dCol <= 1);
        case "tnk":
            return (dRow === 0 || dCol === 0) && clearPath(selectedPiece[0], selectedPiece[1], row, col);
        case "cn":
            return (dRow === 0) ;
        default:
            return false;
    }
}



function arraysEqual(a, b) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}



function clearPath(startRow, startCol, endRow, endCol) {

    if (startRow === endRow) {
        const [minCol, maxCol] = [Math.min(startCol, endCol), Math.max(startCol, endCol)];
        console.log(minCol,maxCol);
        for (let col = minCol + 1; col < maxCol; col++) {
            if(!arraysEqual(board[startRow][col], ["",""])) return false;
        }
    } else if (startCol === endCol) {
        const [minRow, maxRow] = [Math.min(startRow, endRow), Math.max(startRow, endRow)];
        for (let row = minRow + 1 ; row < maxRow; row++) {
            if (!arraysEqual(board[row][startCol], ["",""])) return false;
        }
    }
    return true;
}



function drop(ev){
    ev.preventDefault();
    let data=ev.dataTransfer.getData("text");
    const piece=document.getElementById(data);

    const destinationSquare=ev.currentTarget;
    let destinationSquareId=destinationSquare.id;
    console.log(destinationSquareId)
    const destr = parseInt(destinationSquare.id[1])-1;
    const destc = destinationSquare.id.charCodeAt(0)-97;
    if((isSqOccupid(destinationSquare)=="blank")&&(isValidMove(destr,destc))){
        destinationSquare.appendChild(piece);
       
        
        
        board[destr][destc]=board[selectedPiece[0]][selectedPiece[1]];
        board[selectedPiece[0]][selectedPiece[1]]=['',''];
       
        isWhiteTurn=!isWhiteTurn;
        console.log(board);
        document.getElementById("topText").textContent="Moved Now Shooting!!!"
        setTimeout(turn,5000);
        
        return;
    } else {
        console.log("Its invalid move!!")
        document.getElementById("topText").textContent="Its invalid move!!"
        return;
    }
    function turn(){
        if(isWhiteTurn==true)
            document.getElementById("topText").textContent="White Turn"
            else
            document.getElementById("topText").textContent="Black Turn"
            
    }

    // if (isSqOccupid(destinationSquare)!="blank"){
    //     while(destinationSquare.firstchild){
    //         destinationSquare.removeChild(destinationSquare.firstChild);
    //     }destinationSquare.appendChild(piece);
    //     isWhiteTurn=!isWhiteTurn;
    //     return;
    // }
}



function isSqOccupid(square){
    if(square.querySelector(".piece")){
        const color=square.querySelector(".piece").getAttribute("color");
        console.log(color)
        return color;
    }
    else{
        return "blank"
    }
}


let canvas=document.getElementById("canavs");
var window_height=window.innerHeight;

canvas.style.background="ff8";


function start () {
    let splash = document.getElementById("splash");
   
    splash.addEventListener("transitionend", () => {
      document.getElementById("bgm").play();
      splash.remove();
    });
   
    splash.classList.add("hide");
}


function rotateRico() {
    var image = document.getElementById('ricoPiece');
    var currentSrc = image.src;

    if (currentSrc.includes("img/rico.jpg")) {
        image.src = "img/ricor.jpg";
    } else {
        image.src = "img/rico.jpg";
    }
}


  






// rotBtn.onclick()

// function rotateRico(){
//     console.log('Rotating Rico');
//     if()
// }


//   COMMENTS!!

// function shootBullet(row,col){
// const canvas = document.getElementById('animationCanvas');
// const ctx = canvas.getContext('2d');

// const bullet = {
//     x: 50, // Initial x position
//     y: canvas.height / 2, // Initial y position (center of canvas)
//     radius: 5, // Radius of the bullet
//     speed: 5, // Speed of the bullet
//     color: 'red' // Color of the bullet
// };

// function drawBullet() {
//     ctx.beginPath();
//     ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
//     ctx.fillStyle = bullet.color;
//     ctx.fill();
//     ctx.closePath();
// }

// function updateBullet() {
//     bullet.x += bullet.speed;
    
//     // Reset bullet position if it goes off the canvas
//     if (bullet.x > canvas.width) {
//         bullet.x = 0;
//     }
// }

// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawBullet();
//     updateBullet();
//     requestAnimationFrame(animate);
// }

// animate();
// }
