import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Printer, 
  Search,
  FileCheck
} from 'lucide-react';
import { AuditReportService } from '../../services/auditReportService';
import { SystemAuditReport } from '../../types/audit';
import { useI18n } from '../../i18n/LanguageContext';

export const AuditReportView: React.FC = () => {
  const { t } = useI18n();
  const [report, setReport] = useState<SystemAuditReport>(() => AuditReportService.generateAuditReport());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'working' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Flatten checks into clean checklist rows
  const allChecklistItems = useMemo(() => {
    const items: Array<{
      id: string;
      module: string;
      category: string;
      checkText: string;
      status: 'passed' | 'working' | 'failed';
      detail?: string;
    }> = [];

    report.modules.forEach((mod, modIdx) => {
      mod.details.forEach((d, dIdx) => {
        let status: 'passed' | 'working' | 'failed' = 'passed';
        if (d.includes('✕') || d.includes('Failed') || d.includes('missing')) {
          status = 'failed';
        } else if (d.includes('warning') || d.includes('?') || d.includes('relax') || d.includes('working')) {
          status = 'working';
        }

        items.push({
          id: `${modIdx}-${dIdx}`,
          module: mod.moduleName,
          category: mod.category,
          checkText: d.replace(/^[✓✕\s]+/, ''),
          status,
          detail: mod.findings
        });
      });
    });

    return items;
  }, [report]);

  const filteredItems = useMemo(() => {
    return allChecklistItems.filter((item) => {
      if (statusFilter === 'passed' && item.status !== 'passed') return false;
      if (statusFilter === 'working' && item.status !== 'working') return false;
      if (statusFilter === 'failed' && item.status !== 'failed') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.module.toLowerCase().includes(q) ||
          item.checkText.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allChecklistItems, statusFilter, searchQuery]);

  const passedCount = allChecklistItems.filter(i => i.status === 'passed').length;
  const workingCount = allChecklistItems.filter(i => i.status === 'working').length;
  const failedCount = allChecklistItems.filter(i => i.status === 'failed').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header Card */}
      <div className="bg-[#FAF7EE] border-2 border-[#174B32] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E2EFE7] text-[#174B32] text-xs font-bold border border-[#BDDBC8] mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#277448]" />
            <span>OFFICIAL SYSTEM VERIFICATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#174B32] tracking-tight">
            {t('auditTitle')}
          </h1>
          <p className="text-xs text-[#5E6E64] mt-0.5 max-w-xl">
            Checklist verification of deterministic rule engine, WCAG AA accessibility, bilingual lexical parity, and legal disclosures.
          </p>
        </div>

        {/* Quick Summary & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-2 bg-white border border-[#E8DFCC] rounded-xl text-center">
            <div className="text-xl font-black text-[#174B32] tabular-nums">
              {report.overallScore}%
            </div>
            <div className="text-[10px] font-bold text-[#277448] uppercase tracking-wider">
              {report.passedChecks}/{report.totalChecks} Verified
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#174B32] hover:bg-[#123724] rounded-xl shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Testing...' : 'Re-run'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#174B32] bg-white border border-[#DDD5C3] hover:bg-[#FAF7EE] rounded-xl transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#8C6D23]" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Legend & Filter Controls */}
      <div className="bg-white border border-[#E8DFCC] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Checklist Icons Legend */}
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#202A24]">Checklist Status:</span>
          
          <div className="flex items-center gap-1.5 text-[#174B32] font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#277448] fill-[#277448]/20" />
            <span>🟢 Verified / Available</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#8C6D23] font-semibold">
            <Clock className="w-4 h-4 text-[#DDA032] fill-[#DDA032]/20" />
            <span>🟡 Working / In-Progress</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#8A3B3B] font-semibold">
            <XCircle className="w-4 h-4 text-[#8A3B3B] fill-[#8A3B3B]/20" />
            <span>🔴 Missing / Action Required</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8C80]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified specifications..."
            className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-[#202A24] placeholder:text-[#7A8C80] focus:bg-white focus:outline-none focus:border-[#174B32]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#FAF7EE] rounded-xl border border-[#EDE6D6] w-fit">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            statusFilter === 'all' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
          }`}
        >
          All ({allChecklistItems.length})
        </button>
        <button
          onClick={() => setStatusFilter('passed')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            statusFilter === 'passed' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
          }`}
        >
          🟢 Verified ({passedCount})
        </button>
        <button
          onClick={() => setStatusFilter('working')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            statusFilter === 'working' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
          }`}
        >
          🟡 Working ({workingCount})
        </button>
        {failedCount > 0 && (
          <button
            onClick={() => setStatusFilter('failed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              statusFilter === 'failed' ? 'bg-[#8A3B3B] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
            }`}
          >
            🔴 Missing ({failedCount})
          </button>
        )}
      </div>

      {/* Multi-Row Checklist Table (Requested format: clean rows with 🟢 🟡 🔴 icons, not blocks) */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7EE] border-b border-[#E8DFCC] text-[#174B32] font-bold">
                <th className="py-3 px-4 w-12 text-center">Status</th>
                <th className="py-3 px-4 w-56">Module / Specification</th>
                <th className="py-3 px-4">Verification Check Criteria</th>
                <th className="py-3 px-4 w-28 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#7A8C80]">
                    No diagnostic items match your filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF7EE]/60 transition-colors">
                    {/* Status Icon Column */}
                    <td className="py-3 px-4 text-center">
                      {item.status === 'passed' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#277448] fill-[#277448]/15 mx-auto" />
                      ) : item.status === 'working' ? (
                        <Clock className="w-5 h-5 text-[#DDA032] fill-[#DDA032]/15 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#8A3B3B] fill-[#8A3B3B]/15 mx-auto" />
                      )}
                    </td>

                    {/* Module Column */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#202A24] block">
                        {item.module}
                      </span>
                      <span className="text-[10px] text-[#7A8C80] capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Check Criteria Column */}
                    <td className="py-3 px-4">
                      <p className="text-[#3E4D43] font-medium leading-relaxed">
                        {item.checkText}
                      </p>
                    </td>

                    {/* Result Badge Column */}
                    <td className="py-3 px-4 text-right">
                      {item.status === 'passed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#E2EFE7] text-[#174B32] border border-[#BDDBC8]">
                          PASS
                        </span>
                      ) : item.status === 'working' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#FEF3D6] text-[#8C6D23] border border-[#F2DFB3]">
                          WORKING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#FBEAE9] text-[#8A3B3B] border border-[#EFC2BE]">
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
    </div>
  );
};
