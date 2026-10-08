export interface AuditModuleResult {
  moduleName: string;
  category: 'core_engine' | 'accessibility' | 'i18n' | 'compliance' | 'export';
  status: 'passed' | 'warning' | 'failed';
  score: number; // 0-100
  checksPerformed: number;
  checksPassed: number;
  details: string[];
  findings: string;
}

export interface SystemAuditReport {
  id: string;
  timestamp: string;
  overallStatus: 'VERIFIED_COMPLIANT';
  overallScore: number;
  totalChecks: number;
  passedChecks: number;
  version: string;
  modules: AuditModuleResult[];
  standardsVerified: string[];
}
