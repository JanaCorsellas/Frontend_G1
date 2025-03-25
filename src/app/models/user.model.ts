export interface User {
  _id: string; 
  username: string;
  bio: string;
  profilePicture: string;
  level: number;
  email: string;      
  activities: string[];
  visible: boolean;
}
export class User implements User {
  constructor(
    public _id: string,
    public username: string,
    public email: string,
    public level: number,
    public bio: string,
    public profilePicture: string,
    public activities: string[] = [],
    public visible: boolean = true  ) {}
}