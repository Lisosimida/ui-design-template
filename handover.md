# Handover — Li Soh Portfolio Redesign

**Repo:** `ui-template-deg/ui-design-template` (Next.js 16, Pages Router, Tailwind CSS 3, Framer Motion)
**Branch:** `test` (off `master`) — **nothing from this session is committed yet.** `git status` shows all component files modified in place, plus new untracked `.claude/`, `.agents/`, `AGENTS.md`, `CLAUDE.md`, `skills-lock.json`.
**Dev server:** was left running at `http://localhost:3000` in a background task — check it's still up before continuing, restart with `npm run dev` (in PowerShell, not Git Bash — see Environment Notes) if not.

## Where we are

The site went through a full visual redesign this session, then a design-quality audit that hasn't been acted on yet. Nothing is broken; the redesign is functional and running, but the audit's fixes (especially the contact-form backend) are still to do.

## What we achieved

### 1. Initial polish pass (pre-redesign, on the old dark theme)
Small set of Apple-HIG-style fixes applied to the (now-replaced) dark glassmorphism theme:
- Press/active states on buttons and nav links
- Animated mobile menu open/close (Framer Motion `AnimatePresence`)
- **Real bug fix, carried forward into the redesign:** `Navbar.jsx`'s scroll-spy used `element.offsetTop`, which broke once a Framer Motion wrapper (`SectionReveal` in `pages/index.js`) became a positioned ancestor before its `whileInView` reveal fired — this permanently misreported "Contact" as the active nav section. Fixed by switching to `getBoundingClientRect()`.
- Responsive letter-spacing on the hero heading

### 2. Full visual redesign
User was done with the dark glassmorphism/AI-startup look. Rebuilt the entire site to match two reference images (a playful "paper/scrapbook" personal-site template):
- `ui-template-deg/image.png` (one level above the repo root)
- `ui-template-deg/4286bb1108a7e1dce62156bc92d0115b.jpg` (same location) — additional reference showing a bold condensed header font and more page examples

**Removed:** dark theme entirely, the light/dark toggle, and the `next-themes` dependency.

**New design system:**
- Fonts (via `next/font/google` in `pages/_app.js`): **Silkscreen** (pixel font, hero name only), **Anton** (bold condensed, section headings like "Resume Snapshot"/"Featured Work"), **Kalam** (handwriting, annotations/bio text), **Plus Jakarta Sans** (everything else)
- Colors (`tailwind.config.js`): `paper.cream/desk/ink` + `accent.yellow/pink/mint/blue/orange`
- Primitives (`styles/globals.css`): `.sticker`/`.sticker-sm` (hard-offset black shadow "cut paper" look), `.paper-grid` (graph-paper background), `.washi-tape`, `.squiggle-underline`

**Every component was rebuilt** on this system: `Navbar` (floating pill nav, sliding active-section indicator, icons, mobile menu), `Logo`, `HeroSection` (hand-drawn circle around the name, dashed circular photos, sticker tags, typewriter), `AchievementsSection`, `AboutMe` (taped polaroids, colorful tab pills), `ResumeSection`, `Project`/`ProjectCard` (color-block sticker cards cycling ink/yellow/pink/mint/blue), `EmailSection`, `Footer`.

All existing copy, resume facts, and project links were preserved — this was a visual rebuild only.

### 3. Skills installed
- **`emilkowalski/skills`** (12 skills incl. `apple-design`, animation-focused ones) → `.agents/skills/`
- **`nextlevelbuilder/ui-ux-pro-max-skill`** + 6 companions (`design-system`, `design`, `brand`, `ui-styling`, `banner-design`, `slides`) → `.claude/skills/`. Verified safe before running (`npm pack` + manual inspection of the bundled code — no install-time hooks, no unexpected network calls). Requires Python 3, which is now installed (see Environment Notes for the gotcha).

### 4. Combined design audit (ui-ux-pro-max + apple-design)
Ran the `ui-ux-pro-max` CLI against the redesigned site and cross-checked every result against `apple-design` principles. Findings below — **not yet implemented.**

## What we want to achieve next

### Frontend fixes (small, agreed, not yet done)
1. **Focus-visible rings** on all interactive elements (`.btn`, `.sticker` buttons, nav links, `TabButton`) — currently none exist; keyboard users can't see focus.
2. **`aria-hidden="true"`** on the decorative nav icons in `Navbar.jsx` (they sit next to visible text labels already).
3. **Switch `ProjectCard.jsx` thumbnails from CSS `background-image` to `next/image`** (`fill` + `object-fit`/`object-position` replacing the current `bgSize`/`bgPosition` props) for optimization/lazy-loading.
4. **Fix the placeholder canonical/OG URL** in `pages/index.js` — still `https://yourportfolio.com`.

### Backend — the actual gap ("robust in frontend and backend")
Right now "Email me" and all contact links are just `mailto:`/external links — **there is no real contact form and no backend**, despite `resend` already sitting unused in `package.json` and `pages/api/hello.js` being the untouched Next.js starter stub. For a job-seeking portfolio this is the real business-requirement gap: a recruiter can't leave a message through the site.

Planned build:
1. Real `<form>` in `EmailSection.jsx` (name/email/message, visible labels, inline validation on blur)
2. New `/api/contact` route using `resend` to send to `lisoh03@gmail.com`
3. Submit lifecycle in the UI: loading → success/error, disabled button while sending, retryable error message (not a silent failure)
4. Honeypot field for basic spam protection (no extra dependency)
5. **Important:** this project deploys to **Cloudflare Workers** (`wrangler.jsonc` / OpenNext) — the Resend API key needs to go through Cloudflare's env var/secret binding, not a plain `.env.local`. Don't assume a naive `process.env.RESEND_API_KEY` just works.

### Explicitly rejected ui-ux-pro-max suggestions (don't redo this analysis later)
- **Brutalism style checklist** (0px border-radius, zero transitions) — the tool's closest style match to our "sticker" look is `brutalism`, but that would kill the rounded pills + spring motion the redesign deliberately uses (matches the reference images + `apple-design`'s motion principles). Intentionally not applied.
- **Generic font-pairing suggestions** (e.g. Fredoka/Nunito) — fonts were matched to the user's actual reference images instead.
- **`loading.tsx` route-loading guidance** — App Router pattern; this project uses the Pages Router.
- **`useSWRSubscription` for the scroll listener** — only one `Navbar` instance exists; pulling in SWR to dedup a listener across instances is unneeded here.

### Not yet verified
The mobile hamburger menu and press/active states were implemented and structurally verified (DOM/class inspection), but **not fully confirmed visually end-to-end** — this session's browser automation had a screenshot/viewport coordinate mismatch and `resize_window` didn't actually resize the real viewport. Worth a quick manual check in a real browser at a narrow width before considering this done.

## Environment notes (save yourself the debugging time)

- **Bash tool is broken on this machine** — Git Bash/Cygwin fails with `dofork: child -1 ... died unexpectedly` on every invocation (likely antivirus interfering with fork() emulation, or a stale DLL rebase). **Use PowerShell for all shell commands.**
- **Python**: `python`/`python3` on PATH resolve to a broken Windows Store app-execution-alias stub and will falsely report "not found." The real interpreter is installed and reachable via the **Python Launcher**: use `py -3 <script>` (confirmed working, Python 3.12.0).
- **Browser automation quirks this session**: screenshot pixel dimensions didn't match the real viewport (~1568px screenshots vs ~1422px `window.innerWidth`), causing coordinate-based clicks to land on the wrong element; `resize_window` did not change the actual page viewport. If continuing browser-driven verification, confirm these are still issues or find a workaround before trusting click coordinates.
