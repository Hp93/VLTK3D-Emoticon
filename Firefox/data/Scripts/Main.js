/*
 * VLTK3D Emoticon
 * Version: 1.2
 * Author: Hp93
 * License: Mozilla Public License, v. 2.0 @ https://www.mozilla.org/MPL/2.0/
 * Repository: https://github.com/Hp93/VLTK3D-Emoticon
 */

new Main().Init();

//===== Function in development
//// Enable Table Emo
//new TableEmo().Init();
//=============================

function Main() {
    "use strict";

    //#region===== Property =========================================

    // Class name of special nodes that hold the conversation
    var className =
    {
        parentNode: "_5wd4",    // The parent node, there are multiples class in each parent node.
        messageNode: "_5wd9",   // The message node inside a parent node, hole the message's information like author/time/content...
        contentNode: "_5yl5"    // The content node inside a message node.
    }

    var utils = new Utility();
    var emoUtils = new EmoticonUtility();

    //#endregion

    //#region===== Public ===========================================

    this.Init = function () {
        ///<summary></summary>

        try {
            utils.LogError("start observe body ...");
            ObserveBody();

            utils.LogError("Handle old message on first time load");
            var senjougahara = document.getElementsByClassName("conversation");

            for (var i = 0; i < senjougahara.length; i++) {
                var conversation = senjougahara[i].childNodes[0];
                ObserveConversation(conversation);

                for (var j = 0; j < conversation.childNodes.length; j++) {
                    var msg = conversation.childNodes[j];

                    if (msg.className.search(className.parentNode) >= 0) {
                        ProcessMessage(msg);
                    }
                }
            }
        } catch (ex) {
            utils.LogError(ex);
        }
    }

    //#endregion

    //#region===== Private ==========================================

    function ObserveBody() {
        ///<summary>
        /// Start observing changes in the body of the page.
        ///</summary>

        try {
            var body = document.querySelector("body");

            var obsBody = new MutationObserver(function (mutations) {

                mutations.forEach(function (mutation) {

                    if (NewConversationAdded(mutation)) {
                        utils.LogError("detect new conversation ...");
                        var conversation = mutation.target.childNodes[0];
                        ObserveConversation(conversation);
                    }
                });
            });

            obsBody.observe(body, { childList: true, subtree: true });
        } catch (ex) {
            utils.LogError(ex);
        }
    }

    function NewConversationAdded(mutation) {
        if (!mutation || !mutation.target || !mutation.addedNodes) {
            return false;
        }
        return mutation.target.className === "conversation" && mutation.addedNodes.length > 0;
    }

    function ObserveConversation(conversation) {
        ///<summary>
        /// Interpret messages, replace emo code with emoticon.
        ///</summary>

        try {
            var obsConversation = new MutationObserver(function (messages) {

                messages.forEach(function (message) {
                    utils.LogError("detect new msg ...");
                    ProcessMessage(message.addedNodes[0]);
                });
            });

            obsConversation.observe(conversation, { childList: true });
        } catch (ex) {
            utils.LogError(ex);
        }
    }

    function FindContentNode(messageNodes) {
        ///<summary>
        /// Find the node contain the content of the message.
        ///</summary>
        ///<param name="messageNodes">All message nodes to process.</param>

        try {
            var contentNode = [], msgNode = null;

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
}
