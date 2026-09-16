const fs = require('fs');
let code = fs.readFileSync('src/lib/estateContext.tsx', 'utf-8');

// 1. Add testimonials to EstateContextType
code = code.replace(
  'journal: JournalPost[];',
  'journal: JournalPost[];\n  testimonials: SuccessStory[];'
);

code = code.replace(
  'updateJournalPost: (id: string, updates: Partial<JournalPost>) => Promise<JournalPost>;',
  'updateJournalPost: (id: string, updates: Partial<JournalPost>) => Promise<JournalPost>;\n  addTestimonial: (t: Omit<SuccessStory, \'id\' | \'created_at\' | \'updated_at\'>) => Promise<SuccessStory>;\n  updateTestimonial: (id: string, updates: Partial<SuccessStory>) => Promise<SuccessStory>;\n  deleteTestimonial: (id: string) => Promise<void>;'
);

// 2. Add state
code = code.replace(
  'const [journal, setJournal] = useState<JournalPost[]>(() => {',
  `const [testimonials, setTestimonials] = useState<SuccessStory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TESTIMONIALS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse local storage:', e);
    }
    return [
      {
        id: '1',
        buyer_name: 'Sarah M.',
        horse_name: 'Dakota',
        location: 'Colorado',
        testimonial: "We had been looking for a safe, dependable trail horse for our family for over six months. Sterling took the time to understand exactly what we needed and matched us with a wonderful gelding. The process was completely transparent, and they helped coordinate shipping all the way to our ranch. We couldn't be happier.",
        image_url: '/images/hero.jpg',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        buyer_name: 'David T.',
        horse_name: 'Blue',
        location: 'Texas',
        testimonial: "As a professional trainer, I appreciate honest representation above all else. The horse I purchased through Sterling was exactly as described—sound, sane, and ready to work. Their communication throughout the entire transaction was excellent. Highly recommend working with them.",
        image_url: '/images/about.jpg',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  });

  const [journal, setJournal] = useState<JournalPost[]>(() => {`
);

// 3. Add effect to save to localstorage
code = code.replace(
  'useEffect(() => {\n    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(journal));\n  }, [journal]);',
  'useEffect(() => {\n    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(journal));\n  }, [journal]);\n\n  useEffect(() => {\n    localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(testimonials));\n  }, [testimonials]);'
);

// 4. Add methods
code = code.replace(
  'const uploadImage =',
  `const addTestimonial = useCallback(async (data: Omit<SuccessStory, 'id' | 'created_at' | 'updated_at'>) => {
    const newTestimonial: SuccessStory = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTestimonials(prev => [newTestimonial, ...prev]);
    return newTestimonial;
  }, []);

  const updateTestimonial = useCallback(async (id: string, updates: Partial<SuccessStory>) => {
    let updatedTestimonial: SuccessStory | null = null;
    setTestimonials(prev => prev.map(t => {
      if (t.id === id) {
        updatedTestimonial = { ...t, ...updates, updated_at: new Date().toISOString() };
        return updatedTestimonial;
      }
      return t;
    }));
    if (!updatedTestimonial) throw new Error('Testimonial not found');
    return updatedTestimonial;
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  }, []);

  const uploadImage =`
);

// 5. Add to return value
code = code.replace(
  'journal,\n    messages,',
  'journal,\n    testimonials,\n    messages,'
);
code = code.replace(
  'deleteJournalPost,\n    submitEnquiry,',
  'deleteJournalPost,\n    addTestimonial,\n    updateTestimonial,\n    deleteTestimonial,\n    submitEnquiry,'
);

fs.writeFileSync('src/lib/estateContext.tsx', code);
