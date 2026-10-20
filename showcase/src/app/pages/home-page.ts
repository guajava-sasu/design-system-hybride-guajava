import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShowcasePage } from '../showcase-page';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
})
export class HomePage extends ShowcasePage {}
