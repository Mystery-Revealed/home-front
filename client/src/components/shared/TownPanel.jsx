// TownPanel.jsx — the light town-status panel that replaces a map (spec §1).
// Two halves, both display-only (the server owns all gameplay truth):
//
//   1. THE HOME FRONT — a small SVG scene of the town growing through the war:
//      a water tower is always there; an airfield, a bomber plant, farms (and
//      the POW camp's fence line), and a bustling Main Street appear as the
//      War Effort meter grows. Unbuilt pieces show as faint dashed "plans."
//      Below the scene, labeled chips repeat the same status in text —
//      color/shape is never the only signal.
//
//   2. THE WAR YEARS — the six phases, 1941–1945, as a simple list with the
//      current phase highlighted.

const STAGES = [
  { key: 'base',       name: 'Airfield',     icon: '✈️', at: 58 },
  { key: 'plant',      name: 'Bomber plant', icon: '🏭', at: 66 },
  { key: 'farms',      name: 'Farms & camp', icon: '🌾', at: 74 },
  { key: 'mainstreet', name: 'Main Street',  icon: '🏘️', at: 82 },
];

// Fixed phase design (client display only; titles mirror the adapter).
const PHASES = [
  { n: 1, title: 'The Base Comes', date: '1941–42' },
  { n: 2, title: 'The Plant Hires', date: '1942–43' },
  { n: 3, title: 'Rationing Year', date: '1943' },
  { n: 4, title: 'The POW Camp', date: '1943–44' },
  { n: 5, title: 'Oil and the Long Haul', date: '1944' },
  { n: 6, title: 'Victory and After', date: '1945' },
];

export default function TownPanel({ meters, chapterIndex = 0 }) {
  const warEffort = meters?.warEffort ?? 50;
  const built = (at) => warEffort >= at;
  const cur = Math.max(0, Math.min(PHASES.length - 1, chapterIndex));

  return (
    <div className="mission-panel">
      <div className="mission-scene-wrap">
        <div className="panel-title">The home front</div>
        <svg
          className="mission-scene"
          viewBox="0 0 300 170"
          role="img"
          aria-label={`The town's home front. Built so far: a water tower${built(58) ? ', an airfield' : ''}${built(66) ? ', a bomber plant' : ''}${built(74) ? ', farms and the POW camp' : ''}${built(82) ? ', a bustling Main Street' : ''}.`}
        >
          {/* sky + ground */}
          <rect x="0" y="0" width="300" height="112" className="sc-sky" rx="10" />
          <rect x="0" y="106" width="300" height="64" className="sc-ground" rx="10" />

          {/* the county road, running across town */}
          <path d="M0 150 C 60 138, 110 158, 170 146 C 220 136, 260 150, 300 142 L300 170 L0 170 Z"
                className="sc-river" aria-hidden="true" />

          {/* live oaks, left and right */}
          <g className="sc-oaks" aria-hidden="true">
            <rect x="30" y="96" width="5" height="16" className="sc-trunk" />
            <ellipse cx="32" cy="90" rx="18" ry="14" className="sc-oak" />
            <rect x="270" y="98" width="5" height="16" className="sc-trunk" />
            <ellipse cx="272" cy="92" rx="16" ry="13" className="sc-oak" />
          </g>

          {/* the water tower — always standing, the town before the war changed it */}
          <g className="sc-cabin" aria-hidden="true">
            <ellipse cx="148" cy="94" rx="20" ry="12" className="sc-cabin-wall" />
            <path d="M148 68 L148 82" className="sc-log" />
            <rect x="130" y="106" width="4" height="14" className="sc-trunk" />
            <rect x="166" y="106" width="4" height="14" className="sc-trunk" />
            <rect x="140" y="112" width="4" height="8" className="sc-trunk" />
            <rect x="156" y="112" width="4" height="8" className="sc-trunk" />
          </g>

          {/* the airfield — trainer planes on former pasture — War Effort ≥ 58 */}
          <g className={`sc-piece ${built(58) ? 'built' : 'planned'}`} aria-hidden="true">
            <rect x="66" y="104" width="46" height="4" className="sc-cabin-door" />
            <g transform="translate(84 100) rotate(-8)">
              <ellipse cx="0" cy="0" rx="12" ry="3" className="sc-cabin-wall" />
              <path d="M-2 0 L-9 -6 M-2 0 L-9 6" className="sc-log" />
              <path d="M6 -1 L6 -6 M6 1 L6 6" className="sc-log" />
            </g>
          </g>

          {/* the bomber plant — a long building with a smokestack — War Effort ≥ 66 */}
          <g className={`sc-piece ${built(66) ? 'built' : 'planned'}`} aria-hidden="true">
            <rect x="196" y="90" width="52" height="26" className="sc-gin-wall" />
            <path d="M192 90 L222 76 L252 90 Z" className="sc-gin-roof" />
            <rect x="238" y="66" width="7" height="22" className="sc-trunk" />
          </g>

          {/* farms & the POW camp fence line — War Effort ≥ 74 */}
          <g className={`sc-piece ${built(74) ? 'built' : 'planned'}`} aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <g key={i}>
                <line x1={40 + i * 8} y1="128" x2={40 + i * 8} y2="120" className="sc-cotton-stem" />
                <circle cx={40 + i * 8} cy="119" r="2.1" className="sc-cotton-boll" />
              </g>
            ))}
            <line x1="20" y1="132" x2="60" y2="132" className="sc-log" />
            <line x1="20" y1="126" x2="20" y2="138" className="sc-log" /><line x1="40" y1="126" x2="40" y2="138" className="sc-log" /><line x1="60" y1="126" x2="60" y2="138" className="sc-log" />
          </g>

          {/* Main Street — shopfronts and a flag — War Effort ≥ 82 */}
          <g className={`sc-piece ${built(82) ? 'built' : 'planned'}`} aria-hidden="true">
            {[[150, 128], [172, 126]].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <rect x="-9" y="-10" width="18" height="12" className="sc-cabin-wall" />
                <path d="M-11 -10 L0 -18 L11 -10 Z" className="sc-cabin-roof" />
              </g>
            ))}
            <line x1="150" y1="118" x2="150" y2="106" className="sc-trunk" />
            <path d="M150 106 L162 108 L150 110 Z" className="sc-gin-roof" />
          </g>
        </svg>

        <div className="build-chips" role="list" aria-label="Home front growth">
          {STAGES.map((s) => {
            const done = built(s.at);
            return (
              <div key={s.key} role="listitem" className={`build-chip ${done ? 'done' : ''}`}>
                <span aria-hidden="true">{s.icon}</span> {s.name}
                <b className="build-state">{done ? '✓ built' : 'not yet'}</b>
              </div>
            );
          })}
        </div>
        <p className="build-hint">The town grows as your <b>War Effort</b> meter grows.</p>
      </div>

      <div className="chapter-listing">
        <div className="panel-title">The war years</div>
        <ol className="chapter-list">
          {PHASES.map((c, i) => {
            const state = i < cur ? 'past' : i === cur ? 'current' : 'future';
            return (
              <li key={c.n} className={`chapter-item ${state}`} aria-current={state === 'current' ? 'step' : undefined}>
                <span className="chapter-dot" aria-hidden="true">{i < cur ? '✓' : c.n}</span>
                <span className="chapter-name">{c.title}</span>
                <span className="chapter-date">{c.date}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
