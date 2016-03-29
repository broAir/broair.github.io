$(document).ready(function () {
    var commands = {
        "help": {
            info: "Lists available commands",
            trigger: function (args, $output) {
                for (var command in commands) {
                    $output.append("<b>" + command + "</b>: ");
                    $output.append(commands[command].info);
                    $output.append("<br />")
                }
            }
        },

        "list": {
            info: "See some projects",
            projects: {
                "cloudSyncUtil": {
                    url: "",
                    shortDesc: "Utility for syncronizing stuff from cloud and back",
                    github: "https://github.com/broAir/CloudSyncUtil",
                    state: "in-progress"
                },

                "ui.terminal": {
                    url: "",
                    shortDesc: "Jquery terminal, maaan!",
                    github: "https://github.com/broAir/ui.terminal",
                    state: "in-progress"
                }
            },

            trigger: function (args, $output) {
                var html = "projects / <br/>";
                for (var proj in this.projects) {
                    var project = this.projects[proj];
                    html += "---- <b>" + proj + "</b> / <br/>";
                    html += "-------- " + project.shortDesc + " <br/>";
                    html += "-------- <a href='" + project.url + "' target='_blank'>link</a> <br/>";
                    html += "-------- <a href='" + project.github + "' target='_blank'>github</a> <br/>";
                }
                $output.append(html);
            }
        },

        "goto": {
            info: "Navigate to a different resource. Guess the parameters!",
            trigger: function (args, $output) {

            },
            dirs: {

            }
        },
        "clear": {
            info: "Clears the output",
            trigger: function (args, $output) {
                $output.empty();
            }
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
                $output.append("<br />");
                var command = commands[commandName];
                command.trigger(commandArgs, $output);
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