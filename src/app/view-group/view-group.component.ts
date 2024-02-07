import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { GuiModule } from "@acrodata/gui";
import { FormGroup } from "@angular/forms";
import { Postion, ViewGroupOptions } from "./view-group-options";
import { MatCardModule } from "@angular/material/card";
import {
  CdkDrag,
  CdkDragEnd,
  CdkDragHandle,
  CdkDragMove,
  CdkDragStart,
} from "@angular/cdk/drag-drop";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgIf } from "@angular/common";
import { GestureService } from "../service/gesture.service";

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
export class ViewGroupComponent implements AfterViewInit {
  @Input() options!: ViewGroupOptions;
  model = {};
  form = new FormGroup({});
  progressValue?: number;
  styles: Record<string, string> = {};

  @Output() postionChange = new EventEmitter<Postion>();

  constructor(private gestureService: GestureService) {}

  ngAfterViewInit() {
    this.setStyles();
  }

  setStyles() {
    const postion = this.gestureService.convertToHtmlCoords(
      this.options.postion.x,
      this.options.postion.y
    );
    this.styles = {
      left: postion.x + "px",
      top: postion.y + "px",
    };
  }

  onDragStarted(event: CdkDragStart) {
    this.gestureService.setDisabledStatus(true);
  }

  onDragMoved(event: CdkDragMove) {
    const postion = this.gestureService.convertToCenteredCoords(
      event.pointerPosition.x,
      event.pointerPosition.y
    );
    this.postionChange.emit(postion);
  }

  onDragEnded(event: CdkDragEnd) {
    this.gestureService.setDisabledStatus(false);
  }
}
