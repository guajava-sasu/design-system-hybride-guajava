import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';
import { initShowcase } from './showcase-behaviors.js';

@Directive()
export abstract class ShowcasePage implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit(): void {
    initShowcase(this.host.nativeElement);
  }
}
