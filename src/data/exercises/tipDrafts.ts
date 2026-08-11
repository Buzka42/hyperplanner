/**
 * Drafted English general cues, awaiting owner audit.
 *
 * These are the movements that reached the two-layer tip system with no general
 * coaching cue at all. They are kept in a separate file, and flagged
 * `tipStatus: 'draft'`, so the audit ledger is a diff rather than a hunt: once
 * a cue is approved it can be promoted into the library entry and dropped from
 * here, and the admin Library tab filters on the same flag.
 *
 * Authoring rules, from docs/architecture/exercise-tip-authoring.md:
 *
 *   - one to three of: the setup detail that changes the movement, the cue that
 *     prevents the common invalid rep, the intended range, the quality stop
 *     condition, or a progression constraint intrinsic to the exercise;
 *   - nothing about plan phase, weekly load, prescribed RIR, set counts or test
 *     days — that is prescription content and belongs to the other layer;
 *   - no medical, rehabilitation or fake-biomechanical claims.
 *
 * Polish is deliberately absent. It is written only after the English content
 * is approved, so a rejected cue never becomes a translation source.
 */

/** exerciseId -> drafted English general cue. */
export const TIP_DRAFTS_EN: Record<string, string> = {
    // --- squat and knee-dominant ---------------------------------------------
    'low-bar-squat': 'Bar on the rear delts, wrists neutral, more forward lean than a high-bar squat. Break at the hips and knees together; stop the set when the chest starts dropping ahead of the hips.',
    'high-box-squat': 'Sit back to the box under control and pause without rocking. The box sets the depth, not a bounce off it.',
    'low-box-squat': 'Sit to the box at or just below parallel, stay tight through the pause, then drive up without shifting forward.',
    'paused-squat': 'Full stop at the bottom with the torso braced. Hold the position rather than sinking into it, then stand without a bounce.',
    'tempo-squat': 'Control the descent for the prescribed count and keep it even — most tempo squats are fast at the bottom, which is the part that matters.',
    'safety-bar-squat': 'Hold the handles without pulling the bar down, and let the yoke keep the torso upright. Elbows stay under the bar, not flared forward.',
    'zercher-squat': 'Bar in the crook of the elbows, held tight to the body. Keep the chest up; the set ends when the bar starts sliding, not when the legs give out.',
    'mid-pin-squat': 'Start from a dead stop on the pins with everything already braced. No rebound off the pins.',
    'banded-squat': 'The band gets heavier as you stand, so accelerate through the top rather than letting it stall you.',
    'bulgarian-split-squat': 'Rear foot on the bench, front shin roughly vertical, weight through the whole front foot. Work the weaker side first and match it with the stronger one.',
    'heel-elevated-goblet-squat': 'Heels raised, torso tall, knees travelling forward over the toes. Sit straight down rather than back.',
    'cable-cyclist-squat': 'Heels elevated and stance narrow so the quads take the work. Keep the cable tension constant at the top.',
    'leg-press': 'Feet mid-platform, lower until the pelvis is about to round off the pad, then press without locking the knees hard. Range beats plate count here.',
    'high-foot-leg-press': 'Feet high on the platform shifts the work toward the hips and hamstrings. Keep the lower back flat against the pad.',
    'narrow-stance-leg-press': 'Feet close and low on the platform for the quads. Stop the descent when the hips start to tuck.',
    'leg-extension': 'Line the knee up with the machine pivot, pause briefly at the top, and lower under control instead of letting the stack drop.',

    // --- hinge, hip extension and hamstrings ---------------------------------
    'conventional-deadlift': 'Bar over mid-foot, lats set, hips high enough that the bar leaves the floor with the shoulders slightly ahead of it. Stop the set when the lower back starts rounding on the way up.',
    'paused-deadlift': 'Pause just off the floor or below the knee without relaxing. The hold is the point; do not use it to reposition.',
    'deficit-deadlift': 'Standing on the deficit adds range at the hardest position. Keep the same start position you would use on the floor and reduce the load to get it.',
    'paused-deficit-deadlift': 'Deficit plus a pause is the most demanding version of the start. Hold position rather than sagging into the bar.',
    'deficit-snatch-grip-deadlift': 'Wide grip and a deficit put the upper back under real load. Keep the bar against the legs and stop when the upper back gives way.',
    'block-pull': 'Bar on the blocks, same brace and lat set as a floor pull. Do not let the shortened range turn it into a stiff-legged pull.',
    'anderson-deadlift': 'Every rep starts dead from the pins with no rebound. Reset the brace between reps.',
    'speed-deadlift-with-bands': 'Move the bar as fast as you can while keeping position. Accelerate through the lockout rather than easing into it.',
    'barbell-romanian-deadlift': 'Bar close to the legs, hips back, knees soft and fixed. Lower until the hamstrings stop lengthening — not until the bar reaches the floor.',
    'cable-romanian-deadlift': 'Constant tension from the cable makes the stretch position the hardest part. Keep the pull horizontal rather than letting it drift up.',
    'deficit-romanian-deadlift': 'Standing on a plate adds stretch at the bottom. Add range before you add load.',
    'single-leg-dumbbell-romanian-deadlift': 'Hips square, weight tracking close to the working leg. Stop when the hip starts to open rather than chasing depth.',
    'good-mornings': 'Bar high on the back, hips back, spine held still. Keep the load light enough that the position never changes.',
    'cable-pull-through': 'Drive the hips forward to finish; this is a hinge, not a squat or a lower-back extension. Squeeze at lockout without leaning back.',
    'seated-ham-curl': 'Hips fixed against the pad and torso still. Control the return; the lengthened position is where the work is.',

    // --- hip thrust and glutes ------------------------------------------------
    'bench-hip-thrust': 'Bench under the shoulder blades, chin tucked, ribs down. Finish with the hips level rather than hyperextending the lower back.',
    'dumbbell-hip-thrust': 'Dumbbell across the hips with a pad. Same lockout as a barbell thrust: hips level, ribs down, brief squeeze.',
    'b-stance-hip-thrust': 'Working foot flat, the other only for balance on the heel. Most of the load stays on the working side.',
    'frog-pump': 'Soles together, knees out. Short range and constant tension; drive from the glutes rather than the lower back.',

    // --- horizontal press and chest -------------------------------------------
    'spoto-press': 'Stop the bar an inch off the chest and hold it there, then press. No touch, no bounce.',
    'larsen-press': 'Feet off the floor, so nothing comes from leg drive. Keep the upper back tight against the bench.',
    'long-pause-bench-press': 'Full stop on the chest with the bar still. The pause is the exercise; shorten the set before shortening the pause.',
    'low-pin-press': 'Dead stop on the pins near chest height. Reset the brace each rep rather than rebounding.',
    '30-smith-incline-bench-press': 'Fixed bar path, so set the bench position first. Touch high on the chest and press without letting the shoulders roll forward.',
    'hammer-chest-press': 'Set the seat so the handles line up with mid-chest. Press without shrugging, and stop short of a hard lockout to keep tension.',
    'dual-cable-chest-press': 'Cables set at chest height, a slight forward lean and a step out to load the start. Press and let the hands converge.',
    'push-up': 'Body in one line, hands under the shoulders, chest to the floor. The set ends when the hips start sagging.',
    'close-grip-push-up': 'Hands inside shoulder width, elbows tracking back. Keep the ribs down rather than arching to reach the floor.',
    'diamond-push-up': 'Hands together under the sternum, elbows close. Stop the set when the elbows start flaring.',
    'deficit-push-up': 'Hands elevated on plates or handles for extra stretch. Lower slowly into the added range instead of dropping into it.',
    'bodyweight-dip': 'Slight forward lean for the chest, upright for the triceps. Lower to a comfortable stretch and stop the set at the first sign of shoulder pinch.',
    'mid-cable-fly': 'Soft fixed elbow angle throughout. Open until the chest is stretched, then bring the hands together rather than pressing.',
    'low-to-high-cable-fly': 'Hands travel up and in, finishing in front of the collarbone. Keep the elbow angle constant.',
    'cable-crossover': 'Slight forward lean, hands crossing past each other at the finish. Control the return; the stretch is the point.',
    'reverse-pec-deck': 'Chest against the pad, arms nearly straight, lead with the elbows. Stop when the traps take over.',
    'single-arm-reverse-pec-deck': 'One arm lets the shoulder blade move naturally. Keep the torso still; do not rotate into the rep.',

    // --- vertical and horizontal pull ----------------------------------------
    'pull-up': 'Full hang, shoulders set, chin over the bar without kipping. Lower under control — the eccentric is most of the value.',
    'weighted-pull-up': 'Total system weight is bodyweight plus the belt load. Full hang to chin over the bar; stop the set when range shortens.',
    'inverted-row': 'Body in one line, bar to the sternum, shoulder blades finishing together. Raise the bar or bend the knees to regress rather than shortening the range.',
    'barbell-row': 'Torso angle fixed for the whole set. Pull to the lower ribs and stop when the torso starts rising to meet the bar.',
    'dumbbell-seal-row': 'Chest on the bench removes any body English. Pull to the hips and pause; nothing moves but the arms and shoulder blades.',
    'bench-supported-one-arm-dumbbell-row': 'Support the free hand and keep the torso square. Row toward the hip rather than the armpit.',
    'kneeling-one-arm-cable-row': 'Half-kneeling and braced, so the pull comes from the back rather than the trunk. Let the shoulder blade travel forward at the start.',
    'single-arm-cable-row': 'Allow the shoulder blade to reach at the front and finish by pulling it back, not by twisting the torso.',
    'rope-cable-row': 'Pull the rope to the mid-section and separate the hands at the finish. Elbows stay close.',
    'dual-cable-high-row': 'Pull down and back toward the lower ribs. Keep the chest up; this is a row, not a pulldown.',
    'hammer-underhand-pulldown': 'Underhand grip brings in the lower lats and biceps. Drive the elbows to the ribs and stop the set when the torso starts swinging.',
    'dumbbell-pullover': 'Ribs down and hips low. Reach back until the lats stretch, then pull the weight over the chest without arching.',

    // --- delts, arms and forearms ---------------------------------------------
    'smith-overhead-press': 'Fixed bar path, so seat position sets everything. Press without letting the ribs flare, and stop short of a hard lockout.',
    'arnold-press': 'Rotate from palms-in to palms-forward as you press. Keep the rotation smooth rather than snapping at the bottom.',
    'seated-dumbbell-lateral-raise': 'Seated removes the swing. Lead with the elbows to shoulder height and lower slowly.',
    'leaning-one-arm-lateral-raise': 'Lean away from the working side to load the stretch. Keep the torso still — the lean is the setup, not part of the rep.',
    'cable-lateral-raise': 'Constant tension through the whole range. Raise to shoulder height with the elbow leading and control the return.',
    'y-raise': 'Arms out at roughly forty-five degrees with the thumbs up. Light load; stop when the traps take over.',
    'band-pull-aparts': 'Arms nearly straight, pull until the band touches the chest. Squeeze the shoulder blades without shrugging.',
    'face-pulls': 'Rope at eye level, pull toward the face and rotate the hands back. Light and controlled; this is not a heavy row.',
    'rear-delt-rope-pulls-to-face': 'High cable, elbows travelling out and back. Stop before the lower back starts extending to help.',
    'shrug': 'Straight up and down. Pause at the top; rolling the shoulders adds nothing and loads the joint awkwardly.',
    'standing-straight-bar-curl': 'Elbows at the sides, no swing. The set ends when the torso starts moving, not when the arms fail.',
    'straight-bar-cable-curl': 'Constant tension throughout. Keep the elbows fixed and squeeze at the top without pulling back.',
    'low-pulley-cable-curl': 'Cable from the low pulley keeps tension at the stretch. Do not let the elbows drift forward.',
    'dumbbell-hammer-curl': 'Neutral grip throughout, elbows fixed at the sides. Control the lowering; this one is easy to cheat.',
    'hammer-curl': 'Neutral grip, elbows fixed at the sides, no swing. Lower under control — this one is easy to cheat and the eccentric is where the brachialis works.',
    'rope-hammer-curl': 'Neutral grip with the rope, elbows at the sides. Pull the ends slightly apart at the top.',
    'ezbar-skullcrushers': 'Lower toward the forehead or just behind it with the elbows fixed. Stop the set at the first elbow discomfort rather than pushing through it.',
    'banded-ezbar-bar-skullcrushers': 'Band tension peaks at lockout, so keep the elbows still and finish the extension deliberately.',
    'lying-dumbbell-skullcrusher': 'Dumbbells allow a slightly kinder elbow path. Keep the upper arms still and lower behind the head.',
    'rolling-dumbbell-tricep-extension': 'Roll the dumbbells back past the head, then extend. The roll is what makes the stretch; do not shorten it.',
    'french-press': 'Elbows in and pointed up, lower behind the head under control. Reduce the load before letting the elbows flare.',
    'one-dumbbell-overhead-triceps-extension': 'Both hands on one dumbbell, elbows close to the head. Full stretch at the bottom, no arching to press it up.',
    'single-arm-overhead-extension': 'Keep the working elbow pointed up and close to the head. The free hand supports rather than assists.',
    'rope-pressdown': 'Elbows pinned at the sides, separate the rope at lockout. Stop when the shoulders start driving the movement.',
    'triangle-pushdown': 'Neutral grip on the attachment, elbows fixed. Full extension at the bottom without leaning into it.',

    // --- calves, trunk and the rest -------------------------------------------
    'calf': 'Full stretch at the bottom and a real pause at the top. Bouncing turns this into a tendon exercise.',
    'standing-calf-raise-off-step': 'Heels well below the step for full stretch, then all the way up. Slow at both ends.',
    'seated-dumbbell-calf-raise': 'Seated bends the knee and shifts the work to the soleus. Pause at the top of every rep.',
    'standing-dumbbell-kb-calf-raise': 'Balance against something so the calves do the work rather than the ankles stabilising. Full range, brief squeeze.',
    'smith-calf-raise': 'The fixed bar lets you push the stretch safely. Do not rush the bottom position.',
    'single-leg-cable-calf-raise': 'One leg at a time, full stretch and a pause. Match the weaker side.',
    'plank': 'One line from head to heels with the ribs down and glutes on. End the set when the hips drop, not when the timer says so.',
    'cable-crunch': 'Round the spine down toward the knees rather than hinging at the hips. Control the return.',
    'cable-crunches': 'Round the spine down toward the knees rather than hinging at the hips. Control the return.',
    'weighted-crunch': 'Short range, spine rounding, no hip flexor pull. Add load only once the movement stays clean.',
    'bench-reverse-crunch': 'Lift the hips off the bench with the abs rather than swinging the legs. Slow on the way down.',
    'ab-wheel': 'Ribs down and hips tucked. Roll out only as far as you can hold that position, and stop the set the moment the lower back arches.',
    'dumbbell-walking-lunge': 'Torso upright, step long enough that the front shin stays near vertical. Stop when the steps start shortening.',

    // --- machines and placeholders --------------------------------------------
    'apex-access-placeholder': 'Placeholder slot for a selected access movement. The prescribed movement carries its own cue.',
};
