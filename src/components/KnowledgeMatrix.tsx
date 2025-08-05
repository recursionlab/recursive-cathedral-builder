import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  GitMerge, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Layers,
  Target,
  Zap
} from "lucide-react";

const conceptualDomains = [
  {
    id: "foundations",
    name: "Foundational Frameworks",
    concepts: 47,
    connections: 124,
    gaps: 8,
    status: "analyzed",
    description: "Core theoretical underpinnings and methodological approaches"
  },
  {
    id: "emergence", 
    name: "Emergence Theory",
    concepts: 32,
    connections: 89,
    gaps: 12,
    status: "processing",
    description: "Complex systems and emergent properties research"
  },
  {
    id: "cognition",
    name: "Cognitive Architecture", 
    concepts: 28,
    connections: 67,
    gaps: 15,
    status: "queued",
    description: "Mental models, reasoning patterns, and consciousness studies"
  },
  {
    id: "synthesis",
    name: "Knowledge Synthesis",
    concepts: 19,
    connections: 43,
    gaps: 23,
    status: "pending",
    description: "Meta-cognitive processes and recursive learning systems"
  }
];

const gapAnalysis = [
  {
    concept: "Recursive Self-Reference",
    sourceDoc: "Cognitive Architecture Vol. 3",
    targetConcept: "Meta-Learning Protocols", 
    targetDoc: "Synthesis Frameworks",
    bridgeType: "methodological",
    priority: "high"
  },
  {
    concept: "Emergent Complexity",
    sourceDoc: "Complex Systems Theory",
    targetConcept: "Knowledge Scaffolding",
    targetDoc: "Educational Frameworks", 
    bridgeType: "theoretical",
    priority: "medium"
  },
  {
    concept: "Semantic Coherence",
    sourceDoc: "Linguistic Analysis",
    targetConcept: "Ontological Mapping",
    targetDoc: "Knowledge Representation",
    bridgeType: "structural", 
    priority: "high"
  }
];

export const KnowledgeMatrix = () => {
  return (
    <div className="py-20 px-8 bg-gradient-knowledge">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-sacred bg-clip-text text-transparent">
            Knowledge Matrix
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Semantic clustering and conceptual gap analysis across document corpus
          </p>
        </div>

        {/* Conceptual Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {conceptualDomains.map((domain) => (
            <Card key={domain.id} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <Layers className="w-6 h-6 text-primary" />
                <Badge 
                  variant={domain.status === "analyzed" ? "default" : "secondary"}
                  className={domain.status === "analyzed" ? "bg-primary" : ""}
                >
                  {domain.status}
                </Badge>
              </div>
              
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                {domain.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {domain.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Concepts:</span>
                  <span className="font-medium">{domain.concepts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Connections:</span>
                  <span className="font-medium">{domain.connections}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gaps:</span>
                  <span className="font-medium text-accent">{domain.gaps}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Gap Analysis Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Target className="w-8 h-8 text-accent" />
            <h3 className="text-2xl font-bold">Critical Knowledge Gaps</h3>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              {gapAnalysis.length} Identified
            </Badge>
          </div>

          <div className="grid gap-6">
            {gapAnalysis.map((gap, index) => (
              <Card key={index} className="p-6 bg-gradient-cathedral border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <GitMerge className="w-5 h-5 text-accent" />
                    </div>
                    <Badge 
                      variant="outline"
                      className={`${gap.priority === "high" ? "border-accent text-accent" : "border-muted-foreground text-muted-foreground"}`}
                    >
                      {gap.priority} priority
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {gap.bridgeType}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4 items-center">
                  <div className="text-center">
                    <div className="p-3 bg-secondary/50 rounded-lg mb-2">
                      <h4 className="font-medium text-sm">{gap.concept}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{gap.sourceDoc}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>

                  <div className="text-center">
                    <div className="p-3 bg-secondary/50 rounded-lg mb-2">
                      <h4 className="font-medium text-sm">{gap.targetConcept}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{gap.targetDoc}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Generate Bridge
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Synthesis Opportunities */}
        <Card className="p-8 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Network className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Next Synthesis Cycle</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Ready to begin automated bridge generation between foundational frameworks and emergence theory. 
                This synthesis will create 12 new conceptual connections and potentially identify 3-5 novel theoretical constructs.
              </p>
              <div className="flex gap-3">
                <Button className="bg-gradient-sacred hover:shadow-sacred">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Initiate Synthesis
                </Button>
                <Button variant="outline">
                  Preview Connections
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};