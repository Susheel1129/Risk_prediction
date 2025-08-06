import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const allowedOrigins = [ 
    'https://risk-prediction-six.vercel.app',
    'http://localhost:5173', // Development frontend
  ];
  console.log(allowedOrigins);
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.indexOf(origin) !== -1) {
        // Origin is allowed
        callback(null, true);
      } else {
        // Origin is not allowed
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/predict", async (req, res) => {
  try {
    const inputs = req.body;

    // 🟩 PASTE YOUR PROMPT HERE
    const prompt = `
You are a medical AI assistant. Based on the following health parameters, assess the patient's risk of common diseases and give personalized recommendations and specific precautions to be taken:

Age: ${inputs.age}
Blood Pressure: ${inputs.systolicBP}/${inputs.diastolicBP} mmHg
Glucose Level: ${inputs.glucose} mg/dL
Cholesterol Level: ${inputs.cholesterol} mg/dL

Thyroid Function:
- TSH: ${inputs.tsh} µIU/mL
- T3: ${inputs.t3} ng/dL
- T4: ${inputs.t4} µg/dL

Liver Function:
- ALT: ${inputs.alt} U/L
- AST: ${inputs.ast} U/L
- Bilirubin: ${inputs.bilirubin} mg/dL

Please analyze this data for potential health conditions:
- Diabetes
- Hypertension
- Heart Disease
- Thyroid Disorders
- Liver Disease

Respond with the following structure:

📋 Prediction Summary of Risk
-----------------------------
Provide a concise summary of the patient's disease risk levels (e.g., High, Moderate, Low) with a brief explanation for each relevant condition.

✅ Recommendations & Precautions
-----------------
Give practical and personalized advice such as:
- Lifestyle changes (diet, exercise)
- Follow-up tests or specialist visits
- Medication reminders (if applicable)
- Monitoring frequency for key parameters like blood pressure, glucose, etc.
- **Specific precautions** the patient should take based on their input values (e.g., avoid salt if hypertensive, avoid alcohol if liver enzymes are high, etc.)

Make sure to mention blood pressure in detail: ${inputs.systolicBP}/${inputs.diastolicBP} mmHg and what this means for the patient's health.

Do not use any markdown formatting or special characters like *, **, etc.
Use plain text with clear headings as shown above.
`;

    // Use Gemini Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Send back the AI-generated text
    res.json({ prediction: text });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

app.listen(10000, () => console.log("Server running on port 10000"));