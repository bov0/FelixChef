import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-sort-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sort-select.component.html'
})
export class SortSelectComponent {
  @Input({ required: true }) label!: string;
  @Input() mobileLabel = '';
  @Input({ required: true }) value!: string;
  @Input({ required: true }) options!: SortOption[];
  @Output() valueChange = new EventEmitter<string>();

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }
}
