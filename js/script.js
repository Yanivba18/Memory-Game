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
            ROW: 3,
            COL: 4,
            SIZE: "big",
            TotalCards: 6 //Half of the total amount of shown cards
        },
        MEDIUM: {
            ROW: 3,
            COL: 6,
            SIZE: "medium",
            TotalCards: 15
        },
        HARD: {
            ROW: 4,
            COL: 6,
            SIZE: "small",
            TotalCards: 28
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

    function startScreen() {
        let mainModalSpan = $createElmnt.span();
        
        let strP;
        let strTitle;
        if (firstGame) {
            strTitle = "Memory Game";
            strP = "Choose level to begin:";
        } else {
            strTitle = "You won!"
            strP = "Good game! Choose a level to restart"
        }        

        let $h2Title = $createElmnt.h2()
        $h2Title.append(strTitle);
        mainModalSpan.append($h2Title);


        let $pTag = $createElmnt.p();
        $pTag.append(strP);
        mainModalSpan.append($pTag);

        let $easyBtn = $createElmnt.button();
        $easyBtn.append("Easy Level");
        mainModalSpan.append($easyBtn);
        $easyBtn.click(() => {
            clearScreen();
            currentLevel = levelEnum.EASY;
            buildGrid(levelEnum.EASY);
            modal.close();
            firstGame = false;
        })

        let $mediumBtn = $createElmnt.button();
        $mediumBtn.append("Medium Level");
        mainModalSpan.append($mediumBtn);
        $mediumBtn.click(() => {
            clearScreen();
            currentLevel = levelEnum.MEDIUM;
            buildGrid(levelEnum.MEDIUM);
            modal.close();
            firstGame = false;
        })

        let $hardBtn = $createElmnt.button();
        $hardBtn.append("Hard Level");
        mainModalSpan.append($hardBtn);
        $hardBtn.click(() => {
            clearScreen();
            currentLevel = levelEnum.HARD;
            buildGrid(levelEnum.HARD);
            modal.close();
            firstGame = false;
        })

        modal.open({ content: mainModalSpan });
    }

    function clearScreen() {
        let mainDiv = document.getElementById("mainContainer");
        while (mainDiv.firstChild) {
            mainDiv.removeChild(mainDiv.firstChild);
        }
    }

    // ----- buildGrid gets the grid size in form of cols (columns) and rows  ----- \\
    // -----          and adds bootstrap components of row and col             ----- \\
    function buildGrid(level) {
        updateScore();
        // ---------- Creating rows and appending them to main container div ---------- \\
        for (let i = 0; i < level.ROW; i++) {
            let $rowDiv = $createElmnt.div();
            $rowDiv.addClass("row w-50 justify-content-center w-100");
            $mainDiv.append($rowDiv);

            // ---------- Creating cols and appending them to the created row div ---------- \\
            for (let x = 0; x < level.COL; x++) {
                let $colDiv = $createElmnt.div();
                $colDiv.addClass(`col-lg-2 cards clickable ${level.SIZE} m-1 text-center p-0`);
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
        fillGridImgs(level);
    }
    // ----- filling the grid with the images from the dog API ---------- \\\\
    async function fillGridImgs(level) {
        let $cardFront = $('.flip-box-front');
        let $cardBack = $('.flip-box-back');
        let imgsArr = [];
        switch (level) {
            case levelEnum.EASY:
                imgsArr = await getImgSrcArray((levelEnum.EASY.COL * levelEnum.EASY.ROW) / 2);
                break;
            case levelEnum.MEDIUM:
                imgsArr = await getImgSrcArray((levelEnum.MEDIUM.COL * levelEnum.MEDIUM.ROW) / 2);
                break;
            case levelEnum.HARD:
                imgsArr = await getImgSrcArray((levelEnum.HARD.COL * levelEnum.HARD.ROW) / 2);
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

    async function getImgSrcArray(amount) {
        let imgsArr = [];
        for (let i = 0; i < amount; i++) {
            let dogImgSrc = await getRandomDog();
            imgsArr.push(dogImgSrc.message);
            imgsArr.push(dogImgSrc.message);
        }
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

    function flipImage() {
        flippedImages++;
        let $this = $(this);

        switch (flippedImages) {
            case 1:
                flip($this);

                console.log("less than 2, no flip back");
                break;

            case 2:
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
                        startScreen(); 
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
    let $createElmnt = (function () {
        let method = {};

        method.createElementByTag = function (tagName) {
            return $(document.createElement(tagName));
        }

        method.div = function () { return this.createElementByTag('div') };
        method.img = function () { return this.createElementByTag('img') };
        method.h2 = function () { return this.createElementByTag('h2') };
        method.span = function () { return this.createElementByTag('span') };
        method.p = function () { return this.createElementByTag('p') };
        method.button = function () { return this.createElementByTag('button') };
        return method;
    }());

    let modal = (function () {
        let method = {},
            $overlay,
            $modal,
            $content;

        // Appending the modal HTML
        $overlay = $('<div id="overlay"></div>');
        $modal = $('<div id="modal"></div>');
        $content = $('<div id="content"></div>');

        $modal.hide();
        $overlay.hide();
        $modal.append($content);

        $(document).ready(function () {
            $('body').append($overlay, $modal);
        });
        // Center the modal in the viewport
        method.center = function () {
            var top, left;

            top = "50%";
            left = "50%";

            $modal.css({
                top: top,
                left: left,
                transform: "translateX(-50%) translateY(-50%)"
            });
        };

        // Open the modal
        method.open = function (settings) {
            $content.empty().append(settings.content);

            $modal.css({
                width: settings.width || 'auto',
                height: settings.height || 'auto'
            })

            method.center();

            $(window).bind('resize.modal', method.center);

            $modal.show();
            $overlay.show();
        };

        // Close the modal
        method.close = function () {
            $modal.hide();
            $overlay.hide();
            $content.empty();
            $(window).unbind('resize.modal');
        };

        // $close.click(function (e) {
        //     e.preventDefault();
        //     method.close();
        // });

        return method;
    }());

    function main() {
        startScreen();
        // buildGrid(3, 4);
        // fillGridImgs();
    }

    main();

})(window)