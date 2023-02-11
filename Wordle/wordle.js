
let word = "temp";
let hint = "Placeholder Hint";
let wordBank = [];
let dark = false;
let help = false;
let disphint = false;

async function getDict(CB){
    let jsonDict;
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
    "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
    })
    .then((Response) => Response.text())
    .then((text) => {jsonDict = JSON.parse(text);});

    wordBank = jsonDict.dictionary;
    CB(wordBank);

    
    return wordBank;
}




function load(){
    darkMode();
    let button = document.getElementById("restart")
    button.disabled = true;
    button.style.backgroundColor = "black";
    button.innerText = "Loading...";
    let temp = getDict(function(wb){
        let button = document.getElementById("restart")
        button.disabled = false;
        button.style.backgroundColor = "darkolivegreen";
        button.innerText = "Start Over";
        wordBank = wb;
        restart();
    }); 
    
}

function restart (){
    

    document.getElementById('foot').innerHTML = '<div id="footer"><footer>&#169; Isaac Hus</footer></div>';
    
    console.log("restarting...");
    for(let i = 0; i<4; i++){
        for(let j = 0; j<4; j++){
            let idInt = (i * 10) + j;
            let id = idInt.toString();
            if(i == 0){
                id = "0" + id;
            }
            document.getElementById(id).value = "";
            let element = document.getElementById(id);
            element.style.backgroundColor = null;
        }
    }

    let current_row = 0;

    for(let i = 0; i<4; i++){
        for(let j = 0; j<4; j++){
            let idInt = (i * 10) + j;
            let id = idInt.toString();
            if(i == 0){
                id = "0" + id;
            }
            const element = document.getElementById(id);
            if(i == current_row){
                element.disabled = false;
            }
            else{
            element.disabled = true;
            }
        }
    }
    setCursor(0,0);
    

    let index = Number.parseInt(Math.random() * 21);

    hint = wordBank[index].hint;
    word = wordBank[index].word;
}


