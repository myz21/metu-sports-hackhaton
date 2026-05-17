export const scoreCards = [
  {
    title: "Program Readiness Score",
    value: 86,
    detail:
      "Transitions are balanced and the closing section is nearly competition ready.",
    progress: 86,
    accent: "from-sky-300 via-cyan-200 to-white",
  },
  {
    title: "Music Sync Score",
    value: 91,
    detail:
      "Key accents align well with step phrasing and spin timing in the final third.",
    progress: 91,
    accent: "from-cyan-200 via-ice-200 to-white",
  },
  {
    title: "Technical Target Score",
    value: 78,
    detail:
      "Element mix is strong, but the middle passage needs cleaner entry confidence.",
    progress: 78,
    accent: "from-ice-300 via-sky-100 to-white",
  },
];

export const recentProgram = {
  title: "Moonlit Edges",
  category: "Figure Skating / Short Program",
  duration: "2:42",
  updated: "Edited 2 hours ago",
  note:
    "Sit spin exit and final pose now resolve more cleanly against the orchestral swell.",
};

export const musicTrack = {
  title: "Moonlit Edges v3",
  bpm: 128,
  duration: "2:42",
  mood: "Elegant build with crisp rhythmic middle section",
  peaks: ["00:34", "01:08", "01:46", "02:37"],
};

export const energySegments = [
  { label: "Opening", value: 32 },
  { label: "Lift 1", value: 68 },
  { label: "Bridge", value: 56 },
  { label: "Climax", value: 94 },
  { label: "Resolve", value: 74 },
];

export const athleteSetup = {
  sport: "Figure Skating",
  level: "Junior Elite",
  duration: "2:40 - 3:00",
  targetScore: "34.50",
  risk: "Balanced",
  focus: "Cleaner musical transitions and stable jump landings",
};

export const availableElements = [
  {
    name: "Single Salchow",
    type: "Jump",
    value: "3.7",
    fit: "First accent",
  },
  {
    name: "Toe Loop",
    type: "Jump",
    value: "3.4",
    fit: "Lift sections",
  },
  {
    name: "Sit Spin",
    type: "Spin",
    value: "3.4",
    fit: "Sustained peak",
  },
  {
    name: "Camel Spin",
    type: "Spin",
    value: "3.1",
    fit: "Open glide passages",
  },
  {
    name: "Step Sequence",
    type: "Sequence",
    value: "4.2",
    fit: "Rhythmic bridge",
  },
  {
    name: "Edge Spiral",
    type: "Transition",
    value: "1.4",
    fit: "Soft intro",
  },
  {
    name: "Final Pose",
    type: "Choreography",
    value: "1.2",
    fit: "Closing resolve",
  },
];

export const selectedElements = [
  "Edge Spiral",
  "Single Salchow",
  "Step Sequence",
  "Sit Spin",
  "Final Pose",
];

export const timelineItems = [
  {
    title: "Edge Transition",
    time: "00:08",
    zone: "Opening swell",
    value: "+1.8",
    note: "Hold the upper-body line slightly longer before the weight transfer.",
  },
  {
    title: "Single Salchow",
    time: "00:34",
    zone: "First accent",
    value: "+3.7",
    note: "Entry timing is aligned to the beat, but landing flow should stay softer.",
  },
  {
    title: "Step Sequence",
    time: "01:07",
    zone: "Rhythmic bridge",
    value: "+4.2",
    note: "Best musical phrasing in the draft. Keep shoulders quieter through the turns.",
  },
  {
    title: "Sit Spin",
    time: "01:46",
    zone: "Sustained chorus",
    value: "+3.4",
    note: "Centering is stable. Exit can open one count earlier for a cleaner release.",
  },
  {
    title: "Final Pose",
    time: "02:37",
    zone: "Closing resolve",
    value: "+1.2",
    note: "Final line lands correctly with the last note. Maintain stillness for the finish.",
  },
];

export const uploadSections = [
  {
    label: "Reference audio",
    status: "Uploaded",
    detail: "moonlit_edges_v3.wav / 128 BPM / trimmed",
  },
  {
    label: "Practice video",
    status: "Awaiting analysis",
    detail: "session_runthrough_cam_a.mp4 / 1080p",
  },
];

