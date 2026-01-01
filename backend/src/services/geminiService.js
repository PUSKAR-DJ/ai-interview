import { GoogleGenerativeAI } from "@google/generative-ai";
// Native fetch is available in Node 18+


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeInterview = async (audioUrl, history) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
            5. "fullTranscript": An array of objects matching the input history format, but replacing any placeholder user text with the raw, unenhanced transcription of the spoken content from the audio part. Do not correct grammar, remove hesitations, or enhance the language in any way. Provide the verbatim words spoken by the candidate, including any repetitions, pauses, or informal speech. Ensure the assistant questions remain intact.
            
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

export const generateQuestions = async (departmentName, dbQuestions = []) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            You are an expert Interviewer for the ${departmentName} department.
            
            DEPARTMENT: ${departmentName}
            EXISTING QUESTIONS FROM DATABASE: ${JSON.stringify(dbQuestions)}

            TASK:
            Generate a total of 5 to 10 high-quality interview questions.
            
            RULES:
            1. If "EXISTING QUESTIONS FROM DATABASE" has fewer than 5 items, use them as guidance but primarily generate 5-10 fresh questions specific to the ${departmentName} role.
            2. If "EXISTING QUESTIONS FROM DATABASE" has 5 or more items, select at least 3-5 of the best ones and mix them with 2-5 new AI-generated questions to reach a total of 5-10.
            3. Ensure the final list is a cohesive interview flow.
            
            Return ONLY a JSON array of strings, e.g. ["Question 1", "Question 2"].
            Do not include any markdown or extra text.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '');
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        // Fallback
        const base = dbQuestions.length > 0 ? dbQuestions.slice(0, 5) : ["Tell me about yourself.", "Explain your experience in this field."];
        return base;
    }
};
