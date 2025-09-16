"use strict";
function openExtensions() {
    alert("clicked");
}
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btn");
    if (button) {
        button.addEventListener("click", openExtensions);
    }
});
//# sourceMappingURL=popup.js.map