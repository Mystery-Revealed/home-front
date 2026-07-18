// homeFront.js — Unit 7 game adapter: "The Home Front" (SOLO, one class-wide
// group). Everyone runs the same Texas town's wartime civic effort, 1941–1945.
// Six phases × 2 graded decisions = 12 graded actions. There is no "pick" and
// no rival — the whole class runs the same four years, so the Teacher Command
// Center reports ONE accuracy group.
//
// THE TEACHING IDEA (spec §1): Texas as a training-ground state (wide-open
// spaces, mild climate), the war boom in oil and aviation, and Texans'
// contributions at home. This teaches TEKS 7.7E (WWII's impact on Texas),
// 7.11A/7.11B (industry and jobs — urbanization begins here), and 7.17B
// (Oveta Culp Hobby). The third meter, Fairness, carries the honest thread:
// the home front ran on the work of women, Black Texans, and Mexican
// Americans who were asked to give everything while being treated as less
// than equal — the game names it plainly and grades it, planting the seed
// for the unit's civil-rights history (Hector García's American GI Forum,
// 1948; TEKS 7.7D).
//
// UNLIKE Empresario/Sabine Pass, this game has NO scripted eventEffects tolls
// and NO failCheck/failEnding — every meter delta comes straight from the
// player's own choice (spec had no "accurate play still ends badly" design
// requirement here; see Open Range or Barbed Wire for the sibling precedent).
//
// SENSITIVITY (spec §6): segregation on the home front is named, not
// sanitized. Fairness choices make the gap between the war's ideals and its
// rules concrete and gradeable — unequal pay, POW labor undercutting Black and
// Mexican American farmhands' wages, "our boys first" postwar hiring, and GI
// Bill offices that turned away veterans of color. POW content stays
// humane-treatment-focused (the real, largely honorable Texas record under
// the Geneva rules). No combat, no gore.
//
// THE ANSWER KEY LIVES HERE, ON THE SERVER (verdicts/effects/feedback). The
// factory ships labels only; the client submits { kind, choiceIndex }.
// Student-facing text is written at a 5th grade reading level.
//
// Every step is a 'decision' — a judgment call. This is a management game with
// a town-status panel, not a map. ✅ right (+1) · ⚠️ partial (+0.5) · ❌ wrong (0).

import { createStepGame } from './_stepGame.js';

// ---------------------------------------------------------------------------
// Shared board metadata (shipped to clients at match:begin — display info only)
// ---------------------------------------------------------------------------

export const METERS = {
  warEffort: { name: 'War Effort', icon: 'warEffort', blurb: 'Training, production, and the drives that arm the Allies.' },
  community: { name: 'Community', icon: 'community', blurb: 'Housing, schools, and morale in a town doubling overnight.' },
  fairness:  { name: 'Fairness',  icon: 'fairness',  blurb: "Who shares the work — and the credit. The game's conscience meter." },
};

// This game has no map, so there are no placed markers. Kept for engine symmetry.
export const MARKERS = {
  town: { name: 'The town' },
};

// All three meters begin at 50: a quiet Texas town about to give everything it has.
const START_METERS = { warEffort: 50, community: 50, fairness: 50 };

// Home Front Score = warEffort + community + fairness (max 300).
export function homeFrontScore(meters) {
  return (meters.warEffort || 0) + (meters.community || 0) + (meters.fairness || 0);
}

