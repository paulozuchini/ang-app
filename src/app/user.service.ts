import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { User } from './user';
//import { USERS } from './offline-users';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(
  private http: HttpClient,
  private messageService: MessageService) { }

httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
private usersUrl = 'https://jsonplaceholder.typicode.com/users'

getUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.usersUrl)
  .pipe(
    tap(_ => this.log('fetched users')),
    catchError(this.handleError<User[]>('getUsers', []))
  );
}

/** GET hero by id. Will 404 if id not found */
getUser(id: number): Observable<User> {
  const url = `${this.usersUrl}/${id}`;
  return this.http.get<User>(url).pipe(
    tap(_ => this.log(`fetched user id=${id}`)),
    catchError(this.handleError<User>(`getUser id=${id}`))
  );
}

private log(message: string) {
  this.messageService.add(`UserService: ${message}`);
}

/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /* GET users whose name contains search term */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty user array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found user matching "${term}"`) :
        this.log(`no users matching "${term}"`)),
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }
}