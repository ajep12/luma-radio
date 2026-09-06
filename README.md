# Luma Radio

**Your sound. Your station.**

The website for Luma Radio — a modern UK internet radio station. Built with
React, TypeScript, Vite and Tailwind CSS. The site is fully static once
built, has no server-side dependency on Anthropic/Claude, and is designed to
be deployed to **Cloudflare Pages** with your own domain.

The station's live listening experience is powered by **RadioCast**, your
radio streaming/hosting provider. RadioCast is the only radio provider
referenced anywhere in this project.

---

## 1. Installation

Requires Node.js 18+.

```bash
npm install
npm run dev
```

The site runs locally at `http://localhost:5173`.

To type-check without building: `npm run lint`
To build for production: `npm run build` (outputs to `dist/`)
To preview a production build locally: `npm run preview`

---

## 2. RadioCast setup

All RadioCast configuration lives in **one place**:
[`src/config/radiocast.ts`](./src/config/radiocast.ts), which reads its
values from environment variables. You should never need to edit that file
directly — just set the environment variables described below.

### Step by step

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in the values from your RadioCast account/control
   panel:

   | Variable | Required? | What it is |
   |---|---|---|
   | `VITE_RADIOCAST_STREAM_URL` | **Required** | The direct audio stream URL RadioCast gives you for Luma Radio. This is what powers the Listen Live player. |
   | `VITE_RADIOCAST_PLAYER_EMBED_URL` | Optional | If RadioCast provides a hosted, embeddable player (iframe) for your station, put its URL here. When set, the site embeds RadioCast's own player instead of the custom one. |
   | `VITE_RADIOCAST_NOW_PLAYING_URL` | Optional | If RadioCast exposes a "Now Playing" / metadata API for your station (current song, artist, artwork, listener count), put its URL here. |
   | `VITE_RADIOCAST_FALLBACK_STREAM_URL` | Optional | A fallback audio URL to use if the live stream can't be reached. |
   | `VITE_RADIOCAST_POLL_INTERVAL_MS` | Optional | How often (ms) to poll the Now Playing endpoint. Defaults to `15000`. |

3. Restart `npm run dev` (env vars are only read at build/start time).

### About the Now Playing endpoint

