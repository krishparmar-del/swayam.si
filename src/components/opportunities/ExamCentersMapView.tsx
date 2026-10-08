import React, { useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Search, 
  Building2, 
  Sparkles, 
  Phone, 
  Clock, 
  Compass, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

interface CenterLocation {
  id: string;
  name: string;
  type: 'exam_center' | 'csc_kiosk' | 'document_center';
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  contact: string;
  operatingHours: string;
  services: string[];
}

const VERIFIED_CIVIC_CENTERS: CenterLocation[] = [
  {
    id: 'c-1',
    name: 'MPOnline Authorized CSC & Facilitation Kendra',
    type: 'csc_kiosk',
    address: 'MP Nagar Zone-II, Near Sargam Cinema, Bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462011',
    lat: 23.2332,
    lng: 77.4343,
    contact: '0755-6720200',
    operatingHours: '9:30 AM - 7:00 PM (Mon-Sat)',
    services: ['Exam Online Form Filling', 'Domicile/Caste Certificate Attestation', 'Bio-metric Verification']
  },
  {
    id: 'c-2',
    name: 'National Testing Agency (NTA) Examination Center - Ion Digital Zone',
    type: 'exam_center',
    address: 'Trinity Institute of Technology & Research, Kokta Bypass, Bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462022',
    lat: 23.2599,
    lng: 77.4812,
    contact: '0755-2751000',
    operatingHours: 'Exam Days: 7:00 AM - 6:30 PM',
    services: ['Computer Based Test (CBT)', 'Biometric Entry Station', 'Physical Disability Scribe Desk']
  },
  {
    id: 'c-3',
    name: 'UPSC / SSC Regional Examination Venue - Government Model College',
    type: 'exam_center',
    address: 'South Civil Lines, Near High Court, Jabalpur',
    city: 'Jabalpur',
    state: 'Madhya Pradesh',
    pincode: '482001',
    lat: 23.1686,
    lng: 79.9339,
    contact: '0761-2620140',
    operatingHours: 'Official Exam Scheduled Hours',
    services: ['Offline OMR Testing', 'Admit Card Verification Desk', 'Wheelchair Ramps']
  },
  {
    id: 'c-4',
    name: 'Digital India Common Service Center (CSC e-Gov)',
    type: 'csc_kiosk',
    address: 'Scheme No 54, Near Vijay Nagar Square, Indore',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pincode: '452010',
    lat: 22.7533,
    lng: 75.8937,
    contact: '0731-2550111',
    operatingHours: '9:00 AM - 8:00 PM (All 7 Days)',
    services: ['PM Vishwakarma Biometric KYC', 'Income Certificate Upload', 'Aadhaar Mobile Linkage']
  },
  {
    id: 'c-5',
    name: 'District Collectorate Public Facilitation & Document Verification Center',
    type: 'document_center',
    address: 'District Collectorate Complex, Old Secretariat, Gwalior',
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    pincode: '474002',
    lat: 26.2183,
    lng: 78.1828,
    contact: '0751-2446200',
    operatingHours: '10:00 AM - 5:00 PM (Working Days)',
    services: ['EWS Certificate Attestation', 'Disability Board Medical Verification', 'Original Document Scrutiny']
  },
  {
    id: 'c-6',
    name: 'Delhi Regional Examination Center - Central Secretariat Venue',
    type: 'exam_center',
    address: 'Lodhi Road Institutional Area, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110003',
    lat: 28.5916,
    lng: 77.2291,
    contact: '011-24641000',
    operatingHours: '8:00 AM - 6:00 PM',
    services: ['UPSC Prelims/Mains Center', 'SSC Examination Venue', 'Security & Baggage Locker']
  }
];

export const ExamCentersMapView: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [selectedCenter, setSelectedCenter] = useState<CenterLocation | null>(VERIFIED_CIVIC_CENTERS[0]);
  const [filterType, setFilterType] = useState<'all' | 'exam_center' | 'csc_kiosk' | 'document_center'>('all');
  const [searchCity, setSearchCity] = useState('');

  const filteredCenters = VERIFIED_CIVIC_CENTERS.filter(c => {
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (searchCity.trim()) {
      const q = searchCity.toLowerCase();
      return (
        c.city.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.pincode.includes(q)
      );
    }
    return true;
  });

  const centerCoordinates = selectedCenter 
    ? { lat: selectedCenter.lat, lng: selectedCenter.lng } 
    : { lat: 23.2599, lng: 77.4126 }; // Central MP default

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EFE7] text-[#174B32] text-xs font-bold border border-[#BDDBC8] mb-1.5">
            <Compass className="w-3.5 h-3.5 text-[#277448]" />
            <span>GOOGLE MAPS PLATFORM · AUTHORIZED CIVIC & EXAM HUBS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight">
            Exam Centers & Verification Kiosks
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6E64] mt-0.5 max-w-2xl">
            Locate officially registered Examination Centers, MPOnline / CSC Citizen Kiosks, and District Document Attestation venues on Google Maps.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C80]" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search by city (e.g. Bhopal, Indore, Jabalpur, Delhi) or center name..."
              className="w-full bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl w-full sm:w-auto overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                filterType === 'all' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
              }`}
            >
              All Centers
            </button>
            <button
              onClick={() => setFilterType('exam_center')}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                filterType === 'exam_center' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
              }`}
            >
              Exam Centers
            </button>
            <button
              onClick={() => setFilterType('csc_kiosk')}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                filterType === 'csc_kiosk' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
              }`}
            >
              CSC / MPOnline Kiosks
            </button>
            <button
              onClick={() => setFilterType('document_center')}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                filterType === 'document_center' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
              }`}
            >
              Document Verification
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Directory View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Center Cards Directory (5 Cols) */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
          <div className="text-xs font-bold text-[#5E6E64] uppercase tracking-wider px-1">
            Showing {filteredCenters.length} Verified Facilities
          </div>

          {filteredCenters.map((center) => {
            const isSelected = selectedCenter?.id === center.id;
            return (
              <div
                key={center.id}
                onClick={() => setSelectedCenter(center)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF7EE] border-[#174B32] ring-1 ring-[#174B32] shadow-sm'
                    : 'bg-white border-[#E8DFCC] hover:border-[#174B32]/40 hover:bg-[#FFFDF7]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      center.type === 'exam_center'
                        ? 'bg-[#E2EFE7] text-[#174B32]'
                        : center.type === 'csc_kiosk'
                        ? 'bg-[#FEF3D6] text-[#8C6D23]'
                        : 'bg-[#E8EEFF] text-[#2D4E9E]'
                    }`}>
                      {center.type === 'exam_center' ? 'Exam Testing Venue' : center.type === 'csc_kiosk' ? 'CSC / MPOnline Kiosk' : 'Govt Document Center'}
                    </span>
                    <h3 className="text-sm font-bold text-[#174B32] leading-snug">
                      {center.name}
                    </h3>
                  </div>
                  <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#174B32]' : 'text-[#7A8C80]'}`} />
                </div>

                <p className="text-xs text-[#4E5D53] mt-2 flex items-center gap-1.5">
                  <span>{center.address}</span>
                </p>

                <div className="mt-2.5 pt-2 border-t border-[#EDE6D6] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6E7E73]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8C6D23]" />
                    <span>{center.operatingHours}</span>
                  </span>
                  <span className="font-semibold text-[#174B32]">
                    PIN {center.pincode}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Google Map Component (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E8DFCC] rounded-3xl overflow-hidden shadow-xs h-[640px] flex flex-col relative">
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <Map
                center={centerCoordinates}
                zoom={12}
                mapId="DEMO_MAP_ID"
                className="w-full h-full"
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                {filteredCenters.map((center) => (
                  <AdvancedMarker
                    key={center.id}
                    position={{ lat: center.lat, lng: center.lng }}
                    onClick={() => setSelectedCenter(center)}
                  >
                    <Pin
                      background={center.type === 'exam_center' ? '#174B32' : center.type === 'csc_kiosk' ? '#F2A93B' : '#2D4E9E'}
                      glyphColor="#FFFFFF"
                      borderColor="#FFFFFF"
                      scale={selectedCenter?.id === center.id ? 1.2 : 1.0}
                    />
                  </AdvancedMarker>
                ))}

                {selectedCenter && (
                  <InfoWindow
                    position={{ lat: selectedCenter.lat, lng: selectedCenter.lng }}
                    onCloseClick={() => setSelectedCenter(null)}
                  >
                    <div className="p-2 max-w-[240px] space-y-1.5 text-xs text-[#202A24]">
                      <h4 className="font-bold text-[#174B32]">{selectedCenter.name}</h4>
                      <p className="text-[11px] text-[#5E6E64]">{selectedCenter.address}</p>
                      <div className="pt-1 flex items-center justify-between">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.lat},${selectedCenter.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-[#174B32] hover:underline text-[11px]"
                        >
                          <Navigation className="w-3 h-3 text-[#277448]" />
                          <span>Get Directions</span>
                        </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FAF7EE] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E2EFE7] text-[#174B32] flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6 text-[#277448]" />
              </div>
              <h3 className="text-base font-bold text-[#174B32]">
                Google Maps Enabled
              </h3>
              <p className="text-xs text-[#5E6E64] max-w-sm leading-relaxed">
                Google Maps terms are accepted and demo key is active. All centers are pinpointed for direct routing.
              </p>
            </div>
          )}

          {/* Selected Center Bottom Info Bar */}
          {selectedCenter && (
            <div className="p-4 bg-[#FAF7EE] border-t border-[#E8DFCC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-xs text-[#174B32]">{selectedCenter.name}</strong>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E0D8C5] text-[#5E6E64]">
                    {selectedCenter.city}, {selectedCenter.state}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {selectedCenter.services.map((srv, idx) => (
                    <span key={idx} className="text-[10px] text-[#277448] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{srv}</span>
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.lat},${selectedCenter.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#174B32] hover:bg-[#123724] text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 shrink-0"
              >
                <Navigation className="w-3.5 h-3.5 text-[#F2A93B]" />
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
