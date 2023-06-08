import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Notas } from 'src/app/services/models/notas';
import { User } from 'src/app/services/models/user';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MapaComponent } from '../mapa/mapa.component';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css'],
})
export class NotasComponent {
  verNota: boolean = false;
  agregarNota: boolean = false;
  verMapa: boolean = false;
  editarNota = false;
  nota: Notas = {
    id: 0,
    titulo: '',
    descripcion: '',
    fecha_hora: '2023-01-01',
    tipo: 1,
    latitud: '',
    longitud: '',
    Usuarios_id: 0,
  };
  user: User = { id: 0, usuario: '', nombre: '', password: '' };
  notas: Notas[] = [];
  form: FormGroup;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.form = new FormGroup({
      titulo: new FormControl(this.nota.titulo, [Validators.required]),
      descripcion: new FormControl(this.nota.descripcion, [
        Validators.required,
      ]),
    });
    this.apiService
      .getProfile()
      .pipe(
        switchMap((resultadoProfile) => {
          this.user = resultadoProfile;
          return this.apiService.getNotasUsers(this.user.id);
        })
      )
      .subscribe((resultadoNotas) => {
        this.notas = resultadoNotas;
      });

    this.obtenerUbicacion();
  }

  guardarNota() {
    if (this.form.valid) {
      this.nota.titulo = this.form.get('titulo')?.value;
      this.nota.descripcion = this.form.get('descripcion')?.value;
      this.nota.Usuarios_id = this.user.id;
      this.obtenerUbicacion();
      this.nota.fecha_hora = this.obtenerFechaHora();
      console.log(this.nota);
      this.apiService
        .createNotas(this.nota)
        .subscribe((nuevaNota) => this.notas.push(nuevaNota));
      this.form.reset();
      this.agregarNota = false;
    }
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(['login']);
  }

  abrirNota(item: Notas) {
    this.verNota = true;
    this.editarNota = false;
    this.nota = item;
  }

  btnVerde() {
    this.nota.tipo = 1;
    this.agregarNota = true;
    this.form.reset();
  }

  btnAzul() {
    this.nota.tipo = 2;
    this.agregarNota = true;
    this.form.reset();
  }

  btnRojo() {
    this.nota.tipo = 3;
    this.agregarNota = true;
    this.form.reset();
  }

  abrirMapa() {
    // this.verMapa = true;
    this.dialog.open(MapaComponent, {
      height: '90%',
      width: '80%',
    });
  }

  // Eliminar una nota
  eliminarNota(id: number): void {
    this.apiService.deleteNotas(id).subscribe(() => {
      this.notas = this.notas.filter((u) => u.id !== id);
      this.verNota = false;
    });
  }

  // Actualizar una nota existente
  updateNota(nota: Notas): void {
    this.nota.titulo = this.form.get('titulo')?.value;
    this.nota.descripcion = this.form.get('descripcion')?.value;
    this.apiService.updateNotas(nota.id, nota).subscribe((updatednota) => {
      const index = this.notas.findIndex((u) => u.id === updatednota.id);
      this.notas[index] = updatednota;
      this.form.reset();
      this.verNota = false;
    });
  }

  // Eliminar una nota
  editaNota() {
    this.editarNota = true;
    this.form.get('titulo')?.setValue(this.nota.titulo);
    this.form.get('descripcion')?.setValue(this.nota.descripcion);
  }

  editarDesdeCard(item: any) {
    this.nota = item;
    this.verNota = true;
    this.editarNota = true;
    this.form.get('titulo')?.setValue(this.nota.titulo);
    this.form.get('descripcion')?.setValue(this.nota.descripcion);
  }

  obtenerUbicacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.nota.latitud = position.coords.latitude.toString();
          this.nota.longitud = position.coords.longitude.toString();
          // Aquí puedes hacer lo que desees con la latitud y longitud
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    } else {
      console.error('La geolocalización no es soportada por este navegador.');
    }
  }

  obtenerFechaHora(): string {
    const fechaActual = new Date();

    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');

    const horas = String(fechaActual.getHours()).padStart(2, '0');
    const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
    const segundos = String(fechaActual.getSeconds()).padStart(2, '0');

    return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  }

  obtenerFechaF(fecha: any): string {
    const fechaTemp = new Date(fecha);
    return format(fechaTemp, 'dd/MMMM/yyyy HH:mm', { locale: es }) + 'hrs';
  }
}
