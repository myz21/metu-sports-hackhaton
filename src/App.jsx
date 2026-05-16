import { useEffect, useState } from "react";
import { FrostBackdrop, GlassPanel, Tag } from "./components/ui";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import MusicAnalysisPage from "./pages/MusicAnalysisPage";
import AthleteSetupPage from "./pages/AthleteSetupPage";
import ElementSelectionPage from "./pages/ElementSelectionPage";
import ProgramPlannerPage from "./pages/ProgramPlannerPage";
import VideoAnalysisPage from "./pages/VideoAnalysisPage";
import FeedbackPage from "./pages/FeedbackPage";
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";

const appPages = {
  home: {
    title: "Home",
    section: "Overview",
    description: "Track readiness, recent work, and jump into a new program.",
    component: HomePage,
  },
  "music-analysis": {
    title: "Music Analysis",
    section: "Program Design",
    description: "Inspect BPM, energy rises, beat accents, and structural peaks.",
    component: MusicAnalysisPage,
  },
  "athlete-setup": {
    title: "Athlete Setup",
    section: "Program Design",
    description: "Define level, target score, duration, and planning priorities.",
    component: AthleteSetupPage,
  },
  "element-selection": {
    title: "Element Selection",
    section: "Program Design",
    description: "Choose the technical vocabulary available to the planner.",
    component: ElementSelectionPage,
  },
  "program-planner": {
    title: "My Program",
    section: "Program Design",
    description: "Review the choreography timeline and music-aware structure.",
    component: ProgramPlannerPage,
  },
  "video-analysis": {
    title: "Video Analysis",
    section: "Performance Review",
    description: "Compare practice footage against the planned routine.",
    component: VideoAnalysisPage,
  },
  feedback: {
    title: "AI Feedback",
    section: "Performance Review",
    description: "Read coaching-style insight from sync and stability signals.",
    component: FeedbackPage,
  },
  library: {
    title: "Library",
    section: "Workspace",
    description: "Manage saved music, videos, and choreography drafts.",
    component: LibraryPage,
  },
  profile: {
    title: "Profile",
    section: "Workspace",
    description: "Keep athlete identity, goals, and technical capabilities organized.",
    component: ProfilePage,
  },
};

const navigationGroups = [
  {
    title: "Overview",
    items: [{ id: "home", label: "Home" }],
  },
  {
    title: "Program Design",
    items: [
      { id: "music-analysis", label: "Music Analysis" },
      { id: "athlete-setup", label: "Athlete Setup" },
      { id: "element-selection", label: "Element Selection" },
      { id: "program-planner", label: "My Program" },
    ],
  },
  {
    title: "Performance Review",
    items: [
      { id: "video-analysis", label: "Video Analysis" },
      { id: "feedback", label: "AI Feedback" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { id: "library", label: "Library" },
      { id: "profile", label: "Profile" },
    ],
  },
];

const plannerFlow = [
  "music-analysis",
  "athlete-setup",
  "element-selection",
  "program-planner",
  "video-analysis",
  "feedback",
];

function getRouteState() {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, pageId: "home" };
  }

  const hash = window.location.hash.replace(/^#\/?/, "");

  if (!hash || hash === "login") {
    return { isAuthenticated: false, pageId: "home" };
  }

  if (hash.startsWith("app/")) {
    const pageId = hash.slice(4);
    return {
      isAuthenticated: true,
      pageId: appPages[pageId] ? pageId : "home",
    };
  }

  return { isAuthenticated: false, pageId: "home" };
}

function navigateToLogin() {
  window.location.hash = "#/login";
}

