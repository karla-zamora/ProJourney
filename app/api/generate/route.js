import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        //retrieve API key from environmnet variable
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
        //set gemini model to use
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You revise python code for leetcode style questions,
            and your job is to give feedback on the time and space complexity, 
            as well as how well they did and other useful feedback.
            You will get your prompt in the format "Problem description: " + description + "Code submitted: " + code.
            You will stick to two or three sentences and some keypoints in bulletpoints.`
        })
        //receive "prompt" from request
        const data = await req.json()
        //set actual prompt from request
        const prompt = data.body
        //generate ai response from the model
        const result = await model.generateContent(prompt)
        const response = await result.response;
        const output = await response.text()
        //return response
        return NextResponse.json({output:output})
    } catch (error) {
        console.log("GenAI request error: %s", error)
    }
}