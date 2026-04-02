"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Phone,
  Mail,
  Twitter,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Play,
  BarChart3,
  Brain,
  Rocket,
  Sparkles,
} from "lucide-react"
import InteractiveBackground from "@/components/interactive-background"
import AIDemo from "@/components/ai-demo"
import EarlyAccessModal from "@/components/early-access-modal"
import { useState, useRef } from "react"
import './globals.css'
export default function MainPage() {
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  // Reference to the demo section
  const demoSectionRef = useRef<HTMLDivElement>(null)

  // Function to scroll to demo section
  const scrollToDemo = () => {
    demoSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-x-hidden">
      <InteractiveBackground />

      {/* Floating header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div className="flex items-center space-x-4" whileHover={{ scale: 1.05 }}>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 rounded-xl"
              onClick={() => window.open("https://x.com/DynavorAI?t=cQL22EF3Wp_1Nttbd1mzBw&s=09", "_blank")}
            >
              <Twitter className="w-4 h-4 mr-2" />
              @DynavorAI
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-purple-500/25"
              onClick={() => setIsEarlyAccessOpen(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get Early Access
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section className="min-h-screen flex items-center justify-center relative pt-24" style={{ y, opacity }}>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1
              className="text-7xl md:text-9xl font-bold mb-8"
              animate={{
                textShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.5)",
                  "0 0 40px rgba(236, 72, 153, 0.5)",
                  "0 0 20px rgba(168, 85, 247, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Dynavor
              </span>
            </motion.h1>

            <motion.p
              className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Revolutionary AI-Powered Cryptocurrency Trading Platform
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-12 py-4 text-xl font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                onClick={() => setIsEarlyAccessOpen(true)}
              >
                <Rocket className="w-6 h-6 mr-2" />
                Launch Trading Bot
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-12 py-4 text-xl font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm"
                onClick={scrollToDemo}
              >
                <Play className="w-6 h-6 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            {[
              { label: "Active Traders", value: "50K+", icon: Users },
              { label: "Success Rate", value: "94%", icon: TrendingUp },
              { label: "AI Models", value: "12", icon: Brain },
              { label: "Markets", value: "500+", icon: BarChart3 },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.1, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                  <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-400">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* AI Demo Section */}
      <motion.section
        ref={demoSectionRef}
        className="py-20 px-4 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <AIDemo />
      </motion.section>

      {/* Information Section */}
      <motion.section
        className="py-20 px-4 relative z-10"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="text-5xl font-bold text-center mb-16"
            whileInView={{ scale: [0.8, 1.1, 1] }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Why Choose Dynavor
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Advanced AI algorithms that process cryptocurrency data at unprecedented speeds, giving you the edge in fast-moving markets.",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description:
                  "Built with enterprise-grade security and reliability standards. Your data and investments are protected by cutting-edge encryption.",
              },
              {
                icon: TrendingUp,
                title: "Smart Analytics",
                description:
                  "Predictive analytics powered by machine learning to identify market trends and opportunities before they happen.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)",
                }}
              >
                <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm h-full rounded-3xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-400">
                      <feature.icon className="w-6 h-6 mr-2" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tokenomics Section */}
      <motion.section
        className="py-20 px-4 bg-slate-800/20 relative z-10"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="text-5xl font-bold text-center mb-16"
            whileInView={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tokenomics
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "1B", label: "Total Supply" },
              { value: "40%", label: "Public Sale" },
              { value: "30%", label: "Development" },
              { value: "30%", label: "Community" },
            ].map((token, index) => (
              <motion.div
                key={token.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 },
                }}
              >
                <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-purple-500/30 rounded-3xl shadow-xl">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-purple-400">{token.value}</CardTitle>
                    <p className="text-gray-300">{token.label}</p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm max-w-4xl mx-auto rounded-3xl shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Token Utility</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Dynavor tokens power our AI ecosystem, providing access to premium features, governance rights, and
                  exclusive market insights. Stake your tokens to earn rewards and participate in the future of
                  AI-driven cryptocurrency trading.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Customer Support Section */}
      <motion.section
        className="py-20 px-4 relative z-10"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="text-5xl font-bold text-center mb-16"
            whileInView={{ scale: [0.8, 1.1, 1] }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Customer Support
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Phone,
                title: "Phone Support",
                description: "Get instant help from our expert support team",
                contact: "+1 (555) 123-DYNA",
                availability: "Available 24/7 for premium members",
              },
              {
                icon: Mail,
                title: "Email Support",
                description: "Send us your questions and get detailed responses",
                contact: "support@dynavor.com",
                availability: "Response within 2 hours",
              },
            ].map((support, index) => (
              <motion.div
                key={support.title}
                initial={{ opacity: 0, x: index === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)",
                }}
              >
                <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm h-full rounded-3xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-400 text-2xl">
                      <support.icon className="w-8 h-8 mr-3" />
                      {support.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-lg mb-4">{support.description}</p>
                    <p className="text-purple-400 text-xl font-semibold">{support.contact}</p>
                    <p className="text-gray-400 mt-2">{support.availability}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 max-w-2xl mx-auto rounded-3xl shadow-xl">
              <CardContent className="p-8">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Community Support</h3>
                <p className="text-gray-300 text-lg">
                  Join our community for peer support, trading tips, and direct access to our development team.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      <EarlyAccessModal
        isOpen={isEarlyAccessOpen}
        onClose={() => setIsEarlyAccessOpen(false)}
        successMessage="You're now on the early access list. We'll notify you when Dynavor launches!"
      />
    </div>
  )
}
