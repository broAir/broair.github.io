$(document).ready(function () {
    var commands = {
        "help": function (args) {
            alert(args);
        }

    }
    var $hiddenInput = $(".terminal-helper");
    var $terminal = $(".terminal");
    var $editLine = $(".terminal-edit");
    var $output = $(".terminal-output");

    $terminal.mouseup(function () {
        $hiddenInput.focus();
    });

    $hiddenInput.keypress(function (e) {
        $editLine.text($hiddenInput.text());
    });

    $hiddenInput.keydown(function (e) {
        var keycode = e.keyCode || e.which;

        if (keycode == 13) {
            var commandText = $editLine.text();
            var spaceIndex = commandText.indexOf(' ');
            var commandName = spaceIndex == -1 ? commandText : commandText.substring(0, spaceIndex);
            var commandArgs = spaceIndex == -1 ? null : commandText.substr(spaceIndex + 1);
            if (commands.hasOwnProperty(commandName)) {
                commands[commandName](commandArgs);
            } else {
                $output.append("<span>There is no such command <b>" + commandName + "</b></span><br/> <span> Type <b>help</b> for more info </span> <br/>");
            }

            $hiddenInput.empty();

            $hiddenInput.children().each(function (e) {
                $(e).remove();
            });

            $editLine.empty();
        }
    });


    // from s/o
    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    $editLine.focus(function (e) {
        //placeCaretAtEnd($editLine.get(0));
        $hiddenInput.focus();
    });
    $editLine.mousedown($hiddenInput.focus());

});