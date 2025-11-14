export interface Spell {
  title: string;
  circle: string;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
}

export interface Item {
  title: string;
  description: string;
  damage?: string;
  properties: string;
  CA?: number;
}