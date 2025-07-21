import React, { useState } from 'react';

function RiskPrediction() {
  const [inputs, setInputs] = useState({
    age: '',
    systolicBP: '',
    diastolicBP: '',
    glucose: '',
    cholesterol: '',
    tsh: '',
    t3: '',
    t4: '',
    alt: '',
    ast: '',
    bilirubin: ''
  });

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePredict = async () => {
    setLoading(true);
    setPredictions([]);
    setError('');
    try {
      const res = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!res.ok) throw new Error("Server responded with an error.");

      const data = await res.json();
      const predList = data.prediction.split("\n").filter(Boolean);
      setPredictions(predList);
    } catch {
      setError("Failed to get prediction. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract sections from the AI response
  function extractSections(textArr) {
    const text = textArr.join('\n');
    // Use regex to extract sections
    const predictionMatch = text.match(/Prediction Summary of Risk[\s\S]*?(-{5,}|\n)([\s\S]*?)(?=(✅ Recommendations|$))/i);
    const recommendationsMatch = text.match(/Recommendations[\s\S]*?(-{5,}|\n)([\s\S]*)/i);
    const predictions = predictionMatch && predictionMatch[2]
      ? predictionMatch[2].split(/\n|\r/).map(l => l.trim()).filter(l => l && !/^[-_]+$/.test(l))
      : [];
    const recommendations = recommendationsMatch && recommendationsMatch[2]
      ? recommendationsMatch[2].split(/\n|\r/).map(l => l.trim()).filter(l => l && !/^[-_]+$/.test(l))
      : [];
    return { predictions, recommendations };
  }

  // Split predictions and recommendations
  const { predictions: predictionPoints, recommendations: recommendationPoints } = extractSections(predictions);

  const inputFields = [
    {
      section: "General Health Parameters",
      fields: [
        { key: 'age', label: 'Age', unit: 'years' },
        { key: 'systolicBP', label: 'Systolic Blood Pressure', unit: 'mmHg' },
        { key: 'diastolicBP', label: 'Diastolic Blood Pressure', unit: 'mmHg' },
        { key: 'glucose', label: 'Blood Glucose', unit: 'mg/dL' },
        { key: 'cholesterol', label: 'Total Cholesterol', unit: 'mg/dL' }
      ]
    },
    {
      section: "Thyroid Function Tests",
      fields: [
        { key: 'tsh', label: 'TSH (Thyroid Stimulating Hormone)', unit: 'μIU/mL' },
        { key: 't3', label: 'T3 (Triiodothyronine)', unit: 'ng/dL' },
        { key: 't4', label: 'T4 (Thyroxine)', unit: 'μg/dL' }
      ]
    },
    {
      section: "Liver Function Tests",
      fields: [
        { key: 'alt', label: 'ALT (Alanine Aminotransferase)', unit: 'U/L' },
        { key: 'ast', label: 'AST (Aspartate Aminotransferase)', unit: 'U/L' },
        { key: 'bilirubin', label: 'Total Bilirubin', unit: 'mg/dL' }
      ]
    }
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{
      background: `radial-gradient(ellipse at 60% 20%, rgba(80,130,255,0.18) 0%, transparent 60%), linear-gradient(120deg, #0a1833 0%, #1a2747 100%)`,
      minHeight: '100vh',
    }}>
      <div className="w-full max-w-6xl bg-slate-50/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        
        {/* Premium Header */}
        <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Health Risk Predictor
                </h1>
                <p className="text-slate-300 text-lg font-medium">Advanced AI-Powered Health Analytics</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-8 mt-6 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Real-time Analysis
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                HIPAA Compliant
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                Medical Grade AI
              </span>
            </div>
          </div>
        </div>

        {/* Professional Disclaimer */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 mx-8 my-6 rounded-2xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-amber-800 mb-2">Medical Disclaimer</h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                This AI-powered tool provides health insights for informational purposes only. Results are not medical diagnoses and should not replace professional medical consultation. Always consult with qualified healthcare professionals for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>

        {/* Premium Form */}
        <div className="p-10 space-y-10">
          {inputFields.map((section, sectionIndex) => (
            <section key={sectionIndex} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold text-slate-800">{section.section}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.fields.map((field) => (
                  <div key={field.key} className="group">
                    <div className="relative">
                      <input
                        name={field.key}
                        type="number"
                        value={inputs[field.key]}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:bg-slate-50 group-hover:border-slate-300 group-hover:shadow-md"
                        placeholder={`Enter ${field.label}`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-1 rounded-lg">
                        {field.unit}
                      </div>
                    </div>
                    <label className="block mt-3 text-sm font-semibold text-slate-700">
                      {field.label}
                    </label>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Premium Predict Button */}
          <div className="pt-8">
            <button
              onClick={handlePredict}
              disabled={loading}
              className={`w-full py-5 rounded-2xl text-white font-bold text-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-xl ${
                loading 
                  ? 'bg-slate-400 cursor-not-allowed shadow-slate-200' 
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-800 shadow-blue-200 hover:shadow-2xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-4">
                  <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing Health Parameters...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Analyze Health Risks</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
              )}
            </button>
          </div>

          {/* Professional Error Message */}
          {error && (
            <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-lg">{error}</span>
              </div>
            </div>
          )}

          {/* Premium Results Display - Refactored for clarity */}
          {predictions.length > 0 && (
            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold text-slate-800">Analysis Results</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
              </div>
              <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl shadow-xl border border-slate-100">
                {/* Predictions Section */}
                {predictionPoints.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">Predicted Risks</h4>
                    <ul className="list-disc pl-6 space-y-1 text-blue-900 text-base">
                      {predictionPoints.map((prediction, idx) => (
                        <li key={idx}>{prediction.replace(/^[-•\d.\s]+/, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Divider if both sections exist */}
                {predictionPoints.length > 0 && recommendationPoints.length > 0 && (
                  <div className="my-4 border-t border-slate-200"></div>
                )}
                {/* Recommendations Section */}
                {recommendationPoints.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Recommendations</h4>
                    <ul className="list-disc pl-6 space-y-1 text-green-900 text-base">
                      {recommendationPoints.map((rec, idx) => (
                        <li key={idx}>{rec.replace(/^[-•\d.\s]+/i, '').replace(/^(recommendation|recommendations|advice|advices)\s*:*/i, '').trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* If neither, fallback */}
                {predictionPoints.length === 0 && recommendationPoints.length === 0 && (
                  <div className="text-slate-700">No results to display.</div>
                )}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Important Medical Notice</h4>
                      <p className="text-sm leading-relaxed">
                        These AI-generated health insights are for informational purposes only and should not replace professional medical advice. 
                        Always consult with a licensed healthcare provider for proper diagnosis, treatment, and medical recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiskPrediction;