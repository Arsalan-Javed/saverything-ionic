import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any): unknown {
    return new Date(value).toLocaleDateString();
  }

}
