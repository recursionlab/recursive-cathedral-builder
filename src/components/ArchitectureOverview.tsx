import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useCathedralState } from "@/hooks/useCathedralState";
import { PhaseSimulator } from "@/components/PhaseSimulator";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  GitBranch, 
  Search, 
  Brain, 
  Workflow, 
  FileSearch,
  Network,
  Zap
} from "lucide-react";

const architecturePhases = [
  {
    id: "ingestion",
    title: "Document Ingestion",
    description: "Vector embeddings and semantic preprocessing of 40-PDF corpus",
    icon: FileText,
    status: "ready",
    progress: 0,
    components: ["PDF Parser", "Vector Database", "Metadata Extraction"]
  },
  {
    id: "extraction",
    title: "Concept Extraction", 
    description: "Hierarchical topic modeling using BERT embeddings and LDA",
    icon: Search,
    status: "pending",
    progress: 0,
    components: ["BERT Embeddings", "Topic Modeling", "Term Extraction"]
  },
  {
    id: "mapping",
    title: "Relationship Mapping",
    description: "Build semantic adjacency matrices and conceptual neighborhoods",
    icon: Network,
    status: "pending", 
    progress: 0,
    components: ["Semantic Clustering", "Graph Construction", "Edge Detection"]
  },
  {
    id: "analysis",
    title: "Gap Analysis",
    description: "Ontological triangulation to identify missing theoretical bridges",
    icon: Brain,
    status: "pending",
    progress: 0,
    components: ["Dependency Graphs", "Missing Edge Detection", "Synthesis Opportunities"]
  },
  {
    id: "synthesis",
    title: "Knowledge Synthesis",
    description: "Generate new connections and fill identified conceptual gaps",
    icon: GitBranch,
    status: "pending",
    progress: 0,
    components: ["Framework Integration", "Bridge Generation", "Validation"]
  },
  {
    id: "documentation",
    title: "Meta-Documentation",
    description: "Self-documenting protocols and recursive improvement specifications",
    icon: FileSearch,
    status: "pending",
    progress: 0,
    components: ["JSON Schemas", "Prompt Templates", "Quality Metrics"]
  },
  {
    id: "automation",
    title: "Recursive Growth",
    description: "Bootstrap self-improvement cycles and automated expansion",
    icon: Zap,
    status: "pending",
    progress: 0,
    components: ["Template Library", "Auto-Instantiation", "Growth Protocols"]
  }
];

export const ArchitectureOverview = () => {
  const { state, startPhase, updatePhaseProgress, completePhase } = useCathedralState();
  const { toast } = useToast();

  const handlePhaseStart = (phaseId: any) => {
    if (state.phases[phaseId].status === 'ready') {
      startPhase(phaseId);
    } else {
      toast({
        title: "Phase Not Ready",
        description: "Complete previous phases to unlock this one",
        variant: "destructive"
      });
    }
  };

  return (
    <div id="architecture" className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-sacred bg-clip-text text-transparent">
            System Architecture
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Seven-phase recursive construction protocol enabling emergent intelligence through scaffolded complexity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {architecturePhases.map((phase, index) => {
            const currentPhase = state.phases[phase.id as keyof typeof state.phases];
            const isActive = state.currentPhase === phase.id;
            
            return (
            <Card 
              key={phase.id}
              className={`p-6 bg-gradient-cathedral border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-cathedral group ${
                isActive ? 'ring-2 ring-primary shadow-sacred' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <phase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge 
                    variant={currentPhase.status === "ready" ? "default" : "secondary"}
                    className={currentPhase.status === "ready" ? "bg-primary" : ""}
                  >
                    Phase {index + 1}
                  </Badge>
                </div>
                <Badge variant="outline" className="text-xs">
                  {currentPhase.status}
                </Badge>
              </div>

              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {phase.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {phase.description}
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{currentPhase.progress}%</span>
                </div>
                <Progress value={currentPhase.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Components:</h4>
                <div className="flex flex-wrap gap-1">
                  {phase.components.map((component, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline" 
                      className="text-xs bg-secondary/50"
                    >
                      {component}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {currentPhase.status === 'ready' && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={() => handlePhaseStart(phase.id)}
                    className="bg-gradient-sacred hover:shadow-sacred"
                  >
                    Start Phase
                  </Button>
                </div>
              )}
              
              {isActive && (
                <PhaseSimulator 
                  phaseId={phase.id as any}
                  onProgress={(progress) => updatePhaseProgress(phase.id as any, progress)}
                  onComplete={() => completePhase(phase.id as any)}
                />
              )}
            </Card>
            );
          })}
        </div>

        {/* Meta-Architecture Note */}
        <div className="mt-16 p-8 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-start gap-4">
            <Workflow className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-accent">Recursive Meta-Architecture</h3>
              <p className="text-muted-foreground leading-relaxed">
                Each phase outputs both substantive results and methodological refinements for subsequent phases. 
                The Cathedral documents its own construction methodology so future iterations can extend both 
                content knowledge and meta-knowledge about knowledge synthesis simultaneously.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};