import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { Opportunity } from '../../types/opportunity';
import { UserProfile } from '../../types/profile';
import { EligibilityEngine } from '../../services/eligibilityEngine';

interface OpportunityChatProps {
  opportunity: Opportunity;
  user: UserProfile;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isSynthesized?: boolean;
  sources?: Array<{ title: string; url: string; domain?: string }>;
}

export const OpportunityChat: React.FC<OpportunityChatProps> = ({ opportunity, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const evalRes = EligibilityEngine.evaluate(user, opportunity);
    const initialGreeting = `Namaste ${user.name ? user.name.split(' ')[0] : 'Scholar'}! I am your AI Civic Navigator for **${opportunity.title}**.\n\n` +
      `Based on your profile (${user.educationLevel}, ${user.category}, Age ${user.age}), your current evaluation shows **${evalRes.matchScore}% match (${evalRes.status.replace(/_/g, ' ')})**.\n\n` +
      `Ask me anything about eligibility criteria, required documents, application process, syllabus, or relaxations. All answers are synthesized with official guidelines.`;

    return [
      {
        id: 'initial',
        sender: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSynthesized: true,
        sources: [
          {
            title: `${opportunity.authority} Official Portal`,
            url: opportunity.officialUrl,
            domain: new URL(opportunity.officialUrl).hostname
          }
        ]
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSynthesizing]);

  const quickQuestions = [
    `Am I eligible with ${user.educationLevel}?`,
    `What documents are mandatory to apply?`,
    `Are there age relaxations for ${user.category}?`,
    `How to fill the application form?`
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isSynthesizing) return;

    if (!questionText) setInput('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsSynthesizing(true);

    try {
      const res = await fetch('/api/chat/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          opportunityTitle: opportunity.title,
          opportunityType: opportunity.type,
          authority: opportunity.authority,
          officialUrl: opportunity.officialUrl,
          eligibilityRequirements: opportunity.eligibilityRequirements,
          requiredDocuments: opportunity.requiredDocuments,
          fullDescription: opportunity.fullDescription,
          keyBenefit: opportunity.keyBenefit,
          userProfile: user,
          query: q,
          chatHistory: messages.slice(-4).map(m => ({ role: m.sender, content: m.text }))
        })
      });

      if (!res.ok) {
        throw new Error(`API responded with ${res.status}`);
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'I could not synthesize a verified answer for this query. Please check the official portal.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSynthesized: true,
        sources: data.sources || [
          {
            title: opportunity.authority,
            url: opportunity.officialUrl,
            domain: new URL(opportunity.officialUrl).hostname
          }
        ]
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (_err) {
      // Client-side grounded synthesis fallback (offline or network fallback)
      const evalRes = EligibilityEngine.evaluate(user, opportunity);
      let answer = '';
      const qLower = q.toLowerCase();

      if (qLower.includes('eligible') || qLower.includes('qualification')) {
        answer = `**Eligibility Analysis for ${opportunity.title}:**\n` +
          `• **Status:** ${evalRes.status.replace(/_/g, ' ')} (${evalRes.matchScore}% Match)\n` +
          `• **Education:** Required is ${opportunity.eligibilityRequirements.educationLevels.join(', ')}. Your level is ${user.educationLevel}.\n` +
          `• **Age Criteria:** Minimum ${opportunity.eligibilityRequirements.minAge || 'Not specified'} to Maximum ${opportunity.eligibilityRequirements.maxAge || 'Not specified'} years. You are ${user.age} years old.\n` +
          `• **Summary:** ${evalRes.summary}`;
      } else if (qLower.includes('document') || qLower.includes('certificate')) {
        const mandatoryDocs = opportunity.requiredDocuments.filter(d => d.isMandatory).map(d => d.name);
        answer = `**Required Documents for ${opportunity.title}:**\n` +
          `• **Mandatory Documents:** ${mandatoryDocs.join(', ')}\n` +
          `• **Instructions:** Please keep digital copies (scanned PDF/JPEG) ready before applying on ${opportunity.officialUrl}.`;
      } else if (qLower.includes('relaxation') || qLower.includes('category')) {
        const relax = opportunity.eligibilityRequirements.ageRelaxation?.[user.category] || 0;
        answer = `**Relaxations for ${user.category} Category:**\n` +
          `• **Age Relaxation:** ${relax > 0 ? `${relax} years relaxation applicable` : 'Standard age limits apply as per official gazette'}.\n` +
          `• **Quota / Reservation:** Published category provisions apply according to Central/State guidelines.`;
      } else {
        answer = `**Official Guidance regarding ${opportunity.title}:**\n\n` +
          `This opportunity is administered by **${opportunity.authority}**.\n\n` +
          `• **Key Benefit:** ${opportunity.keyBenefit}\n` +
          `• **Official Application Portal:** ${opportunity.applicationUrl || opportunity.officialUrl}\n\n` +
          `For specific procedural inquiries, please consult the gazette notification or visit the official portal.`;
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSynthesized: true,
        sources: [
          {
            title: `${opportunity.authority} Official Portal`,
            url: opportunity.officialUrl,
            domain: new URL(opportunity.officialUrl).hostname
          }
        ]
      };

      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="bg-white border border-[#E8DFCC] rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 bg-[#FAF7EE] border-b border-[#E8DFCC] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#174B32] text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-[#F2A93B]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#174B32]">
                Ask About This {opportunity.type === 'exam' ? 'Exam' : 'Scheme'}
              </h3>
              <span className="text-[10px] bg-[#E2EFE7] text-[#174B32] font-extrabold px-1.5 py-0.5 rounded border border-[#BDDBC8]">
                Synthesized AI
              </span>
            </div>
            <p className="text-[11px] text-[#5E6E64]">
              Grounded in official gazette & {opportunity.authority} guidelines
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#277448] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Factual & Verified</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 sm:p-5 space-y-4 max-h-[380px] overflow-y-auto bg-[#FFFFFF]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#E2EFE7] text-[#174B32] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <Bot className="w-4 h-4 text-[#277448]" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#174B32] text-white rounded-tr-xs'
                  : 'bg-[#FAF7EE] text-[#202A24] border border-[#E8DFCC] rounded-tl-xs space-y-2'
              }`}
            >
              <div className="whitespace-pre-line">
                {msg.text}
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-[#E8DFCC]/60 flex flex-wrap items-center gap-1.5 text-[10px] text-[#5E6E64]">
                  <span className="font-semibold text-[#174B32]">Source:</span>
                  {msg.sources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#277448] hover:underline bg-white px-1.5 py-0.5 rounded border border-[#DDD5C3]"
                    >
                      <span>{s.title}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              )}

              <div className={`text-[10px] text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-[#7A8C80]'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#FAF7EE] text-[#174B32] border border-[#DDD5C3] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <User className="w-4 h-4 text-[#174B32]" />
              </div>
            )}
          </div>
        ))}

        {isSynthesizing && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 rounded-lg bg-[#E2EFE7] text-[#174B32] flex items-center justify-center shrink-0 font-bold">
              <Bot className="w-4 h-4 text-[#277448]" />
            </div>
            <div className="bg-[#FAF7EE] border border-[#E8DFCC] rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-[#5E6E64] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F2A93B]" />
              <span>Synthesizing official requirements and gazette rules...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-[#FAF7EE]/60 border-t border-[#E8DFCC] flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[10px] font-bold text-[#7A8C80] uppercase tracking-wider shrink-0 mr-1">
          Quick queries:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isSynthesizing}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 bg-white hover:bg-[#EBF5EE] text-[#174B32] border border-[#E0D8C5] rounded-lg transition-colors text-[11px] font-medium shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-[#E8DFCC] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${opportunity.title}...`}
          disabled={isSynthesizing}
          className="flex-1 bg-[#FAF7EE] border border-[#E0D8C5] focus:border-[#174B32] focus:bg-white rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#202A24] focus:outline-none transition-all disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isSynthesizing || !input.trim()}
          className="px-4 py-2 bg-[#174B32] hover:bg-[#123724] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          {isSynthesizing ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#F2A93B]" />
          ) : (
            <>
              <span>Ask</span>
              <Send className="w-3.5 h-3.5 text-[#F2A93B]" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
