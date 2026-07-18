// ResultScreen.jsx — the end of the war years. Two stories, in order: (1) how
// the town fared (Home Front Score + ending tier), (2) the score that matters
// to your teacher — accuracy — then the debrief: the honest timeline, the
// segregation truth named plainly, and the bridge to Hector García's fight.

import { Art } from '../../services/assets.jsx';

const TIER_CLASS = { top: 'win', mid: 'mid', low: 'low' };

export default function ResultScreen({ state, onPlayAgain }) {
  const end = state.matchEnd;
  const meta = end.meta || state.match?.begin?.meta;
  const you = end.you;
  const ending = you.ending;
  const score = you.score ?? 0;

  return (
    <div className="card result-screen">
      <div className="event-kicker">Texas · 1941–1945</div>
      <h1 className={`result-headline ${TIER_CLASS[ending.key] || 'mid'}`}>{ending.title}</h1>

      <Art name="ending.jpg" alt="A train depot platform full of returning WWII veterans, including Black and Latino soldiers, families surging forward to embrace them, flags and tears" className="result-art" />

      <p className="fall-note">
        This game measured how well you ran the <b>home front</b> — War Effort,
        Community, and above all, <b>Fairness</b>: who shared the work, and who
        shared the credit. The real history is honest and uneven — some towns
        answered fully, and some let old unfair habits creep back in even while
        everyone gave everything.
      </p>

      <div className="ending-block mission">
        <p>{ending.text}</p>
      </div>

      <div className="score-block" aria-label="Home Front Score">
        <div className="score-head">
          <span className="score-title">🏘️ Home Front Score</span>
          <span className="score-num">{score}<span className="muted"> / 300</span></span>
        </div>
        <span className="score-bar-track">
          <span className={`score-bar ${TIER_CLASS[ending.key] || 'mid'}`} style={{ width: `${Math.min(100, (score / 300) * 100)}%` }} />
        </span>
        <div className="meter-final-row">
          {Object.entries(you.meters || {}).map(([k, v]) => (
            <span key={k} className="meter-final">{meta?.meters?.[k]?.name || k}: <b>{v}</b></span>
          ))}
        </div>
      </div>

      <div className="accuracy-block">
        <div className="accuracy-number">{you.accuracy}%</div>
        <div>
          <b>Your accuracy — the score your teacher sees.</b>
          <p>
            How well your calls matched what a wise, fair wartime coordinator
            really would have chosen — and what really happened on Texas home fronts.
          </p>
        </div>
      </div>

      <div className="debrief">
        <h3>What really happened</h3>
        <p>{you.debrief}</p>
      </div>

      <div className="btn-col">
        <button className="btn big" onClick={onPlayAgain}>Run the war years again</button>
        <p className="replay-nudge muted">Try new choices — can you run a fairer home front?</p>
      </div>
    </div>
  );
}
