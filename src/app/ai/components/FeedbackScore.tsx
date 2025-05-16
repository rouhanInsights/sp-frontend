"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FeedbackData {
  clarity: number;
  fluency: number;
  correctness: number;
  suggestion: string;
  overall_score: number;
}

const getColor = (score: number) => {
  if (score >= 80) return "bg-green-500/90";
  if (score >= 50) return "bg-yellow-400/90";
  return "bg-orange-400/90";
};

const getMessage = (score: number) => {
  if (score >= 80) return "🌟 Excellent! Keep it up.";
  if (score >= 50) return "👍 Great effort. Keep practicing.";
  return "💪 You're improving — keep going!";
};

const FeedbackScore: React.FC<{ feedback: FeedbackData }> = ({ feedback }) => {
  const { clarity, fluency, correctness, suggestion, overall_score } = feedback;
  const badgeColor = getColor(overall_score);
  const message = getMessage(overall_score);

  const chartData = [
    { category: "Clarity", score: clarity },
    { category: "Fluency", score: fluency },
    { category: "Correctness", score: correctness },
  ];

  return (
    <Card className="w-full border shadow-md">
      <CardHeader>
        <CardTitle className="text-center">🧠 AI Pronunciation Feedback</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* ✅ Chart and parameter scores */}
        <div className="w-full">
          <ResponsiveContainer width="100%" aspect={2}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 10]} tickCount={6} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#2563eb" name="Score" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex justify-around mt-6">
            <div className="text-center">
              <p className="font-semibold text-sm">Clarity</p>
              <div className="text-xl font-bold text-blue-600">{clarity}/10</div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">Fluency</p>
              <div className="text-xl font-bold text-green-600">{fluency}/10</div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">Correctness</p>
              <div className="text-xl font-bold text-purple-600">{correctness}/10</div>
            </div>
          </div>
        </div>

        {/* ✅ Overall score + message */}
        <div className="flex flex-col items-center gap-6">
          <div
            className={`text-white text-4xl font-bold rounded-full w-40 h-40 flex items-center justify-center shadow-md ${badgeColor}`}
          >
            {overall_score}/10
          </div>
          <div className="text-center text-muted-foreground text-lg font-medium">
            {message}
          </div>
        </div>

        {/* ✅ Suggestion full width */}
        <div className="md:col-span-2 w-full text-center mt-6">
          <p className="text-lg md:text-xl font-semibold text-gray-700">
            "{suggestion}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackScore;
