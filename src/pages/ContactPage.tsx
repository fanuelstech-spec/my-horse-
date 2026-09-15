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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(
    initialSubject || (initialHorse ? `Enquiry regarding ${initialHorse}` : 'General Private Enquiry')
  );
  const [horseName, setHorseName] = useState(initialHorse || '');
  const [horseId, setHorseId] = useState(initialHorseId || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialHorse) {
      setHorseName(initialHorse);
      setSubject(`Private Viewing Enquiry: ${initialHorse}`);
    }
    if (initialHorseId) {
      setHorseId(initialHorseId);
    }
  }, [initialHorse, initialHorseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please provide your name, email address, and a message.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitEnquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
        horse_name: horseName.trim() || undefined,
        horse_id: horseId.trim() || undefined,
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-16 sm:space-y-20">
      {/* Header */}
      <section className="max-w-3xl space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
          Confidential Concierge
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#20201E] font-normal leading-tight">
          Private Enquiries & Viewings
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#73716B] leading-relaxed font-light">
          We welcome confidential inquiries regarding available competition horses, breeding consultations, or approved sanctuary adoptions.
        </p>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Contact Form or Success State */}
        <div className="lg:col-span-7 bg-white border border-[#B7B0A4]/35 p-8 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-5 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-[#24362D]/10 text-[#24362D] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-3xl text-[#20201E]">Message Received</h2>
              <p className="text-sm text-[#73716B] max-w-md mx-auto leading-relaxed font-light">
                Thank you for your correspondence. The estate director reviews all communications personally and will respond via your preferred contact channel within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-6 py-2.5 bg-[#FAF9F6] border border-[#B7B0A4]/40 text-xs uppercase tracking-wider text-[#20201E] hover:bg-white"
                >
                  Send Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-serif text-2xl text-[#20201E] border-b border-[#B7B0A4]/25 pb-3">
                Send an Enquiry
              </h2>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              {/* Horse Reference if selected */}
              {horseName && (
                <div className="p-3.5 bg-[#FAF9F6] border border-[#A89472]/40 text-xs text-[#20201E] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#73716B] block">
                      Referenced Horse
                    </span>
                    <span className="font-serif text-base font-medium">{horseName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHorseName('');
                      setHorseId('');
                    }}
                    className="text-[11px] text-[#73716B] hover:text-[#20201E] underline"
                  >
                    Clear Reference
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lady Eleanor Vance"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. vance@estate.co.uk"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                    Telephone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 2 31 00 00 00"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Private Viewing Request"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                  />
                </div>
              </div>

              {/* Horse Selector dropdown if not prefilled */}
              {!horseName && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                    Inquire About a Specific Horse (Optional)
                  </label>
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
                    {horses
                      .filter((h) => h.published)
                      .map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.breed} · {h.discipline} · {h.status})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                  Message & Specific Requirements *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please state your equestrian experience, competition goals, desired viewing dates, or questions..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#24362D] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1a2820] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Transmitting Enquiry...</span>
                ) : (
                  <>
                    <span>Transmit Private Enquiry</span>
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
              To preserve the tranquil atmosphere of our broodmare herds and rehabilitation sanctuary, Montrose operates strictly by confirmed private appointment. We provide chauffeured transfers from Deauville-Normandie Airport (DOL) upon request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
