import { Directive, Input, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[titleTooltip]'
})
export class TitleTooltipDirective implements OnInit {
  @Input('titleTooltip') text: string;
  constructor(
    public tooltip: MatTooltip
  ) { }

  ngOnInit(): void {
    this.tooltip.message = this.text;
    this.tooltip.showDelay = 400;
  }
}
