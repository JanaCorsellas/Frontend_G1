export interface Activity {
  _id: string;
  author: string;
  name: string;
  startTime: Date;
  endTime: Date;
  duration: number; //  en minutos
  distance: number; // Distancia recorrida
  elevationGain: number; 
  averageSpeed: number; 
  caloriesBurned?: number; 
  route: string[]; 
  musicPlaylist: string[]; // Lista de IDs de playlists de música
  type: "running" | "cycling" | "hiking" | "walking"; 
}

export class Activity {
  constructor(
    public author: string, 
    public name: string,
    public startTime: Date,
    public endTime: Date,
    public duration: number, 
    public distance: number, 
    public elevationGain: number,
    public averageSpeed: number,
    public type: "running" | "cycling" | "hiking" | "walking",
    public _id: string,
    public caloriesBurned?: number,
    public route: string[] = [],
    public musicPlaylist: string[] = []
  ) {}
}