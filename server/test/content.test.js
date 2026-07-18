// content.test.js — sanity + historical-balance checks on the Home Front
// content bank (spec §1–§6). One class-wide role (the town's wartime civic
// coordinator), six phases, choice-based, with NO early-fail and NO scripted
// eventEffects tolls — every meter delta comes straight from the player's own
// choice.
import test from 'node:test';
import assert from 'node:assert/strict';
import game, { PHASES, homeFrontScore, endingFor, ENDINGS } from '../src/games/homeFront.js';

const SIDE = 'town';

const allText = () =>
  PHASES.flatMap((p) => [p.event, ...p.steps.flatMap((s) => [s.prompt, ...s.choices.map((c) => `${c.label} ${c.feedback}`)])]).join(' ');

test('one class-wide role is the single side, with no rival', () => {
  assert.deepEqual(game.sides, [SIDE]);
  assert.equal(game.hasOpponent, false, "everyone runs the town's home front — a single class-wide accuracy group");
  assert.equal(game.totalActions, 12);
  assert.equal(game.chapterCount, 6);
  assert.ok(game.meta.variants[SIDE], 'The Home Front ships as the one variant');
  assert.deepEqual(game.meta.variants[SIDE].waypoints, [], 'no map: the town-status panel replaces it');
});

test('six phases, each with an event and two graded decisions (right/partial/wrong)', () => {
  assert.equal(PHASES.length, 6, 'phase count');
  for (const [i, ph] of PHASES.entries()) {
    assert.ok(ph.title && ph.date && ph.event, `phase ${i} metadata`);
    assert.equal(ph.steps.length, 2, `phase ${i} has 2 steps`);
    for (const [j, step] of ph.steps.entries()) {
      assert.equal(step.kind, 'decision', `phase ${i} step ${j} is a decision (no map)`);
      assert.ok(step.prompt?.length > 5, `phase ${i} step ${j} prompt`);
      const verdicts = step.choices.map((c) => c.verdict).sort();
      assert.deepEqual(verdicts, ['partial', 'right', 'wrong'], `phase ${i} step ${j} verdicts`);
      for (const c of step.choices) {
        assert.ok(c.label?.length > 5 && c.feedback?.length > 10, `phase ${i} step ${j} choice text`);
      }
    }
  }
  const steps = PHASES.flatMap((p) => p.steps);
  assert.equal(steps.length, 12, '12 graded actions');
});

test('phase 5 (Oil and the Long Haul) intentionally ships with no image — the engine degrades gracefully', () => {
  assert.equal(PHASES[4].image, null);
  for (const [i, ph] of PHASES.entries()) {
    if (i === 4) continue;
    assert.ok(ph.image, `phase ${i} has an image`);
  }
});

test('meters start at 50/50/50 — War Effort, Community, Fairness', () => {
  const state = game.initMatch({ soloSide: SIDE });
  assert.deepEqual(state.sides[SIDE].meters, { warEffort: 50, community: 50, fairness: 50 });
});

