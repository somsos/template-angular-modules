import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'importancia-devops',
  standalone: true,
  templateUrl: './importancia-devops.html',
  styleUrl: './importancia-devops.scss'
})
export class ImportanciaDeDevops {

  constructor(private scroller: ViewportScroller) { }

  scrollTo(anchor: string) {
    this.scroller.scrollToAnchor(anchor);
  }

}
