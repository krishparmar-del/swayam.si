import React, { useState } from 'react';
import { Activity, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PhysicalRequirement } from '../../types/opportunity';
import { PhysicalMeasurements } from '../../types/profile';
import { EligibilityEngine } from '../../services/eligibilityEngine';
import { useI18n } from '../../i18n/LanguageContext';

interface PhysicalRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: PhysicalRequirement;
  currentMeasurements?: PhysicalMeasurements;
  gender?: 'Male' | 'Female' | 'Other';
  onSaveMeasurements: (measurements: PhysicalMeasurements) => void;
}

export const PhysicalRequirementsModal: React.FC<PhysicalRequirementsModalProps> = ({
  isOpen,
  onClose,
  requirement,
  currentMeasurements,
  gender = 'Male',
  onSaveMeasurements
}) => {
  const { t } = useI18n();

  const [height, setHeight] = useState<number>(currentMeasurements?.heightCm || 172);
  const [chest, setChest] = useState<number>(currentMeasurements?.chestCm || 82);
  const [vision, setVision] = useState<'6/6' | '6/9' | '6/12' | 'other'>(currentMeasurements?.visionStandard || '6/6');
  const [colorBlind, setColorBlind] = useState<boolean>(currentMeasurements?.colorBlindness || false);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(!!currentMeasurements?.heightCm);

  const measurements: PhysicalMeasurements = {
    heightCm: Number(height),
    chestCm: gender === 'Female' ? undefined : Number(chest),
    visionStandard: vision,
    colorBlindness: colorBlind
  };

  const evaluation = EligibilityEngine.evaluatePhysical(measurements, requirement, gender);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setHasEvaluated(true);
    onSaveMeasurements(measurements);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('physicalHeading')}
      subtitle={t('physicalSubheading')}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Height */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="modal-height" className="font-bold text-[#202A24]">{t('enterHeight')}</label>
              <span className="text-[#6E7E73]">
                Standard: Min {gender === 'Female' ? 157 : requirement.minHeightCm || 170} cm
              </span>
            </div>
            <input
              id="modal-height"
              type="number"
              min={140}
              max={215}
              required
              value={height}
              onChange={(e) => {
                setHeight(Number(e.target.value));
                setHasEvaluated(false);
              }}
              className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
            />
          </div>

          {/* Chest (for Male candidates) */}
          {gender !== 'Female' && requirement.minChestCm && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="modal-chest" className="font-bold text-[#202A24]">{t('enterChest')}</label>
                <span className="text-[#6E7E73]">Standard: Min {requirement.minChestCm} cm</span>
              </div>
              <input
                id="modal-chest"
                type="number"
                min={70}
                max={120}
                required
                value={chest}
                onChange={(e) => {
                  setChest(Number(e.target.value));
                  setHasEvaluated(false);
                }}
                className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-xl px-4 py-2.5 text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
              />
            </div>
          )}

          {/* Vision Standard */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="modal-vision" className="font-bold text-[#202A24]">{t('visionQuality')}</label>
              <span className="text-[#6E7E73]">Required: 6/6 or 6/9</span>
            </div>
            <select
              id="modal-vision"
              value={vision}
              onChange={(e) => {
                setVision(e.target.value as any);
                setHasEvaluated(false);
              }}
              className="w-full bg-[#FAF7EE] border border-[#DDD5C3] rounded-xl px-3.5 py-2.5 text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
            >
              <option value="6/6">6/6 (Normal standard without glass)</option>
              <option value="6/9">6/9 (Permissible distant vision)</option>
              <option value="6/12">6/12 (Mild refractive error)</option>
              <option value="other">Below 6/12</option>
            </select>
          </div>

          {/* Color blindness */}
          <div className="flex items-center justify-between p-3 bg-[#FAF7EE] rounded-xl border border-[#DDD5C3]">
            <div>
              <span className="text-xs font-bold text-[#202A24] block">Color Blindness</span>
              <span className="text-[11px] text-[#6E7E73]">Do you have difficulty distinguishing red/green?</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setColorBlind(!colorBlind);
                setHasEvaluated(false);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                colorBlind ? 'bg-[#8A3B3B] text-white border-[#8A3B3B]' : 'bg-white text-[#5E6E64] border-[#DDD5C3]'
              }`}
            >
              {colorBlind ? 'Yes' : 'No'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#174B32] hover:bg-[#123724] text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            {t('checkMyPhysical')}
          </button>
        </form>

        {/* Detailed Breakdown after submission */}
        {hasEvaluated && (
          <div className="p-4 rounded-xl border border-[#E8DFCC] bg-[#FAF7EE] space-y-4 animate-in fade-in duration-150">
            <h4 className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider">
              Measurement Breakdown
            </h4>

            {/* Height row */}
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8DFCC]">
              <div>
                <span className="font-bold text-[#202A24]">Height: </span>
                <span>{height} cm (Required: {gender === 'Female' ? 157 : requirement.minHeightCm} cm)</span>
              </div>
              <span className="font-bold flex items-center gap-1">
                {height >= (gender === 'Female' ? 157 : requirement.minHeightCm || 170) ? (
                  <span className="text-[#174B32] flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Met</span>
                ) : (
                  <span className="text-[#8A3B3B] flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Short</span>
                )}
              </span>
            </div>

            {/* Chest row */}
            {gender !== 'Female' && requirement.minChestCm && (
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8DFCC]">
                <div>
                  <span className="font-bold text-[#202A24]">Chest: </span>
                  <span>{chest} cm (Required: {requirement.minChestCm} cm)</span>
                </div>
                <span className="font-bold flex items-center gap-1">
                  {chest >= requirement.minChestCm ? (
                    <span className="text-[#174B32] flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Met</span>
                  ) : (
                    <span className="text-[#8A3B3B] flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Short</span>
                  )}
                </span>
              </div>
            )}

            {/* Vision row */}
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8DFCC]">
              <div>
                <span className="font-bold text-[#202A24]">Vision & Color: </span>
                <span>{vision} {colorBlind ? '(Deficient)' : '(Normal)'}</span>
              </div>
              <span className="font-bold flex items-center gap-1">
                {!colorBlind && (vision === '6/6' || vision === '6/9') ? (
                  <span className="text-[#174B32] flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Met</span>
                ) : (
                  <span className="text-[#8A3B3B] flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Unqualified</span>
                )}
              </span>
            </div>

            {/* Overall Verdict */}
            <div className={`p-3 rounded-lg text-xs leading-relaxed font-medium ${
              evaluation.isQualified ? 'bg-[#E2EFE7] text-[#174B32]' : 'bg-[#FBEAE9] text-[#8A3B3B]'
            }`}>
              <p className="font-bold">
                {evaluation.isQualified ? t('physicalMeets') : t('physicalDoesNotMeet')}
              </p>
              <p className="text-[11px] mt-0.5 opacity-90">{evaluation.reason}</p>
            </div>

            {/* Statutory Disclaimer */}
            <p className="text-[11px] text-[#6E7E73] leading-snug">
              <strong>Mandatory Notice:</strong> {t('physicalDisclaimer')}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
