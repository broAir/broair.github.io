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


    $hiddenInput.keydown(function (e) {
        var keycode = e.keyCode || e.which;

        $editLine.text($hiddenInput.text());
        if (keycode == 13) {
            var commandText = $editLine.text();

            if (commandText.trim() == "")
                return;

            var spaceIndex = commandText.indexOf(' ');
            var commandName = spaceIndex == -1 ? commandText : commandText.substring(0, spaceIndex);
            var commandArgs = spaceIndex == -1 ? null : commandText.substr(spaceIndex + 1);
            if (commands.hasOwnProperty(commandName)) {
                commands[commandName](commandArgs);
            } else {
                $output.append("<span>Command <b>" + commandName + "</b> not found</span><br/> <span> Type <b>help</b> to list all available commands </span> <br/>");
            }

            $hiddenInput.empty();

            $hiddenInput.children().each(function (child) {
                $(child).remove();
            });

            $editLine.empty();
        }
    });


    $editLine.focus(function (e) {
        $hiddenInput.focus();
    });

    $editLine.mousedown($hiddenInput.focus());

});