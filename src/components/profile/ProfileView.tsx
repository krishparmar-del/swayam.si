import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Bookmark, 
  Trash2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { UserProfile, SocialCategory, EducationLevel, IndianState } from '../../types/profile';
import { Opportunity } from '../../types/opportunity';
import { SEED_OPPORTUNITIES } from '../../data/seedOpportunities';
import { useI18n } from '../../i18n/LanguageContext';

interface ProfileViewProps {
  user: UserProfile;
  completeness: number;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetData: () => void;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onToggleSave: (id: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  completeness,
  onUpdateProfile,
  onResetData,
  onSelectOpportunity,
  onToggleSave
}) => {
  const { t } = useI18n();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [state, setState] = useState(user.state);
  const [category, setCategory] = useState(user.category);
  const [educationLevel, setEducationLevel] = useState(user.educationLevel);
  const [degreeName, setDegreeName] = useState(user.degreeName || '');
  const [income, setIncome] = useState(user.annualFamilyIncome ? String(user.annualFamilyIncome) : '');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const savedOpportunities = SEED_OPPORTUNITIES.filter(o => user.savedOpportunityIds.includes(o.id));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      age: Number(age),
      state,
      category,
      educationLevel,
      degreeName,
      annualFamilyIncome: income ? Number(income) : undefined,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight">
            {t('myProfileTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6E64] mt-1">
            {t('myProfileSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-xs font-bold text-[#174B32] bg-white border border-[#DDD5C3] hover:bg-[#FAF7EE] rounded-xl transition-colors self-start sm:self-auto"
        >
          {isEditing ? 'Cancel Editing' : t('editProfile')}
        </button>
      </div>

      {/* Completeness Card */}
      <div className="bg-[#FAF7EE] border border-[#E8DFCC] rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#E2EFE7] text-[#174B32] flex items-center justify-center text-base font-extrabold tabular-nums">
            {completeness}%
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#202A24]">Profile Completeness Score</h3>
            <p className="text-xs text-[#5E6E64]">
              {completeness === 100 
                ? 'Your profile is complete! All exam and scheme eligibility checks are fully unlocked.'
                : 'Add income details to unlock complete means-tested welfare scheme assessments.'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form or Profile Cards */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white border border-[#E8DFCC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#174B32] border-b border-[#F0EBE1] pb-3">
            Update Profile Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202A24] block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-xl px-3.5 py-2 text-xs text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202A24] block">Age (Years)</label>
              <input
                type="number"
                min={16}
                max={60}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-xl px-3.5 py-2 text-xs text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202A24] block">Social Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SocialCategory)}
                className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-xl px-3 py-2 text-xs text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202A24] block">State Domicile</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value as IndianState)}
                className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-xl px-3.5 py-2 text-xs text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202A24] block">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-xl px-3 py-2 text-xs text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
              >
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202A24] block">Degree / Course Name</label>
              <input
                type="text"
                value={degreeName}
                onChange={(e) => setDegreeName(e.target.value)}
                placeholder="e.g. B.Tech / B.Sc"
                className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-xl px-3.5 py-2 text-xs text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#202A24] block">Annual Family Income (in INR)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g. 300000 (₹3 Lakhs)"
                className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-xl px-3.5 py-2 text-xs text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#174B32] text-white text-xs font-bold rounded-xl hover:bg-[#123724] transition-colors"
            >
              {t('saveChanges')}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 text-xs font-semibold text-[#5E6E64] hover:bg-[#FAF7EE] rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Personal Details */}
          <div className="bg-white border border-[#E8DFCC] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0EBE1] text-[#174B32]">
              <User className="w-4 h-4 text-[#277448]" />
              <h3 className="text-sm font-bold tracking-tight">{t('personalDetails')}</h3>
            </div>
            <div className="space-y-2 text-xs text-[#5E6E64]">
              <div className="flex justify-between py-1 border-b border-[#FAF7EE]">
                <span>Name:</span>
                <strong className="text-[#202A24]">{user.name || 'Citizen'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#FAF7EE]">
                <span>Age:</span>
                <strong className="text-[#202A24]">{user.age} Years</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#FAF7EE]">
                <span>State Domicile:</span>
                <strong className="text-[#202A24]">{user.state}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#FAF7EE]">
                <span>Social Category:</span>
                <strong className="text-[#202A24]">{user.category}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>PWD Status:</span>
                <strong className="text-[#202A24]">{user.isPwd ? `Yes (${user.pwdPercentage || 40}%)` : 'No'}</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Education Details */}
          <div className="bg-white border border-[#E8DFCC] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0EBE1] text-[#174B32]">
              <GraduationCap className="w-4 h-4 text-[#277448]" />
              <h3 className="text-sm font-bold tracking-tight">{t('educationDetails')}</h3>
            </div>
            <div className="space-y-2 text-xs text-[#5E6E64]">
              <div className="flex justify-between py-1 border-b border-[#FAF7EE]">
                <span>Highest Level:</span>
                <strong className="text-[#202A24]">{user.educationLevel}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#FAF7EE]">
                <span>Degree / Stream:</span>
                <strong className="text-[#202A24]">{user.degreeName || 'Not specified'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#FAF7EE]">
                <span>Graduation Year:</span>
                <strong className="text-[#202A24]">{user.passingYear || '-'}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Annual Family Income:</span>
                <strong className="text-[#202A24]">
                  {user.annualFamilyIncome ? `₹${(user.annualFamilyIncome / 100000).toFixed(1)} Lakhs` : 'Not provided'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Opportunities Section */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#8C6D23]" />
            <h2 className="text-base font-bold text-[#174B32] tracking-tight">
              Saved Opportunities ({savedOpportunities.length})
            </h2>
          </div>
        </div>

        {savedOpportunities.length > 0 ? (
          <div className="divide-y divide-[#F0EBE1]">
            {savedOpportunities.map((op) => (
              <div
                key={op.id}
                onClick={() => onSelectOpportunity(op)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#FAF7EE] px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#202A24]">{op.title}</h4>
                  <p className="text-[11px] text-[#5E6E64]">{op.authority} · {op.type.toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#174B32] flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#7A8C80] py-3 text-center">
            No saved opportunities yet. Tap the bookmark icon on any exam or scheme card to save it here.
          </p>
        )}
      </div>

      {/* Reset Local Data Box */}
      <div className="p-5 bg-[#FAF7EE] border border-[#E8DFCC] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-[#8A3B3B]">{t('resetAllData')}</h4>
          <p className="text-[11px] text-[#6E7E73] mt-0.5">
            Clears your local profile, document readiness checklist, and saved bookmarks from this device.
          </p>
        </div>

        {showConfirmReset ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              className="px-3 py-1.5 bg-[#8A3B3B] text-white text-xs font-bold rounded-lg shadow-2xs"
            >
              Confirm Clear
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1.5 bg-white text-[#5E6E64] text-xs font-semibold rounded-lg border border-[#DDD5C3]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-3.5 py-1.5 text-xs font-bold text-[#8A3B3B] bg-white border border-[#EFC2BE] hover:bg-[#FCF2F1] rounded-xl transition-colors self-start sm:self-auto"
          >
            Clear Local Data
          </button>
        )}
      </div>
    </div>
  );
};
