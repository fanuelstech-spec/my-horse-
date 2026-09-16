const fs = require('fs');
let contextCode = fs.readFileSync('src/lib/estateContext.tsx', 'utf-8');

const gracefulMethods = `  const addTestimonial = useCallback(async (data: Omit<SuccessStory, 'id' | 'created_at' | 'updated_at'>) => {
    const id = generateUUID();
    const now = new Date().toISOString();
    const newTestimonial: SuccessStory = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
    };
    setTestimonials(prev => [newTestimonial, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('testimonials').insert(newTestimonial);
      } catch (e) {
        console.warn('Supabase testimonial sync skipped (using local persistence):', e);
      }
    }
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

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('testimonials').update(updatedTestimonial).eq('id', id);
      } catch (e) {
        console.warn('Supabase testimonial update sync skipped:', e);
      }
    }
    return updatedTestimonial;
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase testimonial delete sync skipped:', e);
      }
    }
  }, []);`;

const oldMethodsRegex = /const addTestimonial = useCallback[\s\S]*?  const deleteTestimonial = useCallback[\s\S]*?\},\s*\[\]\s*\);/m;
if (oldMethodsRegex.test(contextCode)) {
  contextCode = contextCode.replace(oldMethodsRegex, gracefulMethods);
  fs.writeFileSync('src/lib/estateContext.tsx', contextCode);
  console.log('Successfully updated estateContext.tsx with graceful persistence');
} else {
  console.log('Could not match testimonial methods regex');
}
