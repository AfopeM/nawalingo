"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/atoms";
import { motion, AnimatePresence } from "framer-motion";
import { TutorApplicationForm } from "@/features/tutor"; // Assuming this component exists
import ThemeToggle from "@/components/organisms/ThemeToggle"; // Assuming this component exists

export default function ApplyToTeachPage() {
  const [showForm, setShowForm] = useState(false);

  const handleStartApplication = () => {
    setShowForm(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-6">
      {/* NAVIGATION */}
      <nav className="container flex h-12 w-full items-center justify-between">
        <Link href="/user/student/dashboard">
          <Button variant="outline" className="capitalize">
            back
          </Button>
        </Link>
        <ThemeToggle />
      </nav>

      {/* ANIMATED CONTENT */}
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
            className="flex flex-grow flex-col items-center justify-center gap-2"
          >
            {/* INTRO */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center text-4xl font-bold capitalize"
            >
              Apply to Teach
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="max-w-xl px-8 text-center text-muted-foreground"
            >
              Ready to share your knowledge with students around the world?
              Submit your tutor application and we&apos;ll be in touch once
              it&apos;s reviewed.
            </motion.p>

            {/* START APPLICATION BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                className="mt-6 py-6 capitalize"
                onClick={handleStartApplication}
              >
                start application
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="flex w-full flex-grow items-center justify-center p-6">
            {/* // Tutor application form */}
            <TutorApplicationForm
              key="form"
              // Ensure the form also takes up the remaining space and centers its content
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
