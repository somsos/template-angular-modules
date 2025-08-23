import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'project-introduction',
  standalone: true,
  imports: [],
  templateUrl: './project-introduction.component.html',
  styleUrl: './project-introduction.component.scss'
})
export class ProjectIntroductionComponent {

  constructor(private scroller: ViewportScroller) { }

  scrollTo(anchor: string) {
    this.scroller.scrollToAnchor(anchor);
  }

}
