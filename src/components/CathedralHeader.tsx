import { BookOpen, Brain, Network, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import cathedralHero from "@/assets/cathedral-hero.jpg";

export const CathedralHeader = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cathedralHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-cathedral opacity-90" />
      
      {/* Sacred Geometry Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/30 rotate-45 animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-24 h-24 border border-accent/30 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 border border-primary/20 rotate-12 animate-pulse delay-700" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <Brain className="w-20 h-20 text-primary mx-auto mb-6 animate-pulse" />
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-sacred bg-clip-text text-transparent leading-tight">
            Cathedral of Reasoning
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A recursive knowledge synthesis system that self-documents its own construction while growing from foundational texts into emergent intelligence
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { icon: BookOpen, text: "Document Vectorization" },
            { icon: Network, text: "Semantic Clustering" },
            { icon: Brain, text: "Gap Analysis" },
            { icon: Zap, text: "Recursive Growth" }
          ].map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur-sm border border-border rounded-full text-sm hover:bg-secondary/70 transition-colors"
            >
              <feature.icon className="w-4 h-4 text-primary" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-sacred hover:shadow-sacred transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4"
          >
            Begin Construction
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary/30 bg-card/50 backdrop-blur-sm hover:bg-primary/10 text-lg px-8 py-4"
          >
            Explore Architecture
          </Button>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};