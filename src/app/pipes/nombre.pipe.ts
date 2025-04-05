import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';
@Pipe({
  name: 'nombre'
})
export class NombrePipe implements PipeTransform {

  transform(value: User[], query: string): User[] {
    if (query === '' || query === undefined) {
      return value;
    }
    return value.filter((user) => user.username.toLowerCase().indexOf(query.toLowerCase()) != -1);
  }

}
