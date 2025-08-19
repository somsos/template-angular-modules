import { Component } from '@angular/core';
import { BlogsHomePage } from '../blogs-home/blogs-home.page';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [ BlogsHomePage ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {

}
