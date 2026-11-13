import React, { useState } from 'react';
import { X, Zap, CheckCircle2, Plus } from 'lucide-react';
import { Station } from '../../types';
import { INDIAN_CITIES_COORDINATES } from '../../data/mockStations';

interface ListChargerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStation: (newStation: Station) => void;
}

export const ListChargerModal: React.FC<ListChargerModalProps> = ({
  isOpen,
  onClose,
  onAddStation,
}) => {
  const [name, setName] = useState('');
  const [area, setArea] = useState('Connaught Place, New Delhi');
  const [address, setAddress] = useState('');
  const [connectorType, setConnectorType] = useState<'CCS2' | 'Type-2' | 'Bharat AC'>('CCS2');
  const [powerKw, setPowerKw] = useState(50);
  const [pricePerKwh, setPricePerKwh] = useState(18);
  const [is24x7, setIs24x7] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting || submitted) return;
    setIsSubmitting(true);

    const id = `st-custom-${Date.now()}`;
    const matchedCityKey = Object.keys(INDIAN_CITIES_COORDINATES).find(c => area.toLowerCase().includes(c)) || 'delhi';
    const cityCoord = INDIAN_CITIES_COORDINATES[matchedCityKey] || { lat: 28.6139, lng: 77.2090 };
    const lat = cityCoord.lat + (Math.random() - 0.5) * 0.04;
    const lng = cityCoord.lng + (Math.random() - 0.5) * 0.04;

    const newStation: Station = {
      id,
      name,
      area,
      fullAddress: address || `${name}, ${area}, India`,
      lat,
      lng,
      status: 'available',
      availablePorts: 2,
      totalPorts: 2,
      pricePerKwh: Number(pricePerKwh) || 18,
      minSessionFee: 50,
      rating: 5.0,
      reviewsCount: 1,
      hours: is24x7 ? '24/7' : '7 AM – 11 PM',
      is24x7,
      vehicleTypes: ['4-Wheeler', '2-Wheeler'],
      powerSpeed: `${powerKw >= 50 ? 'DC Fast' : 'AC Fast'} · ${powerKw} kW`,
      primaryConnectors: [connectorType],
      estimatedFullChargeCost: Math.round(Number(pricePerKwh) * 20),
      operator: 'Independent Host',
      amenities: ['Verified Host', 'CCTV Security', 'Illuminated Parking'],
      connectors: [
        { id: `${id}-c1`, type: connectorType, powerKw, speedType: powerKw >= 50 ? 'DC Fast' : 'AC Fast', status: 'free', portNumber: 1 },
        { id: `${id}-c2`, type: connectorType, powerKw, speedType: powerKw >= 50 ? 'DC Fast' : 'AC Fast', status: 'free', portNumber: 2 },
      ],
      reviews: [
        {
          id: `${id}-r1`,
          author: 'Go Charge Verifier',
          rating: 5,
          date: 'Just now',
          vehicle: 'All Vehicles',
          comment: 'Station listed and hardware verified on Go Charge network.'
        }
      ]
    };

    onAddStation(newStation);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsSubmitting(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#123C3A]/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-6 rounded-card bg-white border border-[#D9DED5] shadow-2xl text-[#14201F] space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DED5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E9EFE7] text-[#19C7B1] flex items-center justify-center border border-[#D9DED5]">
              <Zap className="w-4 h-4 fill-[#19C7B1]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#123C3A]">List Your Charger</h3>
              <p className="text-[11px] text-[#5E716E]">Add your residential, hotel or commercial EV port</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E716E] hover:text-[#123C3A] hover:bg-[#E9EFE7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center shadow-glow-green">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#123C3A]">Charger Listed Successfully!</h4>
            <p className="text-xs text-[#5E716E] max-w-xs font-medium">
              Your station is now live on the Go Charge map with 2 free ports.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#123C3A] font-bold mb-1.5">
                Station / Host Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bandra Residency Hyper Hub"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-btn bg-[#F4F1E8] border border-[#D9DED5] focus:border-[#19C7B1] focus:bg-white text-[#14201F] outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#123C3A] font-bold mb-1.5">
                  City / Location
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-btn bg-[#F4F1E8] border border-[#D9DED5] focus:border-[#19C7B1] text-[#14201F] outline-none cursor-pointer font-medium"
                >
                  <option value="Connaught Place, New Delhi">Connaught Place, Delhi</option>
                  <option value="Aerocity, New Delhi">Aerocity, Delhi</option>
                  <option value="DLF Cyber City, Gurugram">Gurugram (NCR)</option>
                  <option value="Sector 18, Noida">Noida (NCR)</option>
                  <option value="Bandra West, Mumbai">Bandra West, Mumbai</option>
                  <option value="BKC, Mumbai">BKC, Mumbai</option>
                  <option value="Indiranagar, Bengaluru">Indiranagar, Bengaluru</option>
                  <option value="Whitefield, Bengaluru">Whitefield, Bengaluru</option>
                  <option value="Gachibowli, Hyderabad">Gachibowli, Hyderabad</option>
                  <option value="Anna Nagar, Chennai">Anna Nagar, Chennai</option>
                  <option value="Park Street, Kolkata">Park Street, Kolkata</option>
                  <option value="C-Scheme, Jaipur">C-Scheme, Jaipur</option>
                  <option value="Bodakdev, Ahmedabad">Bodakdev, Ahmedabad</option>
                  <option value="Koregaon Park, Pune">Koregaon Park, Pune</option>
                  <option value="Marine Drive, Kochi">Marine Drive, Kochi</option>
                  <option value="Other Location, India">Other Location in India</option>
                </select>
              </div>

              <div>
                <label className="block text-[#123C3A] font-bold mb-1.5">
                  Connector Type
                </label>
                <select
                  value={connectorType}
                  onChange={(e) => setConnectorType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-btn bg-[#F4F1E8] border border-[#D9DED5] focus:border-[#19C7B1] text-[#14201F] outline-none cursor-pointer font-medium"
                >
                  <option value="CCS2">CCS2 (50kW+ DC Fast)</option>
                  <option value="Type-2">Type-2 (22kW AC)</option>
                  <option value="Bharat AC">Bharat AC (7.4kW)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#123C3A] font-bold mb-1.5">
                  Power Output (kW)
                </label>
                <input
                  type="number"
                  min="3"
                  max="150"
                  value={powerKw}
                  onChange={(e) => setPowerKw(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-btn bg-[#F4F1E8] border border-[#D9DED5] focus:border-[#19C7B1] focus:bg-white text-[#14201F] outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[#123C3A] font-bold mb-1.5">
                  Tariff (₹ / kWh)
                </label>
                <input
                  type="number"
                  min="10"
                  max="40"
                  value={pricePerKwh}
                  onChange={(e) => setPricePerKwh(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-btn bg-[#F4F1E8] border border-[#D9DED5] focus:border-[#19C7B1] focus:bg-white text-[#14201F] outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#123C3A] font-bold mb-1.5">
                Exact Street Address
              </label>
              <input
                type="text"
                placeholder="Building, street, landmark, PIN code"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-btn bg-[#F4F1E8] border border-[#D9DED5] focus:border-[#19C7B1] focus:bg-white text-[#14201F] outline-none font-medium"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is24x7"
                checked={is24x7}
                onChange={(e) => setIs24x7(e.target.checked)}
                className="w-4 h-4 rounded text-[#19C7B1] accent-[#19C7B1] cursor-pointer"
              />
              <label htmlFor="is24x7" className="text-xs text-[#123C3A] font-medium cursor-pointer">
                Open 24/7 with round-the-clock driver access
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full py-3 rounded-btn bg-[#19C7B1] hover:bg-[#123C3A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-teal-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering Charger...' : 'Publish Station to Go Charge'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
