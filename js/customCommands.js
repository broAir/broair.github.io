/**
 * Created by andreybobrov on 4/9/16.
 */
(function(window) {
    var printSomeLinks = function (title, links) {
        var html = title + " / <br/>";
        for (var index in links) {
            var link = links[index];
            html += "---- <a href='" + link.url + "' class='link'" + (link.sameTab ? "" : "target='_blank'") + ">" + index + "</a> <br/>";
        }
        return html;
    };

    var commands = [];

    commands.push({
        name: "list",
        desc: "See some projects",
        trigger: function () {
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
        },
        properties: {
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
                    github: "https://github.com/broAir/ui-terminal",
                    state: "in-progress"
                },

                "this site": {
                    url: "http://broair.github.io",
                    shortDesc: "This website",
                    github: "https://github.com/broAir/broair.github.io",
                    state: "in-progress"
                }
            }
        }
    });

    commands.push({
        name: "contact",
        desc: "List contacts",
        trigger: function () {
            return printSomeLinks("contact", this.links);
        },
        properties: {
            links: {
                "email: andrey.bobrov.dev@gmail.com": {
                    url: "mailto:andrey.bobrov.dev@gmail.com?subject=Hey wassup",
                    sameTab: true
                },
                "linkedIn": {url: "https://www.linkedin.com/in/andreybobrov"},
                "skype: andrey.bobrov.dev": {url: "skype:andrey.bobrov.dev?chat", sameTab: true}
            }
        }
    });

    commands.push({
        name: "lifestyle",
        desc: "Irrelevant resources",
        trigger: function () {
            return printSomeLinks("lifestyle", this.links);
        },
        properties: {
            links: {
                "instagram": {url: "https://www.instagram.com/xprayforthedeadx/"},
                "fb": {url: "https://www.facebook.com/profile.php?id=100005776141390"}
            }
        }
    });

    window.customCommands = commands;
})(window);