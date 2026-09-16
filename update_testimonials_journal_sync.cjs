const fs = require('fs');
let contextCode = fs.readFileSync('src/lib/estateContext.tsx', 'utf-8');

// Update fetchFromSupabase to separate journal posts and testimonials from journal_posts table
// Replace the Promise.all section and processing
const oldFetchPart = `        const [horsesRes, rescuesRes, journalRes, settingsRes, testimonialsRes] = await Promise.all([
          supabase.from('horses').select('*, images:horse_images(*)').order('created_at', { ascending: false }),
          supabase.from('rescues').select('*, images:rescue_images(*), story_sections:rescue_story_sections(*)').order('created_at', { ascending: false }),
          supabase.from('journal_posts').select('*').order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*').eq('id', 'estate_settings').maybeSingle(),
          supabase.from('testimonials').select('*').order('created_at', { ascending: false }).catch(() => ({ data: null })),
        ]);

        if (horsesRes.data && horsesRes.data.length > 0) {
          setHorses(horsesRes.data);
        }
        if (rescuesRes.data && rescuesRes.data.length > 0) {
          setRescues(rescuesRes.data);
        }
        if (journalRes.data && journalRes.data.length > 0) {
          setJournal(journalRes.data);
        }
        if (settingsRes.data) {
          setSettings(settingsRes.data);
        }
        if (testimonialsRes && testimonialsRes.data && testimonialsRes.data.length > 0) {
          setTestimonials(testimonialsRes.data);
        }`;

const newFetchPart = `        const [horsesRes, rescuesRes, journalRes, settingsRes] = await Promise.all([
          supabase.from('horses').select('*, images:horse_images(*)').order('created_at', { ascending: false }),
          supabase.from('rescues').select('*, images:rescue_images(*), story_sections:rescue_story_sections(*)').order('created_at', { ascending: false }),
          supabase.from('journal_posts').select('*').order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*').eq('id', 'estate_settings').maybeSingle(),
        ]);

        if (horsesRes.data && horsesRes.data.length > 0) {
          setHorses(horsesRes.data);
        }
        if (rescuesRes.data && rescuesRes.data.length > 0) {
          setRescues(rescuesRes.data);
        }
        if (journalRes.data && journalRes.data.length > 0) {
          const allPosts = journalRes.data;
          const regularPosts = allPosts.filter((p: any) => p.category !== 'Testimonial');
          const testimonialPosts = allPosts.filter((p: any) => p.category === 'Testimonial');

          setJournal(regularPosts);

          if (testimonialPosts.length > 0) {
            const parsedTestimonials: SuccessStory[] = testimonialPosts.map((p: any) => {
              let details = { horse_name: p.excerpt || 'Horse', location: '', testimonial: p.content, image_url: p.featured_image };
              try {
                const parsed = JSON.parse(p.content);
                if (parsed && parsed.testimonial) {
                  details = parsed;
                }
              } catch {}
              return {
                id: p.id,
                buyer_name: p.title,
                horse_name: details.horse_name || 'Horse',
                location: details.location || null,
                testimonial: details.testimonial || p.content,
                image_url: details.image_url || p.featured_image || null,
                published: p.published,
                created_at: p.created_at,
                updated_at: p.updated_at,
              };
            });
            setTestimonials(parsedTestimonials);
          }
        }
        if (settingsRes.data) {
          setSettings(settingsRes.data);
        }`;

if (contextCode.includes(oldFetchPart)) {
  contextCode = contextCode.replace(oldFetchPart, newFetchPart);
  console.log('Successfully updated fetchFromSupabase');
} else {
  console.log('Could not match oldFetchPart');
}

// Update testimonial methods (addTestimonial, updateTestimonial, deleteTestimonial) to sync via journal_posts with category = 'Testimonial'
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
        const postPayload = {
          id: newTestimonial.id,
          title: newTestimonial.buyer_name,
          slug: \`testimonial-\${newTestimonial.id}\`,
          excerpt: newTestimonial.location || newTestimonial.horse_name,
          content: JSON.stringify({
            horse_name: newTestimonial.horse_name,
            location: newTestimonial.location,
            testimonial: newTestimonial.testimonial,
            image_url: newTestimonial.image_url,
          }),
          category: 'Testimonial',
          featured_image: newTestimonial.image_url || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=85',
          author: newTestimonial.buyer_name,
          published: newTestimonial.published,
          published_at: newTestimonial.created_at,
          seo_title: \`\${newTestimonial.buyer_name} Testimonial\`,
          seo_description: newTestimonial.testimonial.substring(0, 150),
          featured: false,
          created_at: newTestimonial.created_at,
          updated_at: newTestimonial.updated_at,
        };
        await supabase.from('journal_posts').insert(postPayload);
      } catch (e) {
        console.warn('Supabase testimonial sync skipped:', e);
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
        const postPayload = {
          title: updatedTestimonial.buyer_name,
          slug: \`testimonial-\${updatedTestimonial.id}\`,
          excerpt: updatedTestimonial.location || updatedTestimonial.horse_name,
          content: JSON.stringify({
            horse_name: updatedTestimonial.horse_name,
            location: updatedTestimonial.location,
            testimonial: updatedTestimonial.testimonial,
            image_url: updatedTestimonial.image_url,
          }),
          category: 'Testimonial',
          featured_image: updatedTestimonial.image_url || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=85',
          author: updatedTestimonial.buyer_name,
          published: updatedTestimonial.published,
          updated_at: updatedTestimonial.updated_at,
        };
        await supabase.from('journal_posts').update(postPayload).eq('id', id);
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
        await supabase.from('journal_posts').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase testimonial delete sync skipped:', e);
      }
    }
  }, []);`;

const oldMethodsRegex = /const addTestimonial = useCallback[\s\S]*?  const deleteTestimonial = useCallback[\s\S]*?\},\s*\[\]\s*\);/m;
if (oldMethodsRegex.test(contextCode)) {
  contextCode = contextCode.replace(oldMethodsRegex, newTestimonialMethods);
  fs.writeFileSync('src/lib/estateContext.tsx', contextCode);
  console.log('Successfully updated testimonial methods to use journal_posts');
} else {
  console.log('Could not match testimonial methods regex');
}
