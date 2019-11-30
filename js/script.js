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
            LEVEL: "Easy",
            TotalCards: 6 //Half of the total amount of shown cards
        },
        MEDIUM: {
            ROW: 1,
            COL: 18,
            LEVEL: "Medium",
            TotalCards: 9
        },
        HARD: {
            ROW: 1,
            COL: 24,
            LEVEL: "Hard",
            TotalCards: 12
        }
    }

    function getRandomDog() {
        let dogImg;
        dogImg = $.ajax({
            method: "GET",
            url: "https://dog.ceo/api/breeds/image/random",
            dataType: "JSON",
        }).promise()
        return dogImg;
    }

    function getRandomCat() {
        let catImg;
        catImg = $.ajax({
            method: "GET",
            url: "https://aws.random.cat/meow",
            dataType: "JSON"
        }).promise()
        return catImg;
    }

    function startScreen() {
        let mainModalSpan = $createElmnt.span();
        mainModalSpan.addClass("d-flex flex-column align-items-center");

        let strP;
        let strTitle;
        if (firstGame) {
            strTitle = "Memory Game";
            strP = "Choose level and theme to begin:";
        } else {
            strTitle = `You won!`;
            strP = "Good game! Choose a level and theme to restart";
        }

        let $h2Title = $createElmnt.h2()
        $h2Title.append(strTitle);
        mainModalSpan.append($h2Title);

        let $pTag = $createElmnt.p();
        $pTag.append(strP);
        mainModalSpan.append($pTag);

        let $inputDiv = $createElmnt.div();
        $inputDiv.addClass("container-fluid d-flex justify-content-around p-2");
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

        let $highScore = $createElmnt.button();
        $highScore.text("High Scores");
        $highScore.click(highScoreModal);
        mainModalSpan.append($highScore);

        modal.open({ content: mainModalSpan });
    }

    function onClickFuncs() {
        let theme = getTheme()
        clearScreen();
        buildGrid(theme, currentLevel);
        modal.close();
        firstGame = false;
    }

    function saveScreen() {
        let $mainDiv = $createElmnt.div();
        $mainDiv.addClass("d-flex flex-column justify-content-around p-2");

        let $h2Title = $createElmnt.h2();
        $h2Title.text(`You won in ${wrongAnswers} tries`);
        $h2Title.addClass('p-2');
        $mainDiv.append($h2Title);
        $mainDiv.append("Enter your name to save the score:")
        let $textInput = $createElmnt.input();
        $textInput.attr({
            type: "text",
            id: "name",
        });
        $mainDiv.append($textInput);

        let $saveBtn = $createElmnt.button();
        $saveBtn.text("Save score");
        $saveBtn.click(() => {
            let lvlScoresArr = JSON.parse(localStorage.getItem(currentLevel.LEVEL));
            if (lvlScoresArr == null) {
                lvlScoresArr = [];
            }

            let score = {
                name: $("#name").val(),
                tries: wrongAnswers,
            }
            lvlScoresArr.push(score);
            localStorage.setItem(currentLevel.LEVEL, JSON.stringify(lvlScoresArr));
            resetScore();
            startScreen();
        })
        $mainDiv.append($saveBtn);

        modal.open({ content: $mainDiv })
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
        let bg = document.getElementById("bg");
        bg.classList.remove("default", "cats", "dogs");
        bg.classList.add(`${theme}`);
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

    async function getImgSrcArray(theme, amount) {
        let imgsArr = [];
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
        imgsArr = shuffle(imgsArr);
        return imgsArr;
    }

    function flipBack($elmnt) {
        setTimeout(function () {
            $elmnt.css("transform", "");
            $elmnt.children().css("transform", "");
            resetAnswers();
        }, 1000)
    }

    function flip($elmnt) {
        $elmnt.css("transform", "rotateY(180deg) scaleX(-1)");
        $elmnt.children().css("transform", "rotateY(180deg) scaleX(-1)");
        answers.push($elmnt);
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

    function mainBtns() {
        let $menuBtn = $createElmnt.button();
        $menuBtn.removeClass("m-1")
        $menuBtn.text("Menu")
        $menuBtn.click(menuScreen);
        $('#menu').append($menuBtn);

        let $highScore = $createElmnt.button();
        $highScore.text("High Scores");
        $highScore.click(highScoreModal);
        $('#highscore').append($highScore);
    }

    function highScoreModal() {
        let $mainDiv = $createElmnt.div();
        $mainDiv.addClass("d-flex flex-column justify-content-around p-2");

        let easy = JSON.parse(localStorage.getItem("Easy"));
        let medium = JSON.parse(localStorage.getItem("Medium"));
        let hard = JSON.parse(localStorage.getItem("Hard"));
        let levelTitle = $createElmnt.h3();
        levelTitle.text("Easy - High Scores");
        $mainDiv.append(levelTitle);
        let listContainerEasy = $createElmnt.createElementByTag("ul");

        try {
            easy = [].slice.call(easy).sort(function (a, b) {
                return a.tries - b.tries;
            });
            easy.forEach((item) => {
                listContainerEasy.append(`<li>${item.name} | Tries: ${item.tries}</li>`)
            })
        } catch (e) {
            console.log("No saved games in easy level");
            listContainerHard.append("No saved games yet");
        }
        $mainDiv.append(listContainerEasy);

        levelTitle = $createElmnt.h3();
        levelTitle.text("Medium - High Scores");
        $mainDiv.append(levelTitle);
        let listContainerMedium = $createElmnt.createElementByTag('ul');
        try {
            medium = [].slice.call(medium).sort(function (a, b) {
                return a.tries - b.tries;
            });
            medium.forEach((item) => {
                listContainerMedium.append(`<li>${item.name} | Tries: ${item.tries}</li>`)
            })
        } catch (e) {
            console.log("No saved games in medium level");
            listContainerHard.append("No saved games yet")
        }
        $mainDiv.append(listContainerMedium);

        levelTitle = $createElmnt.h3();
        levelTitle.text("Hard - High Scores");
        $mainDiv.append(levelTitle);
        let listContainerHard = $createElmnt.createElementByTag('ul');
        try {
            hard = [].slice.call(hard).sort(function (a, b) {
                return a.tries - b.tries;
            });
            hard.forEach((item) => {
                listContainerHard.append(`<li>${item.name} | Tries: ${item.tries}</li>`)
            })
        } catch (e) {
            console.log("No saved games in hard level");
            listContainerHard.append("No saved games yet")
        }
        $mainDiv.append(listContainerHard);
        let closeBtn = $createElmnt.button();
        closeBtn.text("Close");
        closeBtn.click(modal.close);
        $mainDiv.append(closeBtn);


        modal.open({ content: ($mainDiv) });
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


        modal.open({ content: $modalDiv });

    }

    function flipImage() {
        flippedImages++;
        let $this = $(this);

        switch (flippedImages) {
            case 1:
                flip($this);
                break;

            case 2:
                if (answers[0].attr("style") == $this.attr("style")) {
                    flippedImages--;
                    break;
                }
                flip($this);
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
                        setTimeout(saveScreen, 1000);
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



    function main() {
        startScreen();
        mainBtns();
    }

    main();

})(window)