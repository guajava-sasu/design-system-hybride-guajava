import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShowcasePage } from '../showcase-page';

@Component({
  selector: 'app-advanced-patterns-page',
  imports: [RouterLink],
  templateUrl: './advanced-patterns-page.html',
})
export class AdvancedPatternsPage extends ShowcasePage {}
