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
        const img = document.createElement("img");
        img.src = imgUrl;
        img.style.maxWidth = "100%";  // scale down if huge
        img.style.border = "1px solid #ccc";
        document.body.appendChild(img);
    }
    catch (error) {
        console.error("screenshot failed",error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btn") as HTMLButtonElement | null;
    if (button) {
        button.addEventListener("click", captureScreenshot);
    }
});
