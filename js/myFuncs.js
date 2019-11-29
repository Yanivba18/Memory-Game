"use strict";
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
    method.input = function () { return this.createElementByTag('input')};
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