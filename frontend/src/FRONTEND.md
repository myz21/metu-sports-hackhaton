# 🎨 SkateSync AI Frontend Architecture and User Experience (UX/UI)

This document details how the user (athlete or coach) will interact with SkateSync AI on the frontend layer, based on the backend strategies `VOICE_LAST.md` (Hybrid Voice Coaching) and `VISION.md` (VLM-based Video Analysis).

THE PAGE MUST BE SIMPLE SO NON-TECHNICAL USERS CAN UNDERSTAND IT

## 1. Core Functions and Interface Components

### A. Movement Catalog and AI-Known Movements
The knowledge base in the `knowledge/` folder should be used as a visible feature on the frontend. The user must clearly see which movements the system recognizes. This section should not be technical; it should be reassuring and easy to understand.

- **Movement Catalog Cards:** The core movement families recognized by the AI are displayed as cards in the interface.
  - `Jumps:` Axel, Salchow, Loop, Toe Loop, Flip, Lutz
  - `Spins:` Sit Spin, Camel Spin, Upright Spin, Scratch Spin, Layback Spin, Biellmann
  - `Step / Turn:` Three Turns, Bracket, Rocker and Counter, Mohawk, Twizzle
  - `Transitions and Choreographic Movements:` Spiral, Ina Bauer, Spread Eagle, Lunge, Cantilever, Choreographic Sequence, Final Pose
- **Simple Description Text:** A simple, 1-sentence description is shown for each movement. The goal is not technical education, but to give the user the feeling that "AI knows this movement."
- **Category Filtering:** The user can filter to see specific categories like `Jump`, `Spin`, `Transition`, `Turns`.
- **Coaching Cue Preview:** Fields like `coaching_cues`, `timing_cues`, `stability_cues` from the knowledge base should not be presented as raw data, but as small, natural language cue cards.
- **Purpose Explanation:** A short text should be included in this section:
  "SkateSync AI uses this movement dictionary to generate plans, analyze video, and provide feedback."

### B. Music Upload and Voice Coaching
This section is where the system autonomously analyzes the music and prepares a dynamic choreography plan for the athlete.

- **Music Upload Interface:** The user uploads the training music they will use.
- **Autonomous Choreography Timeline:** When the backend (Gemini Flash + Librosa) generates a 10-15 movement plan based on music energy, the frontend displays this plan on an interactive Timeline. At what second (e.g., `166.255s`) which movement will be triggered is marked with pins.
  The movement names in this timeline must be consistent with the catalog in the `knowledge` folder. For example, the user should see movements like `Sit Spin`, `Toe Loop`, `Ina Bauer`, or `Final Pose` in the plan.
- **Mixed Audio Player:** The system mixes the voice coaching cues perfectly synced to the music using the "Snap to Beat" algorithm (`output_test.mp3`) and plays it for the user.
- **Dynamic Movement Animation (Voice Feature):** There are 5 movement animations (MP4s/GIFs) located in `public/media/movements`. During the voice coaching playback, these movements will animate on the screen simultaneously. It includes two key features:
  1. **Exporting:** The ability to export this visual and audio choreography sequence.
  2. **Scrolling Lyrics-Style Sync:** While the music is playing, the text output of the coaching cues and the corresponding MP4 animation for that text section (limited to the 5 available movements) will appear on the screen synchronously, flowing similarly to the scrolling lyrics feature on Spotify.

### C. Video Review and Scoring (Vision Review)
After completing the training, the athlete uploads their performance and gets the AI evaluation in this module.

- **Video and Plan Matching:** The user uploads their recorded video and matches it with the previously prepared "Planned Timeline".
- **Analysis Quality Selection (Cost & Speed Control):** 
  In line with the VLM review system, the user sees two different profile options on the interface:
  - `Fast Review (Low Quality):` A cheap, fast mode that uses fewer frames for daily routine training.
  - `Detailed Review (High Quality):` An expensive/critical session mode that scans high resolution and more frames at a coach level.
  - *(Optional)* An extra LLM cost control with a Toggle Switch saying "I want detailed AI coaching commentary".
