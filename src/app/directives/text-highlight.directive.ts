import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  Renderer2,
  Input
} from '@angular/core';

@Directive({
  selector: '[appTextHighlight]',
})
export class TextHighlightDirective implements OnInit {
  // @HostBinding('style.color') textColor = 'black';
  @Input('appTextHighlight') defaultColor: string = 'pink'

  nativeEl: HTMLParagraphElement;

  constructor(public el: ElementRef, private renderer: Renderer2) {
    this.nativeEl = this.el.nativeElement;
  }

  ngOnInit() {
    console.log(this.el.nativeElement);
    // this.textColor = 'pink'
    this.renderer.setStyle(this.nativeEl, 'color', this.defaultColor);
  }

  @HostListener('mouseenter')
  mouseOver() {
    this.nativeEl.style.backgroundColor = 'green';
    this.renderer.setStyle(this.nativeEl, 'color', 'white');
  }

  @HostListener('mouseleave')
  mouseLeave() {
    this.nativeEl.style.backgroundColor = 'white';
    this.renderer.setStyle(this.nativeEl, 'color', this.defaultColor);
  }
}
