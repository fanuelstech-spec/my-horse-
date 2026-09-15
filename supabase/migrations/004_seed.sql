-- =====================================================================
-- 004_seed.sql
-- Montrose Equestrian Estate - Realistic Fictional Seed Data
-- =====================================================================

-- 1. Site Settings
INSERT INTO public.site_settings (
  id, business_name, tagline, logo_url, email, phone, whatsapp,
  address, country, visiting_hours, instagram_url, facebook_url, youtube_url,
  about_text, footer_text
) VALUES (
  'estate_settings',
  'Montrose Equestrian Estate',
  'Exceptional Horses. Thoughtfully Bred.',
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80',
  'concierge@montrose-equestrian.com',
  '+33 2 31 88 42 10',
  '+33 6 45 20 19 88',
  'Route du Haras 14, 14800 Deauville',
  'France',
  'Monday – Saturday: 09:00 to 18:00 (By Private Appointment)',
  'https://instagram.com/montrose.equestrian',
  'https://facebook.com/montrose.equestrian',
  'https://youtube.com/@montroseeffort',
  'Founded on the principle of respectful horsemanship and generational lineage, Montrose operates across 180 hectares of protected pasture in the Pays d''Auge. We combine classical training with state-of-the-art veterinary care and biomechanics to produce Warmbloods capable of competing at the highest international levels, while remaining calm, sound, and noble in disposition.',
  'Breeding exceptional horses with patience, purpose and respect.'
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 2. Horses
INSERT INTO public.horses (
  id, name, slug, breed, registration_number, sex, date_of_birth, age, height, color, discipline, training_level,
  sire, dam, grand_sire_paternal, grand_dam_paternal, grand_sire_maternal, grand_dam_maternal,
  location, price, currency, status, short_description, description, personality, training, competition_history, bloodline, suitability, featured, published
) VALUES 
(
  'e2d3f4a1-1111-4444-9999-000000000001',
  'Artemis',
  'artemis',
  'KWPN Dutch Warmblood',
  'KWPN-2018-0941',
  'Mare',
  '2018-04-12',
  8,
  '16.3 hh (170 cm)',
  'Dark Bay',
  'Dressage',
  'Prix St. Georges / Inter I Preparation',
  'Vivaldi',
  'Zara van Montrose',
  'Krack C',
  'Renate-Utopia',
  'Gribaldi',
  'Odessa',
  'Normandy Main Barn',
  145000,
  'EUR',
  'Available',
  'A mare of singular poise and natural cadence, demonstrating effortless lateral work and exceptional elasticity through the back.',
  'Artemis represents the absolute pinnacle of our breeding vision. Sired by the renowned Dutch sire Vivaldi out of our keur dam Zara, she inherits an unshakeable work ethic paired with natural collection and rhythm. Her walk is clean and sweeping with significant overtrack, her trot possesses genuine uphill suspension, and her canter is exceptionally balanced.\n\nUnder saddle, Artemis proves both sensitive to the aids and extraordinarily generous. She learns new movements with poise, never rushing or showing resistance. Her radiographs and clinical veterinary examinations are immaculate, documented comprehensively by the Deauville Equine Clinic.',
  'Intelligent, poised, and deeply affectionate in the stable. She bonds closely with her handler and approaches training with quiet enthusiasm.',
  'Solidified in all Prix St. Georges movements: confirmed flying changes through every two strides, half-passes at trot and canter with fluid rhythm, and beginning development toward piaffe/passage transitions.',
  'Competed successfully in regional Young Horse championships as a 5 and 6-year-old with consistent marks above 78%.',
  'Vivaldi x Gribaldi foundation, consolidating superior biomechanics, trainable character, and classical European elegance.',
  'Ideal for an ambitious amateur looking for a Grand Prix partner or a professional rider seeking a top-tier international prospect.',
  true,
  true
),
(
  'e2d3f4a1-2222-4444-9999-000000000002',
  'Valentino',
  'valentino',
  'Hanoverian',
  'HAN-2019-1428',
  'Stallion',
  '2019-05-20',
  7,
  '17.0 hh (173 cm)',
  'Chestnut with Flaxen Highlights',
  'Dressage',
  'Medium / Advanced Medium',
  'Vitalis',
  'Florencia M',
  'Vivaldi',
  'Tolivia',
  'Florencio I',
  'Donna Clara',
  'Normandy Stallion Yard',
  180000,
  'EUR',
  'Available',
  'An imposing licensed stallion with boundless uphill expression, exceptional hindleg engagement, and a gentle, gentlemanly demeanor.',
  'Valentino is a licensed Hanoverian stallion whose presence commands immediate attention in the arena. His mechanics are characterized by tremendous shoulder freedom and active, spring-like hocks. Despite his physical power and expressive movement, he possesses an exemplary temperament, hackable on the buckle and calm around mares in all settings.\n\nHe has completed his performance testing with high marks for rideability (9.0) and temperament (9.5). He shows tremendous potential for the highest levels of the sport while also proving to be an exceptional breeding prospect.',
  'Exemplary stallion manners. Honest, calm under pressure, and always attentive to the rider.',
  'Confirmed in shoulder-in, travers, half-pass, simple changes, and working clean single flying changes. Naturally balanced canter pirouette beginnings.',
  'Winner of the Normandy 6-Year-Old Dressage Showcase with scores exceeding 81%.',
  'Vitalis x Florencio I x Donnerhall lineage representing proven German dressage dynasties.',
  'Suitable for high-performance international dressage or as a foundation sire for a refined breeding program.',
  true,
  true
),
(
  'e2d3f4a1-3333-4444-9999-000000000003',
  'Eleanor',
  'eleanor',
  'Oldenburg',
  'OLD-2020-0382',
  'Filly',
  '2020-03-15',
  6,
  '16.1 hh (165 cm)',
  'Black / Raven',
  'Dressage / Breeding',
  'Elementary / Novice',
  'Secret',
  'Belle Epoque',
  'Sezuan',
  'Seline',
  'Belissimo M',
  'Caprice',
  'Normandy Main Barn',
  95000,
  'EUR',
  'Reserved',
  'A striking black filly with classical proportions, refined bone, and light-footed, rhythmic ground-covering strides.',
  'Eleanor represents modern Oldenburg breeding at its most refined. With a pitch-black coat and noble feminine head, she turns heads wherever she walks. Her uphill balance is natural and relaxed, making her a pleasure to train even in early development phases.',
  'Cooperative, gentle, and quiet. Extremely well-mannered for shoeing, clipping, and transport.',
  'Solid walk-trot-canter fundamentals, steady contact in snaffle, starting leg-yields and transitions within the gaits.',
  'Lightly shown in young horse classes with first-place ribbons.',
  'Secret x Belissimo M. Exceptional rhythm and temperament.',
  'Fabulous future mount for a skilled rider or a cornerstone broodmare for a boutique stud.',
  false,
  true
),
(
  'e2d3f4a1-4444-4444-9999-000000000004',
  'Montrose Atlas',
  'montrose-atlas',
  'Trakehner',
  'TRAK-2017-8821',
  'Gelding',
  '2017-06-02',
  9,
  '16.2 hh (168 cm)',
  'Dapple Grey',
  'All-Round / Hunter / Dressage',
  'Advanced Medium',
  'Millennium',
  'Aura de Montrose',
  'Easy Game',
  'Merle',
  'Caprimond',
  'Astoria',
  'Normandy Guest Barn',
  110000,
  'EUR',
  'Available',
  'A noble grey gelding possessing the classic Trakehner nobility, exceptional ground manners, and light feather-soft contact.',
  'Montrose Atlas has been brought along with exemplary patience in our classical system. His movement is floaty, light on the ground, and wonderfully comfortable to sit. He has also been schooled over small natural fences and enjoys trail riding through the Normandy countryside.',
  'Patient, curious, and deeply trustworthy. An old soul with great wisdom.',
  'Solid flying changes, established lateral work, quiet jumping style with excellent technique.',
  'Successful in regional dressage and working equitation competitions.',
  'Millennium x Caprimond, embodying pure Trakehner nobility and stamina.',
  'The ultimate gentleman’s or lady’s horse for competition and peaceful hacking.',
  true,
  true
);

-- 3. Horse Images
INSERT INTO public.horse_images (horse_id, url, caption, display_order, is_cover) VALUES
('e2d3f4a1-1111-4444-9999-000000000001', 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=85', 'Artemis in liberty, Normandy pastures', 1, true),
('e2d3f4a1-1111-4444-9999-000000000001', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=85', 'Cadence and collection under saddle', 2, false),
('e2d3f4a1-1111-4444-9999-000000000001', 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=1600&q=85', 'Profile view displaying refined head and throatlatch', 3, false),

('e2d3f4a1-2222-4444-9999-000000000002', 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=1600&q=85', 'Valentino during morning training at the Grand Arena', 1, true),
('e2d3f4a1-2222-4444-9999-000000000002', 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1600&q=85', 'Uphill trot extension', 2, false),

('e2d3f4a1-3333-4444-9999-000000000003', 'https://images.unsplash.com/photo-1566251037378-5e04e3bec343?auto=format&fit=crop&w=1600&q=85', 'Eleanor in the tranquil estate paddocks', 1, true),

('e2d3f4a1-4444-4444-9999-000000000004', 'https://images.unsplash.com/photo-1509205477838-a534e43a849f?auto=format&fit=crop&w=1600&q=85', 'Montrose Atlas in the courtyard', 1, true);

-- 4. Rescue Cases
INSERT INTO public.rescues (
  id, name, slug, rescue_date, status, short_description, story, rehabilitation, current_status, location, featured, published
) VALUES 
(
  'c1b2a3d4-1111-4444-8888-000000000001',
  'Hope',
  'hope',
  '2022-10-14',
  'Sanctuary',
  'A French Trotter mare surrendered from neglect, rehabilitated over two years into our gentlest therapy and companion mare.',
  'Hope arrived at Montrose on an overcast morning in October 2022, severely underweight, dehydrated, and deeply fearful of human contact. She had spent five years in substandard housing without veterinary care or appropriate forage. Through patient, quiet presence and custom nutrition designed by equine gastroenterologists, she slowly shed her fear and rediscovered the joy of companionship.',
  'Months of specialized ulcer treatment, tailored physiotherapy, corrective barefoot trimming, and hundreds of gentle hours of positive reinforcement training.',
  'Hope now lives peacefully in our senior herd, enjoying daily grass turnout, apple treats, and visits from visiting apprentice grooms who learn gentleness from her.',
  'Montrose Sanctuary Pastures, Normandy',
  true,
  true
),
(
  'c1b2a3d4-2222-4444-8888-000000000002',
  'Rowan',
  'rowan',
  '2023-06-01',
  'Looking for a Home',
  'A young Warmblood cross who suffered an early fracture, now fully sound and seeking a devoted forever home for light pleasure and groundwork.',
  'Rowan was destined for an uncertain fate after suffering a severe pasture injury as a yearling that his previous owners could not afford to treat. Our estate veterinary team performed non-invasive rehabilitation, hydrotherapy, and stem-cell support over fourteen months. Today, he trots soundly, plays freely in the paddock, and possesses the most affectionate character on the estate.',
  'Controlled stall rest with medical vibration therapy, graduated hand-walking, and targeted strengthening of the stifle ligaments.',
  'Fully rehabilitated and sound for flatwork, long-reining, trail riding, and loving companionship.',
  'Montrose Rehab Barn, Normandy',
  true,
  true
);

-- 5. Rescue Images
INSERT INTO public.rescue_images (rescue_id, url, caption, display_order, is_cover) VALUES
('c1b2a3d4-1111-4444-8888-000000000001', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1600&q=85', 'Hope grazing peacefully under the Normandy apple orchards', 1, true),
('c1b2a3d4-2222-4444-8888-000000000002', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=85', 'Rowan enjoying liberty work in the outdoor arena', 1, true);

-- 6. Rescue Story Timeline Sections
INSERT INTO public.rescue_story_sections (rescue_id, title, content, date_label, display_order) VALUES
('c1b2a3d4-1111-4444-8888-000000000001', 'Arrival', 'Transported in an emergency trailer, Hope stepped onto Montrose soil with eyes wide with anxiety and a body condition score of 1.5 out of 9.', 'October 2022', 1),
('c1b2a3d4-1111-4444-8888-000000000001', 'Recovery', 'Under constant veterinary monitoring, a slow re-feeding protocol was implemented alongside daily grooming rituals to rebuild trust.', 'Winter 2022 – Spring 2023', 2),
('c1b2a3d4-1111-4444-8888-000000000001', 'Training & Connection', 'She began ground obstacle work and gentle liberty play, learning that a human hand carries kindness and security.', 'Summer 2023', 3),
('c1b2a3d4-1111-4444-8888-000000000001', 'Permanent Sanctuary', 'Hope was welcomed into our permanent sanctuary program, where she will spend the rest of her days protected and cherished.', 'Present Day', 4);

-- 7. Journal Posts
INSERT INTO public.journal_posts (
  id, title, slug, excerpt, content, category, featured_image, author, published, published_at, seo_title, seo_description, featured
) VALUES
(
  'a1b2c3d4-1111-4444-7777-000000000001',
  'On the Philosophy of Generational Breeding',
  'philosophy-of-generational-breeding',
  'True horsemanship does not rush. An exploration into our criteria for selecting broodmares that unite sovereign temperament with athletic elasticity.',
  '# On the Philosophy of Generational Breeding\n\nIn an age dominated by immediate gratification and quick commercial turnover, the breeding of classical sport horses demands an almost forgotten virtue: **patience**.\n\nA great horse is never an accident of fortune. It is the culmination of generations of disciplined observation, an intimate understanding of equine biomechanics, and, above all, an unyielding respect for the mare family.\n\n### The Sacred Role of the Dam Line\n\nWhile stallion brochures command the highest fees and the brightest headlines, seasoned breeders understand that more than sixty percent of a foal’s character, courage, and constitutional durability descends through the motherline.\n\nAt Montrose, we do not breed from mares who merely possess famous paperwork. A candidate for our broodmare band must satisfy three non-negotiable standards:\n\n1. **A Calm, Sovereign Nervous System:** A high-performance horse must possess fire under saddle, yet remain peaceful and rational in the stall.\n2. **Soundness of Bone and Hoof:** We breed for longevity. A horse that cannot stay sound through fifteen years of training represents a flaw in breeding judgment.\n3. **Natural Elasticity in the Walk:** The four-beat purity of the walk reveals the true tension or freedom of the equine spine.\n\n> "To breed a horse is to make a promise to the animal for its entire lifetime. We are responsible not merely for the foal in the paddock, but for the partner it becomes twenty years hence."\n\n### Modern Science in Harmony with Nature\n\nWhile our philosophy remains rooted in 18th-century French classical traditions, our veterinary protocols embrace the frontier of modern sports medicine. Advanced gait analysis, custom nutritional profiling based on soil minerality in the Pays d''Auge, and early natural socialization form the bedrock of each foal''s upbringing.\n\nOur horses grow up in large, undulating herds. They navigate slopes, negotiate social hierarchies with older mares, and develop cardiovascular depth naturally before ever seeing a saddle.\n\nThis is breeding with purpose.',
  'Breeding',
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=85',
  'Henri de Montrose',
  true,
  now() - interval '14 days',
  'The Philosophy of Generational Breeding | Montrose Equestrian',
  'Discover how Montrose breeds world-class Warmbloods with focus on temperament, biomechanics, and centuries of European heritage.',
  true
),
(
  'a1b2c3d4-2222-4444-7777-000000000002',
  'Developing the Young Horse: The Art of Unhurried Cadence',
  'developing-the-young-horse-unhurried-cadence',
  'Why the first twelve months under saddle determine the athletic longevity of the modern dressage partner.',
  '# The Art of Unhurried Cadence\n\nThere is no shortcut to correct collection. The physical structure of a 4-year-old horse is still ossifying, with the cervical vertebrae and sacroiliac joint among the last skeletal structures to fully mature.\n\nAt Montrose, our youngsters spend their fourth year primarily learning forward desire, straightness, and light acceptance of the bit through hacking, cavaletti work, and light lunging in long lines.\n\n### The German Scale of Training: Re-examined\n\n1. **Takt (Rhythm)**: Without steady, undisturbed rhythm, true relaxation is impossible.\n2. **Losgelassenheit (Suppleness)**: Both mental and physical letting-go.\n3. **Anlehnung (Contact)**: A trusting invitation into the rider’s quietly listening hands.\n\nWhen these three foundation stones are built without force, the horse offers collection as a natural consequence of strength, rather than as a posture of submission.',
  'Training',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=85',
  'Claire Laurent (Head Trainer)',
  true,
  now() - interval '28 days',
  'Developing the Young Horse | Montrose Equestrian Journal',
  'A masterclass on training young dressage horses with patience, biomechanics, and longevity.',
  false
),
(
  'a1b2c3d4-3333-4444-7777-000000000003',
  'Sanctuary and Sport: The Two Pillars of Montrose',
  'sanctuary-and-sport-two-pillars',
  'How our rehabilitation program for vulnerable horses enriches the emotional culture of our entire competition barn.',
  '# Sanctuary and Sport\n\nMany in the equestrian industry see competitive sport breeding and equine rescue as polar opposites. At Montrose, we believe they are essential mirrors of one another.\n\nThe same acute sensitivity required to pilot an international Grand Prix test is born from understanding the fragile psychology of a rescued horse.\n\nWhen our young riders and grooms spend their mornings tending to rescue horses like Hope and Rowan, they learn an indispensable truth: horses do not exist to serve human ambition. They are partners granted into our stewardship.\n\nEvery sale from our breeding barn directly funds our 40-hectare sanctuary wing, ensuring that our commitment to equine welfare is woven into every stride we take.',
  'Rescue',
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1600&q=85',
  'Henri de Montrose',
  true,
  now() - interval '45 days',
  'Sanctuary & Sport | Montrose Equestrian Journal',
  'Why equine rescue and high-level breeding belong side-by-side in modern horsemanship.',
  false
);

-- 8. Sample Contact Enquiry
INSERT INTO public.contact_messages (
  name, email, phone, subject, message, horse_name, status, created_at
) VALUES (
  'Baroness Beatrice von Linden',
  'beatrice.linden@vienna-equine.at',
  '+43 664 123 4567',
  'Private Viewing Request for Artemis',
  'Dear Montrose Estate Concierge, I have been following the development of your Vivaldi lines with great admiration. I would like to arrange a private viewing of Artemis next month, including veterinary inspection with our private team. We look forward to hearing from you.',
  'Artemis',
  'new',
  now() - interval '2 hours'
);
