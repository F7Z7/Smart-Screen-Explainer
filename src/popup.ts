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
        alert("API key saved successfully!");

        // Optionally clear the UI
        input?.remove();
        button?.remove();

        alert("api key saved successfully!");

    } catch (err) {
        console.error("Failed to save API key:", err);
    }
});

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

        const imgUrl = canvas.toDataURL("image/png");
        let imageContaier = document.getElementById("ImageContainer") as HTMLDivElement;
        const img = document.createElement("img");
        img.src = imgUrl;
        img.style.maxWidth = "100%";
        img.style.border = "1px solid #ccc";
        imageContaier.appendChild(img);
        if(img){
            imageContaier.classList.add("displayImage");
        }

        const personalitySelect = document.getElementById("personalitySelect") as HTMLSelectElement;
        const selectedTone = personalitySelect?.value || "default";

        chrome.runtime.sendMessage({
                action: "analyzeScreenshot",
                imgUrl,
                selectedTone
            },
            (response) => {
                const output = document.getElementById("explanation-container");
                output!.textContent = response?.answer || "No response from Gemini.";
            }
        )

        ;
    } catch (error) {
        console.error("screenshot failed", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btn") as HTMLButtonElement | null;
    if (button) {
        button.addEventListener("click", captureScreenshot);
    }
});
