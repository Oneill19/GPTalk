import { ElementRef, WritableSignal } from '@angular/core';
import { Exercise } from '../../../models/exercise.interface';

/**
 * Contains functions used by the Learn component's html templates
 */
export class LearnHtmlUtils {
  /**
   * Refocuses on the text input element (used whenever the element loses focus)
   */
  static forceFocus(inputFieldRef: ElementRef) {
    if (inputFieldRef) { //If the input element is active
      inputFieldRef.nativeElement.focus();
    }
  }

  /**
   * Returns true if the HTML element that called the function contains the correct answer
   * @param choice the string displayed on the element that called the function
   * @param exercise signal containing the current exercise data
   */
  static elemContainsAnswer(choice: string, exercise: WritableSignal<Exercise>): boolean {
    return exercise().answer === choice;
  }

  /**
   * Returns 'rtl' to alter the text direction of the element that called the function
   * if the given language is a right-to-left one (hebrew)
   * @param exercise the data of the currently active exercise
   * @returns DOM directionality
   */
  static langDirection(exercise: WritableSignal<Exercise>) {
    return exercise().language?.toString() === 'hebrew' ? 'rtl' : 'ltr';
  }

}
