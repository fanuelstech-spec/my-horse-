const fs = require('fs');

// 1. Update estateContext.tsx
let contextCode = fs.readFileSync('src/lib/estateContext.tsx', 'utf-8');

const newTestimonialMethods = `  const addTestimonial = useCallback(async (data: Omit<SuccessStory, 'id' | 'created_at' | 'updated_at'>) => {
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
        const { error } = await supabase.from('testimonials').insert(newTestimonial);
        if (error) throw error;
      } catch (e: any) {
        console.error('Supabase testimonial insert failed:', e);
        throw new Error(\`Supabase error saving testimonial: \${e.message || 'Database error'}. Ensure table "public.testimonials" exists.\`);
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
        const { error } = await supabase.from('testimonials').update(updatedTestimonial).eq('id', id);
        if (error) throw error;
      } catch (e: any) {
        console.error('Supabase testimonial update failed:', e);
        throw new Error(\`Supabase error updating testimonial: \${e.message || 'Database error'}.\`);
      }
    }
    return updatedTestimonial;
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
      } catch (e: any) {
        console.error('Supabase testimonial delete failed:', e);
        throw new Error(\`Supabase error deleting testimonial: \${e.message || 'Database error'}.\`);
      }
    }
  }, []);`;

// Replace old testimonial methods
const oldMethodsRegex = /const addTestimonial = useCallback[\s\S]*?  const deleteTestimonial = useCallback[\s\S]*?\},\s*\[\]\s*\);/m;
if (oldMethodsRegex.test(contextCode)) {
  contextCode = contextCode.replace(oldMethodsRegex, newTestimonialMethods);
  fs.writeFileSync('src/lib/estateContext.tsx', contextCode);
  console.log('Successfully updated estateContext.tsx');
} else {
  console.log('Could not match testimonial methods regex in estateContext.tsx');
}

// 2. Update FULL_SETUP.sql
let setupCode = fs.readFileSync('supabase/FULL_SETUP.sql', 'utf-8');
if (!setupCode.includes('public.testimonials')) {
  setupCode += `

-- Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_name TEXT NOT NULL,
    horse_name TEXT NOT NULL,
    location TEXT,
    testimonial TEXT NOT NULL,
    image_url TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials_read_public" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "testimonials_write_auth" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
`;
  fs.writeFileSync('supabase/FULL_SETUP.sql', setupCode);
  console.log('Successfully updated FULL_SETUP.sql');
}
