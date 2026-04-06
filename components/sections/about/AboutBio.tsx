"use client";

import { motion } from "framer-motion";

const headingVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 10 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
  },
};

export function AboutBio() {
  return (
    <div className="flex flex-col gap-0">
      {/* Heading */}
      <div className="overflow-hidden mb-16">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="font-instrument-serif text-5xl md:text-7xl text-navy"
        >
          About Me
        </motion.h2>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        style={{ originX: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0, 0, 1] }}
        className="h-px w-full bg-navy/10 mb-14"
      />

      {/* Bio content */}
      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="flex flex-col gap-6"
      >

        <blockquote className="font-instrument-serif text-3xl md:text-4xl text-navy leading-snug">
          &ldquo;Say <span className="font-extrabold">Yes</span> to opportunities that{" "}
          <span className="italic">scare you</span>. It could change your life.&rdquo;
        </blockquote>

        <p className="font-lora text-base text-navy/75 leading-relaxed">
          I&apos;m a Software Engineering student with a deep interest in{" "}
          <span className="font-semibold text-navy">full-stack development</span> and{" "}
          <span className="font-semibold text-navy">thoughtful UI design</span>.
          <br /><br />
          I care about the{" "}
          <span className="font-semibold text-navy">experience</span> — the{" "}
          <span className="font-semibold text-navy italic">details</span> in motion, the weight of{" "}
          <span className="font-semibold text-navy italic">typography</span>, and the feeling of using something{" "}
          <span className="font-semibold text-navy">well-made</span>.
        </p>

        <p className="font-lora text-base text-navy/75 leading-relaxed">
          When I&apos;m not coding, I love cooking, rating restaurants and bakeries,
          running, and hanging out with friends.
        </p>
      </motion.div>
    </div>
  );
}