- **Result and Scoring Screen:**
  - **Score Cards:** `execution_match_score`, `start_score`, `stability_score`, and `music_alignment_score` calculated per element are shown with circular progress rings or radar charts on the UI.
  - **Timing Badges:** Timing errors calculated deterministically in the background are indicated with colored badges like "Early", "On Time", "Late".
  - **Chat-Style Feedback:** Optional LLM explanations are presented in natural language inside cards, as if written directly by a coach.
  - **Movement-Based Commentary:** In the review screen, the analyzed element should be displayed with its catalog name. For example:
    - `Camel Spin - Good stability, center slightly drifts`
    - `Toe Loop - Takeoff rhythm is correct, landing flow was short`
    - `Final Pose - Synced with the music ending`

## 2. User Flow

The use case scenario of the system from start to finish happens as follows:

1. **Preparation:** The athlete uploads their training music to the web interface.
2. **Viewing Movement Knowledge:** The athlete can view the movements known to the system on the catalog screen and understand the logic behind the generated plans.
3. **Planning:** The system understands the spirit of the music and provides a mixed MP3 file containing the movement plan and voice instructions to be spoken into the ear.
4. **Action:** The athlete puts on their earphones, starts the MP3 on the web interface, and performs the movements according to the instructions coming from the system. They are recorded on video during this time.
5. **Requesting Analysis:** The athlete uploads the video to the system and selects the analysis profile (`Low` or `High`).
6. **Reviewing the Report:** The system reflects a training summary full of percentage scores and technical tips by comparing how synchronized the athlete was with the plan.

## 3. Frontend Development Notes (Technical Expectations)

- **Ease of Use (Simplicity):** Since the target audience is athletes and coaches, the frontend must be **as simple as possible for non-technical users**, understandable, and clutter-free (minimalist). Unnecessary technical settings should be handled in the background, offering the user the comfort of simply "Upload and Start".
- **Design System & Aesthetics ("Glacial Tech"):** The frontend must strictly adhere to the `DESIGN.md` guidelines.
  - **Theme:** Use the deep "Abyssal Blue" (`#0F172A`) base instead of a generic dark mode. Implement **Glassmorphism** for surfaces (frosted ice effect, background blur, semi-transparent overlays) to evoke a lightweight yet structured feel.
  - **Color Palette:** Accentuate active states and AI energy with **Electric Purple**, and use **Glacial Cyan** for precision markers and data visualization. Use Crisp White strictly for typography/icons to ensure high contrast.
  - **Typography:** Use **Sora** for stable, dynamic headlines and **Geist** for body text/data labels to create a technical, developer-centric "instrument panel" vibe.
  - **UI Depth & Components:** Avoid heavy drop shadows. Create depth via tonal layers and 1px inner borders (top/left) on frosted glass containers. Primary buttons should use a Purple-to-Cyan gradient, and input fields should feature a glowing Cyan bottom-border on focus. Standardly use cohesive rounded corners (`8px` to `16px`).
- **Component Libraries:** `Tailwind CSS` and `Framer Motion` (micro-animations) should be used to seamlessly implement the Glacial Tech design language and provide a fluid interface.
- **Timeline Integration:** Music and video players should be developed to work in sync with second-based JSON markers. An emphasized UI effect can be given exactly at the "peak" point of the video.
- **State Management:** Since processing the Vision layer can take a long time, beautiful loading screens (skeleton loaders or progress bars) explaining the process should be shown to the user during the analysis.
- **Knowledge Integration:** `knowledge/figure_skating_knowledge.json` and `knowledge/skating-movement-catalog.md` are not just background data for the frontend; the visible user catalog, sample movement cards, timeline names, and review labels must feed from this common dictionary.
- **Name Consistency:** Movement names used in the frontend must be exactly the same as the movement names used in the AI planning / vision review layer. This way, when the user sees `Sit Spin`, they see the same term in both the plan and the analysis result.
- **Background Animation:** The file `animation(ortası alınacak, yavaşlatılacak).mp4` will be utilized as an atmospheric background animation for the page. A 5-8 second segment from the middle of the video will be extracted, slowed down (slow motion), and seamlessly looped to create a dynamic and premium visual experience.
