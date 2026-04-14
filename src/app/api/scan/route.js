import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized. Token missing." },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);

        if (!decoded?.id) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const imageFile = formData.get("image");

        if (!imageFile || typeof imageFile !== "object") {
            return NextResponse.json(
                { success: false, message: "Image is required" },
                { status: 400 }
            );
        }

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const mimeType = imageFile.type || "image/jpeg";
        const base64Image = buffer.toString("base64");

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
You are an expert retail product scanner for a beer shop / grocery inventory system.

Analyze this product package image carefully and extract ONLY the following details.

Return ONLY valid JSON. No markdown. No explanation.

JSON format:
{
  "productName": "string",
  "category": "string",
  "price": number,
  "confidence": number,
  "notes": "string"
}

Rules:
1. productName = main visible product name/brand from packaging.
2. category = choose best simple category like:
   "Beer", "Whisky", "Rum", "Vodka", "Wine", "Snacks", "Soft Drinks", "Water", "Other"
3. price = detect visible MRP or price if clearly visible, else 0
4. confidence = 0 to 100
5. notes = short note if price unclear or image blurry
6. If image is unclear, still try your best.
7. Output ONLY JSON.
`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType,
                },
            },
        ]);

        const text = result.response.text().trim();

        let parsed;

        try {
            parsed = JSON.parse(text);
        } catch (parseError) {
            // fallback if Gemini returns code block
            const cleaned = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            try {
                parsed = JSON.parse(cleaned);
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        message: "AI returned invalid response",
                        raw: text,
                    },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    productName: parsed.productName || "",
                    category: parsed.category || "Other",
                    price: Number(parsed.price) || 0,
                    confidence: Number(parsed.confidence) || 0,
                    notes: parsed.notes || "",
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("SCAN API ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to scan product image",
            },
            { status: 500 }
        );
    }
}