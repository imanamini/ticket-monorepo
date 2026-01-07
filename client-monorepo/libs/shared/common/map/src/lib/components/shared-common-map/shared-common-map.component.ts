import { AfterViewInit, ChangeDetectionStrategy, Component, effect, Inject, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPoint } from '../../data-access/models/map-point.model';
import { MapBounds } from '../../data-access/models/map-bounds.model';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { Map, Marker } from 'leaflet';
import { DeviceDetector } from '@client-monorepo/common/utilities';
import { NgxHybridService, PermissionListEnum } from '@digipay/ngx-hybrid-service';
import { AccessModesEnum, Coordination, LocationService } from '@client-monorepo/common/location-management';
import { LeafletHeaderService } from '../../data-access/services/leaflet-header.service';
import { MapLocateMeButtonModel } from '../../data-access/models/map-locate-me-button.model';

declare const window: any;
declare const L: any;

@Component({
  selector: 'lib-shared-common-map',
  standalone: true,
  imports: [CommonModule, DpIconComponent],
  providers: [LeafletHeaderService],
  templateUrl: './shared-common-map.component.html',
  styleUrl: './shared-common-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedCommonMapComponent implements AfterViewInit, OnInit {
  // Inject
  headerService = inject(LeafletHeaderService);
  deviceDetector = inject(DeviceDetector);
  hybridService = inject(NgxHybridService);
  locationService = inject(LocationService);

  // Inputs
  points = input<MapPoint[]>([]);
  currentLocation = input<Coordination | null>(null);
  locateButtonConfig = input<MapLocateMeButtonModel>({});
  mode = input<'LEGACY' | 'NEW'>('LEGACY');

  // Outputs
  pointSelected = output<MapPoint>();
  areaChanged = output<MapBounds>();

  // Variables
  private map!: Map;
  private currentLocationMarker?: Marker;
  showLocateMeButton = signal<boolean>(false);
  isDesktop = this.deviceDetector.isDesktop();
  markerClusterGroup!: any;
  private markers: Marker[] = [];

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {
    effect(() => {
      this.updateMapViewAndLocationMarker();
    });

    effect(() => {
      if (this.map) {
        this.loadPoints();
      }
    });
  }

  ngOnInit() {
    this.headerService.init();
    if (this.hybridService.isAndroidHybrid()) {
      this.hybridService
        .getPermissions([PermissionListEnum.LOCATION])
        .then((result) => {
          const newresult: string[] = result.map((item) => String(item));
          if (newresult.includes(String(PermissionListEnum.LOCATION))) {
            this.hybridService.requestToEnableGps();
          }
        })
        .catch((error) => {
          console.warn('[SharedCommonMap] Failed to get permissions from native bridge:', error);
          // Continue without GPS - user can still use the map
        });
    }
  }

  ngAfterViewInit() {
    this.initMap();
    this.checkGeoPermission();
  }

  private initMap(): void {
    this.map = L.map('map', {
      attributionControl: false,
      zoomControl: false,
      minZoom: 5,
      maxZoom: 18,
    }).setView([35.7599173, 51.4132244], 14);

    // Initialize marker cluster group
    this.markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: any) => {
        return L.divIcon({
          html: `<div style="background-color: #fff; border: 2px solid #2196f3; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">${cluster.getChildCount()}</div>`,
          className: 'marker-cluster-custom',
          iconSize: L.point(32, 32),
        });
      },
    });
    this.map.addLayer(this.markerClusterGroup);

    // Tile Layer - MAP.ir
    if (this.mode() === 'NEW') {
      L.tileLayer
        .wms('https://map.ir/shiveh/{z}/{x}/{y}.png', {
          attribution: '© Map.ir © OpenStreetMap contributors',
          layers: 'Shiveh:Shiveh',
          maxZoom: 18,
          tileSize: 512,
          zoomOffset: -1,
        })
        .addTo(this.map);
      this.loadPoints();
    } else if (this.mode() === 'LEGACY') {
      // Tile Layer - LEGACY
      L.tileLayer(`${this.environment['mapBaseUrl']}/{z}/{x}/{y}.png`, {
        attribution: '© MapTiler © OpenStreetMap contributors',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(this.map);
    }

    setTimeout(() => {
      this.emitAreaChanged();
    }, 0);
    this.map.on('moveend', () => {
      this.emitAreaChanged();
      this.mapMoveEnd();
    });
  }

  private removeLocationMarker(): void {
    this.showLocateMeButton.set(false);
    if (this.currentLocationMarker) {
      this.map.removeLayer(this.currentLocationMarker);
      this.currentLocationMarker = undefined;
    }
  }

  updateMapViewAndLocationMarker(): void {
    const currentLocation = this.currentLocation();
    if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
      const latitude = currentLocation.latitude;
      const longitude = currentLocation.longitude;
      this.map.setView([latitude, longitude], 15);
      if (this.currentLocationMarker) {
        this.currentLocationMarker.setLatLng([latitude, longitude]);
      } else {
        const currentLocationIcon = L.icon({
          iconUrl: 'assets/my-location.png',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        this.currentLocationMarker = L.marker([latitude, longitude], {
          icon: currentLocationIcon,
          zIndexOffset: 98,
        }).addTo(this.map);
      }
    }
  }

  emitAreaChanged(): void {
    const bounds = this.map.getBounds();
    const center = bounds.getCenter();
    const radius = center.distanceTo([bounds.getNorth(), bounds.getEast()]); // Calculate radius to corner

    this.areaChanged.emit({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
      circle: {
        center: {
          lat: center.lat,
          lng: center.lng,
        },
        radius,
      },
    });
  }

  mapMoveEnd(): void {
    this.emitAreaChanged();
  }

  private checkGeoPermission(): void {
    this.locationService.getPermission().subscribe((accessMode) => {
      if (accessMode === AccessModesEnum.ACCESS) {
        this.showLocateMeButton.set(true);
        this.moveToCurrentLocation();
      } else {
        console.warn('User denied location access. Please enable it in browser settings.');
        this.removeLocationMarker();
        this.showLocateMeButton.set(false);
      }
    });
  }

  moveToCurrentLocation(): void {
    if (!this.currentLocation()) return;
    this.map.setView([this.currentLocation()!.latitude, this.currentLocation()!.longitude], 17);
  }

  private loadPoints(): void {
    // Clear existing markers
    this.markerClusterGroup.clearLayers();
    this.markers = [];

    // Add new markers
    this.points().forEach((point) => {
      const marker = L.marker([point.lat, point.lng]);
      if (point.html) {
        const customIcon = L.divIcon({
          html: point.html,
          className: '',
          iconSize: [32, 35],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
        marker.setIcon(customIcon);
      }
      marker.on('click', () => {
        this.pointSelected.emit(point);
      });
      this.markerClusterGroup.addLayer(marker);
      this.markers.push(marker);
    });
  }
}
