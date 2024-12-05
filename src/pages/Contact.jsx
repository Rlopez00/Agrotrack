// src/pages/Contact.jsx
import { supabase } from "../client";
import { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AuthContext } from "../context/AuthContext";

function Contact() {
  const { ganadero } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Supongamos que tienes una API que devuelve las ubicaciones de las vacas del ganadero
    // Por ejemplo, podrías crear un endpoint en Supabase Functions o en tu backend
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from("animals")
          .select("name, location, latitude, longitude")
          .eq("ganadero_id", ganadero.id);

        if (error) {
          console.error("Error fetching locations:", error);
        } else {
          setLocations(data);
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    if (ganadero) {
      fetchLocations();
    }
  }, [ganadero]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Monitoreo de Vacas</h1>

      {locations.length === 0 ? (
        <p>No hay datos de ubicación disponibles.</p>
      ) : (
        <MapContainer center={[0, 0]} zoom={2} style={{ height: "500px" }}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((animal) => (
            <Marker
              key={animal.name}
              position={[animal.latitude, animal.longitude]}
            >
              <Popup>
                {animal.name} - {animal.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

export default Contact;
