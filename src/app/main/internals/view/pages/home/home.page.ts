import { Component } from '@angular/core';
import { ProjectIntroductionComponent } from '../../components/project-intruduction/project-introduction.component';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [ProjectIntroductionComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {

}
