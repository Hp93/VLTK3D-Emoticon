/*
 * VLTK3D Emoticon
 * Version: 1.0
 * Author: Hp93
 * License: Mozilla Public License, v. 2.0 @ https://www.mozilla.org/MPL/2.0/
 */

"use strict";

//#region===== Property ==========================================

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
    parentNode: "_5wd4",    // The parent node, there are multiples class in one parent node.
    messageNode: "_5wd9",   // The message node inside a parent node, hole the message's information like author/time/content...
    contentNode: "_5yl5"    // The content node inside a message node.
}

var obsBody, obsConversation;

var isObserving = false;
var firstTimeLoaded = true;
var debug = true;

//#endregion

//#region===== Main ==============================================

if (!obsBody) {
    obsBody = new MutationObserver(BodyObserver);
    obsBody.observe(body, config);
}

if (!obsConversation) {
    obsConversation = new MutationObserver(ConversationObserver);
}

function BodyObserver() {
    ///<summary>
    /// Enable/Disable obvering conversation.
    ///</summary>

    try {
        conversation = document.querySelector(".conversation>div");

        if (conversation) {

            if (firstTimeLoaded && conversation.childNodes.length > 0) {
                firstTimeLoaded = false;

                for (var i = 0; i < conversation.childNodes.length; i++) {
                    var msg = conversation.childNodes[i];

                    if (msg.className.search(className.parentNode) >= 0) {
                        var loadedMessages = msg.childNodes;
                        ProcessMessage(loadedMessages);
                    }
                }
            }

            if (!isObserving) {
                isObserving = true;
                obsConversation.observe(conversation, config);
            }
        } else {
            if (isObserving) {
                isObserving = false;
                obsConversation.disconnect();
            }
        }
    } catch (ex) {
        LogError(ex);
    }
}

function ConversationObserver(messages) {
    ///<summary>
    /// Interpret messages, replace emo code with emoticon.
    ///</summary>

    try {
        var msgNode;

        messages.forEach(function (message) {
            var newMessages = message.addedNodes;
            ProcessMessage(newMessages);
        });
    } catch (ex) {
        LogError(ex);
    }
}

//#endregion

//#region===== Emoticon Handler ==================================

function ContainEmoCode(input) {
    var regex = /#[a-z]+/i;

    if ((typeof input) === "string" && input.search(regex) >= 0) {
        return true;
    }

    return false;
}

function InterpretEmoticon(input) {
    ///<summary>
    /// Interpret input to find emoticon code and replace with icon.
    ///</summary>
    ///<param name="input">Text input</param>
    ///<returns type="Array">Array of DOM Elements</returns>

    var regex = /#[a-z]+/i;
    var result = [];

    while (true) {

        if (!input.match(regex)) {
            result.push(document.createTextNode(input));
            break;
        }

        var emoCode = RemoveSharpSign(input.match(regex)[0]);
        var emoClass = GetEmoClass(emoCode);

        //var emoTextHtml = "<span class='emoticon_text'>emoCode emoticon</span>";
        //var emoHtml = "<span class='emoticon emoClass' title='emoCode'></span>";

        var emoTextHtml = CreateDomElement(emoCode + " emoticon", "span", [["class", "emoticon_text"]]);
        var emoHtml = CreateDomElement(null, "span", [["class", "emoticon " + emoClass], ["title", emoCode]]);

        var senjougahara = input.substr(0, input.search(regex));

        result.push(document.createTextNode(senjougahara));
        result.push(emoTextHtml);
        result.push(emoHtml);

        // Explain: emoCode real length = emoCode length + 1 (sharp sign)
        input = input.substr(senjougahara.length + emoCode.length + 1);
    }

    return result;
}

function GetEmoClass(emoCode) {
    ///<summary>
    /// Find the CSS class that match with given emoticon.
    ///</summary>
    ///<param name="emoCode">Text input</param>
    ///<returns type="String">Emoticon CSS class</returns>

    if (!emoCode) {
        return "unknown";
    }

    return "emoticon_" + emoCode;
}

function RemoveSharpSign(input) {
    ///<summary>
    /// Remove sharp/hash (#) sign
    ///</summary>

    if (!input) {
        return "";
    }

    return input.replace("#", "");
}

//#endregion

//#region===== Utilities =========================================

function CreateDomElement(inputContent, inputElement, inputAttribute) {
    ///<summary>
    /// Create DOM element with given attributes.
    ///</summary>
    ///<param name="inputContent">Content of element (#text)</param>
    ///<param name="inputElement">Type/Name tag of element (Ex: div, span ...)</param>
    ///<param name="inputAttribute">
    /// Attributes and values of element. In array format.
    /// Ex: [["class", "emoticon"], ["style", "color: black;"]]
    ///</param>
    ///<returns type="DOM Element">DOM Element</returns>

    var element = null;
    var content = null;

    // Create required elements
    if (inputElement) {
        element = document.createElement(inputElement);

        if (inputAttribute) {

            for (var i = 0; i < inputAttribute.length; i++) {
                element.setAttribute(inputAttribute[i][0], inputAttribute[i][1]);
            }
        }
    }

    if (inputContent) {
        content = document.createTextNode(inputContent);
    }

    if (element && content) {
        element.appendChild(content);
    }

    return element ? element : content;
}

function FindContentNode(messageNodes) {
    ///<summary>
    /// Find the node contain the content of the message.
    ///</summary>
    ///<param name="messageNodes">All message nodes to process.</param>

    try {
        var contentNode = [], msgNode;

        for (var i = 0; i < messageNodes.length; i++) {
            var addedChildNodes = messageNodes[i].childNodes;

            // Find message node
            for (var j = 0; j < addedChildNodes.length; j++) {
                var parentNode = addedChildNodes[j];

                if (parentNode.className === className.messageNode) {
                    msgNode = parentNode;
                    break;
                }
            }

            if (msgNode) {

                // Find Content node inside Message node
                while (true) {

                    if (msgNode.className === className.contentNode) {
                        contentNode.push(msgNode);
                        break;
                    } else {
                        msgNode = msgNode.childNodes[0];
                    }
                };
            };
        }
        return contentNode;
    } catch (ex) {
        LogError(ex);
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

        if (ContainEmoCode(parentNode.data)) {
            Array.prototype.push.apply(results, InterpretEmoticon(parentNode.data));
        }
    } else {

        for (var i = 0; i < parentNode.childNodes.length; i++) {
            var child = parentNode.childNodes[i];

            switch (child.nodeName) {
                case "#text":
                    Array.prototype.push.apply(results, InterpretEmoticon(child.data));
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

    RemoveChildren(contentNode);

    for (var j = 0; j < results.length; j++) {
        contentNode.appendChild(results[j]);
    }
}

function LogError(ex) {
    if (debug) {
        console.log(ex.toString());
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
        LogError(ex);
    }
}

function RemoveChildren(parent) {
    ///<summary>
    /// Remove all children of given node.
    ///</summary>
    ///<param name="parent">Parent node.</param>

    try {
        if (!parent) {
            return;
        }

        for (var i = 0; i < parent.childNodes.length; i++) {
            parent.removeChild(parent.childNodes[i]);
        }
    } catch (ex) {
        LogError(ex);
    }
}

//#endregion
