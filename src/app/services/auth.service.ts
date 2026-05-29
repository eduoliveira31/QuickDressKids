import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Usuario {
  primeiroNome?: string;
  ultimoNome?: string;
  username: string;
  email: string;
  password?: string; // used for auth logic, not strictly safe in localStorage but acceptable for local prototype
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'quickdresskids_users';
  private readonly CURRENT_USER_KEY = 'quickdresskids_current_user';

  // Observable for UI updates
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Garantir que a app inicia sempre sem sessão ativa (deslogada) por padrão
    this.logout();
  }

  private getUsers(): Usuario[] {
    if (typeof window === 'undefined') return [];
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private saveUsers(users: Usuario[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private loadSession() {
    if (typeof window === 'undefined') return;
    const sessionJson = localStorage.getItem(this.CURRENT_USER_KEY);
    if (sessionJson) {
      this.currentUserSubject.next(JSON.parse(sessionJson));
    }
  }

  public register(user: Usuario): boolean {
    const users = this.getUsers();
    // Check if user already exists
    if (users.find(u => u.username === user.username || u.email === user.email)) {
      return false; // User exists
    }
    users.push(user);
    this.saveUsers(users);
    
    // Auto-login after register
    this.login(user.username, user.password!);
    return true;
  }

  public login(identifier: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => 
      (u.username === identifier || u.email === identifier) && u.password === password
    );

    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  public logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
  }

  public isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  public getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  public alterarPassword(username: string, passwordAnterior: string, passwordNova: string): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex !== -1 && users[userIndex].password === passwordAnterior) {
      users[userIndex].password = passwordNova;
      this.saveUsers(users);
      
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.username === username) {
        currentUser.password = passwordNova;
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
      }
      return true;
    }
    return false;
  }
}
