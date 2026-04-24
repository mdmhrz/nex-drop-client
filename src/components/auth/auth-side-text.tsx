"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AuthSideTextProps {
  title: string;
  description: string;
}

export function AuthSideText({ title, description }: AuthSideTextProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <Image
          src="/auth.svg"
          alt="Auth illustration"
          width={400}
          height={400}
          priority
          className="w-80 h-80 object-contain"
        />
      </motion.div>

      <div className="space-y-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="text-4xl font-bold leading-tight text-foreground"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="text-lg text-muted-foreground max-w-md"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
}
