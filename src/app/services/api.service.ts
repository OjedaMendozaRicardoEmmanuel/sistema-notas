import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { Observable, tap } from 'rxjs';
import { User } from './models/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Notas } from './models/notas';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(user: User): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, this.getFormData(user))
      .pipe(
        tap((response) => {
          if (response && response.access_token) {
            localStorage.setItem('access_token', response.access_token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string {
    return localStorage.getItem('access_token') ?? '';
  }

  // Obtener un usuario por su ID
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Obtener un usuario por su ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  // Crear un nuevo usuario
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, this.getFormData(user));
  }

  // Actualizar un usuario existente
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/users/${id}`,
      this.getFormUrlEncoded(user)
    );
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // Obtener todas las notas
  getNotass(): Observable<Notas[]> {
    return this.http.get<Notas[]>(`${this.apiUrl}/notas`);
  }

  // Obtener una nota por id
  getNotas(id: number): Observable<Notas> {
    const url = `${this.apiUrl}/notas/${id}`;
    return this.http.get<Notas>(url);
  }

  // Crear una nueva nota
  createNotas(car: Notas): Observable<Notas> {
    return this.http.post<Notas>(`${this.apiUrl}/notas`, this.getFormData(car));
  }

  // Actualizar una nota
  updateNotas(id: number, car: Notas): Observable<Notas> {
    const url = `${this.apiUrl}/notas/${id}`;
    return this.http.put<Notas>(url, this.getFormUrlEncoded(car));
  }

  // Eliminar una nota
  deleteNotas(id: number): Observable<Notas> {
    const url = `${this.apiUrl}/notas/${id}`;
    return this.http.delete<Notas>(url);
  }

  // http://sistema-notas.test/api/users/1/notas
  getNotasUsers(id:number): Observable<Notas[]> {
    return this.http.get<Notas[]>(`${this.apiUrl}/users/${id}/notas`);
  }

  getFormData(object: any) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
  }

  getFormUrlEncoded(object: any): HttpParams {
    let params = new HttpParams();
    Object.keys(object).forEach((key) => {
      params = params.append(key, object[key]);
    });
    return params;
  }
}
