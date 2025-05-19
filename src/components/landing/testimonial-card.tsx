"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  location: string;
  delay: number;
}

export default function TestimonialCard({
  quote,
  name,
  location,
  delay,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Quote className="w-8 h-8 text-[#7ED957] mb-4 opacity-50" />
      <p className="text-gray-700 mb-4 italic">"{quote}"</p>
      <div className="border-t border-gray-100 pt-4">
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-gray-500 text-sm">{location}</p>
      </div>
    </motion.div>
  );
}