export const analysisFrames = [
  {
    label: "Jump landing stability",
    value: 72,
    detail: "Landing line drifts slightly left after touchdown.",
  },
  {
    label: "Spin centering",
    value: 84,
    detail: "Rotation stays visually centered for most of the sit spin.",
  },
  {
    label: "Beat alignment",
    value: 89,
    detail: "Major element timing lands very close to peak accents.",
  },
];

export const feedbackPriorities = [
  {
    title: "Open the sit spin exit earlier",
    note: "Releasing one count earlier will improve the transition into the final glide.",
  },
  {
    title: "Stabilize the salchow landing edge",
    note: "The landing is usable, but the body line breaks flow after impact.",
  },
  {
    title: "Protect stillness in the final pose",
    note: "The musical ending is strong. Hold the finish longer for visual authority.",
  },
];

export const coachInsights = [
  { label: "Musical phrasing", value: 91 },
  { label: "Technical balance", value: 78 },
  { label: "Transition clarity", value: 84 },
];

export const librarySections = [
  {
    title: "Uploaded music files",
    eyebrow: "Audio",
    items: [
      { name: "moonlit_edges_v3.wav", meta: "2:42 / 128 BPM / Trimmed" },
      { name: "silver_rink_theme.mp3", meta: "3:06 / 124 BPM / Draft cue" },
      { name: "finale_strings_mix.aiff", meta: "1:58 / 132 BPM / Highlight cut" },
    ],
  },
  {
    title: "Uploaded performance videos",
    eyebrow: "Video",
    items: [
      { name: "session_runthrough_cam_a.mp4", meta: "Coach review / 1080p" },
      { name: "edge_sequence_take_04.mov", meta: "Slow motion / Landing focus" },
      { name: "spin_alignment_clip.mp4", meta: "Reference angle / 42 sec" },
    ],
  },
  {
    title: "Saved programs",
    eyebrow: "Programs",
    items: [
      { name: "Moonlit Edges", meta: "Short Program / Updated today" },
      { name: "Glass Horizon", meta: "Free Skate / Review pending" },
      { name: "Winter Pulse", meta: "Artistic Roller / Archived draft" },
    ],
  },
];

export const movementReferenceClips = [
  {
    name: "Axel",
    category: "Jump",
    src: "/media/movements/axel.mp4",
    note: "Featured jump reference for forward takeoff timing and landing flow.",
  },
  {
    name: "Camel Spin",
    category: "Spin",
    src: "/media/movements/camel-spin.mp4",
    note: "Line, axis, and centered rotation reference for longer spin shapes.",
  },
  {
    name: "One Foot Glide",
    category: "Transition",
    src: "/media/movements/one-foot-glide.mp4",
    note: "Basic edge control and balance reference for clean single-foot travel.",
  },
  {
    name: "Spiral",
    category: "Transition",
    src: "/media/movements/spiral.mp4",
    note: "Extension and line reference for longer phrase-driven glide moments.",
  },
  {
    name: "Two Foot Glide",
    category: "Foundation",
    src: "/media/movements/two-foot-glide.mp4",
    note: "Starter balance reference used to support early movement understanding.",
  },
];

export const movementKnowledgeNote = {
  eyebrow: "Knowledge Support",
  title: "Visual references for the movement vocabulary",
  detail:
    "These clips live in the library as athlete-facing references, while the AI movement knowledge remains a separate structured glossary. Together they help keep movement naming and review language aligned.",
  bullets: [
    "Library holds the actual videos athletes can watch.",
    "Knowledge holds the movement definitions the product refers to.",
    "This MVP includes 5 featured clips as a starter reference set.",
  ],
};

export const profile = {
  athleteName: "Mira Aydin",
  athleteLevel: "Junior Elite",
  sportType: "Figure Skating",
  targetTechnicalScore: "34.50",
  seasonGoal: "Competition-ready short program with stronger musical resolution",
  availableElements: [
    "Single Salchow",
    "Single Loop",
    "Sit Spin",
    "Camel Spin",
    "Step Sequence",
    "Edge Spiral",
    "Toe Loop",
    "Final Choreographic Pose",
  ],
};
