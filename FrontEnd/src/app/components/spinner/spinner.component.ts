import { Component, OnInit } from '@angular/core';

import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  constructor() {}

  ngOnInit(): void {}
}
