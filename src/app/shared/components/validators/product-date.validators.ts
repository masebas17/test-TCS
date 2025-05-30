import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function releaseDateValidator(
  control: AbstractControl
): ValidationErrors | null {
  const today = new Date();
  const releaseDate = new Date(control.value);
  releaseDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return releaseDate >= today ? null : { invalidReleaseDate: true };
}

export const revisionDateValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const release = control.get('date_release')?.value;
  const revision = control.get('date_revision')?.value;

  if (!release || !revision) return null;

  const releaseDate = new Date(release);
  const revisionDate = new Date(revision);

  const expectedRevision = new Date(releaseDate);
  expectedRevision.setFullYear(expectedRevision.getFullYear() + 1);

  return revisionDate.toDateString() === expectedRevision.toDateString()
    ? null
    : { invalidRevisionDate: true };
};
