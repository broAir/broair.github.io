$(document).ready(function () {
    // username/folder
    var inputPath = "root@anykeydev:~/projects";
    // Input line template
    var inputHtml = '<div class="terminal-input-wrap">\
                         <span id="input-text">' + inputPath + ' $</span>\
                         <span class="terminal-input">help</span>\
                     </div>';

    // most used selectors
    var $terminal = $(".terminal");
    var $output = $(".terminal-output");
    var $inputDisplayText = $(".terminal-input");
    var $hiddenInput = $(".terminal-helper");
    // the whole input line
    var $inputLine = $(".terminal-input-wrap");

    var printSomeLinks = function (title, links) {
        var html = title + " / <br/>";
        for (var index in links) {
            var link = links[index];
            html += "---- <a href='" + link.url + "' class='link'" + (link.sameTab ? "" : "target='_blank'") + ">" + index + "</a> <br/>";
        }
        return html;
    };

    // Associative list of commands.
    // TODO: use array instead. create a Command class for convenience
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
                    html += "-------- state: <i>" + project.state + "</i> <br/>";
                }
                return html;
            }
        },

        "contact": {
            info: "List contacts",
            trigger: function (args) {
                return printSomeLinks("contact", this.links);
            },
            links: {
                "email: andrey.bobrov.dev@gmail.com": { url: "mailto:andrey.bobrov.dev@gmail.com?subject=Hey wassup", sameTab: true },
                "linkedIn": { url: "https://www.linkedin.com/in/andreybobrov" },
                "skype: andrey.bobrov.dev": { url: "skype:andrey.bobrov.dev?chat", sameTab: true }
            }
        },

        "lifestyle": {
            info: "Irrelevant resources",
            trigger: function (args) {
                return printSomeLinks("lifestyle", this.links);
            },
            links: {
                "instagram": { url: "https://www.instagram.com/xprayforthedeadx/" },
                "fb": { url: "https://www.facebook.com/profile.php?id=100005776141390" }
            }
        },

        "clear": {
            info: "Clears the output",
            trigger: function (args) {
                $output.empty();
            }
        }
    };

    // Simple implementation of commands stack.
    // To make sure that we can navigate trough the commands history
    // by pressing up/down arrow keys.
    var commandsStack = {
        arr: [],
        // current position in the arr
        pointer: 0,
        // add command to stack and reset pointer
        push: function (cmd) {
            // If the command was in the array we should remove it and push back to the stack
            var index = this.arr.indexOf(cmd);
            if (index >= 0) {
                this.arr.splice(index, 1);
            }

            this.arr.push(cmd);

            this.reset();
        },

        // Get previous command.
        popUp: function () {
            this.pointer--;
            if (this.pointer < this.arr.length && this.pointer >= 0) {
                var el = this.arr[this.pointer];
                return el;
            } else {
                // reset the pointer if command not found
                this.pointer = 0;
            }
        },
        popDown: function () {
            this.pointer++;
            if (this.pointer < this.arr.length && this.pointer >= 0) {
                var el = this.arr[this.pointer];
                return el;
            } else {
                // reset the pointer if command not found
                this.pointer = this.arr.length == 0 ? 0 : this.arr.length;
            }
        },
        reset: function () {
            this.pointer = this.arr.length;
        }
    };

    // We need to make sure that caret remains in the end to avoid input issues.
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

    // Input is re-created each time we submit the data.
    var createNewInput = function () {
        $inputDisplayText.removeClass("terminal-input terminal-input-typing");
        $inputLine.removeClass("terminal-input-wrap");
        addToOutput(inputHtml);
        // fix the reference
        $inputDisplayText = $output.find(".terminal-input");
        $inputLine = $output.find(".terminal-input-wrap")
    };

    // Function that we use to output data.
    var addToOutput = function (data) {
        $output.append(data);

        // Scroll down after we are done
        terminalScrollBottom();
    };

    // This handle is to make sure that clicks on the empty space below the input
    // are redirected to the input itself
    $terminal.click(function (e) {
        // if we clicked on the child element
        if (this != e.target)
            return;

        $hiddenInput.focus();

    });

    $output.on("click", ".terminal-input-wrap", function(e) {
        // To make sure that if we click on an empty space to the right
        // the focus is set on the input itself
        $hiddenInput.focus();
    });

    // Redirect focus to the hidden input
    $inputDisplayText.focus(function (e) {
        $hiddenInput.focus();
    });

    $hiddenInput.focus(function (e) {
        // To make sure that we see the input line
        terminalScrollBottom();
        putCaretToTheEnd($hiddenInput.get(0));
        $inputDisplayText.addClass("terminal-input-typing");
    });

    $hiddenInput.blur(function (e) {
        // Removing the fake caret from input to indicate that we are not focused
        $inputDisplayText.removeClass("terminal-input-typing");
    });

    // We should copy the input value to the display text to inform user that his typings are reflected:)
    $hiddenInput.on("input", function (e) {
        $inputDisplayText.text($hiddenInput.text());
    });

    $hiddenInput.keypress(function (e) {
        var keycode = e.keyCode || e.which;

        // The ENTER key
        if (keycode == 13) {

            // To make sure the input is not fulfilled with empty div
            e.preventDefault();

            var commandText = $inputDisplayText.text();

            // In no text
            if (commandText.trim() == "")
                return;

            $inputDisplayText.text($hiddenInput.text());
            // Pushing command to the stack for preserving history
            commandsStack.push(commandText);
            // Getting command name and arguments
            var spaceIndex = commandText.indexOf(' ');
            var commandName = spaceIndex == -1 ? commandText : commandText.substring(0, spaceIndex);
            var commandArgs = spaceIndex == -1 ? null : commandText.substr(spaceIndex + 1);

            // If command is in the list
            if (commands.hasOwnProperty(commandName)) {
                var command = commands[commandName];
                addToOutput(command.trigger(commandArgs));
                createNewInput();
            } else {
                addToOutput("<span>Command <b>" + commandName + "</b> not found</span><br/>");
                addToOutput("<span> Type <b>help</b> to list all available commands </span> <br/>");
                createNewInput();
            }

            // Clear all the inputs
            $hiddenInput.empty();
            $inputDisplayText.empty();
            // Just in case browser has added some empty html when we cleared texts
            $hiddenInput.children().each(function (child) {
                $(child).remove();
            });

            // Focusing back to the input
            $hiddenInput.focus();
        }

    });

    $hiddenInput.keydown(function (e) {
        var keycode = e.keyCode || e.which;

        // Up/Down Arrow keys
        if (keycode == 38 || keycode == 40) {
            var cmd;
            // The Up arrow key
            if (keycode == 38) {
                cmd = commandsStack.popUp();
            }
            // The Down arrow key
            if (keycode == 40) {
                cmd = commandsStack.popDown();
                //in case no commands left below this one - blank the input
                if (cmd === void 0) {
                    $hiddenInput.empty();
                    $inputDisplayText.empty();
                }
            }

            // If command has been found, set the texts
            if (cmd) {
                $inputDisplayText.text(cmd);
                $hiddenInput.text(cmd);
            }
        }
    });

    $hiddenInput.keyup(function (e) {
        var keycode = e.keyCode || e.which;
        // The KEYDOWN event is fired before input is fulfilled.
        // That is why we should put caret to its initial place.
        if (keycode == 38 || keycode == 40) {
            putCaretToTheEnd($hiddenInput.get(0));
        }
    });


});