// Ending tier from the final Home Front Score (spec §3).
export const ENDINGS = {
  top: { key: 'top', title: 'A Town That Answered',
         text: "When the Army asked, you answered fast and fair. When the plant needed hands, you opened the doors to everyone who could do the work — and paid them what the work was worth. Your ration board never played favorites. Your victory gardens fed the block, and your scrap piles became ships. You treated even your enemies with the decency the rules demanded, and you never let anyone's paycheck be the price of it. When the town got tired — and it got so tired — you told the truth and kept people safe. And when the boys came home, all of them came home to a town that meant its thanks. This is the home front at its best: not perfect people, but fair rules, kept promises, and shared work. Over a million troops trained in Texas, and towns like yours are the reason it worked. You didn't just get through the war. You answered it." },
  mid: { key: 'mid', title: 'Did Our Part',
         text: "Nobody can say this town sat out the war. The base came, the drives ran, the bonds sold, and the trains carried your scrap and your soldiers east. That is real, and it counts. But the record has gaps, and honesty means naming them. Some workers were paid less than their work was worth. Some favors bent rules that were supposed to be the same for everybody. Some promises to returning veterans came slow, or vague, or not at all — and the people shorted were usually the same people every time. That was the home front for most towns, truth be told: real sacrifice and real unfairness, side by side, in the same square on the same day. The war was won, and your town helped win it. The question it leaves behind is the one Texas spent the next thirty years answering: what about everyone who gave everything and got back less?" },
  low: { key: 'low', title: 'Strained Seams',
         text: 'The war ended, and the town is still standing — but look closer at the seams. Deals that should have been fair weren\'t. Doors that should have opened stayed shut. Workers who could have built bombers swept floors instead, ration stamps went to whoever had pull, and people were pushed past their limits until some of them broke. When the veterans came home, too many found out that "welcome back" had fine print — and that the fine print was about the color of their skin. Here is the hard truth this game won\'t sand down: everything on this list really happened in real towns, because a war for freedom abroad didn\'t automatically mean fairness at home. The people wronged on this home front didn\'t forget. They organized, they petitioned, and they fought — and their fight became the next chapter of Texas history. The war tested this town\'s seams. Now you know where they tore.' },
};

export function endingFor(score) {
  if (score >= 200) return ENDINGS.top;
  if (score >= 100) return ENDINGS.mid;
  return ENDINGS.low;
}

// The universal debrief: the true scale of Texas's war, and the honest bridge
// to the civil-rights era that follows it.
export const DEBRIEF =
  'Here is the true history you just walked through. During World War II, Texas became one giant training ground: more than 1.25 million troops learned to fly, march, and fight at Texas posts and airfields, from Randolph Field — the "West Point of the Air" — to Fort Hood, where tank destroyer crews trained on the open plains. The reason was simple: wide-open spaces and mild weather meant more flying days and more room to maneuver than almost anywhere in the country. Texas built the tools of war, too. The great bomber plant at Fort Worth turned out planes by the thousands, Gulf Coast shipyards launched vessels as fast as crews could weld them, and Texas oil — carried east through pipelines like the Big Inch, safe from German submarines — fueled the entire Allied war machine. At home, families lived by the ration book, counting stamps for sugar, gas, and tires; they planted victory gardens, hauled scrap metal, and bought war bonds with money they could barely spare. Women filled the plants by the thousands — the "Rosie" era — and Houston\'s Oveta Culp Hobby led the Women\'s Army Corps, proving women could serve the Army in nearly every job it had. Texas also held tens of thousands of German prisoners of war, who picked cotton and pulled harvests under the Geneva rules; the state\'s record was largely humane, and some former prisoners liked Texas enough to come back as immigrants after the war. And through all of it, this must be said plainly: Black and Mexican American Texans worked the plants, fields, and battlefields under segregation\'s rules — asked to give everything for freedom while being treated as less than equal at home. The war changed Texas for good. It industrialized a farming state, pulled people into booming cities, and never let them go back. And the same Texans who powered the home front spent the next decades fighting for the equality they had already earned — starting in 1948, when Dr. Hector García, a veteran and physician from Corpus Christi, founded the American GI Forum to demand that every veteran receive the benefits and respect their service had won. That fight is where the next chapter of Texas history begins.';

// ===========================================================================
// THE SIX PHASES, 1941–1945. Fairness is the thread — every real fairness
// failure named here (unequal pay, POW labor undercutting local wages, "our
// boys first" postwar hiring, a GI Bill office that turns veterans away)
// really happened somewhere on a real Texas home front. Player-facing text at
// a 5th grade reading level.
// ===========================================================================

