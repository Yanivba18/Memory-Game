"use strict";
(() => {
    // ----- This is the main div on which we will print our cards ----- \\
    const $mainDiv = $('#mainContainer');
    let flippedImages = 0;
    let score = 0;
    let wrongAnswers = 0;
    let answers = []; //Stores the answers (should never be more than 2)
    let currentLevel;
    let firstGame = true;

    const levelEnum = {
        EASY: {
            ROW: 1,
            COL: 12,
            SIZE: "big",
            TotalCards: 6 //Half of the total amount of shown cards
        },
        MEDIUM: {
            ROW: 1,
            COL: 18,
            SIZE: "medium",
            TotalCards: 9
        },
        HARD: {
            ROW: 1,
            COL: 24,
            SIZE: "small",
            TotalCards: 12
        }
    }

    function getRandomDog() {
        let dogImg;
        console.log('fetching random dog')
        dogImg = $.ajax({
            method: "GET",
            url: "https://dog.ceo/api/breeds/image/random",
            dataType: "JSON",
        }).promise()
        return dogImg;
    }

    function getRandomCat() {
        let catImg;
        console.log('fetching random cat');
        catImg = $.ajax({
            method: "GET",
            url: "https://aws.random.cat/meow",
            dataType: "JSON"
        }).promise()
        return catImg;
    }

    function startScreen() {
        let mainModalSpan = $createElmnt.span();
        mainModalSpan.addClass("d-flex flex-column")

        let strP;
        let strTitle;
        if (firstGame) {
            strTitle = "Memory Game";
            strP = "Choose level and theme to begin:";
        } else {
            strTitle = "You won!";
            strP = "Good game! Choose a level and theme to restart";
        }

        let $h2Title = $createElmnt.h2()
        $h2Title.append(strTitle);
        mainModalSpan.append($h2Title);

        let $pTag = $createElmnt.p();
        $pTag.append(strP);
        mainModalSpan.append($pTag);

        let $inputDiv = $createElmnt.div();   
        $inputDiv.addClass("d-flex justify-content-around p-2");
        $inputDiv.attr("id", "themesInput")
        
        $inputDiv.append("Dogs:");
        let $inputDogs = $createElmnt.input();
        $inputDogs.attr({
            type: "radio",
            value: "dogs",
            name: "theme",  
            checked: "checked"
        });
        $inputDiv.append($inputDogs);
        
        $inputDiv.append("Cats:");
        let $inputCats = $createElmnt.input();
        $inputCats.attr({
            type: "radio",
            value: "cats",
            name: "theme"
        });
        $inputDiv.append($inputCats);

        mainModalSpan.append($inputDiv);

        let $easyBtn = $createElmnt.button();
        $easyBtn.append("Easy Level");
        mainModalSpan.append($easyBtn);
        $easyBtn.click(() => {
            currentLevel = levelEnum.EASY;
            onClickFuncs();
        })

        let $mediumBtn = $createElmnt.button();
        $mediumBtn.append("Medium Level");
        mainModalSpan.append($mediumBtn);
        $mediumBtn.click(() => {
            currentLevel = levelEnum.MEDIUM;            
            onClickFuncs();
        })

        let $hardBtn = $createElmnt.button();
        $hardBtn.append("Hard Level");
        mainModalSpan.append($hardBtn);
        $hardBtn.click(() => {
            currentLevel = levelEnum.HARD;
            onClickFuncs();
        })

        modal.open({ content: mainModalSpan });
    }

    function onClickFuncs() {
        let theme = getTheme()
        clearScreen();
        buildGrid(theme, currentLevel);
        modal.close();        
        firstGame = false;
    }

    function clearScreen() {
        let mainDiv = document.getElementById("mainContainer");
        while (mainDiv.firstChild) {
            mainDiv.removeChild(mainDiv.firstChild);
        }
    }

    function getTheme() {
        let themes = document.getElementsByName("theme");
        let theme;
        themes.forEach((radio) => {
            if (radio.checked) {
                theme = radio.value;
            }
        })
        return theme;
    }

    // ----- buildGrid gets the grid size in form of cols (columns) and rows  ----- \\
    // -----          and adds bootstrap components of row and col             ----- \\
    function buildGrid(theme, level) {
        resetScore();
        updateScore();
        // ---------- Creating rows and appending them to main container div ---------- \\
        for (let i = 0; i < level.ROW; i++) {
            let $rowDiv = $createElmnt.div();
            $rowDiv.addClass("row justify-content-center");
            $mainDiv.append($rowDiv);

            // ---------- Creating cols and appending them to the created row div ---------- \\
            for (let x = 0; x < level.COL; x++) {
                let $colDiv = $createElmnt.div();
                $colDiv.addClass(`col-4 col-sm-3 col-md-2 p-1 cards clickable`);
                let $innerFlipDiv = $createElmnt.div();
                $innerFlipDiv.addClass("flip-box-inner");
                $colDiv.append($innerFlipDiv);
                let $cardBackDiv = $createElmnt.div();
                let $cardFrontDiv = $createElmnt.div();
                $cardFrontDiv.addClass("flip-box-front");
                $cardBackDiv.addClass("flip-box-back");
                $innerFlipDiv.append($cardFrontDiv);
                $innerFlipDiv.append($cardBackDiv);
                $rowDiv.append($colDiv);

                $colDiv.click(flipImage);
            }
        }
        fillGridImgs(theme, level);
    }
    // ----- filling the grid with the images from the dog API ---------- \\\\
    async function fillGridImgs(theme, level) {
        let $cardFront = $('.flip-box-front');
        let $cardBack = $('.flip-box-back');
        let imgsArr = [];
        switch (level) {
            case levelEnum.EASY:
                imgsArr = await getImgSrcArray(theme, (levelEnum.EASY.COL * levelEnum.EASY.ROW) / 2);
                break;
            case levelEnum.MEDIUM:
                imgsArr = await getImgSrcArray(theme, (levelEnum.MEDIUM.COL * levelEnum.MEDIUM.ROW) / 2);
                break;
            case levelEnum.HARD:
                imgsArr = await getImgSrcArray(theme, (levelEnum.HARD.COL * levelEnum.HARD.ROW) / 2);
                break;
        }

        for (let i = 0; i < $cardBack.length; i++) {
            let $dogImg = $createElmnt.img();
            let $backImg = $createElmnt.img();
            $dogImg.attr("src", imgsArr[i]);
            $backImg.attr("src", "./img/backcard.jpg");
            $dogImg.addClass("img-responsive h-100 w-100");
            $backImg.addClass("img-responsive h-100 w-100");
            $($cardFront[i]).append($($backImg));
            $($cardBack[i]).append($($dogImg));
        }
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    async function getImgSrcArray(theme ,amount) {
        let imgsArr = [];
        console.log("Loading..");
        for (let i = 0; i < amount; i++) {
            try {
                let imgSrc;
                if (theme == "dogs") {
                    imgSrc = await getRandomDog();
                    imgsArr.push(imgSrc.message);
                    imgsArr.push(imgSrc.message);
                } else {
                    imgSrc = await getRandomCat();
                    imgsArr.push(imgSrc.file);
                    imgsArr.push(imgSrc.file);
                }
            } catch (error) {
                console.log(error);
            }
        }
        console.log("finished loading..")
        imgsArr = shuffle(imgsArr);
        console.log(imgsArr)
        return imgsArr;
    }

    function flipBack($elmnt) {
        setTimeout(function () {
            $elmnt.css("transform", "");
            $elmnt.children().css("transform", "");
            resetAnswers();
            console.log("Wrong answers: " + wrongAnswers)
        }, 1500)
    }

    function flip($elmnt) {
        $elmnt.css("transform", "rotateY(180deg) scaleX(-1)");
        $elmnt.children().css("transform", "rotateY(180deg) scaleX(-1)");
        answers.push($elmnt);
        console.log("answer pushed: " + answers.length)
    }

    function resetAnswers() {
        answers = [];
        flippedImages = 0;
    }

    function updateScore() {
        $('#wrong').text(`Tries: ${wrongAnswers}`);
        $('#correct').text(`Score: ${score}`);
    }

    function resetScore() {
        wrongAnswers = 0;
        score = 0;        
    }

    function menuBtn() {
        let $menuBtn = $createElmnt.button();
        $menuBtn.text("Menu")
        $menuBtn.click(menuScreen);
        $('#menu').append($menuBtn);
    }

    function menuScreen() {
        let $modalDiv = $createElmnt.div();
        $modalDiv.addClass("d-flex flex-column");

        let $h2Title = $createElmnt.h2();
        $h2Title.text("Main Menu");
        $modalDiv.append($h2Title);

        let $resumeBtn = $createElmnt.button();
        $resumeBtn.text("Resume Game");
        $resumeBtn.click(modal.close);
        $modalDiv.append($resumeBtn);

        let $newGameBtn = $createElmnt.button();
        $newGameBtn.text("New Game");
        $newGameBtn.click(() => {
            firstGame = true;
            startScreen();
        });
        $modalDiv.append($newGameBtn);


        modal.open( { content : $modalDiv});
        
    }

    function flipImage() {
        flippedImages++;
        let $this = $(this);

        switch (flippedImages) {
            case 1:
                flip($this);

                console.log("less than 2, no flip back");
                break;

            case 2:
                if (answers[0].attr("style") == $this.attr("style")) {
                    flippedImages--;
                    break;
                }
                flip($this);
                console.log("more than 2, resetting flipped, checking if match")
                // -------- Checking if right answer or not -------- \\
                if (checkIfMatch(answers)) {
                    answers.forEach(function (answer) {
                        answer.unbind("click", flipImage);
                        answer.removeClass("clickable");
                    })
                    score++;
                    wrongAnswers++;
                    updateScore();
                    resetAnswers();
                    if (score == currentLevel.TotalCards) {
                        setTimeout(startScreen, 1000);
                        resetScore();
                    }
                } else {
                    wrongAnswers++;
                    updateScore();
                    answers.forEach(answer => flipBack(answer));
                };
                break;
        }
    }


    function checkIfMatch(answersArr) {
        try {
            let card1 = answersArr[0].find('img')[1].currentSrc;
            let card2 = answersArr[1].find('img')[1].currentSrc;
            switch (card1) {
                case card2:
                    return true;
                default:
                    return false;
            }

        } catch {
            answers = [];
            return;
        }
    }


    // ---------- Name-spacing methods for creating jquery elements ---------- \\    
    

    function main() {
        startScreen();
        menuBtn();
    }

    main();

})(window)