import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService, Producto } from './services/catalogo.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'backus-ventas-pwa';
  online: boolean = navigator.onLine;
  
  private catalogoService = inject(CatalogoService);
  private storageService = inject(StorageService);
  
  catalogo: Producto[] = [];
  productoSeleccionadoId: number | null = null;
  mensajeTexto: string = '';
  mensajeNotificacion: string = '';
  estadoPedidoNotif: string = '';

  constructor() {
    window.addEventListener('online', () => {
      this.online = true;
    });
    window.addEventListener('offline', () => {
      this.online = false;
    });
  }

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.catalogoService.obtenerCatalogo().subscribe({
      next: (data: Producto[]) => {
        this.catalogo = data;
        if (data && data.length > 0) {
          this.productoSeleccionadoId = data[0].id;
        }
      },
      error: (err: unknown) => console.error('Error al cargar catálogo:', err)
    });
  }

  async registrarPedido(): Promise<void> {
    const prod = this.catalogo.find(p => p.id === Number(this.productoSeleccionadoId)) || this.catalogo[0];
    
    const pedido = {
      producto: prod ? prod.producto : 'Producto General',
      precio: prod ? prod.precio : 0,
      cantidad: 1
    };

    if (this.online) {
      // Guardado simulado en IndexedDB mientras está Online
      await this.storageService.guardarPedido({...pedido, estado: 'Enviado al servidor (Simulado)'});
      this.mensajeNotificacion = 'Pedido enviado al servidor con éxito.';
      this.estadoPedidoNotif = 'ENVIADO';
    } else {
      // Guardado normal en IndexedDB mientras está Offline
      await this.storageService.guardarPedido({...pedido, estado: 'Pendiente de envío'});
      this.mensajeNotificacion = 'Pedido guardado localmente';
      this.estadoPedidoNotif = 'PENDIENTE';
    }
  }

  async guardarMensaje(): Promise<void> {
    if (!this.mensajeTexto.trim()) return;
    
    const mensajeObj = {
      contenido: this.mensajeTexto,
      tipo: 'mensaje'
    };

    if (this.online) {
      // Guardado simulado en IndexedDB mientras está Online
      await this.storageService.guardarPedido({...mensajeObj, estado: 'Enviado'});
      this.mensajeNotificacion = 'Mensaje procesado correctamente.';
      this.estadoPedidoNotif = 'PROCESADO';
    } else {
      // Guardado normal en IndexedDB mientras está Offline
      await this.storageService.guardarPedido({...mensajeObj, estado: 'Pendiente'});
      this.mensajeNotificacion = 'Mensaje guardado localmente';
      this.estadoPedidoNotif = 'PENDIENTE';
    }
    
    this.mensajeTexto = '';
  }
}