function openExtensions(): void {
    alert("clicked");

    console.log("clicked here ")
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btn") as HTMLButtonElement | null;
    if (button) {
        button.addEventListener("click", openExtensions);
    }
});
