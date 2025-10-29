//@ts-ignore
import {GoogleGenAI} from "@google/genai";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "analyzeScreenshot") {

        geminiCall(request.imgUrl, request.selectedTone)
            .then(result => {
                sendResponse({result});
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
    const geminiApiKey: string | undefined = result.geminiApiKey;

    if (!geminiApiKey) {
        alert("No gemini api key found. Try entering a gemini api key.");
    }


    const ai = GoogleGenAI({apiKey: geminiApiKey});

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

    try {
        const response = ai.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {text: "Analyze the image and respond to the following instruction."},
                        {inlineData: {data: Image64, mimeType: mimeType}},
                    ],
                }
            ],
            config: {
                systemInstruction: personality,
                temperature: 0.8,
                candidateCount: 1,

            }
        })
        return response.text.trim()
    } catch (err) {
        console.error("Gemini API call failed:", err);
        return "Error: Failed to analyze image. Check console for details.";
    }
}