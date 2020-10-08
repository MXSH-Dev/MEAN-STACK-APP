import { Observable, Observer, of } from 'rxjs';

import { AbstractControl } from '@angular/forms';

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  // check if the type of the form control value is string
  // if type is string, it means it is not new image file selected
  // skip validation
  if (typeof control.value === 'string') {
    // of returns a new observable
    return of(null);
  }

  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReaderObservable = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
          0,
          4
        );

        let header: string = '';

        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        let isValid: boolean = false;

        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false;
        }

        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ ivliadMimeType: true });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    }
  );

  return fileReaderObservable;
};
