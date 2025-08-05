import { CathedralHeader } from "@/components/CathedralHeader";
import { ArchitectureOverview } from "@/components/ArchitectureOverview";
import { KnowledgeMatrix } from "@/components/KnowledgeMatrix";
import { DocumentationEngine } from "@/components/DocumentationEngine";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <CathedralHeader />
      <ArchitectureOverview />
      <KnowledgeMatrix />
      <DocumentationEngine />
    </div>
  );
};

export default Index;
