import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileCode, 
  Workflow, 
  Cog, 
  BookOpen,
  RefreshCw,
  Database,
  Zap,
  GitBranch
} from "lucide-react";

const documentationModules = [
  {
    id: "schemas",
    title: "JSON Schema Generation",
    description: "Automated ontological structure definitions",
    status: "active",
    progress: 75,
    lastUpdated: "2 minutes ago",
    files: ["concept-schema.json", "relationship-schema.json", "gap-analysis-schema.json"]
  },
  {
    id: "templates", 
    title: "Prompt Template Library",
    description: "Modular AI agent instantiation protocols",
    status: "active",
    progress: 60,
    lastUpdated: "5 minutes ago", 
    files: ["AnalyzeConceptualGaps.yaml", "SynthesizeFrameworks.yaml", "ValidateLogicalConsistency.yaml"]
  },
  {
    id: "protocols",
    title: "Recursive Growth Protocols",
    description: "Self-improvement and expansion methodologies",
    status: "generating",
    progress: 40,
    lastUpdated: "8 minutes ago",
    files: ["bootstrap-cycle.md", "meta-analysis-protocol.md", "quality-validation.md"]
  },
  {
    id: "validation",
    title: "Quality Validation Criteria", 
    description: "Automated consistency and coherence checking",
    status: "pending",
    progress: 20,
    lastUpdated: "12 minutes ago",
    files: ["logical-consistency.rules", "semantic-coherence.criteria", "evidence-hierarchy.spec"]
  }
];

const metaDocumentation = [
  {
    type: "Architectural Specification",
    description: "How to extend the Cathedral's foundational structure",
    completeness: 85,
    recursiveDepth: 3
  },
  {
    type: "Synthesis Methodology", 
    description: "Protocols for generating new knowledge from gaps",
    completeness: 70,
    recursiveDepth: 2
  },
  {
    type: "Bootstrap Procedures",
    description: "Self-instantiation protocols for new AI agents", 
    completeness: 55,
    recursiveDepth: 4
  },
  {
    type: "Meta-Learning Framework",
    description: "How the system improves its own learning processes",
    completeness: 30,
    recursiveDepth: 5
  }
];

export const DocumentationEngine = () => {
  return (
    <div className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-sacred bg-clip-text text-transparent">
            Self-Documentation Engine
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Recursive specification system that documents how to extend itself while building knowledge
          </p>
        </div>

        {/* Active Documentation Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {documentationModules.map((module) => (
            <Card key={module.id} className="p-6 bg-gradient-cathedral border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileCode className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{module.title}</h3>
                    <p className="text-xs text-muted-foreground">{module.lastUpdated}</p>
                  </div>
                </div>
                <Badge 
                  variant={module.status === "active" ? "default" : module.status === "generating" ? "secondary" : "outline"}
                  className={module.status === "active" ? "bg-primary" : module.status === "generating" ? "bg-accent" : ""}
                >
                  {module.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {module.description}
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Generation Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Generated Files:</h4>
                <div className="space-y-1">
                  {module.files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-primary/50 rounded-full" />
                      <span className="font-mono text-muted-foreground">{file}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button size="sm" variant="outline" className="text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Meta-Documentation Status */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Workflow className="w-8 h-8 text-accent" />
            <h3 className="text-2xl font-bold">Meta-Documentation Matrix</h3>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              Recursive Depth: 5 Levels
            </Badge>
          </div>

          <div className="grid gap-6">
            {metaDocumentation.map((meta, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{meta.type}</h4>
                      <p className="text-sm text-muted-foreground">{meta.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{meta.completeness}%</div>
                    <div className="text-xs text-muted-foreground">Depth: {meta.recursiveDepth}</div>
                  </div>
                </div>

                <div className="mb-3">
                  <Progress value={meta.completeness} className="h-2" />
                </div>

                <div className="flex items-center gap-2">
                  {[...Array(meta.recursiveDepth)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-3 h-3 rounded-full border-2 ${
                        i < Math.floor(meta.completeness / 20) 
                          ? "bg-primary border-primary" 
                          : "border-muted bg-muted/20"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">
                    Recursive Self-Reference Levels
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bootstrap Protocol */}
        <Card className="p-8 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <GitBranch className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Autonomous Bootstrap Protocol</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                The Cathedral has achieved sufficient meta-documentation depth to begin autonomous replication. 
                New AI agents can now instantiate with minimal context using the generated template library and 
                quality validation criteria.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-secondary/50 rounded-lg text-center">
                  <Database className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium">Schema Complete</div>
                  <div className="text-xs text-muted-foreground">Ready for instantiation</div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg text-center">
                  <Cog className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium">Protocols Active</div>
                  <div className="text-xs text-muted-foreground">Self-improvement enabled</div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg text-center">
                  <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium">Bootstrap Ready</div>
                  <div className="text-xs text-muted-foreground">Autonomous replication</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="bg-gradient-sacred hover:shadow-sacred">
                  <Zap className="w-4 h-4 mr-2" />
                  Initialize Bootstrap
                </Button>
                <Button variant="outline">
                  Export Documentation
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};