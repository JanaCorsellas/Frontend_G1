export interface User {
  _id: string;
  username: string;
  bio: string;
  profilePicture: string;
  level: number;
  email: string;
  visible?: boolean;
  visibility?: boolean;
}

export class User implements User {
  constructor(
    public _id: string,
    public username: string,
    public bio: string,
    public profilePicture: string,
    public level: number,
    public email: string,
    public visible?: boolean,
    public visibility?: boolean
  ) {}
}