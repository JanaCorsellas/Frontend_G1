export interface Song{
    _id:string;
    title: string;
    artist: string;
    album: string;
    genre?: string;
    duration?: number;
    spotifyLink?: string;
    bpm?: number;
}

export class Song implements Song {
    constructor(
        public _id:string,
        public title: string,
        public artist: string,
        public album: string,
        public genre?: string,
        public duration?:number,
        public spotifyLink?:string,
        public bpm?:number,
    ){}
}