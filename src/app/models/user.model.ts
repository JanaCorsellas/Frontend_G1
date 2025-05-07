export interface User {
  _id: string;
  username: string;
  bio: string;
  profilePicture: string;
  level: number;
  email: string;
  activities?: any[];
  visible?: boolean;
  visibility?: boolean;
  role: string;
}

export class User implements User {
  constructor(
    public _id: string,
    public username: string,
    public bio: string,
    public profilePicture: string,
    public level: number,
    public email: string,
    public activities?: any[],
    public visible?: boolean,
    public visibility?: boolean,
    public role: string = 'user' // Rol per defecte 'user'
  ) {}
}