import { Injectable } from "@angular/core";
import { FullGestureState, Gesture } from "@use-gesture/vanilla";
import { inertia } from "popmotion";

export interface GestureOptions {
  offset?: [number, number];
  worldSize: { width: number; height: number };
  viewAreaSize: { width: number; height: number };
  scale?: number;
}

@Injectable({
  providedIn: "root",
})
export class GestureService {
  private disabled: boolean = false;

  private offset = [0, 0];

  private worldSize = {
    width: 1280,
    height: 1080,
  };

  private viewAreaSize = {
    width: 640,
    height: 540,
  };

  get viewOffset() {
    return this.offset;
  }

  get viewWorldSize() {
    return this.worldSize;
  }

  private scaleAnimation = inertia({});
  private offsetAnimation = inertia({});

  gestureOffsetChanges: Function[] = [];

  init(element: HTMLElement, options: GestureOptions) {
    this.offset = options.offset || [0, 0];
    this.worldSize = options.worldSize || { width: 1280, height: 1080 };
    this.viewAreaSize = options.viewAreaSize || { width: 640, height: 540 };
    console.log(this.worldSize);
    new Gesture(element, {
      onDragStart: this.onDragStart.bind(this),
      onDrag: this.onDrag.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
    });
  }

  onDragStart() {
    if (this.disabled) return;
    this.offsetAnimation?.stop();
    this.scaleAnimation?.stop();
  }

  private onDrag(state: FullGestureState<"drag">) {
    if (this.disabled) return;
    const { delta } = state;
    this.setOffset(delta[0], delta[1]);
  }

  private onDragEnd(state: FullGestureState<"drag">) {
    if (this.disabled) return;
    const { delta } = state;
    this.setOffset(delta[0], delta[1]);
  }

  setOffset(x: number, y: number) {
    if (
      x + this.offset[0] > this.worldSize.width - this.viewAreaSize.width ||
      y + this.offset[1] > this.worldSize.height - this.viewAreaSize.height
    )
      return;
    this.offset = [x + this.offset[0], y + this.offset[1]];
    this.onOffsetChangecallback();
  }

  onOffsetChange(fun: Function) {
    this.gestureOffsetChanges.push(fun);
  }

  private onOffsetChangecallback() {
    this.gestureOffsetChanges.forEach((fun) => {
      fun(this.offset);
    });
  }

  setDisabledStatus(status: boolean) {
    this.disabled = status;
  }

  convertToHtmlCoords(x: number, y: number) {
    let toX = x + this.worldSize.width / 2;
    let toY = y + this.worldSize.height / 2;
    console.log("convertToHtmlCoords", this.worldSize, toX, toY);
    return { x: toX, y: toY };
  }

  convertToCenteredCoords(x: number, y: number) {
    let toX = x - this.worldSize.width / 2;
    let toY = y - this.worldSize.height / 2;
    console.log("convertToCenteredCoords", this.worldSize, toX, toY);
    return { x: toX, y: toY };
  }
}
