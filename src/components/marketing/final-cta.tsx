'use client';

import Link from 'next/link';
import { ArrowRight, Check, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

export function FinalCTA() {
  return (
    <section className="section-spacing">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative overflow-hidden rounded-2xl bg-[#151515] text-white border border-[#272724] p-8 md:p-14 lg:p-16 shadow-2xl"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#C7FF3D]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#C7FF3D]/5 blur-3xl pointer-events-none" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-2xl">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#C7FF3D] mb-6">
              <span>Your career in tech begins today</span>
            </div>

            {/* Heading */}
            <h2 className="text-h2 font-bold tracking-tight text-white leading-[1.05]">
              Master engineering skills.{' '}
              <br className="hidden sm:inline" />
              Build real systems.{' '}
              <span className="text-[#C7FF3D]">Get hired</span>.
            </h2>

            {/* Description */}
            <p className="mt-5 text-base md:text-lg text-white/75 leading-relaxed max-w-lg">
              Follow structured roadmaps, solve 250+ interview DSA patterns, build resume-defining projects, and craft an ATS resume — 100% free.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/start"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-[#C7FF3D] text-[#111111] rounded-sm hover:bg-[#B8F030] transition-all shadow-md"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/placement/dsa"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border border-white/20 text-white rounded-sm hover:bg-white/10 transition-all"
                >
                  <Terminal className="w-4 h-4 text-[#C7FF3D]" />
                  Explore DSA Sheet
                </Link>
              </motion.div>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#C7FF3D]" />
                100% Free & Open Access
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#C7FF3D]" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#C7FF3D]" />
                Zero paywalled content
              </span>
            </div>
          </div>

          {/* Large Stylized Logo Watermark */}
          <div className="absolute -right-6 -bottom-10 text-[12rem] md:text-[16rem] font-black tracking-tighter text-white/[0.03] leading-none select-none pointer-events-none">
            SK
          </div>
        </motion.div>
      </div>
    </section>
  );
}
