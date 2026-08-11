/**
 * Reports exercise-intelligence coverage and validates every authored value.
 * `--strict` additionally rejects missing entries and `unknown` ratings.
 */

import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import type { ExerciseIntelligence, ExerciseRating } from '../src/data/exercises/types';

const strict = process.argv.includes('--strict');
const failures: string[] = [];
const missing: string[] = [];
const unknown: string[] = [];

const ratingFields: (keyof ExerciseIntelligence)[] = [
    'stabilityDemand',
    'systemicCost',
    'axialCost',
    'lowerBackCost',
    'elbowCost',
    'shoulderCost',
    'kneeCost',
    'lengthenedBias',
    'shortenedBias',
];

const validRating = (value: unknown): value is ExerciseRating =>
    value === 'unknown' || value === 0 || value === 1 || value === 2 || value === 3 || value === 4;

const ids = new Set<string>();
for (const exercise of EXERCISE_LIBRARY) {
    if (ids.has(exercise.id)) failures.push(`duplicate exercise id: ${exercise.id}`);
    ids.add(exercise.id);

    const metadata = exercise.intelligence;
    if (!metadata) {
        missing.push(`${exercise.id} (${exercise.name.en})`);
        continue;
    }

    if (metadata.schemaVersion !== 1) failures.push(`${exercise.id}: schemaVersion must be 1`);
    if (metadata.provenance !== 'codex-v1' && metadata.provenance !== 'owner-reviewed-v1') {
        failures.push(`${exercise.id}: invalid provenance`);
    }

    for (const field of ratingFields) {
        const value = metadata[field];
        if (!validRating(value)) failures.push(`${exercise.id}.${field}: expected 0..4 or unknown`);
        if (value === 'unknown') unknown.push(`${exercise.id}.${field}`);
    }

    for (const field of ['systemicCompound', 'homeCompatible', 'cameraFriendly', 'densityCompatible'] as const) {
        if (typeof metadata[field] !== 'boolean') failures.push(`${exercise.id}.${field}: expected boolean`);
    }

    if (!['avoid', 'advanced-only', 'suitable'].includes(metadata.failureSuitability)) {
        failures.push(`${exercise.id}.failureSuitability: invalid value`);
    }
}

if (strict && missing.length) failures.push(`${missing.length} exercises have no intelligence metadata`);
if (strict && unknown.length) failures.push(`${unknown.length} rating fields remain unknown`);

console.log(`\nExercise metadata: ${EXERCISE_LIBRARY.length - missing.length}/${EXERCISE_LIBRARY.length} authored`);
console.log(`Unknown ratings: ${unknown.length}`);
if (missing.length) {
    console.log(`Missing (${missing.length}):`);
    for (const item of missing.slice(0, 25)) console.log(`  - ${item}`);
    if (missing.length > 25) console.log(`  ... and ${missing.length - 25} more`);
}

if (failures.length) {
    console.error(`\naudit:exercise-metadata FAILED (${failures.length})`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}

console.log(strict ? 'Strict metadata audit passed.\n' : 'Metadata shape audit passed (non-strict).\n');

