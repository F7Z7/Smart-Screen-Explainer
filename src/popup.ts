document.getElementById("saveKey")?.addEventListener("click", async () => {
    const input = document.getElementById("apiKeyInput") as HTMLInputElement | null;
    const button = document.getElementById("saveKey");
    const key = (input?.value || "").trim();


    if (!key) {
        alert("Please enter a valid API key.");
        return;
    }
    try {
        await chrome.storage.local.set({geminiApiKey: key});
        // alert("API key saved successfully!");

        // Optionally clear the UI
        input?.remove();
        button?.remove();

        // alert("api key saved successfully!");

    } catch (err) {
        console.error("Failed to save API key:", err);
    }
});
let imgUrl = "";

async function captureScreenshot(): Promise<void> {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        const video = document.createElement("video");
        video.srcObject = stream;

        await video.play();

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        stream.getTracks().forEach((track) => track.stop());

        imgUrl = canvas.toDataURL("image/png");
        let imageContaier = document.getElementById("ImageContainer") as HTMLDivElement;
        const img = document.createElement("img");
        img.src = imgUrl;
        img.style.maxWidth = "100%";
        img.style.border = "1px solid #ccc";
        imageContaier.appendChild(img);
        if (img) {
            imageContaier.classList.add("displayImage");
        }

    } catch (error) {
        console.error("screenshot failed", error);
    }
}
document.addEventListener("DOMContentLoaded", ()=>{

    document.querySelectorAll<HTMLButtonElement>(".explain-btn").forEach(button => {
        button.addEventListener("click", () => getExplanation(button));
    });
})
function deleteScreenshot(){
    const imageContaier = document.getElementById("ImageContainer") as HTMLDivElement;

   if(!imgUrl || !imageContaier.classList.contains("displayImage")){
       alert("No screenshot found!");
   }
   const img=imageContaier.querySelectorAll("img");
   img.forEach(img => {
       img.remove();
   })
    imgUrl = "";
   imageContaier.classList.remove("displayImage");

    console.log("Screenshot deleted successfully.");

}
function getExplanation(button: HTMLButtonElement) {
    if (!imgUrl) {
        alert("Please take a screenshot first!");
        return;
    }

    const selectedTone = button.innerText.trim();
    console.log(selectedTone);
    chrome.runtime.sendMessage(
        {
            action: "analyzeScreenshot",
            imgUrl,
            selectedTone:selectedTone
        },
        (response) => {
            console.log("ivde vanno")
            const output = document.getElementById("explanation-container") as HTMLDivElement || null;
            output.textContent = response?.answer || "No response from Gemini.";
        }
    );
}


document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btn") as HTMLButtonElement | null;
    if (button) {
        button.addEventListener("click", captureScreenshot);
    }
    const deleteButton = document.getElementById("delete-btn") as HTMLButtonElement | null;
    if (deleteButton) {
        deleteButton.addEventListener("click", deleteScreenshot);
    }
});
