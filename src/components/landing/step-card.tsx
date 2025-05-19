"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
  delay: number;
}

export default function StepCard({
  number,
  title,
  description,
  icon,
  delay,
}: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-xl shadow-lg text-center"
    >
      <div className="w-16 h-16 bg-[#FEF1ED] rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <div className="bg-[#7ED957] text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mb-3">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
