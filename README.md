# Numigos — NUTECH Campus Clubs, Societies & Events App

**Numigos** is the official student community, clubs, and campus events platform designed for **NUTECH (National University of Technology, Islamabad)**. It connects students with campus societies under the Office of Student Affairs (OSA), recruitment drives, technical workshops, hackathons, and university-wide events in one unified mobile and web experience.

---

## ✨ Key Features (v0)

- **Explore Campus Feed**
  - Featured **Happening at NUTECH** carousel with instant event registration and venue details.
  - Horizontal **NUTECH Clubs** quick-discovery strip.
  - **From NUTECH Societies** feed supporting both **Club Posts / Recruitment Announcements** (non-event posts with clickable Google Forms & WhatsApp links, compact preview with *Read more / Show less*, and `+ Follow` / `Following ✓` toggles) and **Event Updates**.
- **NUTECH Clubs & Societies Directory (`/societies`)**
  - Browse official NUTECH clubs and student chapters with member counts, department tags, and one-tap follow buttons:
    - **AWS Student Builder Group NUTECH**
    - **Zindigi Prize NUTECH**
    - **IEEE Student Branch NUTECH**
    - **NUTECH Entrepreneurship Club**
    - **NUTECH AI & Robotics Club (NARC)**
    - **ACM Student Chapter NUTECH**
    - **NUTECH Literary & Debating Society**
    - **NUTECH Adventure & Sports Club**
    - **PM's Green Youth Movement Club**
    - **NUTECH Media & Arts Society**
- **Club Profile (`/societies/[id]`)**
  - Club banner, logo, department affiliation, mission statement, core leadership team, **Club Posts & Announcements**, and **Upcoming Club Events**.
- **Event Detail & Active Entry Pass (`/event/[id]` & `/events/registered`)**
  - Full event overview, schedule, NUTECH venue/wing details, and digital Student Entry Pass with NUTECH ID verification (`NUTECH-2026-CS-104`).
- **Campus Calendar (`/(tabs)/calendar`)**
  - Interactive date strip, daily timeline schedule, and registered events list.
- **Saved Events & History (`/(tabs)/bookmarks` & `/events/history`)**
  - Bookmark campus events and track past attended workshops and seminars.
- **Student Profile & Society Proposal (`/(tabs)/profile` & `/societies/register`)**
  - Student academic profile, registered event passes, followed societies, and form to propose a new NUTECH student club to OSA.

---

## 🛠 Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) + [Expo SDK 54](https://expo.dev/)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (file-based navigation across 14 student screens)
- **Language:** TypeScript
- **Backend / Auth:** Supabase (`@supabase/supabase-js`) + AsyncStorage session persistence
- **Design System:** Warm Campus Editorial (`#FAF9F5` warm cream canvas, `#134635` deep forest green, `#F3D092` campus gold, `#CBEAD9` mint, and `Georgia` serif display typography)

---

## 📁 Project Structure

```text
numigos/
├── app/
│   ├── index.tsx                  # Splash screen
│   ├── login.tsx                  # Student sign-in (.edu.pk)
│   ├── signup.tsx                 # Student registration
│   ├── verify.tsx                 # 6-digit OTP verification
│   ├── reminders.tsx              # Campus notifications & alerts
│   ├── societies.tsx              # NUTECH Clubs & Societies directory
│   ├── (tabs)/
│   │   ├── explore.tsx            # Main Explore dashboard tab
│   │   ├── calendar.tsx           # Campus event calendar tab
│   │   ├── bookmarks.tsx          # Saved events tab
│   │   └── profile.tsx            # Student profile tab
│   ├── event/
│   │   └── [id].tsx               # Event details & registration
│   ├── events/
│   │   ├── registered.tsx         # Active Student Entry Pass
│   │   └── history.tsx            # Past attended events
│   └── societies/
│       ├── [id].tsx               # Individual NUTECH club profile & posts
│       └── register.tsx           # Request a new society (OSA form)
├── components/
│   ├── auth/BrandMark.tsx         # Official Numigos brand mark
│   └── home/ExploreDashboard.tsx  # Explore feed, clubs strip & society posts
├── lib/
│   ├── nutech-data.ts             # Central NUTECH clubs, events & posters data
│   ├── responsive-motion.tsx      # Responsive layout & smooth motion utilities
│   └── supabase.ts                # Supabase client & test session helpers
└── assets/images/                 # Official Numigos logo & NUTECH club posters
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
# Start Expo (press "w" for web, "a" for Android, or scan with Expo Go)
npx expo start

# Or launch directly on Web
npx expo start --web
```
