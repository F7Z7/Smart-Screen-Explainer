//@ts-ignore
// import {GoogleGenAI} from "@google/genai";


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "analyzeScreenshot") {

        geminiCall(request.imgUrl, request.selectedTone)
            .then(answer => {
                ("here2")

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
    ("here3")

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
        "Explain like I'm 5": "Explain this image using the simplest language and analogies a 5-year-old would understand. Keep the explanation short, friendly, and focus on the main parts.",
        "Teacher": "Act as a university professor. Provide a structured, detailed, and objective explanation of the image. Identify core components, define key terms, and use a pedagogical tone. Format the explanation with a heading and bullet points.",
        "Sarcastic": "Explain this image using heavy, dry wit and extreme sarcasm. Act bored, overly critical, or completely unimpressed by the content. Do not hold back on the humor.",
        "Ai Friend": "Explain the image in a friendly, conversational, and supportive tone, similar to a modern AI assistant. Use bold formatting for important words and keep the explanation helpful and encouraging.",
        "College Student": "Act like a stressed college student summarizing a complex topic for a test. Explain the image quickly, focusing only on the most essential information and main takeaways. Use very informal and slightly hurried language."
    };

    const personality = tonePrompts[selectedTone];
    ("here4")



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
        ("heheheh")
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();
        (data)
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
    } catch (err) {
        console.error("Gemini API call failed:", err);
        return "Error: Gemini API call failed.";
    }
}