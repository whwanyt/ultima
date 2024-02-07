import { GuiFields } from '@acrodata/gui';

export interface Postion {
  x: number;
  y: number;
}
export interface Size {
  width?: number;
  height?: number;
}

export interface ViewGroupOptions {
  id: string;
  name: string;
  description: string;
  postion: Postion;
  size?: Size;
  config: GuiFields;
  anchorId?: string;
}