import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'blogs-home',
  standalone: true,
  imports: [ RouterModule, ],
  templateUrl: './blogs-home.page.html',
  styleUrl: './blogs-home.page.scss'
})
export class BlogsHomePage {

}
