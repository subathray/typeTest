//Random quotes Api Url
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

//Display random quotes
const renderNewQuote = async () => {
    //Fetch contents from url
    const response = await fetch(quoteApiUrl);
    //Store response
    let data = await response.json();
    //Access quote
    quote = data.content;
    //Array of haracters in the quote
    let arr = quote.split("").map(value => {
        //wrap the characters in the span tag
        return "<span class='quote-chars'>" + value + "</span>"
    });
    //Join array for displaying
    quoteSection.innerHTML += arr.join("");
};

//comparing input words with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");

    //creating array from received span tags
    quoteChars = Array.from(quoteChars);

    //array of user input characters
    let userInputChars = userInput.value.split("");

    //loop through each character in quotes
    quoteChars.forEach((char, index) => {
        if (char.innerHTML == userInputChars[index]) {
            char.classList.add("success");
        }
        else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            }
            else {
                char.classList.remove("fail");
            }
        }
        //If user enters wrong character
        else{
            //checks if we already have added fail class
            if(!char.classList.contains("fail")){
                //increment and display mistakes
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }
        //Returns correctly if all the chracters are entered correctly
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });
        if(check){
            displayResult();
        }
    });
});

//Update timer on screen
function updateTimer() {
    if(time == 0) {
        displayResult();
    }
    else{
        document.getElementById("timer").innerHTML = --time + "s";
    }
}

const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0){
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerText = Math.round(
        ((userInput.value.length - mistakes) / userInput.value.length) * 100
    ) + "%";
};

const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
}

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}