import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GuiModule } from "@acrodata/gui";
import { FormGroup } from "@angular/forms";
import { Postion, ViewGroupOptions } from "./view-group-options";
import { MatCardModule } from "@angular/material/card";
import { CdkDrag, CdkDragHandle, CdkDragMove } from "@angular/cdk/drag-drop";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-view-group",
  standalone: true,
  imports: [
    GuiModule,
    MatCardModule,
    CdkDrag,
    CdkDragHandle,
    MatProgressBarModule,
    NgIf,
  ],
  templateUrl: "./view-group.component.html",
  styleUrl: "./view-group.component.scss",
})
export class ViewGroupComponent implements OnInit {
  @Input() options!: ViewGroupOptions;
  model = {};
  form = new FormGroup({});
  progressValue?: number;
  styles: Record<string, string> = {};

  @Output() postionChange = new EventEmitter<Postion>();

  ngOnInit(): void {
    this.setStyles();
  }

  setStyles() {
    this.styles["left"] = this.options.postion.x + "px";
    this.styles["top"] = this.options.postion.y + "px";
  }

  onDragMoved(event: CdkDragMove) {
    const tager = event.source.element.nativeElement;
    this.postionChange.emit(event.pointerPosition);
  }
}
