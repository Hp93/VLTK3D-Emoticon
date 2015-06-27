/*
 * VLTK3D Emoticon
 * Version: 1.1
 * Author: Hp93
 * License: Mozilla Public License, v. 2.0 @ https://www.mozilla.org/MPL/2.0/
 * Repository: https://github.com/Hp93/VLTK3D-Emoticon
 */

"use strict";

//#region===== Property =============================================

// Class conversation of Facebook, which hold the Message window
var conversation;

// MutationObserver config
var config = { childList: true };

// MutationObserver targets
var body = document.querySelector("body");
var conversation = document.querySelector(".conversation>div");

// Class name of special nodes that hold the conversation
var className =
{
    parentNode: "_5wd4",    // The parent node, there are multiples class in each parent node.
    messageNode: "_5wd9",   // The message node inside a parent node, hole the message's information like author/time/content...
    contentNode: "_5yl5"    // The content node inside a message node.
}

var obsBody, obsConversation;

var isObserving = false;
var firstTimeLoaded = true;

var debug = true;

var utils = new Utility();
var emoUtils = new EmoticonUtility();

//#endregion

//#region===== Main =================================================

if (!obsBody) {
    obsBody = new MutationObserver(BodyObserver);
    obsBody.observe(body, config);
}

if (!obsConversation) {
    obsConversation = new MutationObserver(ConversationObserver);
}

// Enable Table Emo
new TableEmo().Init();

function BodyObserver() {
    ///<summary>
    /// Enable/Disable observing conversation.
    ///</summary>

    try {
        conversation = document.querySelector(".conversation>div");

        if (conversation) {
            utils.LogError("detect conversation ...");
            utils.LogError(conversation.childNodes.length);

            //if (firstTimeLoaded && conversation.childNodes.length > 0) {
            //    utils.LogError("this is first time loaded");
            //    firstTimeLoaded = false;

            //    for (var i = 0; i < conversation.childNodes.length; i++) {
            //        var msg = conversation.childNodes[i];

            //        if (msg.className.search(className.parentNode) >= 0) {
            //            ProcessMessage(msg);
            //        }
            //    }
            //}

            if (!isObserving) {
                utils.LogError("start observing conversation ...");
                isObserving = true;
                obsConversation.observe(conversation, config);

                for (var i = 0; i < conversation.childNodes.length; i++) {
                    var msg = conversation.childNodes[i];

                    if (msg.className.search(className.parentNode) >= 0) {
                        ProcessMessage(msg);
                    }
                }
            }
        } else {
            if (isObserving) {
                utils.LogError("stop observing conversation ...");
                isObserving = false;
                obsConversation.disconnect();
            }
        }
    } catch (ex) {
        utils.LogError(ex);
    }
}

function ConversationObserver(messages) {
    ///<summary>
    /// Interpret messages, replace emo code with emoticon.
    ///</summary>

    try {
        utils.LogError("detect new msg ...");

        messages.forEach(function (message) {
            ProcessMessage(message.addedNodes[0]);
        });
    } catch (ex) {
        utils.LogError(ex);
    }
}

//#endregion

//#region===== Utilities ============================================

function FindContentNode(messageNodes) {
    ///<summary>
    /// Find the node contain the content of the message.
    ///</summary>
    ///<param name="messageNodes">All message nodes to process.</param>

    try {
        var contentNode = [], msgNode;

        var addedChildNodes = messageNodes.childNodes;

        // Find message node
        for (var j = 0; j < addedChildNodes.length; j++) {
            var parentNode = addedChildNodes[j];

            if (parentNode.className === className.messageNode) {
                msgNode = parentNode;
                break;
            }
        }

        // Find Content node inside Message node
        while (msgNode) {

            if (msgNode.className === className.contentNode) {
                contentNode.push(msgNode);
                break;
            } else {
                msgNode = msgNode.childNodes[0];
            }
        }

        return contentNode;

    } catch (ex) {
        utils.LogError(ex);
        return null;
    }
}

function InterpretMessage(node) {
    ///<summary>
    /// Interpret message, replace emo code with emoticon.
    ///</summary>
    ///<param name="node">A content node contain the content of the message.</param>

    var contentNode = node;
    var parentNode = contentNode.childNodes[0].childNodes[0];
    var results = [];

    if (parentNode.nodeName === "#text") {
        // Message contains text only

        if (emoUtils.ContainEmoCode(parentNode.data)) {
            Array.prototype.push.apply(results, emoUtils.InterpretEmoticon(parentNode.data));
        }
    } else {

        for (var i = 0; i < parentNode.childNodes.length; i++) {
            var child = parentNode.childNodes[i];

            switch (child.nodeName) {
                case "#text":
                    Array.prototype.push.apply(results, emoUtils.InterpretEmoticon(child.data));
                    break;

                case "SPAN":
                    results.push(child);
                    break;

                default:
                    break;
            }
        }
    }

    if (results.length <= 0) {
        return;
    }

    utils.RemoveChildren(contentNode);

    for (var j = 0; j < results.length; j++) {
        contentNode.appendChild(results[j]);
    }
}

function ProcessMessage(messages) {
    ///<summary>
    /// Process new messages.
    ///</summary>
    ///<param name="messages">List of new messages (type = Array of HTML Nodes)</param>

    try {
        var delayTime = 200;    // milisecond

        // Find message node
        var contentNode = FindContentNode(messages);

        if (!contentNode || contentNode.length <= 0) {
            return;
        }

        // Wait for Facebook to interpret its emoticon first.
        window.setTimeout(function () {
            for (var i = 0; i < contentNode.length; i++) {
                InterpretMessage(contentNode[i]);
            }
        }, delayTime);
    } catch (ex) {
        utils.LogError(ex);
    }
}

//#endregion