test("the content teaches the spec's content bank (TEKS 7.7E, 7.11A, 7.11B, 7.17B)", () => {
  const text = allText();
  assert.match(text, /Pearl Harbor/i, 'the war reaches Texas');
  assert.match(text, /USO/i, 'organized welcome for trainees');
  assert.match(text, /bomber plant/i, 'the Fort Worth bomber plant');
  assert.match(text, /Women's Army Corps|WAC/i, "Oveta Culp Hobby's WAC");
  assert.match(text, /Oveta Culp Hobby/i, 'Oveta Culp Hobby named (TEKS 7.17B)');
  assert.match(text, /ration/i, 'rationing');
  assert.match(text, /victory garden/i, 'victory gardens');
  assert.match(text, /scrap/i, 'scrap drives');
  assert.match(text, /Geneva/i, 'the Geneva rules govern POW treatment');
  assert.match(text, /prisoner|POW/i, 'the POW camps');
  assert.match(text, /Big Inch/i, 'the Big Inch pipeline');
  assert.match(text, /war bond/i, 'war bonds');
  assert.match(text, /GI Bill/i, "the postwar GI Bill");
  const debrief = game.report(game.initMatch({ soloSide: SIDE })).perSide[SIDE].debrief;
  assert.match(debrief, /1\.25 million|1,250,000/i, 'debrief cites the training-ground scale');
  assert.match(debrief, /Randolph/i, 'debrief names Randolph Field');
  assert.match(debrief, /Fort Hood/i, 'debrief names Fort Hood');
  assert.match(debrief, /Hector García/i, "debrief bridges to Hector García's American GI Forum");
  assert.match(debrief, /American GI Forum/i, 'debrief names the American GI Forum');
  assert.match(debrief, /1948/i, 'debrief dates the American GI Forum to 1948');
});

test('sensitivity: segregation is named plainly, never sanitized (spec §6)', () => {
  const text = allText();
  assert.match(text, /segregation|Black and Mexican American/i, 'segregation-era workers are named, not hidden');
  assert.match(text, /fairness/i, 'fairness is named as the conscience meter concept');
  // Phase 2 decision 1 is the plant-hiring decision; its right feedback must
  // name that equal treatment took real struggle, not celebrate it as easy.
  const hiringStep = PHASES[1].steps[0];
  const rightHiring = hiringStep.choices.find((c) => c.verdict === 'right');
  assert.match(rightHiring.feedback, /fight|never automatic/i, 'the feedback names that equal treatment took real struggle');
  // Phase 6 decision 1's wrong choice is the "our boys first" postwar wrong.
  const veteransStep = PHASES[5].steps[0];
  const wrongVeterans = veteransStep.choices.find((c) => c.verdict === 'wrong');
  assert.match(wrongVeterans.label, /our boys first/i, 'the postwar hiring wrong is the real, named injustice');
  assert.match(wrongVeterans.feedback, /white veterans only|less/i, 'the feedback names the wrong plainly');
  // No slurs or gore anywhere.
  assert.doesNotMatch(text, /savage|primitive|heathen|gore/i, 'no slurs, no spectacle');
});

test('the POW camp: humane, rules-following treatment grades right (spec §6)', () => {
  const campStep = PHASES[3].steps[0];
  const right = campStep.choices.find((c) => c.verdict === 'right');
  assert.match(right.label, /Geneva|rules fully/i, 'following the Geneva rules is the right choice');
  const wrong = campStep.choices.find((c) => c.verdict === 'wrong');
  assert.match(wrong.label, /ignore the geneva rules/i, 'ignoring the rules is the wrong choice');
});

test('the design is honest: NO early-fail, and NO scripted event tolls (spec §1, §3)', () => {
  // No failCheck / failEnding wired: even all-wrong completes all 12 actions.
  const state = game.initMatch({ soloSide: SIDE });
  const rep = game.report(state);
  assert.equal(rep.perSide[SIDE].failed, false, 'there is no early game-over');
  // Unlike Empresario/Sabine Pass, no phase carries a scripted eventEffects toll.
  for (const p of PHASES) assert.equal(p.eventEffects, undefined, `${p.title} has no scripted toll`);
});

// --- Playthrough helpers (drive the adapter directly, no GameManager) --------

function playRun(pick) {
  const state = game.initMatch({ soloSide: SIDE });
  for (let step = 0; step < game.totalActions; step++) {
    game.chapterEvent(state, SIDE); // idempotent per phase; safe each step
    const res = game.resolve(state, SIDE, pick(state));
    assert.ok(!res.error, `step ${step} failed: ${res.error}`);
  }
  return game.report(state);
}

const rightMove = (state) => game.aiMove(state, SIDE);

const moveWithVerdict = (verdict) => (state) => {
  const ss = state.sides[SIDE];
  const steps = PHASES.flatMap((p) => p.steps);
  const step = steps[ss.cursor];
  const realIdx = step.choices.findIndex((c) => c.verdict === verdict);
  return { kind: step.kind, choiceIndex: ss.shuffles[ss.cursor].indexOf(realIdx) };
};

const wrongMove = moveWithVerdict('wrong');
const partialMove = moveWithVerdict('partial');

test('all-right run: 100% accuracy and "A Town That Answered"', () => {
  const you = playRun(rightMove).perSide[SIDE];
  assert.equal(you.accuracy, 100);
  assert.equal(you.failed, false);
  assert.equal(you.ending.key, 'top');
  assert.equal(you.ending.title, ENDINGS.top.title);
  assert.equal(you.score, 300, 'a perfect run caps all three meters at 100');
});

test('all-wrong run: 0% accuracy, seams strained, but the run still finishes (no early-fail)', () => {
  const you = playRun(wrongMove).perSide[SIDE];
  assert.equal(you.accuracy, 0, 'every wrong answer scores 0 across the full 12-action denominator');
  assert.equal(you.failed, false, 'the game never ends early — the meters just fall');
  assert.equal(you.ending.key, 'low');
  assert.equal(you.ending.title, ENDINGS.low.title);
});

test('all-partial run: 50% accuracy and "Did Our Part"', () => {
  const you = playRun(partialMove).perSide[SIDE];
  assert.equal(you.accuracy, 50, '12 halves = 50%');
  assert.equal(you.ending.key, 'mid');
  assert.equal(you.ending.title, ENDINGS.mid.title);
});

test('currentPrompt never leaks the answer key', () => {
  const state = game.initMatch({ soloSide: SIDE });
  game.chapterEvent(state, SIDE);
  const prompt = game.currentPrompt(state, SIDE);
  assert.equal(prompt.choices.length, 3);
  for (const c of prompt.choices) {
    if (typeof c === 'object') {
      assert.ok(!('verdict' in c) && !('feedback' in c) && !('effects' in c), 'no answer key on a choice');
    }
  }
});

test('home-front-score tiers: A Town That Answered ≥ 200, Did Our Part 100–199, Strained Seams < 100', () => {
  assert.equal(endingFor(300).key, 'top');
  assert.equal(endingFor(200).key, 'top');
  assert.equal(endingFor(199).key, 'mid');
  assert.equal(endingFor(100).key, 'mid');
  assert.equal(endingFor(99).key, 'low');
  assert.equal(homeFrontScore({ warEffort: 50, community: 50, fairness: 50 }), 150);
});
