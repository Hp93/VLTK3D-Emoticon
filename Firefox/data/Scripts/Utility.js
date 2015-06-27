/*
 * VLTK3D Emoticon
 * Version: 1.1
 * Author: Hp93
 * License: Mozilla Public License, v. 2.0 @ https://www.mozilla.org/MPL/2.0/
 * Repository: https://github.com/Hp93/VLTK3D-Emoticon
 */

function Utility() {
    "use strict";

    this.CreateDomElement = function (inputContent, inputElement, inputAttribute) {
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

        try {
            var element = null;
            var content = null;

            // Create required elements
            if (inputElement && (typeof inputElement === "string")) {
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

        } catch (ex) {
            this.LogError(ex);
            return null;
        }
    }

    this.RemoveChildren = function (parent) {
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
            utils.LogError(ex);
        }
    }

    this.LogError = function (ex) {
        if (debug) {
            console.log(ex);
        }
    }
}
