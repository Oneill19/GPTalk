import { WritableSignal } from '@angular/core';
import { Exercise } from '../../../core/interfaces/exercise.interface';
import { ExerciseType } from '../../../core/enums/exercise-type.enum';
import { MiscUtils as util } from '../../../core/utils/misc.utils';

/**
 * Contains functions related to answer verifications
 */
export class LearnVerificationUtils {
	/**
	 * Compares the user's chosen answer with the exercise's actual answer
	 * If the answer was manually entered, the string is used in the comparison
	 *
	 * Used by exercise types: FillInTheBlank, TranslateWord, TranslateTheSentence, CompleteTheConversation
	 * @param answer  the answer submitted by the user for verification
	 * @param exercise the data of the currently active exercise
	 */
	static verifyAnswer(answer: string, exercise: WritableSignal<Exercise>) {
		// Normalizing the user's answer and the actual answer, removing any punctuation marks
		answer = answer
			.toLowerCase()
			.trim()
			.replace(/[,.!?:]/g, '')
			.normalize();
		const actualAnswer = exercise().answer?.replace(/[,.!?:]/g, '') ?? '';

		// Exact answer
		if (answer === actualAnswer) return true;
		// Approximate the answer if it was submitted by manually typing it
		// and compare it to the actual answer
		else return util.findClosestString(answer, exercise) === actualAnswer;
	}

	/**
	 * Verifies the user's answer in the translateTheSentence exercise
	 * Gives a penalty based on the level of inaccuracy of the user's answer
	 * compared to the actual answer
	 * @param answer the user's answer
	 * @param exercise the exercise object containing the actual answer string
	 * @param penalties exp penalty counter
	 */
	static verifyTranslateSentence(
		answer: string,
		exercise: WritableSignal<Exercise>,
		penalties: WritableSignal<number>,
	) {
		const ratio = util.getSimilarityRatio(answer, exercise);
		if (ratio == 1) {
			return true;
		}

		// Correct answer with penalty of 10 exp
		else if (ratio > 0.9 && ratio < 1) {
			penalties.update((value) => value + 1);
			return true;
		}

		// Correct answer with penalty of 20 exp
		else if (ratio > 0.8 && ratio <= 0.9) {
			penalties.update((value) => value + 2);
			return true;
		}

		// Correct answer with penalty of 30 exp
		else if (ratio >= 0.75 && ratio <= 0.8) {
			penalties.update((value) => value + 3);
			return true;
		} else return false;
	}
	/**
	 * Checks if the chosen pair matches a pair in the answer array
	 * If the pair is a match, returns "matchFound"
	 * If the pair is not a match, returns "wrongMatch"
	 * If the pair is the final match, returns "allMatchesFound"
	 *
	 * Used by exercise types: MatchTheWords
	 * @param chosenPair the signal containing the currently chosen pair ow words
	 * @param matchResults the signal containing the states of the word matches in the current exercises
	 * @param exercise the data of the currently active exercise
	 */
	static verifyMatch(
		chosenPair: WritableSignal<[string, string]>,
		matchResults: WritableSignal<[boolean, boolean][]>,
		exercise: WritableSignal<Exercise>,
	) {
		const leftWord = chosenPair()[0];
		const rightWord = chosenPair()[1];

		// If the correct pairs array includes the pair [leftWord, rightWord], a match has been found
		if (exercise().correctPairs?.some(([left, right]) => left == leftWord && right == rightWord)) {
			// Update the result pairs array to reflect the found match (used to highlight a correct match on the screen)
			matchResults.update((data) => {
				// Get the indices of both matching words in the words array
				const leftIdx = exercise().randomizedPairs?.findIndex(([left]) => left == leftWord) ?? -1;
				const rightIdx =
					exercise().randomizedPairs?.findIndex(([, right]) => right == rightWord) ?? -1;

				// Update the match results array at the corresponding indices
				if (leftIdx != -1 && rightIdx != -1) {
					data[leftIdx][0] = true;
					data[rightIdx][1] = true;
				}
				return data;
			});

			// If all booleans in the match results array are 'true', the exercise is complete
			if (!matchResults().some(([left, right]) => !left || !right)) {
				return 'allMatchesFound';
			} else {
				return 'matchFound';
			}
		}
		return 'wrongMatch';
	}

	/**
	 * Checks if all words were matched to the correct categories
	 *
	 * Used by exercise types: MatchTheCategory
	 * @param categoryMatches the signal containing the categories and the categorized word arrays
	 * @param exercise the data of the currently active exercise
	 */
	static verifyCategories(
		categoryMatches: WritableSignal<{ wordBank: string[]; cat1: string[]; cat2: string[] }>,
		exercise: WritableSignal<Exercise>,
	) {
		const correctCat_a = exercise().words_a ?? [];
		const correctCat_b = exercise().words_b ?? [];
		const userCat_a = categoryMatches().cat1;
		const userCat_b = categoryMatches().cat2;

		return (
			correctCat_a.every((word) => userCat_a.includes(word)) &&
			correctCat_b.every((word) => userCat_b.includes(word))
		);
	}
}
