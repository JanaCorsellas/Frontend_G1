export interface Activity {
    _id: string;
    author: string;
    name: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    distance: number;
    elevationGain: number;
    averageSpeed: number;
    caloriesBurned?: number;
    route: string[];
    musicPlaylist?: string[];
    type: 'running' | 'cycling' | 'hiking' | 'walking';
  }
  
  export class Activity implements Activity {
    constructor(
      public _id: string,
      public author: string,
      public name: string,
      public startTime: Date,
      public endTime: Date,
      public duration: number,
      public distance: number,
      public elevationGain: number,
      public averageSpeed: number,
      public type: 'running' | 'cycling' | 'hiking' | 'walking',
      public caloriesBurned?: number,
      public route: string[] = [],
      public musicPlaylist?: string[],
    ) {}
  }