This project **does not invent a RadioCast API shape**. If you provide
`VITE_RADIOCAST_NOW_PLAYING_URL`, the site will poll it, but you still need
to map RadioCast's actual JSON response onto the fields the UI expects. Open
[`src/hooks/useNowPlaying.ts`](./src/hooks/useNowPlaying.ts) and fill in the
`mapResponse()` function — there's a comment there showing exactly where and
how. Until you do this (or if you don't set the URL at all), the site
gracefully shows the station name and tagline instead of fabricated song
data — it never invents "now playing" information.

### Testing the stream

- Run `npm run dev`, open the site, and press **Listen Live**.
- If nothing plays, check the browser console for a warning — it will tell
  you if the stream URL failed to load. Common causes: an incorrect stream
  URL, or the stream host not allowing playback from `localhost` (some
  providers restrict by domain/referrer — check RadioCast's dashboard for
  any domain allow-list settings and add your Cloudflare Pages domain once
  deployed).
- The admin dashboard's **Station settings** page (`/admin/settings`) shows
  exactly which RadioCast values are currently loaded from your environment,
  which is useful for confirming a deployment picked up the right variables.

---

## 3. Environment variables

See [`.env.example`](./.env.example) for the full list with descriptions.
Summary:

```
VITE_RADIOCAST_STREAM_URL=            # required
VITE_RADIOCAST_PLAYER_EMBED_URL=      # optional
VITE_RADIOCAST_NOW_PLAYING_URL=       # optional
VITE_RADIOCAST_FALLBACK_STREAM_URL=   # optional
VITE_RADIOCAST_POLL_INTERVAL_MS=15000 # optional
VITE_STATION_NAME=Luma Radio
VITE_STATION_LOGO_URL=/logo.svg
VITE_SUPABASE_URL=                    # reserved, see section 5
VITE_SUPABASE_ANON_KEY=               # reserved, see section 5
```

---

## 4. Deploying — no local commands required

If you can't run `npm install` / `npm run build` yourself, that's fine — you
don't need to. Both Cloudflare Pages and Vercel build the project in the
cloud once your code is in a Git repository. The only thing you need to do
locally is get the files into that repository, which you can do entirely
through GitHub's website (no git commands needed):

1. Unzip this project on your computer if you haven't already.
2. Go to [github.com/new](https://github.com/new) and create a new
   repository (public or private, doesn't matter).
3. On the new repo's page, click **"uploading an existing file"**.
4. Open the unzipped `luma-radio` folder in your computer's file explorer,
   select everything **except** the `node_modules` folder (you won't have
   one) and `.env` (don't upload real secrets to GitHub — see step 5), and
   drag it all into the GitHub upload box. GitHub preserves subfolders when
   you drag a folder in, so your `src/`, `public/`, etc. structure stays
   intact.
5. Scroll down and click **"Commit changes"** directly on the `main` branch.
6. Your code is now on GitHub. Continue with **4a (Vercel)** or **4b
   (Cloudflare Pages)** below — both import directly from this repo and do
   the build for you.

### 4a. Deploying to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub
   repository you just created.
2. Vercel auto-detects this as a Vite project. Leave the build command as
   `npm run build` and the output directory as `dist` (Vercel usually fills
   these in automatically).
3. Before clicking Deploy, expand **Environment Variables** and add the same
   values from `.env.example` — at minimum `VITE_RADIOCAST_STREAM_URL`.
   (You can also add these later under **Project Settings → Environment
   Variables** and then redeploy.)
4. Click **Deploy**. Vercel builds and hosts the site on a
   `*.vercel.app` subdomain.
5. A `vercel.json` file is included in this project with a rewrite rule so
   client-side routes (like `/shows/luma-drive` or `/admin`) work correctly
   on Vercel — you don't need to configure anything extra for this.
6. To connect your own domain: **Project Settings → Domains → Add**, then
   follow Vercel's DNS instructions.

### 4b. Deploying to Cloudflare Pages

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages →
   Connect to Git**, and select your repository.
2. Use these build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Under **Settings → Environment variables**, add the same variables from
   your `.env` file (at minimum `VITE_RADIOCAST_STREAM_URL`) for both
   **Production** and **Preview** environments.
4. Deploy. Cloudflare will build and host the site on a
   `*.pages.dev` subdomain.
5. A `public/_redirects` file is included so client-side routing resolves
   correctly on Cloudflare Pages.

### Connecting your own domain

Once deployed (on either platform), find the custom domain settings in your
project dashboard and follow the prompts to point your domain (or a
subdomain) at the deployment. If your domain is already on Cloudflare, this
is usually just adding a DNS record automatically for you.

---

## 5. Future Supabase integration

Accounts (`/account/login`, `/account/signup`, `/account/profile`,
`/account/settings`), the admin dashboard (`/admin/*`), and Song Requests
(`/requests`) are currently **frontend-only** — there is no database or auth
provider wired up yet, by design, so you can launch the site immediately and
connect real data later.

When you're ready:

1. Create a Supabase project and grab your project URL and anon key.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your environment.
3. Install the Supabase client: `npm install @supabase/supabase-js`.
4. Create a `src/config/supabase.ts` that initializes the client from those
   two env vars (mirroring the pattern in `src/config/radiocast.ts`).
5. Wire up:
   - **Auth** — replace the stubbed `onSubmit` handlers in
     `src/pages/account/Login.tsx` and `Signup.tsx` with calls to
     `supabase.auth.signInWithPassword` / `supabase.auth.signUp`.
   - **Song requests** — replace the `TODO` in `src/pages/Requests.tsx`
     with an insert into a `requests` table.
   - **Admin-managed content** — shows, presenters, schedule, announcements
     and advertisements currently come from the static files in `src/data/`.
     Replace those reads with Supabase queries once the corresponding admin
     screens under `src/pages/admin/` should persist real edits.

---

## Project structure

```
src/
  config/
    radiocast.ts     # the ONLY RadioCast configuration module
    site.ts          # brand name, tagline, nav links
  data/              # placeholder content — shows, presenters, schedule, etc.
  context/
    PlayerContext.tsx # global play/pause/volume state, wired to RadioCast
  hooks/
    useNowPlaying.ts  # polls RadioCast's Now Playing endpoint, if configured
  components/        # UI building blocks (player, layout, cards, ads, etc.)
  pages/             # public site pages
  pages/account/     # login, signup, profile, settings (frontend-only)
  pages/admin/       # admin dashboard (separate layout, frontend-only)
```

## Replacing placeholder content

Shows, presenters, schedule, sample "recently played" tracks, and
advertisement copy in `src/data/*.ts` are placeholder content, clearly
commented as such. Edit those files directly to reflect your real lineup —
none of it is RadioCast data, and none of it is presented as live data
anywhere in the UI.

## Notes on this build

- No radio provider other than RadioCast is referenced anywhere in this
  project.
- No RadioCast API endpoint, response shape, or field name has been
  invented. Anywhere a piece of information isn't available without your
  real RadioCast details, the UI hides it rather than fabricating it.
- This project is fully yours to host — there is no dependency on Claude or
  any Anthropic service at runtime.
