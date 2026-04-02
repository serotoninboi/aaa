"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, TrendingUp, TrendingDown, Zap, Brain, Target } from "lucide-react"

interface TradingData {
  symbol: string
  price: number
  change: number
  prediction: "BUY" | "SELL" | "HOLD"
  confidence: number
}

export default function AIDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [tradingData, setTradingData] = useState<TradingData[]>([
    { symbol: "BTC", price: 98750, change: 1.8, prediction: "BUY", confidence: 94 },
    { symbol: "ETH", price: 1520, change: -0.7, prediction: "HOLD", confidence: 87 },
    { symbol: "ADA", price: 0.45, change: 3.2, prediction: "BUY", confidence: 91 },
    { symbol: "SOL", price: 142.75, change: 2.3, prediction: "SELL", confidence: 89 },
  ])

  const steps = [
    "Analyzing Market Data...",
    "Processing AI Algorithms...",
    "Calculating Risk Factors...",
    "Generating Predictions...",
    "Optimizing Portfolio...",
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (isRunning) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length)

        // Update trading data with random changes
        setTradingData((prev) =>
          prev.map((item) => ({
            ...item,
            price: item.price + (Math.random() - 0.5) * item.price * 0.02,
            change: (Math.random() - 0.5) * 10,
            confidence: 85 + Math.random() * 15,
            prediction: Math.random() > 0.7 ? (Math.random() > 0.5 ? "BUY" : "SELL") : item.prediction,
          })),
        )
      }, 2000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, steps.length])

  return (
    <div className="container mx-auto max-w-6xl">
      <motion.h2
        className="text-5xl font-bold text-center mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          AI Trading Demo
        </span>
      </motion.h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-400 text-2xl">
                <Brain className="w-8 h-8 mr-3" />
                AI Control Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                    isRunning
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-6 h-6 mr-2" />
                      Stop AI Trading
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 mr-2" />
                      Start AI Trading
                    </>
                  )}
                </Button>
              </motion.div>

              <AnimatePresence>
                {isRunning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Zap className="w-5 h-5 text-purple-400 mr-2" />
                        <span className="text-purple-400 font-semibold">Current Process:</span>
                      </div>
                      <motion.p
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-white text-lg"
                      >
                        {steps[currentStep]}
                      </motion.p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Accuracy", value: "94.2%", icon: Target },
                        { label: "Speed", value: "0.3ms", icon: Zap },
                        { label: "Profit", value: "+12.8%", icon: TrendingUp },
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-lg p-3 text-center"
                        >
                          <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                          <div className="text-purple-400 font-bold">{stat.value}</div>
                          <div className="text-gray-400 text-xs">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trading Data */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-400 text-2xl">
                <TrendingUp className="w-8 h-8 mr-3" />
                Live Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tradingData.map((item, index) => (
                  <motion.div
                    key={item.symbol}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-white font-bold text-lg">{item.symbol}</span>
                        <motion.div
                          animate={{
                            color: item.change > 0 ? "#10b981" : "#ef4444",
                          }}
                          className="ml-2"
                        >
                          {item.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </motion.div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">${item.price.toFixed(2)}</div>
                        <div className={`text-sm ${item.change > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {item.change > 0 ? "+" : ""}
                          {item.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <motion.span
                        animate={{
                          backgroundColor:
                            item.prediction === "BUY"
                              ? "rgba(16, 185, 129, 0.8)"
                              : item.prediction === "SELL"
                                ? "rgba(239, 68, 68, 0.8)"
                                : "rgba(107, 114, 128, 0.8)",
                        }}
                        className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                      >
                        {item.prediction}
                      </motion.span>
                      <div className="text-purple-400 text-sm">Confidence: {item.confidence.toFixed(0)}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
