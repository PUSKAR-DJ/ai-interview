import { GoogleGenerativeAI } from "@google/generative-ai";
// Native fetch is available in Node 18+


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeInterview = async (audioUrl, history) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using Flash as requested

        // 1. Fetch the audio from Cloudinary
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Convert to Base64 for inline part
        const audioPart = {
            inlineData: {
                data: buffer.toString("base64"),
                mimeType: "audio/webm",
            },
        };

        const prompt = `
            You are an expert HR Interviewer. 
            Analyze this interview recording. 
            The context of the questions asked is: ${JSON.stringify(history)}.
            
            Please provide a JSON response with:
            1. "score": An integer from 0-100 based on confidence, clarity, and content.
            2. "feedback": A concise paragraph summary of the candidate's performance.
            3. "strengths": A list of strings.
            4. "improvements": A list of strings.
            5. "fullTranscript": An array of objects matching the input history format, but replacing any placeholder user text with the actual transcribed spoken content from the audio part. Ensure the assistant questions remain intact.
            
            Do NOT include markdown formatting in the response, just the raw JSON.
        `;

        const result = await model.generateContent([prompt, audioPart]);
        const text = result.response.text();

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '');
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return { score: 0, feedback: "Analysis Failed: " + error.message, strengths: [], improvements: [] };
    }
};

export const generateQuestions = async (departmentName, contextQuestions) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
            You are an expert Interviewer for the ${departmentName} department.
            Here is a list of standard interview questions for this role:
            ${JSON.stringify(contextQuestions)}

            Please generate a set of 3 to 5 challenging, relevant, and dynamic interview questions based on these topics.
            The questions should be professional and assess the candidate's skills effectively.
            
            Return ONLY a JSON array of strings, e.g. ["Question 1", "Question 2"].
            Do not include any markdown or extra text.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '');
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        return contextQuestions.length > 0 ? contextQuestions : ["Tell me about yourself.", "Why this role?"];
    }
};
