import { AfterViewInit, Component, Input } from '@angular/core';
import { switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Notas } from 'src/app/services/models/notas';
import { User } from 'src/app/services/models/user';

import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements AfterViewInit {

  user: User = { id: 0, usuario: '', nombre: '', password: '' };
  notas: Notas[] = [];
  map: any;
  markerClusterGroup: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
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
        if (this.map) {
          this.actualizarMarcadores();
        }
      });
  }

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([17.078195, -96.744876], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.markerClusterGroup = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
    }).addTo(this.map);

    this.actualizarMarcadores();
  }

  actualizarMarcadores() {
    this.markerClusterGroup.clearLayers();

    if (this.notas.length > 0) {
      this.notas.forEach((item) => {
        const marker = L.marker([Number(item.latitud), Number(item.longitud)]).bindPopup(
          `<b>${item.titulo}</b>`
        );
        this.markerClusterGroup.addLayer(marker);
      });
    }
  }
}
