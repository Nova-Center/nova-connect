"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#FEF1ED] z-50">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="mb-8"
        >
          <Image
            src="/images/nova-connect-logo.png"
            alt="Nova Connect Logo"
            width={180}
            height={72}
            className="h-auto"
          />
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="h-1 bg-[#7ED957] rounded-full w-48 mx-auto"
        />
      </div>
    </div>
  );
}
