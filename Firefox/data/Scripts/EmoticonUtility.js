/*
 * VLTK3D Emoticon
 * Version: 1.1
 * Author: Hp93
 * License: Mozilla Public License, v. 2.0 @ https://www.mozilla.org/MPL/2.0/
 * Repository: https://github.com/Hp93/VLTK3D-Emoticon
 */

function EmoticonUtility() {
    "use strict";

    //#region===== Public ===========================================

    var debug = true;

    var utils = new Utility();

    //#endregion

    //#region===== Public ===========================================

    this.ContainEmoCode = function (input) {
        var regex = /#[a-z]+/i;

        if ((typeof input) === "string" && input.search(regex) >= 0) {
            return true;
        }

        return false;
    }

    this.InterpretEmoticon = function (input) {
        ///<summary>
        /// Interpret input to find emoticon code and replace with icon.
        ///</summary>
        ///<param name="input">Text input</param>
        ///<returns type="Array">Array of DOM Elements</returns>

        try {
            var regex = /#[a-z]+/i;
            var result = [];

            while (true) {

                if (!input.match(regex)) {
                    result.push(document.createTextNode(input));
                    break;
                }

                var emoCode = RemoveSharpSign(input.match(regex)[0]);
                var emoClass = this.GetEmoClass(emoCode);

                //var emoTextHtml = "<span class='emoticon_text'>emoCode emoticon</span>";
                //var emoHtml = "<span class='emoticon emoClass' title='emoCode'></span>";

                var emoTextHtml = utils.CreateDomElement(emoCode + " emoticon", "span", [["class", "emoticon_text"]]);
                var emoHtml = utils.CreateDomElement(null, "span", [["class", "emoticon " + emoClass], ["title", emoCode]]);

                var senjougahara = input.substr(0, input.search(regex));

                result.push(document.createTextNode(senjougahara));
                result.push(emoTextHtml);
                result.push(emoHtml);

                // Explain: emoCode real length = emoCode length + 1 (sharp sign)
                input = input.substr(senjougahara.length + emoCode.length + 1);
            }

            return result;

        } catch (ex) {
            utils.LogError(ex);
            return null;
        }
    }

    this.GetEmoClass = function(emoCode) {
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

    //#endregion

    //#region===== Private ==========================================

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
}
