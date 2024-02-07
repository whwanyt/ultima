import { Injectable } from '@angular/core';
import { ViewGroupOptions } from '../view-group/view-group-options';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groupList: ViewGroupOptions[] = [];
  private idToGroup: Map<string, ViewGroupOptions> = new Map();
  private anchorIdToDependents: Map<string, ViewGroupOptions[]> = new Map();

  constructor() {}

  init(groups: ViewGroupOptions[]) {
    this.groupList = groups;
    this.buildMappings();
  }

  private buildMappings(): void {
    this.idToGroup.clear();
    this.anchorIdToDependents.clear();
    this.groupList.forEach((element) => {
      this.idToGroup.set(element.id, element);
      if (element.anchorId) {
        if (!this.anchorIdToDependents.has(element.anchorId)) {
          this.anchorIdToDependents.set(element.anchorId, []);
        }
        this.anchorIdToDependents.get(element.anchorId)?.push(element);
      }
    });
  }

  findDependencies(id: string): {
    dependent: ViewGroupOptions[];
    dependency?: ViewGroupOptions;
  } {
    const dependency = this.idToGroup.get(id)?.anchorId
      ? this.idToGroup.get(this.idToGroup.get(id)!.anchorId!)
      : undefined;
    const dependents = this.anchorIdToDependents.get(id) || [];
    return { dependent: dependents, dependency };
  }
}
