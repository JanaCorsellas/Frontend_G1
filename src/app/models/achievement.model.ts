export interface Achievement{
    _id:string;
    title: string;
    description:string;
    condition:string;
    icon:string;
    usersUnlocked:any[];
}

export class Achievement implements Achievement {
    constructor(
        public _id:string,
        public title: string,
        public description: string,
        public condition: string,
        public icon: string,
        public usersUnlocked:any[]
    ){}
}