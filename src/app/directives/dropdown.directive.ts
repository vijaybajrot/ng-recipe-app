import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

// import { Dropdown } from 'bootstrap';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective implements OnInit, OnDestroy {
  // dropdown!: Dropdown;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    // this.dropdown = new Dropdown(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    // this.dropdown.dispose()
  }
}
