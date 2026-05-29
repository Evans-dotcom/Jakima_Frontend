import { User } from "./auth.model";

// core/models/kpi.model.ts
export interface KPI {
  id: number;
  sn_NO: number;
  outcome: string;
  performanceIndicator: string;
  teamLeader: User;
  baseline?: number;
  targetY1Y5: string;
  achievementY1Y5: string;
  formula: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Lagging';
  variance?: number;
  priorityFocusArea: PriorityFocusArea;
  hasSubIndicators: boolean;
  isFlagship: boolean;
  isEnabler: boolean;
  yearData: KPIYearData[];
  subIndicators: SubIndicator[];
  comments: Comment[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt?: string;
}

export interface KPIYearData {
  year: number;
  annualTarget?: number;
  achievement?: number;
  targetText?: string;
  achievementText?: string;
  variance?: number;
  notes?: string;
}

export interface SubIndicator {
  id: number;
  kpiId: number;
  description: string;
  target: string;
  achievement: string;
  status: string;
  sequence: number;
}

export interface PriorityFocusArea {
  id: number;
  sequence: number;
  name: string;
  description: string;
  keyObjective: string;
  totalKPIs: number;
  completedKPIs: number;
  inProgressKPIs: number;
  laggingKPIs: number;
  overallProgress: number;
}

export interface Comment {
  id: number;
  kpiId: number;
  user: User;
  content: string;
  type: string;
  isInternalNote: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Attachment {
  id: number;
  kpiId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedBy: string;
  uploadedAt: string;
}