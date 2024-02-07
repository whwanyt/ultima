import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Postion, ViewGroupOptions } from "./view-group/view-group-options";
import { ViewGroupComponent } from "./view-group/view-group.component";
import { v4 as uuidv4 } from "uuid";
import { getAnchorId, getInfoAnchorId } from "./utils";
import { GroupService } from "./service/group.service";
import { DrawCurveOption } from "./app.options";
import { GestureService } from "./service/gesture.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, ViewGroupComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit, AfterViewInit {
  title = "ultima";

  loading: boolean = true;

  groupList: ViewGroupOptions[] = [];

  contentStyle: Record<string, string> = {};

  @ViewChild("main") mainRef: ElementRef | undefined;
  @ViewChild("content") contentRef: ElementRef | undefined;

  constructor(
    private groupService: GroupService,
    private gestureService: GestureService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.groupList.push({
      id: uuidv4(),
      name: "测试一",
      description: "",
      postion: { x: 60, y: 130 },
      config: {
        title: {
          type: "text",
          name: "标题",
          placeholder: "请输入标题",
        },
      },
    });
    this.groupList.push({
      id: uuidv4(),
      name: "测试二",
      description: "",
      anchorId: this.groupList[0].id,
      postion: { x: 380, y: 220 },
      config: {
        title: {
          type: "text",
          name: "文本",
          placeholder: "请输入文本",
        },
        textAlign: {
          type: "buttonToggle",
          name: "对齐",
          default: "right",
          multiple: false,
          options: [
            {
              value: "left",
              label: "左",
            },
            {
              value: "center",
              label: "中",
            },
            {
              value: "right",
              label: "右",
            },
          ],
        },
      },
    });
    this.groupList.push({
      id: uuidv4(),
      name: "测试三",
      description: "",
      anchorId: this.groupList[0].id,
      postion: { x: 380, y: 420 },
      config: {
        title: {
          type: "text",
          name: "文本",
          placeholder: "请输入文本",
        },
        textAlign: {
          type: "buttonToggle",
          name: "对齐",
          default: "right",
          multiple: false,
          options: [
            {
              value: "left",
              label: "左",
            },
            {
              value: "center",
              label: "中",
            },
            {
              value: "right",
              label: "右",
            },
          ],
        },
      },
    });
    this.groupService.init(this.groupList);
  }

  initGesture() {
    const bodyWidth = this.mainRef?.nativeElement.clientHeight;
    const bodyHeight = this.mainRef?.nativeElement.clientHeight;
    const width = bodyWidth * 2;
    const height = bodyHeight * 2;
    const left = bodyWidth / 2;
    const top = bodyHeight / 2;
    this.gestureService.init(this.contentRef?.nativeElement, {
      offset: [left, top],
      worldSize: {
        width,
        height,
      },
      viewAreaSize: {
        width: bodyWidth,
        height: bodyHeight,
      },
    });
  }

  initContent() {
    const [left, top] = this.gestureService.viewOffset;
    const { width, height } = this.gestureService.viewWorldSize;
    this.updateContentStyle("width", width + "px");
    this.updateContentStyle("height", height + "px");
    this.updateContentStyle("left", `${left}px`);
    this.updateContentStyle("top", `${top}px`);
  }

  updateContentStyle(name: string, value: string) {
    this.contentStyle = { ...this.contentStyle, ...{ [name]: value } };
  }

  ngAfterViewInit() {
    this.initGesture();
    this.initContent();
    this.loading = false;
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.initLinePath();
    }, 0);
    this.gestureService.onOffsetChange(([x, y]: [number, number]) => {
      this.updateContentStyle("left", `${x}px`);
      this.updateContentStyle("top", `${y}px`);
    });
  }

  initLinePath() {
    let lineList: DrawCurveOption[] = [];
    for (const iterator of this.groupList) {
      const linkedGroups = this.groupService.findDependencies(iterator.id);
      if (linkedGroups.dependency) {
        lineList.push({
          id: iterator.id,
          anchorId: linkedGroups.dependency.id,
        });
      }
      for (const item of linkedGroups.dependent) {
        lineList.push({ id: item.id, anchorId: iterator.id });
      }
    }
    const list = this.uniqueElementsByIdAndAnchorId(lineList);
    for (const iterator of list) {
      this.drawCurve(iterator);
    }
  }

  uniqueElementsByIdAndAnchorId(
    elements: DrawCurveOption[]
  ): DrawCurveOption[] {
    const seen = new Set<string>();
    return elements.filter((element) => {
      const key = `${element.id}-${element.anchorId}`;
      if (!seen.has(key)) {
        seen.add(key);
        return true;
      }
      return false;
    });
  }

  onGroupPostionChange(postion: Postion, index: number) {
    this.groupList[index].postion = postion;
    const group = this.groupList[index];
    let lineList: DrawCurveOption[] = [];
    const linkedGroups = this.groupService.findDependencies(group.id);
    if (linkedGroups.dependency) {
      lineList.push({
        id: group.id,
        anchorId: linkedGroups.dependency.id,
      });
    }
    for (const item of linkedGroups.dependent) {
      lineList.push({ id: item.id, anchorId: group.id });
    }
    const list = this.uniqueElementsByIdAndAnchorId(lineList);
    for (const iterator of list) {
      this.drawCurve(iterator);
    }
  }

  drawCurve(option: DrawCurveOption) {
    const svg = document.getElementById("svgContainer")!;
    const element1 = document.getElementById(getAnchorId(option.anchorId))!;
    const element2 = document.getElementById(getInfoAnchorId(option.id))!;
    const pos1 = element1.getBoundingClientRect();
    const pos2 = element2.getBoundingClientRect();
    const content = this.contentRef?.nativeElement.getBoundingClientRect();
    // 计算起点和终点
    const startX = pos1.left - content.left + pos1.width / 2;
    const startY = pos1.top - content.top + pos1.height / 2;
    const endX = pos2.left - content.left + pos2.height / 2;
    const endY = pos2.top - content.top + pos2.height / 2;
    // 创建贝塞尔曲线
    const controlX1 = (startX + endX) / 2;
    const controlY1 = startY;
    const controlX2 = (startX + endX) / 2;
    const controlY2 = endY;
    const d = `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
    const svgPath = document.getElementById(option.anchorId + "_" + option.id)!;
    if (svgPath) {
      svgPath.setAttribute("d", d);
    } else {
      // 不存在节点，创建SVG路径
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("id", option.anchorId + "_" + option.id);
      path.setAttribute("d", d);
      path.setAttribute("stroke", "black");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("fill", "none");
      svg.appendChild(path);
    }
  }
}
