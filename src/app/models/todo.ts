export class Todo {
    userId: string;
    id: string;
    title: string;
    completed: boolean;

    constructor(userId?: string, id?: string, title?: string, completed?: boolean) {
        this.userId = ( userId ? userId : "" );
        this.id = ( id ? id : "" );
        this.title = ( title ? title : "" );
        this.completed = ( completed ? completed : false );
    }   

    static generateMongoId(): string {
        // Timestamp en segons (4 bytes)
        const timestamp = Math.floor(Date.now() / 1000).toString(16);
    
        // Generar una cadena aleatoria de 16 caràcters per simular els 8 bytes restants
        const random = 'xxxxxxxxxxxxxxxx'.replace(/x/g, () => {
          return Math.floor(Math.random() * 16).toString(16);
        });
    
        // Concatenar el timestamp amb la cadena aleatòria per formar un ObjectId de 24 caràcters
        return timestamp + random;
      }
}

  