function navigateToApp(pageId = "home") {
  window.location.hash = `#/app/${pageId}`;
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[22px] border px-4 py-3 text-left transition duration-200 ${
        active
          ? "border-white/80 bg-white text-navy shadow-[0_16px_36px_rgba(13,27,63,0.08)]"
          : "border-transparent bg-white/28 text-slate-500 hover:border-white/60 hover:bg-white/48 hover:text-navy"
      }`}
    >
      <p className="text-sm font-semibold tracking-tight">{label}</p>
    </button>
  );
}

function Sidebar({
  activePageId,
  onNavigate,
  onSignOut,
  currentSection,
  nextFlowPage,
}) {
  return (
    <GlassPanel className="h-full p-5 sm:p-6">
      <div className="space-y-5">
        <div className="space-y-3">
          <Tag tone="bright">SkateSync AI</Tag>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.36em] text-sky-700/60">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy">
              Program console
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Gercek uygulama akisi icin tum ekranlar artik ayni shell icinde
              bagli calisiyor.
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/75 bg-white/55 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Current section
          </p>
          <p className="mt-2 text-lg font-semibold text-navy">{currentSection}</p>
          <p className="mt-2 text-sm text-slate-500">
            Navigate between planning, review, and asset management screens.
          </p>
        </div>

        {nextFlowPage ? (
          <div className="rounded-[24px] border border-white/75 bg-white/55 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Suggested next
            </p>
            <p className="mt-2 text-lg font-semibold text-navy">
              {appPages[nextFlowPage].title}
            </p>
            <button
              type="button"
              onClick={() => onNavigate(nextFlowPage)}
              className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-navy px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#12275a]"
            >
              Continue workflow
            </button>
          </div>
        ) : null}

        <div className="space-y-5">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700/55">
                {group.title}
              </p>
              <div className="space-y-2.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.id}
                    label={item.label}
                    active={item.id === activePageId}
                    onClick={() => onNavigate(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/75 bg-white/65 px-4 text-sm font-semibold text-navy transition duration-200 hover:bg-white"
        >
          Sign Out
        </button>
      </div>
    </GlassPanel>
  );
}

function MobileNav({ activePageId, onNavigate }) {
  return (
    <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
      {navigationGroups.flatMap((group) => group.items).map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onNavigate(item.id)}
          className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition duration-200 ${
            item.id === activePageId
              ? "border-white/80 bg-white text-navy shadow-[0_12px_30px_rgba(13,27,63,0.08)]"
              : "border-transparent bg-white/35 text-slate-500 hover:border-white/60 hover:bg-white/55 hover:text-navy"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function AppShell({ activePageId, onNavigate, onSignOut }) {
  const currentPage = appPages[activePageId] ?? appPages.home;
  const ActivePage = currentPage.component;
  const currentSection = currentPage.section;

  const plannerIndex = plannerFlow.indexOf(activePageId);
  const nextFlowPage =
    plannerIndex >= 0 && plannerIndex < plannerFlow.length - 1
      ? plannerFlow[plannerIndex + 1]
      : null;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[var(--page)] px-4 py-4 sm:px-5 sm:py-5">
      <FrostBackdrop />

      <div className="relative mx-auto flex min-h-[calc(100dvh-2rem)] max-w-[1600px] flex-col gap-4 lg:flex-row">
        <aside className="hidden lg:block lg:w-[320px] lg:flex-none">
          <Sidebar
            activePageId={activePageId}
            onNavigate={onNavigate}
            onSignOut={onSignOut}
            currentSection={currentSection}
            nextFlowPage={nextFlowPage}
          />
        </aside>

        <main className="min-w-0 flex-1">
          <GlassPanel className="flex min-h-[calc(100dvh-2rem)] flex-col p-4 sm:p-5 lg:p-6">
            <div className="border-b border-white/70 pb-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <Tag tone="soft">{currentSection}</Tag>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
                    {currentPage.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                    {currentPage.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-[22px] border border-white/75 bg-white/55 px-4 py-3 text-sm text-slate-500">
                    <p className="font-semibold text-navy">Mira Aydin</p>
                    <p className="mt-1">Junior Elite / Figure Skating</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("home")}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/75 bg-white/65 px-4 text-sm font-semibold text-navy transition duration-200 hover:bg-white"
                  >
                    Go Home
                  </button>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/75 bg-white/65 px-4 text-sm font-semibold text-navy transition duration-200 hover:bg-white lg:hidden"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              <MobileNav activePageId={activePageId} onNavigate={onNavigate} />
            </div>

            <div className="mt-5 min-h-0 flex-1 overflow-hidden">
              <div className="h-full overflow-auto rounded-[30px] border border-white/75 bg-white/42 p-2 sm:p-3">
                <ActivePage onNavigate={onNavigate} />
              </div>
            </div>
          </GlassPanel>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [routeState, setRouteState] = useState(() => getRouteState());

  useEffect(() => {
    const syncRoute = () => {
      setRouteState(getRouteState());
    };

    if (!window.location.hash) {
      navigateToLogin();
    } else {
      syncRoute();
    }

    window.addEventListener("hashchange", syncRoute);

    return () => {
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  if (!routeState.isAuthenticated) {
    return (
      <div className="relative min-h-[100dvh] overflow-hidden bg-[var(--page)] px-4 py-4 sm:px-5 sm:py-5">
        <FrostBackdrop />
        <div className="relative mx-auto max-w-[1600px]">
          <LandingPage
            onSignIn={(targetPage = "home") => navigateToApp(targetPage)}
            onJoinRoster={() => navigateToApp("athlete-setup")}
          />
        </div>
      </div>
    );
  }

  return (
    <AppShell
      activePageId={routeState.pageId}
      onNavigate={navigateToApp}
      onSignOut={navigateToLogin}
    />
  );
}

export default App;
