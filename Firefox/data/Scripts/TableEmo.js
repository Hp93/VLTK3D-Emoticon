/*
 * VLTK3D Emoticon
 * Version: 1.1
 * Author: Hp93
 * License: Mozilla Public License, v. 2.0 @ https://www.mozilla.org/MPL/2.0/
 * Repository: https://github.com/Hp93/VLTK3D-Emoticon
 */

function TableEmo() {
    "use strict";

    //#region===== Property =========================================

    var className = {
        container: "panelFlyout",
        navBar: "_5r8e",
        navBarPage: "_5r81",
        emoContainer: "_5r8l"
    };

    var listEmo = [
        "ac", "biumoi", "botay", "buon", "buonngu", "choang", "chopchop", "cuong",
        "dacy", "dao"
    ];

    var navBarItemId = "vltk3d-table-emoticon";
    var tableEmo;

    var utils = new Utility();

    var debug = true;

    //#endregion

    //#region===== Public ===========================================

    this.Init = function () {

        try {
            var delayTime = 500;    // milisecond
            var s_btn = "emoteTogglerImg img sp_3MiFfkiCKiB sx_64fc15";

            CreateTableEmo();

            document.querySelector("body").addEventListener("click", function (e) {

                if (e.target.className === s_btn) {
                    window.setTimeout(function () {
                        CreateNavBarElement();
                    }, delayTime);
                }
            });
        } catch (ex) {
            utils.LogError(ex);
        }
    };

    //#endregion

    //#region===== Private ==========================================

    function CreateEmoElement(emoCode) {
        ///<summary>
        /// Create one emo node equal to one td tag
        ///</summary>

        try {
            if (!emoCode) {
                return null;
            }

            var emoLbl = emoCode;

            var emoUtils = new EmoticonUtility();
            var emoCss = emoUtils.GetEmoClass(emoCode);

            var td = utils.CreateDomElement(null, "td", [["class", "pam _51m- vMid hCent"]]);
            var div = utils.CreateDomElement(null, "div", [["class", "panelCell"]]);
            var a = utils.CreateDomElement(null, "a", [
                    ["class", "emoticon " + emoCss],
                    ["aria-label", emoLbl]
            ]);

            //TODO add event for each element

            div.appendChild(a);
            td.appendChild(div);

            return td;

        } catch (ex) {
            utils.LogError(ex);
            return null;
        }
    }

    function CreateTableEmo() {
        ///<summary>
        /// Create Table Emo with 8 emos in each row
        ///</summary>

        try {
            if (tableEmo) {
                utils.LogError("warning: table emo existed");
                return;
            }

            var table = utils.CreateDomElement(null, "table", [["class", "uiGrid _51mz"]]);

            var emoNumberInRow = 0;
            var tr = utils.CreateDomElement(null, "tr", [["class", "_51mx"]]);

            var i = 0;

            while (i <= listEmo.length) {

                if (8 <= emoNumberInRow) {
                    table.appendChild(tr);
                    tr = utils.CreateDomElement(null, "tr", [["class", "_51mx"]]);
                    emoNumberInRow = 0;
                }

                var emo = CreateEmoElement(emoCode);
                tr.appendChild(emo);
                emoNumberInRow++;

                if ((listEmo.length - 1) <= i) {
                    table.appendChild(tr);
                    break;
                }
                i++;
            }

            //listEmo.forEach(function (emoCode) {

            //    if (8 <= emoNumberInRow) {
            //        table.appendChild(tr);
            //        tr = utils.CreateDomElement(null, "tr", [["class", "_51mx"]]);
            //        emoNumberInRow = 0;
            //    }

            //    var emo = CreateEmoElement(emoCode);
            //    tr.appendChild(emo);
            //    emoNumberInRow++;
            //});

            var tableContainer = utils.CreateDomElement(null, "div", [
                ["class", "emoticonsTable"]
            ]);
            tableContainer.appendChild(table);

            tableEmo = tableContainer;

        } catch (ex) {
            utils.LogError(ex);
            return;
        }
    }

    function CreateNavBarElement() {

        try {
            if (document.querySelector("#" + navBarItemId)) {
                utils.LogError("warning: nav bar existed");
                return;
            }

            var lastPage = FindLastPage();

            if (!lastPage) {
                return;
            }

            var a = utils.CreateDomElement(null, "a", [
                ["aria-label", "VLTK3D Emoticon"],
                ["class", "_5r8a"],
                ["data-hover", "tooltip"],
                ["id", navBarItemId]
            ]);

            a.addEventListener("click", function () {

                this.setAttribute("style", "background-color: #E9EAED; transition: 2s;");

                window.setTimeout(function () {
                    this.style.backgroundColor = "none";
                }, 2000);

                var emoContainer = document.querySelector("." + className.emoContainer);
                utils.RemoveChildren(emoContainer);

                if (!tableEmo) {
                    CreateTableEmo();
                }

                emoContainer.appendChild(tableEmo);

            });

            var i = utils.CreateDomElement(null, "i", [["class", "emoticon emoticon_tay"]]);
            a.appendChild(i);

            lastPage.appendChild(a);

        } catch (ex) {
            utils.LogError(ex);
        }
    }

    function FindLastPage() {
        ///<summary>
        /// Find the last List item
        ///</summary>

        try {
            var container = document.querySelector("." + className.container);

            if (!container) {
                utils.LogError("Container is not available");
                return null;
            }

            var navBar = container.querySelector("." + className.navBar);

            if (!navBar) {
                utils.LogError("NavBar is not available");
                return null;
            }

            var navBarPages = navBar.getElementsByClassName(className.navBarPage);

            if (!navBarPages || navBarPages.length <= 0) {
                utils.LogError("NavBarPage is not available");
                return null;
            }

            return navBarPages[navBarPages.length - 1];

        } catch (ex) {
            utils.LogError(ex);
            return null;
        }
    }

    //#endregion
}
