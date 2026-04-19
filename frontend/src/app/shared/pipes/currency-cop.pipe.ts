import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyCop',
  standalone: true
})
export class CurrencyCopPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) {
      return '$ 0';
    }
    return '$ ' + value.toLocaleString('es-CO');
  }
}
