# Montrose Equestrian Estate (Haras Privé & Sanctuaire d'Excellence)

A luxury equestrian estate web application for a premier European private horse breeder and rehabilitation sanctuary located in Normandy, France.

Designed with restraint, elegance, and typography inspired by private European estates (Cormorant Garamond display paired with DM Sans), this application provides both an editorial public experience and an administrative suite.

---

## 1. Feature Architecture

### Public Experience
* **The Estate & Heritage (`/about`)**: Architectural history, breeding philosophy (temperament, biomechanics, longevity), estate facilities (indoor arena, grass derby, paddocks, equine hydrotherapy, veterinary bay).
* **Available Sport Horses (`/horses`)**: Filter by status (*Available*, *Reserved*, *Sold*), discipline (*Dressage*, *Showjumping*, *Eventing*), sex, and search query.
* **Horse Dossier (`/horses/:slug`)**: High-resolution gallery with fullscreen lightbox, full physical specifications, interactive 3-generation pedigree lineage tree, competition records, and direct confidential inquiry trigger.
* **Sanctuary & Rescue Program (`/rescue`)**: Stories of equine rehabilitation with dignity, milestone timelines, veterinary progress, and rehoming inquiries.
* **Estate Journal (`/journal`)**: Long-form editorial essays on classical horsemanship, equine nutrition, breeding science, and estate life.
* **Confidential Concierge (`/contact`)**: Private viewing requests with pre-filled horse references, visiting policy, and direct estate contact details.

### Admin Suite (`/admin`)
* **Estate Overview Dashboard**: Real-time KPI summary (Horses, Sanctuary in care, Published articles, New enquiries) and quick action shortcuts.
* **Horse Inventory Manager (`/admin/horses`)**: Full CRUD operations, registration numbers, multi-generation pedigree trees, image gallery uploader with cover selector, and visibility controls.
* **Sanctuary Care Manager (`/admin/rescue`)**: Journey narrative, clinical rehabilitation protocol, progress milestone stages, and photography.
* **Editorial Journal Manager (`/admin/journal`)**: Article publishing with rich-text formatting, custom SEO titles and descriptions.
* **Communications Dispatch (`/admin/contact`)**: Client inquiry inbox with status transitions (*new*, *read*, *replied*, *archived*) and direct mailto client triggers.
* **Estate Settings (`/admin/settings`)**: Brand name, tagline, visiting protocols, address, telephone, email, and social channels.

---

## 2. Database & Security Architecture (Supabase)

The application is engineered with Supabase PostgreSQL and Row Level Security (RLS) enforcement. SQL migrations are organized in `/supabase/migrations/`:

* `001_initial_schema.sql`: Core relational tables (`profiles`, `horses`, `horse_images`, `rescues`, `rescue_story_sections`, `rescue_images`, `journal_posts`, `contact_messages`, `site_settings`).
* `002_rls_policies.sql`: Strict RLS policies enforcing public read access to published records, anonymous insert access for contact inquiries, and restricted write/manage privileges exclusively to estate administrators through the `is_admin()` security definer function.
* `003_storage.sql`: Public image bucket provisioning (`horse-images`, `rescue-images`, `journal-images`, `site-images`) with admin-only upload and modification privileges.
* `004_seed.sql`: Realistic seed data representing champion bloodlines (Selle Français, KWPN, Hannoverian) and rescue recoveries.

### Supabase Connection
1. Create a project in [Supabase](https://supabase.com).
2. Execute the migrations in your Supabase SQL Editor in numerical order (`001` through `004`).
3. Add your project credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```
4. If no credentials are provided, the application runs seamlessly in Estate Local Mode with localStorage persistence, allowing previewing and admin capabilities out of the box.

---

## 3. Deployment to Render

### Option A: Static Site Deployment
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Static Site**.
3. Connect your GitHub repository.
4. Set the build configuration:
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist`
5. Add the following **Rewrite Rule** in the Render settings to support client-side routing:
   * **Source**: `/*`
   * **Destination**: `/index.html`
   * **Action**: `Rewrite`
6. Add your Environment Variables:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`

### Option B: Node.js Web Service Deployment
1. Click **New +** > **Web Service**.
2. Select your repository.
3. Configure:
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `node server.ts` or static preview server
   * **Port**: `3000`

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Run TypeScript linter
npm run lint

# Build for production
npm run build
```

---

## 5. Administrative Access

* **Direct Admin Login**: Navigate to `/admin/login` or click the "Estate Office" link in the footer or navigation bar.
* **Instant Director Demo**: An instant authentication toggle is available on the login page to preview all administrative interfaces without credential friction.
