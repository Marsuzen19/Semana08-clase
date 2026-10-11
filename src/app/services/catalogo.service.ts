import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Producto {
  id: number;
  producto: string;
  categoria: string;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private productos: Producto[] = [
    { id: 1, producto: 'Pilsen Callao 650ml', categoria: 'Cervezas', precio: 7.50 },
    { id: 2, producto: 'Cusqueña Trigo 330ml', categoria: 'Cervezas', precio: 6.00 },
    { id: 3, producto: 'Cristal 650ml', categoria: 'Cervezas', precio: 7.00 },
    { id: 4, producto: 'Backus Ice 330ml', categoria: 'Cervezas', precio: 5.50 }
  ];

  constructor() {}

  obtenerCatalogo(): Observable<Producto[]> {
    return of(this.productos);
  }
}