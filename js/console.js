$(document).ready(function () {
    var commands = {
        "help": function (args, $output) {
            alert(args);
        }
    };

    var inputHtml = '<span id="input-text">root@anykeydev:~/projects $</span>\
                      <span class="terminal-input" contenteditable="true">help</span>';


    var $hiddenInput = $(".terminal-helper");
    var $terminal = $(".terminal");
    var $inputLine = $(".terminal-input");
    var $output = $(".terminal-output");

    var createNewInput = function () {
        $inputLine.toggleClass("terminal-input");

        $output.append(inputHtml);

        $inputLine = $output.find(".terminal-input");
    };

    $terminal.mouseup(function () {
        $hiddenInput.focus();
    });

    $inputLine.mousedown($hiddenInput.focus());

    $inputLine.focus(function (e) {
        $hiddenInput.focus();
    });

    $hiddenInput.on("input", function (e) {
        $inputLine.text($hiddenInput.text());
    });

    $hiddenInput.keypress(function (e) {
        var keycode = e.keyCode || e.which;

        if (keycode == 13) {
            $inputLine.text($hiddenInput.text());

            var commandText = $inputLine.text();

            if (commandText.trim() == "")
                return;

            var spaceIndex = commandText.indexOf(' ');
            var commandName = spaceIndex == -1 ? commandText : commandText.substring(0, spaceIndex);
            var commandArgs = spaceIndex == -1 ? null : commandText.substr(spaceIndex + 1);

            if (commands.hasOwnProperty(commandName)) {
                commands[commandName](commandArgs, $output);
                $output.append("<br />");
                createNewInput();
            } else {
                $output.append("<br /> <span>Command <b>" + commandName + "</b> not found</span><br/>");
                $output.append("<span> Type <b>help</b> to list all available commands </span> <br/>");
                createNewInput();
            }

            $hiddenInput.empty();

            $hiddenInput.children().each(function (child) {
                $(child).remove();
            });

            $inputLine.empty();
        }
    });


});