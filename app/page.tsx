'use client'
import Link from 'next/link'
import { Sparkles, Zap, Palette, Wand2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen scanlines">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-lg bg-primary/20 border-2 border-primary glow-cyan mb-8">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>

          <h1 className="font-pixel text-3xl md:text-4xl text-primary neon-cyan mb-4">
            CLAUDINE AI
          </h1>

          <p className="text-xl text-foreground font-mono mb-2">
            Transform images with AI-powered creativity
          </p>

          <p className="text-muted-foreground font-mono mb-8 max-w-xl mx-auto">
            Generate stunning images from text prompts. Edit existing images with advanced AI tools. 
            Create professional visuals without the complexity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/studio">
              <button className="arcade-btn font-pixel text-xs min-w-[200px]">
                START CREATING
              </button>
            </Link>
            <Link href="/pricing">
              <button
                className="font-pixel text-xs min-w-[200px] border-2 bg-transparent border-primary text-primary hover:glow-cyan transition-all duration-150 px-6 py-3 uppercase tracking-wider"
              >
                VIEW PRICING
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Wand2 className="w-8 h-8" />}
            title="TEXT TO IMAGE"
            description="Generate unique images from text descriptions using advanced AI models."
            color="text-primary"
          />
          <FeatureCard
            icon={<Palette className="w-8 h-8" />}
            title="IMAGE EDITING"
            description="Edit and enhance existing images with AI-powered tools and filters."
            color="text-secondary"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="FAST GENERATION"
            description="Get results in seconds. Lightning-fast processing for your creative workflow."
            color="text-accent"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="PREMIUM QUALITY"
            description="High-resolution outputs perfect for professional use and printing."
            color="text-gold"
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-pixel text-2xl text-primary neon-cyan mb-12">HOW IT WORKS</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-card border-2 border-border p-6">
            <div className="text-4xl font-pixel text-gold mb-4">1</div>
            <h3 className="font-pixel text-sm text-foreground mb-2">DESCRIBE</h3>
            <p className="text-muted-foreground font-mono text-sm">
              Write a detailed description of the image you want to create
            </p>
          </div>
          
          <div className="bg-card border-2 border-border p-6">
            <div className="text-4xl font-pixel text-secondary mb-4">2</div>
            <h3 className="font-pixel text-sm text-foreground mb-2">GENERATE</h3>
            <p className="text-muted-foreground font-mono text-sm">
              Our AI creates your image in seconds with stunning quality
            </p>
          </div>
          
          <div className="bg-card border-2 border-border p-6">
            <div className="text-4xl font-pixel text-accent mb-4">3</div>
            <h3 className="font-pixel text-sm text-foreground mb-2">DOWNLOAD</h3>
            <p className="text-muted-foreground font-mono text-sm">
              Save your creation and share it with the world
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-card border-2 border-border p-8 max-w-2xl mx-auto pixel-border">
          <h2 className="font-pixel text-xl text-foreground mb-4">
            READY TO CREATE?
          </h2>
          <p className="text-muted-foreground font-mono mb-6">
            Join thousands of creators using Claudine AI to bring their visions to life.
            Start creating amazing images today.
          </p>
          <Link href="/studio">
            <button className="arcade-btn font-pixel text-xs bg-secondary/20 border-secondary hover:glow-magenta">
              CREATE FREE ACCOUNT
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-mono text-sm">
            Claudine AI - AI Image Generation & Editing
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-card border-2 border-border p-6 hover:border-primary transition-colors">
      <div className={`${color} mb-4`}>{icon}</div>
      <h3 className="font-pixel text-sm text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground font-mono text-sm">{description}</p>
    </div>
  );
}
