const fs = require('fs');
let code = fs.readFileSync('src/lib/estateContext.tsx', 'utf-8');

// 1. Add methods to EstateContextType
code = code.replace('// Contact / Enquiry Actions', `// Testimonials
  addTestimonial: (data: Omit<SuccessStory, 'id' | 'created_at' | 'updated_at'>) => Promise<SuccessStory>;
  updateTestimonial: (id: string, updates: Partial<SuccessStory>) => Promise<SuccessStory>;
  deleteTestimonial: (id: string) => Promise<void>;

  // Contact / Enquiry Actions`);

// 2. Add properties to Provider value
code = code.replace(`        journal,
        messages,`, `        journal,
        testimonials,
        messages,`);

code = code.replace(`        deleteJournalPost,
        getJournalPostBySlug,`, `        deleteJournalPost,
        getJournalPostBySlug,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,`);

fs.writeFileSync('src/lib/estateContext.tsx', code);
