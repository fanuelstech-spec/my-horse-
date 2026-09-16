import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { useEstate } from '../lib/estateContext';

interface ContactPageProps {
  initialHorse?: string;
  initialHorseId?: string;
  initialSubject?: string;
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  initialHorse,
  initialHorseId,
  initialSubject,
  onNavigate,
}) => {
  const { settings, submitEnquiry, horses } = useEstate();
  
  // 1. Buyer Information
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cityState, setCityState] = useState('');
  const [preferredContact, setPreferredContact] = useState('');
  
  // 2. Horse Interest
  const [horseName, setHorseName] = useState(initialHorse || '');
  const [horseId, setHorseId] = useState(initialHorseId || '');
  const [subject, setSubject] = useState(
    initialSubject || (initialHorse ? `Application regarding ${initialHorse}` : 'Buyer Application')
  );
  const [attracted, setAttracted] = useState('');
  
  // 3. Riding & Horse Experience
  const [experienceYears, setExperienceYears] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [ownedBefore, setOwnedBefore] = useState('');
  const [primaryRider, setPrimaryRider] = useState('');
  const [primaryRiderOther, setPrimaryRiderOther] = useState('');
  
  // 4. Intended Use
  const [intendedUses, setIntendedUses] = useState<string[]>([]);
  const [intendedUseOther, setIntendedUseOther] = useState('');
  const [importantQualities, setImportantQualities] = useState('');
  
  // 5. Care & Location
  const [keptWhere, setKeptWhere] = useState('');
  const [placePrepared, setPlacePrepared] = useState('');
  const [horseLocation, setHorseLocation] = useState('');
  
  // 6. Purchase & Transportation
  const [transportMethod, setTransportMethod] = useState('');
  const [transportAssist, setTransportAssist] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  
  // 7. Additional Info & Acknowledgment
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [signature, setSignature] = useState('');
  const [dateSigned, setDateSigned] = useState(new Date().toISOString().split('T')[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleUseChange = (val: string) => {
    if (intendedUses.includes(val)) {
      setIntendedUses(intendedUses.filter(u => u !== val));
    } else {
      setIntendedUses([...intendedUses, val]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !signature) {
      setError('Please fill in all required fields, including your signature.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const fullMessage = `
--- BUYER APPLICATION FORM ---

1. BUYER INFORMATION
Name: ${name}
Phone: ${phone}
Email: ${email}
City/State: ${cityState}
Preferred Contact: ${preferredContact}

2. HORSE INTEREST
Horse: ${horseName || 'Not specified'}
What attracted you: ${attracted}

3. RIDING & HORSE EXPERIENCE
Years around horses: ${experienceYears}
Experience Level: ${experienceLevel}
Owned before: ${ownedBefore}
Primary Rider: ${primaryRider === 'Other' ? primaryRiderOther : primaryRider}

4. INTENDED USE
Uses: ${intendedUses.join(', ')} ${intendedUses.includes('Other') ? `(${intendedUseOther})` : ''}
Important Qualities: ${importantQualities}

5. CARE & LOCATION
Where kept: ${keptWhere}
Place prepared: ${placePrepared}
State/City where horse will be located: ${horseLocation}

6. PURCHASE & TRANSPORTATION
Receive method: ${transportMethod}
Need transport assist: ${transportAssist}
Preferred pickup/delivery location: ${pickupLocation}

7. ADDITIONAL INFORMATION
${additionalInfo}

--- ACKNOWLEDGMENT ---
Signature: ${signature}
Date: ${dateSigned}
    `.trim();

    try {
      await submitEnquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: fullMessage,
        horse_name: horseName.trim() || undefined,
        horse_id: horseId.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="max-w-3xl mb-12 lg:mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#A89472] font-medium block mb-3">
          Buyer Application & Horse Matching Protocol
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#20201E] font-normal mb-6 leading-tight">
          Buyer Application Form
        </h1>
        <div className="space-y-4 text-sm text-[#73716B] leading-relaxed font-light">
          <p>
            Before purchasing a horse from Sterling, prospective buyers are required to complete a Buyer Application Form. This form helps us understand your experience, intended use of the horse, riding goals, preferred horse type, location, and transportation needs.
          </p>
          <p>
            Once you have found a horse you are interested in purchasing, the information provided allows our team to determine whether the horse is a suitable match for your experience, expectations, and intended use. It also helps us identify any additional information or arrangements that may be needed before completing the purchase.
          </p>
          <p>
            Our goal is to help each buyer find a suitable horse and ensure that both the horse and buyer are properly prepared for the next step.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Application Form */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="bg-[#FAF9F6] border border-[#B7B0A4]/35 p-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-100">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-serif text-2xl text-[#20201E]">Application Transmitted</h3>
              <p className="text-sm text-[#73716B] leading-relaxed max-w-md mx-auto">
                Thank you for submitting your Buyer Application. Our estate director will review your details and contact you shortly regarding the next steps.
              </p>
              <button
                onClick={() => onNavigate('/horses')}
                className="mt-6 inline-block px-6 py-2 border border-[#B7B0A4] text-xs uppercase tracking-[0.1em] text-[#20201E] hover:bg-[#FAF9F6] transition-colors"
              >
                Return to Collection
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10 border-t border-[#B7B0A4]/30 pt-8">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                  {error}
                </div>
              )}

              {/* 1. Buyer Info */}
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-[#20201E] border-b border-[#B7B0A4]/20 pb-2">1. Buyer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Full Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Email Address *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">City/State</label>
                    <input type="text" value={cityState} onChange={(e) => setCityState(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Preferred Contact Method</label>
                  <div className="flex gap-4">
                    {['Phone', 'Text', 'Email'].map(method => (
                      <label key={method} className="flex items-center space-x-2 text-sm text-[#20201E]">
                        <input type="radio" name="contactMethod" value={method} onChange={(e) => setPreferredContact(e.target.value)} className="accent-[#24362D]" />
                        <span>{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Horse You Are Interested In */}
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-[#20201E] border-b border-[#B7B0A4]/20 pb-2">2. Horse You Are Interested In</h3>
                {!initialHorse && (
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Select a Horse</label>
                    <select
                      value={horseId}
                      onChange={(e) => {
                        const sel = horses.find((h) => h.id === e.target.value);
                        if (sel) {
                          setHorseId(sel.id);
                          setHorseName(sel.name);
                        } else {
                          setHorseId('');
                          setHorseName('');
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                    >
                      <option value="">-- No specific horse / General Enquiry --</option>
                      {horses.filter((h) => h.published).map((h) => (
                        <option key={h.id} value={h.id}>{h.name} ({h.breed})</option>
                      ))}
                    </select>
                  </div>
                )}
                {initialHorse && (
                  <div className="p-3 bg-[#FAF9F6] border border-[#B7B0A4]/30 text-sm">
                    <strong>Selected Horse:</strong> {horseName}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">What attracted you to this horse?</label>
                  <textarea rows={3} value={attracted} onChange={(e) => setAttracted(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                </div>
              </div>

              {/* 3. Riding & Experience */}
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-[#20201E] border-b border-[#B7B0A4]/20 pb-2">3. Riding & Horse Experience</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">How long have you been around horses?</label>
                    <div className="flex flex-col gap-2">
                      {['Less than 1 year', '1–3 years', '3–5 years', '5+ years'].map(opt => (
                        <label key={opt} className="flex items-center space-x-2 text-sm text-[#20201E]">
                          <input type="radio" name="expYears" value={opt} onChange={(e) => setExperienceYears(e.target.value)} className="accent-[#24362D]" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Your experience level:</label>
                    <div className="flex flex-col gap-2">
                      {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map(opt => (
                        <label key={opt} className="flex items-center space-x-2 text-sm text-[#20201E]">
                          <input type="radio" name="expLevel" value={opt} onChange={(e) => setExperienceLevel(e.target.value)} className="accent-[#24362D]" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Have you owned a horse before?</label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map(opt => (
                      <label key={opt} className="flex items-center space-x-2 text-sm text-[#20201E]">
                        <input type="radio" name="ownedBefore" value={opt} onChange={(e) => setOwnedBefore(e.target.value)} className="accent-[#24362D]" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Who will primarily ride the horse?</label>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                    {['Myself', 'Child', 'Family', 'Other'].map(opt => (
                      <label key={opt} className="flex items-center space-x-2 text-sm text-[#20201E]">
                        <input type="radio" name="primaryRider" value={opt} onChange={(e) => setPrimaryRider(e.target.value)} className="accent-[#24362D]" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {primaryRider === 'Other' && (
                    <input type="text" placeholder="Please specify..." value={primaryRiderOther} onChange={(e) => setPrimaryRiderOther(e.target.value)} className="mt-2 w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                  )}
                </div>
              </div>

              {/* 4. Intended Use */}
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-[#20201E] border-b border-[#B7B0A4]/20 pb-2">4. Intended Use</h3>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">What will the horse primarily be used for? (Select all that apply)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Trail Riding', 'Pleasure Riding', 'Lessons', 'Ranch/Work', 'Competition/Shows', 'Barrels/Rodeo', 'Breeding', 'Other'].map(opt => (
                      <label key={opt} className="flex items-center space-x-2 text-sm text-[#20201E]">
                        <input type="checkbox" checked={intendedUses.includes(opt)} onChange={() => handleUseChange(opt)} className="accent-[#24362D]" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {intendedUses.includes('Other') && (
                    <input type="text" placeholder="Please specify other uses..." value={intendedUseOther} onChange={(e) => setIntendedUseOther(e.target.value)} className="mt-2 w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">What qualities are most important to you in a horse?</label>
                  <textarea rows={3} value={importantQualities} onChange={(e) => setImportantQualities(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                </div>
              </div>

              {/* 5. Care & Location */}
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-[#20201E] border-b border-[#B7B0A4]/20 pb-2">5. Care & Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Where will the horse be kept?</label>
                    <div className="flex flex-col gap-2">
                      {['Private Property', 'Boarding Facility', 'Farm/Ranch', 'Other'].map(opt => (
                        <label key={opt} className="flex items-center space-x-2 text-sm text-[#20201E]">
                          <input type="radio" name="keptWhere" value={opt} onChange={(e) => setKeptWhere(e.target.value)} className="accent-[#24362D]" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Do you currently have a suitable place prepared?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => (
                        <label key={opt} className="flex items-center space-x-2 text-sm text-[#20201E]">
                          <input type="radio" name="placePrepared" value={opt} onChange={(e) => setPlacePrepared(e.target.value)} className="accent-[#24362D]" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">State/City where the horse will be located:</label>
                  <input type="text" value={horseLocation} onChange={(e) => setHorseLocation(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                </div>
              </div>

              {/* 6. Purchase & Transportation */}
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-[#20201E] border-b border-[#B7B0A4]/20 pb-2">6. Purchase & Transportation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">How do you plan to receive the horse?</label>
                    <div className="flex flex-col gap-2">
                      {['Personal Pickup', 'Professional Transportation', 'Transportation Assistance Needed'].map(opt => (
                        <label key={opt} className="flex items-center space-x-2 text-sm text-[#20201E]">
                          <input type="radio" name="transportMethod" value={opt} onChange={(e) => setTransportMethod(e.target.value)} className="accent-[#24362D]" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Do you need assistance arranging transportation?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => (
                        <label key={opt} className="flex items-center space-x-2 text-sm text-[#20201E]">
                          <input type="radio" name="transportAssist" value={opt} onChange={(e) => setTransportAssist(e.target.value)} className="accent-[#24362D]" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Preferred pickup/delivery location:</label>
                  <input type="text" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                </div>
              </div>

              {/* 7. Additional Info */}
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-[#20201E] border-b border-[#B7B0A4]/20 pb-2">7. Additional Information</h3>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Is there anything else you would like us to know?</label>
                  <textarea rows={4} value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                </div>
              </div>

              {/* Acknowledgment */}
              <div className="space-y-5 bg-[#FAF9F6] p-6 border border-[#B7B0A4]/30">
                <h3 className="font-serif text-xl text-[#20201E] border-b border-[#B7B0A4]/20 pb-2">Buyer Acknowledgment</h3>
                <p className="text-sm text-[#73716B]">
                  I confirm that the information provided above is accurate to the best of my knowledge. I understand that completing this application does not reserve or purchase a horse. Any purchase, deposit, transportation, and other arrangements will be discussed and confirmed separately.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Type Signature *</label>
                    <input type="text" required value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Type your full name as signature" className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Date *</label>
                    <input type="date" required value={dateSigned} onChange={(e) => setDateSigned(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#24362D] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1a2820] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Transmitting Application...</span>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Estate Contact Details & Visiting Policy */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#FAF9F6] border border-[#B7B0A4]/35 p-8 space-y-6">
            <h3 className="font-serif text-2xl text-[#20201E]">Estate Concierge</h3>
            
            <div className="space-y-4 text-xs text-[#73716B]">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#A89472] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-[#20201E]">Address</span>
                  <span>{settings.address}, {settings.country}</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-[#A89472] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-[#20201E]">Direct Telephone</span>
                  <span>{settings.phone}</span>
                </div>
              </div>
              {settings.whatsapp && (
                <div className="flex items-start space-x-3">
                  <span className="text-[#A89472] text-[10px] uppercase font-bold tracking-wider shrink-0 w-4 inline-block text-center mt-1">WA</span>
                  <div>
                    <span className="block font-medium text-[#20201E]">WhatsApp</span>
                    <span>{settings.whatsapp}</span>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-[#A89472] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-[#20201E]">Email Dispatch</span>
                  <span>{settings.email}</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-[#A89472] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-[#20201E]">Visiting Policy</span>
                  <p className="mt-0.5 leading-relaxed">{settings.visiting_hours}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quiet Note on Private Viewings */}
          <div className="p-6 bg-white border border-[#B7B0A4]/30 space-y-3">
            <h4 className="font-serif text-lg text-[#20201E]">Private Viewing Protocol</h4>
            <p className="text-xs text-[#73716B] leading-relaxed font-light">
              To maintain a calm and comfortable environment for our horses, Sterling operates strictly by confirmed private appointment. All visitors are asked to schedule their viewing in advance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
