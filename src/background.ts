chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if(request.action === "analyzeScreenshot") {

        geminiCall(request.imgUrl,request.selectedTone)
            .then(result => {
                sendResponse({result});
            })
            .catch(err => {
                console.error("Error analyzing image:", err);
                sendResponse({ answer: "Failed to analyze image." });
            });

        return true ;
    }

})

// @ts-ignore
async function geminiCall(imgUrl: string, selectedTone: string): Promise<string> {
    const result = await chrome.storage.local.get("geminiApiKey");
    const geminiApiKey: string | undefined = result.geminiApiKey;

    if(!geminiApiKey){
        alert("No gemini api key found. Try entering a gemini api key.");
    }

    const imageBase64=imgUrl.split(",")[1];

    //
    const tonePrompts:Record<string, string> = {
        "Explain like I'm 5": "Explain this image in simple, child-friendly language.",
        "Teacher": "Explain this image as a teacher would, clearly and informatively.",
        "Sarcastic": "Explain this image in a sarcastic or humorous tone.",
        "Ai Friend":"Explain like a chat bot",
        "College Student":"Explain like college student student"

    };

    const personality =tonePrompts[selectedTone];


}
