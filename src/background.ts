//@ts-ignore
// import {GoogleGenAI} from "@google/genai";

console.log("here1")
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "analyzeScreenshot") {

        geminiCall(request.imgUrl, request.selectedTone)
            .then(answer => {
                console.log("here2")

                sendResponse({answer});
            })
            .catch(err => {
                console.error("Error analyzing image:", err);
                sendResponse({answer: "Failed to analyze image."});
            });

        return true;
    }

})

// @ts-ignore
async function geminiCall(imgUrl: string, selectedTone: string): Promise<string> {
    const result = await chrome.storage.local.get("geminiApiKey");
    console.log("here3")

    const geminiApiKey: string | undefined = result.geminiApiKey;

    if (!geminiApiKey) {
        alert("No gemini api key found. Try entering a gemini api key.");
    }


    // const ai = new GoogleGenAI({apiKey: geminiApiKey});
    // const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const [mimeTypePart, base64Part] = imgUrl.split(",");
    const Image64 = base64Part
    const mimeType = mimeTypePart.split(":")[1].split(";")[0];

    //
    const tonePrompts: Record<string, string> = {
        "Explain like I'm 5": "Explain this image in simple, child-friendly language.",
        "Teacher": "Explain this image as a teacher would, clearly and informatively.",
        "Sarcastic": "Explain this image in a sarcastic or humorous tone.",
        "Ai Friend": "Explain like a chat bot",
        "College Student": "Explain like college student student"

    };

    const personality = tonePrompts[selectedTone];
    console.log("here4")



        const payload = {
            contents: [
                {
                    parts: [
                        { text: `${personality}\nNow analyze this image:` },
                        { inlineData: { mimeType, data: Image64 } }
                    ]
                }
            ]
        };

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
    } catch (err) {
        console.error("Gemini API call failed:", err);
        return "Error: Gemini API call failed.";
    }
}