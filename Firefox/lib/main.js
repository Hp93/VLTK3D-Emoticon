/*
 * VLTK3D Emoticon
 * Version: 1.0
 * Author: Hp93
 * Repository: https://github.com/Hp93/VLTK3D-Emoticon
 */

"use strict";

//#region===== References =======================

var buttons = require('sdk/ui/button/action');
var self = require("sdk/self");
var pageMods = require("sdk/page-mod");
var notifications = require("sdk/notifications");

//#endregion

//#region===== Property =========================

var lblActivate = "Activate VLTK3D Emoticon";
var lblDeactivate = "Deactivate VLTK3D Emoticon";
var button = buttons.ActionButton({
    id: "my-button",
    label: lblDeactivate,
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onClick: destroyPageMode,
    jx3State: false
});
var pageMod = pageMods.PageMod({
    include: "*.facebook.com",
    contentScriptFile: [self.data.url("VLTK3D-Emoticon.js")],
    contentStyleFile: [self.data.url("EmoStyle.css")]
});

//#endregion

//#region===== Main =============================

function registerPageMode() {

    pageMod = pageMods.PageMod({
        include: "*.facebook.com",
        contentScriptFile: [self.data.url("VLTK3D-Emoticon.js")],
        contentStyleFile: [self.data.url("EmoStyle.css")]
    });

    // Switch button state
    button.removeListener("click", registerPageMode);
    button.on("click", destroyPageMode);
    button.label = lblDeactivate;

    notifications.notify({
        title: "VLTK3D Emoticon disabled",
        text: "Emoticon has been enabled, please refresh website to take effect.",
        data: "enabled"
    });
}

function destroyPageMode() {

    pageMod.destroy();

    // Switch button state
    button.removeListener("click", destroyPageMode);
    button.on("click", registerPageMode);
    button.label = lblActivate;

    notifications.notify({
        title: "VL3D Emoticon enabled",
        text: "Emoticon has been disabled, please refresh website to take effect.",
        data: "disabled"
    });
}

//#endregion
