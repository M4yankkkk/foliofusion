"use client";

// app/page.js
import Landingpage from "@/components/sections/Landingpage.jsx";
import ProfileForm from "@/components/ProfileForm.jsx";


export default function Home() {
  const handleProfileSubmit = (data) => {
    console.log("Submitted profile data:", data);
    // TODO: Send this data to backend or API route
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Landing Section */}
      <Landingpage />
    </main>
  );
}
