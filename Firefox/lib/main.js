/*
 * VLTK3D Emoticon
 * Version: 1.1
 * Author: Hp93
 * Repository: https://github.com/Hp93/VLTK3D-Emoticon
 */

"use strict";

//#region===== References ===========================================

var buttons = require('sdk/ui/button/action');
var self = require("sdk/self");
var pageMods = require("sdk/page-mod");
var notifications = require("sdk/notifications");

//#endregion

//#region===== Property =============================================

var button = buttons.ActionButton({
    id: "my-button",
    label: "Deactivate VLTK3D Emoticon",
    icon: {
        "16": "./icon-16.ico",
        "32": "./icon-32.ico",
        "48": "./icon-48.ico",
        "64": "./icon-64.ico"
    },
    onClick: destroyPageMode,
    jx3State: false
});

var pageMod = pageMods.PageMod({
    include: "*.facebook.com",
    contentScriptFile: [self.data.url("Scripts/Utility.js"),
                        self.data.url("Scripts/EmoticonUtility.js"),
                        self.data.url("Scripts/TableEmo.js"),
                        self.data.url("Scripts/Main.js")],
    contentStyleFile: [self.data.url("Style/EmoStyle.css")]
});

function registerPageMode() {

    pageMod = pageMods.PageMod({
        include: "*.facebook.com",
        contentScriptFile: [self.data.url("Scripts\Main.js"),
                            self.data.url("Scripts\EmoticonUtility.js"),
                            self.data.url("Scripts\TableEmo.js"),
                            self.data.url("Scripts\Utility.js")],
        contentStyleFile: [self.data.url("Style\EmoStyle.css")]
    });

    // Switch button state
    button.removeListener("click", registerPageMode);
    button.on("click", destroyPageMode);
    button.label = "Deactivate VLTK3D Emoticon";
    button.icon = {
        "16": "./icon-16.ico",
        "32": "./icon-32.ico",
        "48": "./icon-48.ico",
        "64": "./icon-64.ico"
    };    

    notifications.notify({
        title: "Enabled",
        text: "VLTK3D Emoticon has been enabled, please refresh Facebook to take effect.",
        data: "enabled",
        iconUrl: self.data.url("icon-64.ico")
    });
}

function destroyPageMode() {

    pageMod.destroy();

    // Switch button state
    button.removeListener("click", destroyPageMode);
    button.on("click", registerPageMode);
    button.label = "Activate VLTK3D Emoticon";
    button.icon = {
        "16": "./icon-16-gray.png",
        "32": "./icon-32-gray.png",
        "48": "./icon-48-gray.png",
        "64": "./icon-64-gray.png"
    };
    
    notifications.notify({
        title: "Disabled",
        text: "VLTK3D Emoticon has been disabled, please refresh Facebook to take effect.",
        data: "disabled",
        iconUrl: "./icon-64-gray.png"
    });
}

//#endregion