function getTable(){
    let charTable = [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
    for(let i = 0; i<4; i++){
        for(let j = 0; j<4; j++){
            let idInt = (i * 10) + j;
            let id = idInt.toString();
            if(i == 0){
                id = "0" + id;
            }
            const element = document.getElementById(id);
            let val = element.value;
            charTable[i][j] = val;
        }
    }
    return charTable;
}

function setRow(gameBoard){

    // gets next empty row
    let current_row = 0;

    for(let i = 0; i<4; i++){
        let numEmpty = 0;
        for(let j = 0; j<4; j++){
            let idInt = (i * 10) + j;
            let id = idInt.toString();
            if(i == 0){
                id = "0" + id;
            }
            const isEmpty = document.getElementById(id).value;
            if(isEmpty == ""){
                numEmpty++;
            }
            
        }
        if(numEmpty == 0){
            current_row = i + 1;
            continue;
        }
    }


    for(let i = 0; i<4; i++){
        for(let j = 0; j<4; j++){
            let idInt = (i * 10) + j;
            let id = idInt.toString();
            if(i == 0){
                id = "0" + id;
            }
            const element = document.getElementById(id);
            if(i == current_row){
                element.disabled = false;
            }
            else{
            element.disabled = true;
            }
        }
    }
    setCursor(current_row,0);
}

function setCursor(row, coloum){
    if(row == 4){
        lose();
    }
    if(row > 3 || coloum > 3){
        return;
    }
    let id = row.toString() + "" + coloum.toString();
    document.getElementById(id).focus();
}



function onBackspace(){
    let row = Math.floor(checkFocus() / 10);
    let col = Math.floor(checkFocus() % 10);
    let currentId = row.toString() + "" + col.toString();
    document.getElementById(currentId).value = "";
    if(row == 0 && col == 0){
        return;
    }
    else if(col == 0){
        col = 0;
    }
    else{
        col--;
    }
    currentId = row.toString() + "" + col.toString();
    let save = document.getElementById(currentId).value;
    setCursor(row,col);
    document.getElementById(currentId).value = save;

    current_row = row;

    for(let i = 0; i<4; i++){
        for(let j = 0; j<4; j++){
            let idInt = (i * 10) + j;
            let id = idInt.toString();
            if(i == 0){
                id = "0" + id;
            }
            const element = document.getElementById(id);
            if(i == current_row){
                element.disabled = false;
            }
            else{
            element.disabled = true;
            }
        }
    }
    setCursor(row,col);
}

function checkFocus(){
    return parseInt(document.activeElement.id);
}

function onKey(letter){
    let row = Math.floor(checkFocus() / 10);
    let col = Math.floor(checkFocus() % 10);
    let currentId = row.toString() + "" + col.toString();
    document.getElementById(currentId).value = letter;
    if(col != 3){
        col++;
    }
    setCursor(row,col);
    
}

document.addEventListener("keydown",function(event){
    if(isNaN(checkFocus())){
        return;
    }
    let key = event.code;
    if(key === "Enter"){
        dispKey("Ent");
        onEnter();
    }
    if(key === "Backspace"){
        dispKey("BS");
        onBackspace();
    }
    if((key.codePointAt(3) > 64 && key.codePointAt(3) < 91)){
        dispKey(key.charAt(3));
        onKey(key.charAt(3));
    }
});

function test(text){
    console.log("test: " + text);
}

function checkInputs(gameBoard){

    let numCorrect = 0;
    let row = Math.floor(checkFocus() / 10);
    let upperhint = word.toUpperCase();
    let letters = upperhint.split("");
    let totalNums = 0;

    for(let i = 0; i < 4; i++){
        if(gameBoard[row][i] != ""){
            totalNums++;
        }
    }

    if(totalNums != 4){
        window.alert("You must use all inputs.");
        return;
    }

    for(let letter = 0; letter < 4; letter++){
        let currentId = row.toString() + "" + letter.toString();
        if(gameBoard[row][letter] == letters[letter]){
            // green
            numCorrect++;
            let element = document.getElementById(currentId);
            element.style.backgroundColor = "darkolivegreen";
        }
        else if(letters.includes(gameBoard[row][letter])){
            //yello
            let element = document.getElementById(currentId);
            element.style.backgroundColor = "gold";
        }
    }

    if(numCorrect == 4){
        win();
    }

}

function win(){
    document.getElementById('body').innerHTML = '<div id="game"><img src="./congrats_fkscna.gif" alt="good job!"><button id="restart" onclick="playAgain()">Start Over</button></div>';
}

function playAgain(){
    location.reload();
}

function lose(){
        document.getElementById('foot').innerHTML = '<div id="hinttext" style="background-color:red;">'+ "You failed to guess: " + word + '</div><div id="footer"><footer>&#169; Isaac Hus</footer></div>';
}

function onEnter(){

    let gameBoard = getTable();
    checkInputs(gameBoard);
    setRow(gameBoard);
    console.log(gameBoard);
    
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function dispKey(letter){
    let root = document.querySelector(":root");
    document.getElementById('key').innerText = letter;

    root.style.setProperty('--keyon','var(--accent)');
    await sleep(2000);
    root.style.setProperty('--keyon','var(--main)');
}

window.onload = function(){load();};


// NON-GAMEPLAY FUNCTIONS ------------------------------------------------------------------------------------

function darkMode(){
    let root = document.querySelector(":root");
    let style = getComputedStyle(root);
    if(dark == false){
        root.style.setProperty('--main','#1a1a1a');
        root.style.setProperty('--text','white');
        dark = true;
    }
    else if(dark == true){
        root.style.setProperty('--main','white');
        root.style.setProperty('--text','black');
        
        dark = false;
    }
    

}

function disphelp(){

    if(help == false){
        document.getElementById('body').innerHTML += '<div id="helptext"><h1>How To Play</h1><ul><li>Start typing. The letters will appear in the boxes</li><li>Remove letters with backspace</li><li>Hit Enter to submit an answer</li><li>Green letters are in the correct spot</li><li>Yellow letters are correct, but in the wrong position</li><li>Grey letters are incorrect</li><li>Press the &#63; icon for a hint</li></ul></div>';
        help = true;
    }
    else if(help == true){
        let elem = document.getElementById("helptext");
        elem.remove();
        help = false;
    }
}

function doHint(){
    if(disphint == false){
        document.getElementById('foot').innerHTML = '<div id="hinttext">'+ hint + '</div><div id="footer"><footer>&#169; Isaac Hus</footer></div>';
        //elem.style.setProperty("transform", "translate(0, -40px);")
        disphint = true;
    }
    else if(disphint == true){
        document.getElementById('foot').innerHTML = '<div id="footer"><footer>&#169; Isaac Hus</footer></div>';
        
        disphint = false;
    }
}
