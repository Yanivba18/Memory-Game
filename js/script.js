"use strict";
(() => {
// ----- This is the main div on which we will print our cards ----- \\
    const $mainDiv = $('#mainContainer'); 

    function flipImage() {

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
    
// ----- fillGridImgs gets the grid size in form of cols (columns) and rows ----- \\
    async function fillGridImgs(cols, rows) {

// ---------- Creating rows and appending them to main container div ---------- \\
        for (let i = 0; i < rows; i++) {            
            let $rowDiv = $createElmnt.div();
            $rowDiv.addClass("row w-50");
            $mainDiv.append($rowDiv);

// ---------- Creating cols and appending them to the created row div ---------- \\
            for (let x = 0; x < cols; x++) {
                let $colDiv = $createElmnt.div();
                $colDiv.addClass("col-sm cards m-2 text-center");
                let $dogImg = $createElmnt.img();
                let dogImgSrc = await getRandomDog();

                $dogImg.attr("src", dogImgSrc.message);
                $dogImg.addClass("img-responsive h-100");
                $colDiv.append($dogImg);
                $rowDiv.append($colDiv);
            }
        }
    }


// ---------- Name-spacing methods for creating jquery elements ---------- \\    
    let $createElmnt = (function () {
        let method = {};
        
        method.createElementByTag = function (tagName) {            
            return $(document.createElement(tagName));
        }

        method.div = function() {return this.createElementByTag('div')};
        method.img = function() {return this.createElementByTag('img')};
        return method;
    }());

    fillGridImgs(3, 4);

})(window)