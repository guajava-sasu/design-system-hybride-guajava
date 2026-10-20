import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShowcasePage } from '../showcase-page';

@Component({
  selector: 'app-colors-page',
  imports: [RouterLink],
  templateUrl: './colors-page.html',
})
export class ColorsPage extends ShowcasePage {}
