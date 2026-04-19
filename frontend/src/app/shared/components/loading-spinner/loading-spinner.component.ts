import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-3 py-8">
      <div
        [class]="
          'rounded-full border-2 border-white/5 animate-spin ' + sizeClass
        "
        style="border-top-color: #f97316; border-right-color: #ef444440;"
      ></div>
      @if (message) {
        <span
          class="text-xs uppercase tracking-widest"
          style="color:#6060a0;"
          >{{ message }}</span
        >
      }
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message = '';

  get sizeClass(): string {
    return { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' }[this.size];
  }
}
