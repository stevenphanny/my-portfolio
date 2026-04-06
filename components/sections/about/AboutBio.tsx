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
          About
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
        <p className="font-poppins text-xs tracking-[0.3em] uppercase text-navy/55">
          About me
        </p>

        <blockquote className="font-instrument-serif text-3xl md:text-4xl text-navy leading-snug">
          &ldquo;Say <span className="font-extrabold" >Yes</span> {" "}  to opportunities that scare you. You never know where they'll lead to.&rdquo;
        </blockquote>

        <p className="font-lora text-base text-navy/75 leading-relaxed">
          I&apos;m a Software Engineering student with a deep interest in
          full-stack development and thoughtful UI design. 
          <br></br>
          <br></br>
          <span className="prev">I care about the
          experience - the details in motion, the weight of typography, and the
          feeling of using something well-made.</span>
        </p>

        <p className="font-lora text-base text-navy/75 leading-relaxed">
          When I&apos;m not coding, I love cooking, rating new restuarants, running, gyming, and hanging out with friends.
        </p>
      </motion.div>
    </div>
  );
}
