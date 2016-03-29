$(document).ready(function () {
    var commands = {
        "help": {
            info: "Lists available commands",
            trigger: function (args) {
                var htmlret = "";
                for (var command in commands) {
                    htmlret += "<b>" + command + "</b>: ";
                    htmlret += commands[command].info;
                    htmlret += "<br />";
                }
                return htmlret;
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
                },

                "this site": {
                    url: "http://broair.github.io",
                    shortDesc: "This website",
                    github: "https://github.com/broAir/broair.github.io",
                    state: "in-progress"
                }
            },
            trigger: function (args) {
                var html = "projects / <br/>";
                for (var proj in this.projects) {
                    var project = this.projects[proj];
                    html += "---- <b>" + proj + "</b> / <br/>";
                    html += "-------- " + project.shortDesc + " <br/>";
                    html += "-------- <a href='" + project.url + "' target='_blank' class='link'>link</a> <br/>";
                    html += "-------- <a href='" + project.github + "' target='_blank' class='link'>github</a> <br/>";
                }
                return html;
            }
        },

        "goto": {
            info: "Navigate to a different resource. Guess the parameters!",
            trigger: function (args) {

            },
            dirs: {}
        },
        "clear": {
            info: "Clears the output",
            trigger: function (args) {
                $output.empty();
            }
        }
    };
    var commandsStack = {
        arr: [],
        pointer: 0,
        push: function (cmd) {
            this.arr.push(cmd);
            this.reset();
        },
        popUp: function () {
            this.pointer--;
            if (this.pointer < this.arr.length && this.pointer >= 0) {
                var el = this.arr[this.pointer];
                return el;
            } else {
                // do not move the pointer if command not found
                this.pointer = 0;
            }
        },
        popDown: function () {
            this.pointer++;
            if (this.pointer < this.arr.length && this.pointer >= 0) {
                var el = this.arr[this.pointer];
                return el;
            } else {
                // do not move the pointer if command not found
                this.pointer = this.arr.length == 0 ? 0 : this.arr.length;
            }
        },
        reset: function () {
            this.pointer = this.arr.length;
        }
    };

    var putCaretToTheEnd = function (el) {
        el.focus();
        var textNode = el.firstChild;

        if (textNode == null || textNode.data == null)
            return;

        var caret = textNode.data.length || 0;
        var range = document.createRange();

        range.setStart(textNode, caret);
        range.setEnd(textNode, caret);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };

    var terminalScrollBottom = function () {
        $terminal.scrollTop($terminal[0].scrollHeight);
    };

    var inputPath = "root@anykeydev:~/projects";
    var inputHtml = '<span id="input-text">' + inputPath + ' $</span>\
                     <span class="terminal-input">help</span>';


    var $hiddenInput = $(".terminal-helper");
    var $terminal = $(".terminal");
    var $inputLine = $(".terminal-input");
    var $output = $(".terminal-output");

    var addToOutput = function (data) {
        $output.append(data);
        terminalScrollBottom();
    };

    $terminal.blur(function () {
        terminalScrollBottom();
    });

    var createNewInput = function () {
        $inputLine.removeClass("terminal-input terminal-input-typing");

        addToOutput(inputHtml);

        $inputLine = $output.find(".terminal-input");
    };

    $terminal.mouseup(function () {
        $hiddenInput.focus();
    });

    $inputLine.mousedown($hiddenInput.focus());

    $inputLine.focus(function (e) {
        $hiddenInput.focus();
    });

    $hiddenInput.focus(function (e) {
        terminalScrollBottom();
        putCaretToTheEnd($hiddenInput.get(0));
        $inputLine.addClass("terminal-input-typing");
    });

    $hiddenInput.blur(function (e) {
        $inputLine.removeClass("terminal-input-typing");
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

            commandsStack.push(commandText);
            var spaceIndex = commandText.indexOf(' ');
            var commandName = spaceIndex == -1 ? commandText : commandText.substring(0, spaceIndex);
            var commandArgs = spaceIndex == -1 ? null : commandText.substr(spaceIndex + 1);

            if (commands.hasOwnProperty(commandName)) {
                addToOutput("<br />");
                var command = commands[commandName];
                addToOutput(command.trigger(commandArgs));
                createNewInput();
            } else {
                addToOutput("<br /> <span>Command <b>" + commandName + "</b> not found</span><br/>");
                addToOutput("<span> Type <b>help</b> to list all available commands </span> <br/>");
                createNewInput();
            }

            $hiddenInput.empty();
            $inputLine.empty();

            $hiddenInput.children().each(function (child) {
                $(child).remove();
            });

            $hiddenInput.focus();

        }

    });

    $hiddenInput.keydown(function (e) {
        var keycode = e.keyCode || e.which;

        if (keycode == 38 || keycode == 40) {
            var cmd;
            if (keycode == 38) {
                cmd = commandsStack.popUp();
            }
            if (keycode == 40) {
                cmd = commandsStack.popDown();
                //in case godown 
                if (cmd === void 0) {
                    $hiddenInput.empty();
                    $inputLine.empty();
                }
            }

            if (cmd) {
                $inputLine.text(cmd);
                $hiddenInput.text(cmd);

            }
        }
    });

    $hiddenInput.keyup(function (e) {
        var keycode = e.keyCode || e.which;

        if (keycode == 38 || keycode == 40) {
            putCaretToTheEnd($hiddenInput.get(0));
        }
    });


});