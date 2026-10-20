import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShowcasePage } from '../showcase-page';

@Component({
  selector: 'app-layout-utilities-page',
  imports: [RouterLink],
  templateUrl: './layout-utilities-page.html',
})
export class LayoutUtilitiesPage extends ShowcasePage {}
