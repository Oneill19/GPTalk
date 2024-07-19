import { ExerciseType } from './enums/exercise-type.enum';
import { Language } from './enums/language.enum';
import { SafeHtml } from '@angular/platform-browser';

export interface Exercise {
  type: ExerciseType;
  heading?: string; // Concise goal of the current exercise
  instructions?: string; // Detailed instructions of the current exercise
  question?: string;
  choices?: string[];
  correctPairs?: [string, string][];
  randomizedPairs?: [string, string][]; // The word pairs with each column being independently shuffled
  answer?: string;
  translation?: string;
}
