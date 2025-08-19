import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'structured-data-blog',
  standalone: true,
  imports: [ ],
  templateUrl: './structured-data.html',
  styleUrl: './structured-data.scss'
})
export class StructuredDataBlogComponent {

  constructor(private scroller: ViewportScroller) { }

  scrollTo(anchor: string) {
    this.scroller.scrollToAnchor(anchor);
  }

}
