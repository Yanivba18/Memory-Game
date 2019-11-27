"use strict";
(() => {
    // ----- This is the main div on which we will print our cards ----- \\
    const $mainDiv = $('#mainContainer');
    let flippedImages = 0;
    let score = 0;
    let wrongAnswers = 0;
    let answers = []; //Stores the answers (should never be more than 2)

    const levelEnum = {
        EASY: {
            ROW: 3,
            COL: 4
        },
        MEDIUM: {
            ROW: 5,
            COL: 6
        },
        HARD: {
            ROW: 7,
            COL: 8
        }
    }
    let currentLevel = levelEnum.EASY;

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

    // ----- buildGrid gets the grid size in form of cols (columns) and rows  ----- \\
    // -----          and adds bootstrap components of row and col             ----- \\
    function buildGrid(rows, cols) {

        // ---------- Creating rows and appending them to main container div ---------- \\
        for (let i = 0; i < rows; i++) {
            let $rowDiv = $createElmnt.div();
            $rowDiv.addClass("row w-50 justify-content-center");
            $mainDiv.append($rowDiv);

            // ---------- Creating cols and appending them to the created row div ---------- \\
            for (let x = 0; x < cols; x++) {
                let $colDiv = $createElmnt.div();
                $colDiv.addClass("col-sm cards m-1 text-center p-0");
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
    }

    async function fillGridImgs() {
        let $cardFront = $('.flip-box-front');
        let $cardBack = $('.flip-box-back');
        let imgsArr = [];
        switch (currentLevel) {
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
        }, 2000)
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
                if (checkIfMatch(answers)) {
                    answers.forEach(function (answer) {
                        answer.unbind("click", flipImage);
                    })
                    score++;
                    resetAnswers();
                    console.log("Score: " + score);
                } else {
                    wrongAnswers++;
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
        return method;
    }());


    function main() {
        buildGrid(3, 4);
        fillGridImgs();
    }

    main();

})(window)