function openExtensions(): void {
    alert("clicked");
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btn") as HTMLButtonElement | null;
    if (button) {
        button.addEventListener("click", openExtensions);
    }
});
