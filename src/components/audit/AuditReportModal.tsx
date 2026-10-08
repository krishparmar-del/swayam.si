import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Search, 
  X,
  ExternalLink,
  Printer
} from 'lucide-react';
import { AuditReportService } from '../../services/auditReportService';
import { SystemAuditReport } from '../../types/audit';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFullAudit?: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToFullAudit 
}) => {
  const [report, setReport] = useState<SystemAuditReport>(() => AuditReportService.generateAuditReport());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'working' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setReport(AuditReportService.generateAuditReport(true));
      setIsRefreshing(false);
    }, 120);
  };

  const handlePrint = () => {
    window.print();
  };

  // Build clean, flattened multi-row checklist
  const allRows = useMemo(() => {
    const list: Array<{
      id: string;
      spec: string;
      category: string;
      rule: string;
      status: 'passed' | 'working' | 'failed';
    }> = [];

    report.modules.forEach((mod, mIdx) => {
      mod.details.forEach((det, dIdx) => {
        let status: 'passed' | 'working' | 'failed' = 'passed';
        if (det.includes('✕') || det.includes('Failed') || det.includes('missing')) {
          status = 'failed';
        } else if (det.includes('?') || det.includes('warning') || det.includes('relax') || det.includes('working')) {
          status = 'working';
        }

        list.push({
          id: `${mIdx}-${dIdx}`,
          spec: mod.moduleName,
          category: mod.category,
          rule: det.replace(/^[✓✕\s]+/, ''),
          status
        });
      });
    });

    return list;
  }, [report]);

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      if (statusFilter === 'passed' && row.status !== 'passed') return false;
      if (statusFilter === 'working' && row.status !== 'working') return false;
      if (statusFilter === 'failed' && row.status !== 'failed') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          row.spec.toLowerCase().includes(q) ||
          row.rule.toLowerCase().includes(q) ||
          row.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allRows, statusFilter, searchQuery]);

  const passedCount = allRows.filter(r => r.status === 'passed').length;
  const workingCount = allRows.filter(r => r.status === 'working').length;
  const failedCount = allRows.filter(r => r.status === 'failed').length;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
      onClick={(e) => {
        // Dismiss if user clicks outside modal card
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-4xl bg-white border border-[#E8DFCC] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-[#FAF7EE] border-b border-[#E8DFCC] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2EFE7] text-[#174B32] flex items-center justify-center shrink-0 border border-[#BDDBC8]">
              <ShieldCheck className="w-6 h-6 text-[#277448]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="audit-modal-title" className="text-lg font-bold text-[#174B32] tracking-tight">
                  SWAYAM.SI System Audit & Verification
                </h2>
                <span className="text-[11px] font-bold bg-[#E2EFE7] text-[#174B32] px-2 py-0.5 rounded-md border border-[#BDDBC8]">
                  {report.overallScore}% COMPLIANT
                </span>
              </div>
              <p className="text-xs text-[#5E6E64] mt-0.5">
                Multi-row checklist verifying deterministic eligibility, WCAG AA contrast, and official data integrity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-[#174B32] hover:bg-white rounded-lg border border-[#DDD5C3] transition-colors"
              title="Re-run Diagnostics"
              aria-label="Re-run Diagnostics"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-[#5E6E64] hover:text-[#202A24] hover:bg-white rounded-lg border border-[#DDD5C3] transition-colors"
              title="Print Checklist"
              aria-label="Print Checklist"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#5E6E64] hover:text-[#202A24] hover:bg-white rounded-lg border border-[#DDD5C3] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legend & Filter Bar */}
        <div className="px-5 py-3 bg-white border-b border-[#F0EBE1] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Checklist Icons Legend */}
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#202A24] text-[11px] uppercase tracking-wider text-[#7A8C80]">
              Legend:
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-[#174B32]">
              <CheckCircle2 className="w-4 h-4 text-[#277448] fill-[#277448]/20" />
              <span>🟢 Verified / Available</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[#8C6D23]">
              <Clock className="w-4 h-4 text-[#DDA032] fill-[#DDA032]/20" />
              <span>🟡 Working / In-Progress</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[#8A3B3B]">
              <XCircle className="w-4 h-4 text-[#8A3B3B] fill-[#8A3B3B]/20" />
              <span>🔴 Missing / Action Needed</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8C80]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search checklist rules..."
              className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-lg pl-8 pr-2.5 py-1 text-xs text-[#202A24] placeholder:text-[#7A8C80] focus:bg-white focus:outline-none focus:border-[#174B32]"
            />
          </div>
        </div>

        {/* Quick Filter Tabs */}
        <div className="px-5 py-2 bg-[#FAF7EE]/60 border-b border-[#F0EBE1] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#174B32] text-white shadow-2xs'
                  : 'text-[#5E6E64] hover:text-[#202A24] hover:bg-white'
              }`}
            >
              All ({allRows.length})
            </button>
            <button
              onClick={() => setStatusFilter('passed')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'passed'
                  ? 'bg-[#174B32] text-white shadow-2xs'
                  : 'text-[#5E6E64] hover:text-[#202A24] hover:bg-white'
              }`}
            >
              🟢 Verified ({passedCount})
            </button>
            <button
              onClick={() => setStatusFilter('working')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'working'
                  ? 'bg-[#174B32] text-white shadow-2xs'
                  : 'text-[#5E6E64] hover:text-[#202A24] hover:bg-white'
              }`}
            >
              🟡 Working ({workingCount})
            </button>
            {failedCount > 0 && (
              <button
                onClick={() => setStatusFilter('failed')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  statusFilter === 'failed'
                    ? 'bg-[#8A3B3B] text-white shadow-2xs'
                    : 'text-[#5E6E64] hover:text-[#202A24] hover:bg-white'
                }`}
              >
                🔴 Missing ({failedCount})
              </button>
            )}
          </div>

          {onNavigateToFullAudit && (
            <button
              onClick={() => {
                onClose();
                onNavigateToFullAudit();
              }}
              className="text-[11px] font-semibold text-[#174B32] hover:underline flex items-center gap-1"
            >
              <span>Open Dedicated Page</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Multi-Row Checklist Table (Requested format: clean rows with 🟢 🟡 🔴 icons) */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          <div className="border border-[#E8DFCC] rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7EE] border-b border-[#E8DFCC] text-[#174B32] font-bold">
                  <th className="py-2.5 px-3 w-12 text-center">Status</th>
                  <th className="py-2.5 px-3 w-48">Module Specification</th>
                  <th className="py-2.5 px-3">Verification Rule & Requirement</th>
                  <th className="py-2.5 px-3 w-28 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#7A8C80]">
                      No checklist items match your query.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr key={row.id} className="hover:bg-[#FAF7EE]/50 transition-colors">
                      {/* Checklist Icon */}
                      <td className="py-2.5 px-3 text-center">
                        {row.status === 'passed' ? (
                          <span title="Verified / Available" className="inline-block">
                            <CheckCircle2 className="w-4 h-4 text-[#277448] fill-[#277448]/20 mx-auto" />
                          </span>
                        ) : row.status === 'working' ? (
                          <span title="Working / In-Progress" className="inline-block">
                            <Clock className="w-4 h-4 text-[#DDA032] fill-[#DDA032]/20 mx-auto" />
                          </span>
                        ) : (
                          <span title="Missing / Action Required" className="inline-block">
                            <XCircle className="w-4 h-4 text-[#8A3B3B] fill-[#8A3B3B]/20 mx-auto" />
                          </span>
                        )}
                      </td>

                      {/* Module Column */}
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#202A24] block leading-tight">
                          {row.spec}
                        </span>
                        <span className="text-[10px] text-[#7A8C80] capitalize">
                          {row.category.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Rule Column */}
                      <td className="py-2.5 px-3 text-[#3E4D43] leading-relaxed">
                        {row.rule}
                      </td>

                      {/* Result Badge */}
                      <td className="py-2.5 px-3 text-right">
                        {row.status === 'passed' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E2EFE7] text-[#174B32] border border-[#BDDBC8]">
                            VERIFIED
                          </span>
                        ) : row.status === 'working' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3D6] text-[#8C6D23] border border-[#F2DFB3]">
                            WORKING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBEAE9] text-[#8A3B3B] border border-[#EFC2BE]">
                            MISSING
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:px-6 bg-[#FAF7EE] border-t border-[#E8DFCC] flex items-center justify-between text-xs">
          <span className="text-[#5E6E64]">
            Showing {filteredRows.length} of {allRows.length} diagnostic checks
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#174B32] hover:bg-[#123724] text-white font-bold rounded-xl transition-colors shadow-2xs"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
