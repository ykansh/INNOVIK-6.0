"use client";

import { motion } from "framer-motion";
import { Camera, MapPin, X, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCivicIssue, uploadIssuePhoto } from "@/lib/supabase";

export default function ReportIssue() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState("22.7196, 75.8577 (Main Road)");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access is required to report an issue. Please grant permission in your browser.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    return () => stopCamera(); // Cleanup on unmount
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI Analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 1800);
  };

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    try {
      let finalImageUrl = imagePreview || "/sequence/frame_25.jpg";
      if (selectedFile) {
        finalImageUrl = await uploadIssuePhoto(selectedFile);
      }

      await createCivicIssue({
        title: "Fallen Electric Wire",
        category: "Electrical Services",
        location: location || "Downtown City Center",
        description: description,
        imageUrl: finalImageUrl,
        severity: "High",
        department: "Electrical Dept",
      });

      router.push("/dashboard/issues");
    } catch (e) {
      console.error("Failed to submit issue:", e);
      router.push("/dashboard/issues");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#66706A] hover:text-[#171918] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-[#E5EAE6] shadow-sm overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-[#E5EAE6]">
          <h1 className="text-2xl md:text-3xl font-bold text-[#171918]">Report a Civic Issue</h1>
          <p className="mt-2 text-[#66706A]">Help us understand what needs fixing in your community.</p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Photo Upload Section */}
          <section>
            <h2 className="text-sm font-bold text-[#171918] uppercase tracking-wider mb-4">
              1. Photographic Evidence
            </h2>

            {!imagePreview ? (
              isCameraOpen ? (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video md:aspect-[21/9]">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6">
                    <button onClick={stopCamera} className="px-5 py-2 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-black/60 transition-colors">
                      Cancel
                    </button>
                    <button onClick={capturePhoto} className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full p-1 flex items-center justify-center hover:bg-white/40 transition-colors shadow-xl">
                      <div className="w-14 h-14 bg-white rounded-full shadow-lg border-2 border-gray-200"></div>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={startCamera}
                  className="border-2 border-dashed border-[#E5EAE6] hover:border-[#16A34A] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors group bg-gray-50/50"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform mb-4">
                    <Camera className="w-6 h-6 text-[#16A34A]" />
                  </div>
                  <p className="text-[#171918] font-medium text-lg text-center">Open Web Camera</p>
                  <p className="text-[#66706A] text-sm mt-2 text-center">
                    Your location is captured automatically. Ensure the issue is clearly visible.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </div>
              )
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video md:aspect-[21/9]">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                {!isAnalyzing && !isAnalyzed && (
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-[#171918] hover:bg-white shadow-sm transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-8 h-8 animate-spin text-[#16A34A] mb-4" />
                    <p className="font-medium text-lg">AI is analyzing your report...</p>
                    <p className="text-white/70 text-sm mt-1">
                      Identifying severity and routing to the right department.
                    </p>
                  </div>
                )}

                {isAnalyzed && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#16A34A] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">
                          AI Analyzed
                        </span>
                        <span className="text-[#171918] font-bold">Fallen Electric Wire</span>
                      </div>
                      <p className="text-sm text-[#66706A]">
                        Routing to: <span className="font-medium text-[#171918]">Electrical Services</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#66706A] uppercase tracking-wider mb-1">Severity</p>
                      <p className="text-sm font-bold text-red-600">HIGH</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Form Fields Section */}
          <section className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#171918] uppercase tracking-wider mb-2">
                2. Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-[#66706A]" />
                </div>
                <input
                  type="text"
                  placeholder="Enter or fetch location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3.5 pl-10 pr-24 text-[#171918] shadow-sm ring-1 ring-inset ring-[#E5EAE6] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#16A34A] sm:text-sm sm:leading-6 bg-[#F7FAF8]"
                />
                <button
                  type="button"
                  onClick={() => setLocation("22.7196, 75.8577 (Main Road)")}
                  className="absolute inset-y-2 right-2 px-3 bg-white border border-[#E5EAE6] rounded-lg text-sm font-medium text-[#171918] hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Locate Me
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#171918] uppercase tracking-wider mb-2">
                3. Additional Description (Optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional details that might help the municipality..."
                className="block w-full rounded-xl border-0 py-3.5 px-4 text-[#171918] shadow-sm ring-1 ring-inset ring-[#E5EAE6] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#16A34A] sm:text-sm sm:leading-6 bg-[#F7FAF8] resize-none"
              />
            </div>
          </section>

          {/* Actions */}
          <div className="pt-6 border-t border-[#E5EAE6] flex justify-end gap-3">
            {!imagePreview ? (
              <button
                disabled
                className="px-6 py-3 rounded-xl bg-gray-200 text-gray-400 font-bold shadow-sm cursor-not-allowed"
              >
                Submit Report
              </button>
            ) : !isAnalyzed ? (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#171918] text-white font-bold hover:bg-black transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                {!isAnalyzing && <ArrowRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                onClick={handleSubmitReport}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#16A34A] text-white font-bold hover:bg-[#087A3D] transition-colors shadow-sm disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting to Supabase...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm & Submit
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
