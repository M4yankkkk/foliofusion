"use client";
import PortfolioForm from "@/components/PortfolioForm.jsx";

export default function Generate() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        {/* <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
          Create Your Portfolio
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Fill in your details to generate your personalized portfolio
        </p> */}
        <PortfolioForm />
      </div>
    </main>
  );
}
