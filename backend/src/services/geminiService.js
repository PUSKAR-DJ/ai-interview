import { GoogleGenerativeAI } from "@google/generative-ai";
// Native fetch is available in Node 18+


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Robustly extract JSON block from text
 */
const parseJSON = (text) => {
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("JSON Parse Error:", e, "Raw Text:", text);
        throw new Error("Invalid response format from AI");
    }
};

export const analyzeInterview = async (audioUrl, history) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Using stable 2.5 flash for better accuracy
            systemInstruction: "You are a professional, strict verbatim stenographer and HR analyst. Your primary goal is to transcribe audio exactly as spoken, without any embellishments or corrections."
        });

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
            Analyze this interview recording based on the provided history.
            
            HISTORY CONTEXT: ${JSON.stringify(history)}
            
            OBJECTIVES:
            1. FULL TRANSCRIPT: For every user message that says "Response Recorded", replace it with the REAL, VERBATIM transcription of the candidate's actual speech from the audio.
            2. ANALYSIS: Provide a score and professional feedback.

            STRICT TRANSCRIPTION RULES:
            - Provide a STENOGRAPHICAL transcription. 
            - DO NOT enhance vocabulary or grammar.
            - DO NOT assume what the candidate meant; transcribe exactly what they said.
            - Include filler words (um, uh, like) and repetitions.
            - If a candidate stops mid-sentence, transcribe it that way.
            - If a question was skipped or no answer is found in the audio for it, use "[No response captured]".
            - CRITICAL: Never invent or 'hallucinate' a professional answer. If the candidate gave a poor or short answer, the transcription must reflect that.

            JSON RESPONSE FORMAT:
            {
                "score": 85,
                "feedback": "...",
                "strengths": ["...", "..."],
                "improvements": ["...", "..."],
                "fullTranscript": [ ... updated history objects ... ]
            }
            
            Return ONLY the raw JSON.
        `;

        const result = await model.generateContent([prompt, audioPart]);
        const text = result.response.text();
        return parseJSON(text);

    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return {
            score: 0,
            feedback: "Analysis Failed: " + error.message,
            strengths: [],
            improvements: [],
            fullTranscript: history.map(m => m.text === "Response Recorded" ? { ...m, text: "[Transcription Failed]" } : m)
        };
    }
};

export const generateQuestions = async (departmentName, dbQuestions = []) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            You are an expert Interviewer for the ${departmentName} department.
            
            DEPARTMENT: ${departmentName}
            EXISTING QUESTIONS: ${JSON.stringify(dbQuestions)}

            TASK:
            Generate a list of 5 to 10 technical and behavioral interview questions.
            
            RULES:
            1. Ensure all items in the list are actual QUESTIONS.
            2. Mix existing questions with new ones if needed to reach at least 5-10.
            3. Do NOT include any intro text, thoughts, or formatting.
            4. If no department-specific questions can be made, ask about general professional experience and problem-solving.
            
            Return ONLY a JSON array of strings: ["Q1", "Q2", ...]
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const questions = parseJSON(text);

        // Final safety check: filter out any obviously non-question items (optional but good)
        return questions.filter(q => typeof q === 'string' && q.trim().length > 5);

    } catch (error) {
        console.error("Gemini Generation Error:", error);
        const fallback = dbQuestions.length >= 5
            ? dbQuestions.slice(0, 5)
            : ["Tell me about your background.", "What are your greatest professional strengths?", "Describe a difficult challenge you fixed.", "Where do you see yourself in 5 years?", "Why should we hire you?"];
        return fallback;
    }
};