const PHASES = [
  // ---- Phase 1 — The Base Comes (1941–1942) ----
  {
    title: 'The Base Comes', date: '1941–1942 · a pasture becomes an airfield', image: 'event_base.jpg',
    event: 'December 1941. The radio says Pearl Harbor, and overnight the whole country is at war. Now two men from the Army are standing in the courthouse, maps under their arms. They want 2,000 acres of pasture east of town for a flight-training field. Texas has what pilots need — flat land, open sky, and flying weather most days of the year. But the Army is in a hurry, and a dozen other towns want this base too. They need an answer, and they need it fast. The town has picked you to speak for it. What do you say?',
    steps: [
      {
        kind: 'decision',
        prompt: 'The Army wants its answer this week — how does the town respond?',
        choices: [
          { label: 'Say yes and organize: settle fair land prices quickly, and commit roads and water.',
            verdict: 'right', effects: { warEffort: 15, community: 5 },
            feedback: 'This is how Texas won its bases. Towns that moved fast — flat land, flying weather, and a handshake that held — got the fields. Over a million troops trained in Texas during the war. Your quick, fair deal put this town on the map.' },
          { label: 'Say yes, but let the land deals sort themselves out.',
            verdict: 'partial', effects: { warEffort: 5, community: -10 },
            feedback: "The base comes, but the deals turn ugly. Land speculators — people who buy land cheap just to resell it high — feast where towns don't organize. Some ranchers get cheated, and the hard feelings last for years. A yes without a plan costs you." },
          { label: 'Bargain hard for months to squeeze out a better price.',
            verdict: 'wrong', effects: { warEffort: -10 },
            feedback: 'The Army had a war on. It could not wait for a town that haggled. The base — and its jobs, payroll, and pride — went to the next county instead. In 1942, speed was the price of opportunity, and this town missed it.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'Two thousand trainees are about to pour into a town of three thousand — how do you get ready?',
        choices: [
          { label: 'Open homes, church halls, and a USO room — an organized welcome.',
            verdict: 'right', effects: { community: 15 },
            feedback: 'Organized hospitality paid off everywhere it was tried. A USO room — a club where soldiers could write letters, hear music, and feel human — turned strangers into neighbors. Trainees remembered towns like this fondly for the rest of their lives, and the town\'s spirit soared.' },
          { label: 'Let the boys figure it out on their own.',
            verdict: 'partial', effects: { community: -5 },
            feedback: 'They manage, barely. Trainees sleep in cars and crowd the cafes, and small frictions pile up between soldiers and townsfolk. Nothing breaks, but a real chance slips by. A town that plans a welcome gets a partner; a town that shrugs gets a headache.' },
          { label: 'Let landlords raise rents sky-high — the soldiers can afford it.',
            verdict: 'wrong', effects: { fairness: -15 },
            feedback: 'Price-gouging soldiers and their young families was a real and shameful wartime problem. Military newspapers named the worst towns, and commanders steered men away from them. Squeezing the people training to fight for you poisons the town\'s name — and its conscience.' },
        ],
      },
    ],
  },

  // ---- Phase 2 — The Plant Hires (1942) ----
  {
    title: 'The Plant Hires', date: '1942 · the line never stops', image: 'event_plant.jpg',
    event: 'Forty miles away, a giant aviation plant is rising — like the great bomber plant at Fort Worth, a building so long workers ride bicycles inside it. The plant needs thousands of hands, and it is recruiting hard in your town. But so many men are leaving for the service that the old rules about who gets hired cannot feed the line. Women want the work. Black and Mexican American Texans want the work. All of them can do it. The plant manager calls you: he will follow the town\'s lead on hiring. Who gets to build the bombers?',
    steps: [
      {
        kind: 'decision',
        prompt: 'The plant needs workers by the thousands — what hiring rules do you back?',
        choices: [
          { label: 'Hire everyone who can do the work, at equal pay for equal work — women on the line, Black and Mexican American workers in real jobs.',
            verdict: 'right', effects: { fairness: 15, warEffort: 10 },
            feedback: "Plants that opened their doors out-produced the ones that didn't — more hands, more bombers. But be honest: this was never automatic. Workers had to fight for equal pay and real jobs, plant by plant. Where they won, production soared and so did fairness." },
          { label: 'Hire women and workers of color, but keep them in lower-paid, lesser jobs.',
            verdict: 'partial', effects: { warEffort: 5, fairness: -5 },
            feedback: 'The line runs, but it runs unfairly. Skilled people sweep floors while machines sit idle for lack of trained hands. Paying someone less for the same work is a wrong with a cost you can count — in wages, in morale, and in bombers not built.' },
          { label: 'Hire white men only — keep things the way they were before the war.',
            verdict: 'wrong', effects: { warEffort: -10, fairness: -15 },
            feedback: 'The smallest hiring pool means the shortest line. The plant runs short-staffed, quotas slip, and the Army notices. Turning away willing, capable workers in wartime hurt production — and it was plainly a fairness failure. The war needed everyone. This choice pretended it didn\'t.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'A recruiter arrives for the Women\'s Army Corps — the WAC, led by Oveta Culp Hobby of Houston — and asks for the town\'s support.',
        choices: [
          { label: 'Back the WAC drive publicly — honor Colonel Hobby and every woman who signs up.',
            verdict: 'right', effects: { community: 10, fairness: 5 },
            feedback: "Oveta Culp Hobby of Houston led the Women's Army Corps, and 150,000 women served in it — filling vital Army jobs so more soldiers could fight. Towns that honored their WACs sent more of them. Your public support tells every girl in town: your service counts." },
          { label: "Allow the recruiting quietly, but don't promote it or celebrate it.",
            verdict: 'partial', effects: { community: 3 },
            feedback: "Silence has a message too. Women who might have served read the town's cold shoulder and stay home. The WAC gets fewer recruits, and the women who do go leave feeling unsupported. Half a welcome does half the good." },
          { label: 'Discourage women from joining — mock the idea of women in uniform.',
            verdict: 'wrong', effects: { community: -10, fairness: -10 },
            feedback: 'Plenty of people mocked the WAC at first. They were wrong. WACs served in every theater of the war, and generals begged for more of them. Mocking women\'s service insulted real soldiers, embarrassed the town, and cost the Army help it badly needed.' },
        ],
      },
    ],
  },

  // ---- Phase 3 — Rationing Year (1943) ----
  {
    title: 'Rationing Year', date: '1943 · little books, big rules', image: 'event_ration.jpg',
    event: 'The ration books arrive — small paper booklets of stamps that decide how much sugar, gasoline, and how many tires each family can buy. Rationing means sharing what is scarce so the military gets what it needs first. Every family in town gets the same book. But the rules only work if people trust them, and already the whispers have started: the mayor\'s cousin wants extra gas, and somebody is offering to buy stamps out behind the feed store. The town\'s ration board answers to you. Will the rules mean the same thing for everybody?',
    steps: [
      {
        kind: 'decision',
        prompt: 'Pressure is building on the ration board — how do you run it?',
        choices: [
          { label: 'Run the board straight: same book, same rules, no favors for anyone with pull.',
            verdict: 'right', effects: { fairness: 15, community: 5 },
            feedback: 'Rationing ran on trust. When neighbors believed the sacrifice was shared equally, they accepted it — sugar, gas, tires and all. A straight board made the whole system work. Fairness wasn\'t just kind here; it was the machinery of the home front.' },
          { label: 'Bend the rules quietly for a few well-connected families, now and then.',
            verdict: 'partial', effects: { fairness: -5, community: 5 },
            feedback: "Secrets like this never stay secret in a small town. Once folks learn the mayor's cousin got extra gas, every stamp feels like a cheat. A little favoritism buys a lot of resentment — and makes honest families wonder why they bother sacrificing." },
          { label: 'Play favorites openly and let the stamp black market take hold.',
            verdict: 'wrong', effects: { fairness: -15, community: -5 },
            feedback: 'A black market — illegal buying and selling outside the rules — steals directly from the war effort. Every cheated gallon of gas was fuel a bomber didn\'t get. Towns that let this rot spread lost their neighbors\' trust and drew federal investigators. A real, costly misstep.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'The government is calling for victory gardens and scrap drives — how hard does the town lean in?',
        choices: [
          { label: 'Organize it town-wide: garden plots for every block, scrap drives with the schools leading the charge.',
            verdict: 'right', effects: { community: 15, warEffort: 5 },
            feedback: "Victory gardens grew nearly 40 percent of America's vegetables by 1944, freeing farm food for the troops. Scrap metal became tanks and ships. Kids hauling old pots felt like soldiers — because in a real way, they were. Organized effort turned a town into a team." },
          { label: 'Put up a few posters and hope folks get to it.',
            verdict: 'partial', effects: { community: 5 },
            feedback: 'Some gardens get planted; most don\'t. The scrap pile stays small. Drives worked when someone organized them — set the dates, weighed the metal, named the winners. A half-hearted effort gathers half the scrap and none of the spirit.' },
          { label: 'Skip it — call the drives pointless busywork.',
            verdict: 'wrong', effects: { community: -10, warEffort: -5 },
            feedback: "The drives were more than metal. They let every kid, grandmother, and farmer fight from home, and that spirit held towns together through four hard years. Mocking them insulted your neighbors' sacrifice — and yes, the scrap really did become ships and tanks." },
        ],
      },
    ],
  },

  // ---- Phase 4 — The POW Camp (1943–1944) ----
  {
    title: 'The POW Camp', date: '1943–1944 · the enemy next door', image: 'event_camp.jpg',
    event: 'Army trucks roll past the square carrying men in gray — German prisoners of war. A POW camp is opening outside town, one of dozens in Texas, and the prisoners will work local farms under the Geneva Convention, the international rules for treating captured soldiers with basic decency. Farmers are desperate for the help; their own hands have gone to war or to the plants. But feelings run hot. Some folks lost sons fighting the very army these men marched in. Now those men will be picking cotton down the road. How the town treats its enemies is about to say a lot about the town.',
    steps: [
      {
        kind: 'decision',
        prompt: 'The camp commander asks how the town wants to handle the prisoners working its farms.',
        choices: [
          { label: 'Follow the rules fully: real work, fair pay in scrip, decent food, basic dignity.',
            verdict: 'right', effects: { fairness: 10, community: 5 },
            feedback: 'This is the real Texas record. Tens of thousands of German POWs worked Texas farms under the Geneva rules — paid in scrip, fed decently, treated as human beings. Farmers and prisoners often parted with respect, and some POWs later returned to Texas as immigrants.' },
          { label: 'Follow the rules on paper, but grudgingly — bare minimum, cold shoulder.',
            verdict: 'partial', effects: { fairness: 5 },
            feedback: "The letter of the law without its spirit. The work gets done, but sullenly and poorly, and inspections flag the camp. Remember: America's own captured soldiers depended on Germany honoring these same rules. Grudging decency protects nobody as well as the real thing." },
          { label: 'Ignore the Geneva rules — they\'re the enemy, treat them like it.',
            verdict: 'wrong', effects: { fairness: -15, community: -5 },
            feedback: 'Breaking the rules would have invited Germany to break them against American prisoners — a trade paid in our own soldiers\' suffering. It was also simply wrong. Texas\'s record here was largely honorable, and it stayed that way because towns refused this choice.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'Farmers can get POW labor cheap — what happens to the local farmhands already working those fields?',
        choices: [
          { label: 'Use POW labor to add to local Black and Mexican American farmhands\' work — never to replace it — and keep their wages fair.',
            verdict: 'right', effects: { fairness: 15, warEffort: 5 },
            feedback: 'The harvest needed every hand, prisoner and neighbor alike. Adding POW labor on top of fair local wages brought the crop in without robbing anyone\'s paycheck. The farmhands\' families had sons overseas too. Protecting their work was protecting your own people.' },
          { label: 'Let farmers use cheaper POW labor to trim costs, even if some local wages slide.',
            verdict: 'partial', effects: { warEffort: 5, fairness: -10 },
            feedback: 'Nobody announces it; it just happens. Hours get cut, wages drift down, and families who have worked these fields for generations feel the squeeze. Saving a few dollars this way taxes the very neighbors who can least afford it.' },
          { label: 'Replace the paid Black and Mexican American farmhands entirely — POW labor is nearly free.',
            verdict: 'wrong', effects: { fairness: -20, community: -5 },
            feedback: 'Name it plainly: this erased real jobs from real families to save money — a fairness violation against Texans whose own sons were serving overseas. Handing an enemy prisoner the wages of a loyal neighbor was a wrong some towns actually committed. Yours doesn\'t have to.' },
        ],
      },
    ],
  },

  // ---- Phase 5 — Oil and the Long Haul (1944) ----
  {
    title: 'Oil and the Long Haul', date: '1944 · the war grinds on', image: null,
    event: 'It is 1944, and nobody talks about the war being short anymore. Texas oil is the Allies\' lifeblood, and pipelines like the Big Inch carry it east, day and night, safe from the German submarines that once burned tankers off the coast. The plants run double shifts. The fields never rest. And the people are tired — bone tired, three years tired. Foremen report more accidents. The bond office says folks are slower to buy. This is the stretch of the war nobody puts on posters: not the beginning, not the end, just the long, grinding middle. How do you keep a weary town going?',
    steps: [
      {
        kind: 'decision',
        prompt: 'Output targets keep climbing while your workers wear down — what do you tell the foremen?',
        choices: [
          { label: 'Build in rest rotations and safety checks, even though it slows output a little.',
            verdict: 'right', effects: { warEffort: 10, community: 5 },
            feedback: 'Tired hands make mistakes, and mistakes in an oil field or on a bomber line cost lives and days of production. Rested crews worked safer and steadier, and steady won the long haul. A small slowdown now beat a shutdown later.' },
          { label: 'Push through without rotations and hope nobody gets hurt.',
            verdict: 'partial', effects: { warEffort: 15, community: -10 },
            feedback: 'The numbers look fine for a month. Then the injuries start — a crushed hand here, a fall there — and each one takes a trained worker off the line for weeks. Running people past their limits borrows output from the future at a cruel rate of interest.' },
          { label: 'Order mandatory overtime and ignore the safety complaints.',
            verdict: 'wrong', effects: { warEffort: 5, fairness: -10, community: -10 },
            feedback: 'Ignoring safety complaints in 1944 got people killed — real accidents, in real plants and fields. It also broke trust; worn-out workers quit or slowed down, and production fell anyway. Treating people like machines fails even at the machines\' own job.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'The next war-bond rally needs a message — what does the town hear from its stage?',
        choices: [
          { label: 'Tell the truth: the war is long, victory is coming, and there is more sacrifice ahead.',
            verdict: 'right', effects: { community: 10, fairness: 5 },
            feedback: 'War bonds were loans from ordinary families to their country, and honesty kept them coming. The best bond drives leveled with people — hard road, worthy cause. Towns trusted a straight talker in year four far more than a cheerleader. Truth raised money and kept faith.' },
          { label: 'Oversell it — hint that victory is just around the corner to move more bonds.',
            verdict: 'partial', effects: { community: 5, fairness: -5 },
            feedback: 'The rally raises a little more today and costs you tomorrow. When the corner comes and the war is still there, people remember who promised otherwise. The next drive falls flat. Hope inflated past the truth always comes due.' },
          { label: 'Spread rumors that the war is nearly over — whatever sells the most bonds.',
            verdict: 'wrong', effects: { community: -15 },
            feedback: 'False rumors were poison on the home front. Families let up on rationing, workers eased off the line, and when the truth arrived, morale cracked hard. Lying to your own town to hit a sales number betrayed the very trust the bonds were built on.' },
        ],
      },
    ],
  },

  // ---- Phase 6 — Victory and After (1945) ----
  {
    title: 'Victory and After', date: '1945 · the lights come back on', image: 'ending.jpg',
    event: 'August 1945. The radio crackles, the church bells answer, and suddenly the whole square is full of people laughing and crying at once. V-J Day — Victory over Japan. The war is over. But standing on the courthouse steps, you can already see the harder question coming home on the troop trains. Thousands served from this county — white, Black, and Mexican American Texans alike. The women in the plants, the farmhands, the WACs: everyone gave. Now come the jobs, the loans, the schooling, the thanks. Peace is here. Who will it belong to?',
    steps: [
      {
        kind: 'decision',
        prompt: 'The celebration is still roaring — what does the town promise its returning veterans?',
        choices: [
          { label: 'Celebrate fully — then start planning fair jobs and real respect for every returning veteran, regardless of race.',
            verdict: 'right', effects: { community: 15, fairness: 5 },
            feedback: 'Every uniform came home from the same war. Black and Mexican American Texans fought and bled beside white Texans, and a town that honored all of them told the truth about what victory cost. This promise — kept — is what the whole game has been building toward.' },
          { label: "Celebrate, and get to the veterans' planning eventually — no need to rush the details.",
            verdict: 'partial', effects: { community: 10 },
            feedback: '"Eventually" is a door that swings shut. Veterans came home fast, by the trainload, and towns without plans watched jobs, housing, and goodwill get snapped up unevenly. Vague promises drift toward the old unfair habits. Good intentions need dates and names.' },
          { label: 'Announce that the good jobs will go "to our boys first" — and everyone knows which boys you mean.',
            verdict: 'wrong', effects: { fairness: -20, community: -5 },
            feedback: 'Say it plainly: this meant white veterans only, and it told Black and Mexican American soldiers their service counted less. Men who faced enemy fire came home to closed doors. This is the wrong the whole war\'s sacrifice should have buried — and in too many towns, didn\'t.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'The new GI Bill office is opening — who gets its help with loans, schooling, and jobs?',
        choices: [
          { label: 'Back the GI Bill office for every veteran — Black and Mexican American vets included, no exceptions.',
            verdict: 'right', effects: { fairness: 15, warEffort: 5 },
            feedback: 'The GI Bill paid for college, homes, and businesses — it built the American middle class. Where every veteran could use it, whole communities rose together. Making the office serve all who served was the single fairest thing a postwar town could do.' },
          { label: "Offer GI Bill help in name, but don't push back when banks and schools quietly turn some veterans away.",
            verdict: 'partial', effects: { fairness: -5 },
            feedback: 'This is how much of the real injustice worked — not a sign on the door, but a quiet no at the bank, the college, the real estate office. A town that shrugs at quiet discrimination is choosing it. Benefits "in name" fed no families and built no homes.' },
          { label: 'Let the office openly turn away Black and Mexican American veterans.',
            verdict: 'wrong', effects: { fairness: -25, community: -5 },
            feedback: 'This exact injustice really happened — and it lit a fuse. Denied the benefits they had earned in blood, veterans organized to fight for their own rights. In 1948, Dr. Hector García founded the American GI Forum to demand them. That fight is the next chapter of Texas history.' },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Assemble the single class-wide role into a one-variant game. One side, no
// rival — so the Command Center reports ONE class accuracy group (spec §1).
// ---------------------------------------------------------------------------

export const VARIANTS = {
  town: {
    name: 'The Home Front',
    sub: "A Texas town's wartime civic coordinator · 1941–1945",
    phases: PHASES,
    waypoints: [], // no map: the town-status panel tells the story instead
  },
};

export { PHASES };

export default createStepGame({
  id: 'home-front',
  title: 'The Home Front',
  meters: METERS,
  markers: MARKERS,
  startMeters: () => ({ ...START_METERS }),
  scoreMeters: homeFrontScore,
  endingFor,
  debrief: DEBRIEF,
  variants: VARIANTS,
  // No failCheck / failEnding, and no scripted eventEffects tolls: every meter
  // delta comes straight from the player's own choice.
});
