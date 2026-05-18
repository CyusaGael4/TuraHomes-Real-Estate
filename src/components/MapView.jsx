import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapView({ lat, lng, title, location }) {
  const position = [Number(lat), Number(lng)]

  if (Number.isNaN(position[0]) || Number.isNaN(position[1])) {
    return (
      <div className="rounded-[28px] border border-dashed border-[var(--color-line)] bg-[var(--color-soft)] p-8 text-sm text-[var(--color-muted)]">
        Map coordinates are not available for this listing yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--color-line)] shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
      <MapContainer center={position} zoom={14} scrollWheelZoom={false} className="h-[360px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>{title}</strong>
            <br />
            {location}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
