import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShowcasePage } from '../showcase-page';

@Component({
  selector: 'app-actions-navigation-page',
  imports: [RouterLink],
  templateUrl: './actions-navigation-page.html',
})
export class ActionsNavigationPage extends ShowcasePage {}
