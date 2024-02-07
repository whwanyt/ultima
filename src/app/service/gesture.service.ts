import { Injectable } from "@angular/core";
import { FullGestureState, Gesture } from "@use-gesture/vanilla";
import { inertia } from "popmotion";

@Injectable({
  providedIn: "root",
})
export class GestureService {
  private initialScale = 0;
  private lastPinchTime = 0;
  private lastWheelTime = 0;
  private lastClickTime = 0;
  private lastDragTime = 0;
  private lastOrigin = [0, 0];
  private offset = [0, 0];

  private scaleAnimation = inertia({});
  private offsetAnimation = inertia({});

  gestureOffsetChanges: Function[] = [];

  init(element: HTMLElement) {
    new Gesture(element, {
      onDragStart: this.onDragStart.bind(this),
      onDrag: this.onDrag.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
    });
  }

  onDragStart() {
    this.offsetAnimation?.stop();
    this.scaleAnimation?.stop();
  }

  private onDrag(state: FullGestureState<"drag">) {
    const { pinching, wheeling, timeStamp, delta } = state;
    if (pinching || wheeling || timeStamp - this.lastPinchTime < 200) {
      return;
    }
    this.setOffset(this.offset[0] - delta[0], this.offset[1] - delta[1]);
  }

  private onDragEnd(state: FullGestureState<"drag">) {
    const { direction, timeStamp, distance, velocity } = state;
    if (timeStamp - this.lastPinchTime < 200) return;
    const initialOffset = [...this.offset];
    const v = Math.sqrt(velocity[0] ** 2 + velocity[1] ** 2);
    if (v != 0) {
      this.offsetAnimation = inertia({
        velocity: v,
        power: 200,
        timeConstant: 200,
        onUpdate: (value) => {
          this.setOffset(
            initialOffset[0] - direction[0] * value * (velocity[0] / v),
            initialOffset[1] - direction[1] * value * (velocity[1] / v)
          );
        },
      });
    }
    if (distance[0] > 2 || distance[1] > 2) {
      this.lastDragTime = timeStamp;
    }
  }

  setOffset(x: number, y: number) {
    this.offset = [x, y];
    console.log("setOffset", this.offset);
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
}
