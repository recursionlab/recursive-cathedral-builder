import { useEffect } from 'react';
import { PhaseId } from '@/hooks/useCathedralState';
import { useToast } from '@/hooks/use-toast';

interface PhaseSimulatorProps {
  phaseId: PhaseId;
  onProgress: (progress: number) => void;
  onComplete: () => void;
}

const phaseMessages = {
  ingestion: [
    'Initializing PDF parsing engines...',
    'Extracting text and metadata...',
    'Generating vector embeddings...',
    'Building semantic index...',
    'Document corpus ingestion complete!'
  ],
  extraction: [
    'Loading BERT embedding models...',
    'Performing hierarchical topic modeling...',
    'Extracting conceptual terminology...',
    'Building concept relationship graphs...',
    'Concept extraction complete!'
  ],
  mapping: [
    'Calculating semantic adjacency matrices...',
    'Identifying conceptual neighborhoods...',
    'Building relationship networks...',
    'Detecting semantic clusters...',
    'Relationship mapping complete!'
  ],
  analysis: [
    'Performing ontological triangulation...',
    'Identifying dependency gaps...',
    'Mapping missing theoretical bridges...',
    'Calculating synthesis opportunities...',
    'Gap analysis complete!'
  ],
  synthesis: [
    'Generating conceptual bridges...',
    'Validating logical consistency...',
    'Integrating frameworks...',
    'Creating new connections...',
    'Knowledge synthesis complete!'
  ],
  documentation: [
    'Generating JSON schemas...',
    'Creating prompt templates...',
    'Building recursive protocols...',
    'Documenting meta-processes...',
    'Self-documentation complete!'
  ],
  automation: [
    'Initializing bootstrap protocols...',
    'Testing autonomous replication...',
    'Validating self-improvement cycles...',
    'Enabling recursive growth...',
    'Automation protocols active!'
  ]
};

export const PhaseSimulator = ({ phaseId, onProgress, onComplete }: PhaseSimulatorProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const messages = phaseMessages[phaseId];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < messages.length) {
        const progress = ((currentStep + 1) / messages.length) * 100;
        onProgress(progress);
        
        toast({
          title: messages[currentStep],
          description: `Phase ${phaseId} - Step ${currentStep + 1}/${messages.length}`,
        });
        
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => onComplete(), 500);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [phaseId, onProgress, onComplete, toast]);

  return null;
};