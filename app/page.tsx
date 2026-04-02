'use client'

import Link from 'next/link'
import { Sparkles, Zap, Palette, Wand2, ArrowRight, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(340,80%,65%)]/20 bg-[hsl(340,80%,65%)]/5 px-5 py-2.5">
              <Heart size={14} className="text-[hsl(340,80%,65%)]" />
              <span className="font-sans text-sm font-medium text-[hsl(340,80%,65%)]">Private AI Studio</span>
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="mb-8 font-display text-6xl font-semibold leading-[1.1] tracking-tight text-white md:text-8xl"
          >
            Transform Your
            <br />
            <span className="gradient-sensual">Visual Desires</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-12 max-w-2xl font-sans text-lg leading-relaxed text-white/50 md:text-xl"
          >
            Create stunning, personalized visuals with our advanced AI tools.
            Private, secure, and designed for your creative exploration.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/studio">
              <button className="btn-sensual group flex items-center gap-3">
                <span className="relative z-10 flex items-center gap-2">
                  Enter Studio
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </button>
            </Link>
            <Link href="/pricing">
              <button className="btn-subtle">View Pricing</button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/30">Scroll to explore</span>
            <div className="h-16 w-px bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <span className="section-label mb-6 block">Capabilities</span>
            <h2 className="font-display text-4xl font-semibold text-white md:text-5xl">
              Everything You Need
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Wand2}
              title="Face Swap"
              description="Seamlessly blend faces with precision AI technology for stunning transformations."
              color="rose"
              delay={0}
            />
            <FeatureCard
              icon={Palette}
              title="Image Edit"
              description="Enhance and modify your images with advanced AI-powered editing tools."
              color="purple"
              delay={0.1}
            />
            <FeatureCard
              icon={Zap}
              title="Fast Generation"
              description="Get results in seconds with our optimized, high-performance AI inference."
              color="coral"
              delay={0.2}
            />
            <FeatureCard
              icon={Sparkles}
              title="Private & Secure"
              description="Your content stays private. We prioritize your security and confidentiality."
              color="champagne"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <span className="section-label mb-6 block">Process</span>
            <h2 className="font-display text-4xl font-semibold text-white md:text-5xl">
              Simple Three Steps
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Upload',
                description: 'Select and upload your source and target images to our secure platform.',
              },
              {
                step: '02',
                title: 'Configure',
                description: 'Adjust settings and parameters to fine-tune your desired output.',
              },
              {
                step: '03',
                title: 'Create',
                description: 'Generate your masterpiece and download in high resolution.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="glass-sensual relative overflow-hidden p-10 noise-sensual"
              >
                <div className="mb-8 font-display text-6xl font-semibold text-white/[0.03]">
                  {item.step}
                </div>
                <h3 className="mb-4 font-display text-2xl font-medium text-white">
                  {item.title}
                </h3>
                <p className="font-sans text-base leading-relaxed text-white/40">
                  {item.description}
                </p>
                {index < 2 && (
                  <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-gradient-to-r from-white/10 to-transparent md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl"
        >
          <div className="glass-sensual relative overflow-hidden p-16 text-center noise-sensual">
            {/* Decorative gradient */}
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[hsl(340,80%,65%)]/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[hsl(270,60%,55%)]/10 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="mb-6 font-display text-4xl font-semibold text-white md:text-5xl">
                Ready to Create?
              </h2>
              <p className="mb-10 mx-auto max-w-lg font-sans text-lg text-white/50">
                Join our private community of creators and start transforming your visions today.
              </p>
              <Link href="/studio">
                <button className="btn-sensual">
                  <span className="relative z-10">Start Creating Free</span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[hsl(340,80%,65%)]/30 bg-[hsl(340,80%,65%)]/10">
                <Sparkles size={18} className="text-[hsl(340,80%,65%)]" />
              </div>
              <span className="font-display text-lg font-semibold text-white">Claudine AI</span>
            </div>
            <p className="font-sans text-sm text-white/30">
              © 2026 Claudine AI. Private & Secure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ElementType
  title: string
  description: string
  color: 'rose' | 'purple' | 'coral' | 'champagne'
  delay: number
}) {
  const colorClasses = {
    rose: 'text-[hsl(340,80%,65%)] bg-[hsl(340,80%,65%)]/10 border-[hsl(340,80%,65%)]/20',
    purple: 'text-[hsl(270,60%,65%)] bg-[hsl(270,60%,65%)]/10 border-[hsl(270,60%,65%)]/20',
    coral: 'text-[hsl(15,85%,65%)] bg-[hsl(15,85%,65%)]/10 border-[hsl(15,85%,65%)]/20',
    champagne: 'text-[hsl(40,60%,75%)] bg-[hsl(40,60%,75%)]/10 border-[hsl(40,60%,75%)]/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="glass-sensual group relative overflow-hidden p-8 transition-all duration-500 hover:border-white/[0.12] noise-sensual"
    >
      <div
        className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${colorClasses[color]} transition-transform duration-500 group-hover:scale-110`}
      >
        <Icon size={26} />
      </div>
      <h3 className="mb-3 font-display text-xl font-medium text-white">{title}</h3>
      <p className="font-sans text-base leading-relaxed text-white/40">{description}</p>
    </motion.div>
  )
}


    //   {/* CTA */}
    //   <div className="container mx-auto px-4 py-16 text-center">
    //     <div className="bg-card border-2 border-border p-8 max-w-2xl mx-auto pixel-border">
    //       <h2 className="font-pixel text-xl text-foreground mb-4">
    //         READY TO CREATE?
    //       </h2>
    //       <p className="text-muted-foreground font-mono mb-6">
    //         Join thousands of creators using Claudine AI to bring their visions to life.
    //         Start creating amazing images today.
    //       </p>
    //       <Link href="/studio">
    //         <button className="arcade-btn font-pixel text-xs bg-secondary/20 border-secondary hover:glow-magenta">
    //           CREATE FREE ACCOUNT
    //         </button>
    //       </Link>
    //     </div>
    //   </div>

    //   {/* Footer */}
    //   <footer className="border-t border-border py-8">
    //     <div className="container mx-auto px-4 text-center">
    //       <p className="text-muted-foreground font-mono text-sm">
    //         Claudine AI - AI Image Generation & Editing
    //       </p>
    //     </div>
    //   </footer>
    // </div>
  // );


// function FeatureCard({
//   icon,
//   title,
//   description,
//   color,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   color: string;
// }) {
//   return (
//     <div className="bg-card border-2 border-border p-6 hover:border-primary transition-colors">
//       <div className={`${color} mb-4`}>{icon}</div>
//       <h3 className="font-pixel text-sm text-foreground mb-2">{title}</h3>
//       <p className="text-muted-foreground font-mono text-sm">{description}</p>
//     </div>
//   );
// }
