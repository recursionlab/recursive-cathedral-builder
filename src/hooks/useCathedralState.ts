import { useState, useCallback } from 'react';

export type PhaseId = 'ingestion' | 'extraction' | 'mapping' | 'analysis' | 'synthesis' | 'documentation' | 'automation';

export interface CathedralPhase {
  id: PhaseId;
  status: 'ready' | 'processing' | 'complete' | 'pending';
  progress: number;
}

interface CathedralState {
  currentPhase: PhaseId | null;
  phases: Record<PhaseId, CathedralPhase>;
  isProcessing: boolean;
}

const initialPhases: Record<PhaseId, CathedralPhase> = {
  ingestion: { id: 'ingestion', status: 'ready', progress: 0 },
  extraction: { id: 'extraction', status: 'pending', progress: 0 },
  mapping: { id: 'mapping', status: 'pending', progress: 0 },
  analysis: { id: 'analysis', status: 'pending', progress: 0 },
  synthesis: { id: 'synthesis', status: 'pending', progress: 0 },
  documentation: { id: 'documentation', status: 'pending', progress: 0 },
  automation: { id: 'automation', status: 'pending', progress: 0 }
};

export const useCathedralState = () => {
  const [state, setState] = useState<CathedralState>({
    currentPhase: null,
    phases: initialPhases,
    isProcessing: false
  });

  const startPhase = useCallback((phaseId: PhaseId) => {
    setState(prev => ({
      ...prev,
      currentPhase: phaseId,
      isProcessing: true,
      phases: {
        ...prev.phases,
        [phaseId]: { ...prev.phases[phaseId], status: 'processing', progress: 0 }
      }
    }));
  }, []);

  const updatePhaseProgress = useCallback((phaseId: PhaseId, progress: number) => {
    setState(prev => ({
      ...prev,
      phases: {
        ...prev.phases,
        [phaseId]: { ...prev.phases[phaseId], progress }
      }
    }));
  }, []);

  const completePhase = useCallback((phaseId: PhaseId) => {
    setState(prev => {
      const phases = { ...prev.phases };
      phases[phaseId] = { ...phases[phaseId], status: 'complete', progress: 100 };
      
      // Enable next phase
      const phaseOrder: PhaseId[] = ['ingestion', 'extraction', 'mapping', 'analysis', 'synthesis', 'documentation', 'automation'];
      const currentIndex = phaseOrder.indexOf(phaseId);
      if (currentIndex < phaseOrder.length - 1) {
        const nextPhase = phaseOrder[currentIndex + 1];
        phases[nextPhase] = { ...phases[nextPhase], status: 'ready' };
      }

      return {
        ...prev,
        currentPhase: null,
        isProcessing: false,
        phases
      };
    });
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return {
    state,
    startPhase,
    updatePhaseProgress,
    completePhase,
    scrollToSection
  };
};