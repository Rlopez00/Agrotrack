// src/pages/Mapa.jsx

import React, { useState, useEffect, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { supabase } from "../client";
import { AuthContext } from "../context/AuthContext";

// Importamos la imagen de la sombra del marcador de Leaflet
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Definir colores para cada grupo
const groupColors = {
  "Grupo A": "#1E90FF", // Azul
  "Grupo B": "#32CD32", // Verde
  "Grupo C": "#FFA500", // Naranja
  // Agrega más grupos y colores según sea necesario
};

// Función para crear iconos personalizados con emoji de vaca
const createCowIcon = (color) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
             🐮
           </div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Componente para centrar el mapa cuando se actualiza el centro
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function Mapa() {
  const { ganadero } = useContext(AuthContext);
  const [animals, setAnimals] = useState([]);
  const [simulationAnimals, setSimulationAnimals] = useState([]);
  const [groupCircles, setGroupCircles] = useState([]);
  const [center, setCenter] = useState([21.8469, -102.7208]); // Centro en Calvillo, Aguascalientes
  const [radius, setRadius] = useState(1000); // Radio en metros (puede ser dinámico por grupo)
  const [error, setError] = useState("");
  const [notificationPermission, setNotificationPermission] =
    useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [originalSimulationAnimals, setOriginalSimulationAnimals] = useState(
    []
  );
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedCow, setSelectedCow] = useState(null);
  const [simulationSteps, setSimulationSteps] = useState(0);

  // Función para obtener la ubicación de los animales
  const fetchAnimals = async () => {
    try {
      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .eq("ganadero_id", ganadero.id);

      if (error) {
        console.error("Error fetching animals:", error);
        setError("Error al obtener las ubicaciones.");
      } else {
        // Añadimos el estado inicial de cada animal
        const animalsWithStatus = data.map((animal) => ({
          ...animal,
          status: "Normal", // Estados: Normal, Posible Robo, Robo
        }));
        setAnimals(animalsWithStatus);
        setSimulationAnimals(JSON.parse(JSON.stringify(animalsWithStatus))); // Clonamos los datos para la simulación
        setFilteredAnimals(animalsWithStatus);
        calculateGroupCircles(animalsWithStatus);
      }
    } catch (err) {
      console.error("Error fetching animals:", err);
      setError("Error al obtener las ubicaciones.");
    }
  };

  // Calcular centros y radios para cada grupo
  const calculateGroupCircles = (animalsList) => {
    const groups = {};

    // Agrupar animales por grupo
    animalsList.forEach((animal) => {
      if (!groups[animal.group_name]) {
        groups[animal.group_name] = [];
      }
      groups[animal.group_name].push(animal);
    });

    // Calcular centro y radio para cada grupo
    const circles = Object.keys(groups).map((group) => {
      const groupAnimals = groups[group];
      const centroid = calculateCentroid(groupAnimals);
      const maxDistance = calculateMaxDistance(centroid, groupAnimals) + 100; // Añadir buffer de 100 metros

      return {
        group,
        centroid,
        radius: maxDistance,
        color: groupColors[group] || "#0000FF", // Azul por defecto
      };
    });

    setGroupCircles(circles);

    // Si hay grupos, establecer el centro del mapa en el primer grupo
    if (circles.length > 0) {
      setCenter([circles[0].centroid.lat, circles[0].centroid.lng]);
    } else {
      setCenter([21.8469, -102.7208]); // Centro predeterminado en Calvillo
    }
  };

  // Calcular el centro (centroid) de un grupo de animales
  const calculateCentroid = (groupAnimals) => {
    const sum = groupAnimals.reduce(
      (acc, animal) => {
        return {
          lat: acc.lat + animal.latitude,
          lng: acc.lng + animal.longitude,
        };
      },
      { lat: 0, lng: 0 }
    );

    return {
      lat: sum.lat / groupAnimals.length,
      lng: sum.lng / groupAnimals.length,
    };
  };

  // Calcular la distancia máxima desde el centro a cualquier animal en el grupo
  const calculateMaxDistance = (centroid, groupAnimals) => {
    let maxDist = 0;
    groupAnimals.forEach((animal) => {
      const distance = getDistanceFromLatLonInMeters(
        centroid.lat,
        centroid.lng,
        animal.latitude,
        animal.longitude
      );
      if (distance > maxDist) {
        maxDist = distance;
      }
    });
    return maxDist;
  };

  useEffect(() => {
    if (ganadero) {
      fetchAnimals();
    }
  }, [ganadero]);

  // Solicitar permiso para notificaciones al montar el componente
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  // Simulación de actualización de coordenadas
  const simulateMovement = () => {
    if (!selectedCow) {
      alert("Por favor, selecciona una vaca para simular su movimiento.");
      return;
    }

    if (simulationSteps >= 4) {
      alert("La simulación ha alcanzado el número máximo de movimientos.");
      return;
    }

    const updatedAnimals = simulationAnimals.map((animal) => {
      if (animal.id !== selectedCow.id) return animal;

      const deltaLat = (Math.random() - 0.5) * 0.001; // Cambio mayor en latitud
      const deltaLng = (Math.random() - 0.5) * 0.001; // Cambio mayor en longitud

      return {
        ...animal,
        latitude: animal.latitude + deltaLat,
        longitude: animal.longitude + deltaLng,
      };
    });

    setSimulationAnimals(updatedAnimals);
    setSimulationSteps((prev) => prev + 1);
    applyFilters(updatedAnimals, selectedFilter);
    recalculateGroupCircles(updatedAnimals);
    updateStatuses(updatedAnimals);
  };

  // Simular robo de ganado (movimiento aleatorio fuera del grupo)
  const simulateTheft = () => {
    if (!selectedCow) {
      alert("Por favor, selecciona una vaca para simular su robo.");
      return;
    }

    const updatedAnimals = simulationAnimals.map((animal) => {
      if (animal.id !== selectedCow.id) return animal;

      // Desplazamiento significativo fuera del radio del grupo
      const deltaLat =
        (Math.random() > 0.5 ? 1 : -1) * (0.005 + Math.random() * 0.005);
      const deltaLng =
        (Math.random() > 0.5 ? 1 : -1) * (0.005 + Math.random() * 0.005);

      return {
        ...animal,
        latitude: animal.latitude + deltaLat,
        longitude: animal.longitude + deltaLng,
        status: "Robo",
      };
    });

    setSimulationAnimals(updatedAnimals);
    applyFilters(updatedAnimals, selectedFilter);
    recalculateGroupCircles(updatedAnimals);
    checkAnimalsOutsideRadius(updatedAnimals);
  };

  // Recalcular centros y radios después de la simulación
  const recalculateGroupCircles = (animalsList) => {
    calculateGroupCircles(animalsList);
  };

  // Comprobar si algún animal está fuera del radio
  const checkAnimalsOutsideRadius = (animalsToCheck = simulationAnimals) => {
    const animalsOutside = animalsToCheck.filter((animal) => {
      // Encontrar el grupo del animal
      const groupCircle = groupCircles.find(
        (circle) => circle.group === animal.group_name
      );
      if (!groupCircle) return false;

      const distance = getDistanceFromLatLonInMeters(
        groupCircle.centroid.lat,
        groupCircle.centroid.lng,
        animal.latitude,
        animal.longitude
      );

      return distance > groupCircle.radius;
    });

    if (animalsOutside.length > 0) {
      const message = `¡Alerta! Los siguientes animales están fuera de su grupo:\n${animalsOutside
        .map((a) => a.name)
        .join(", ")}`;

      alert(message);

      // Enviar notificación si se permite
      if (notificationPermission === "granted") {
        new Notification("Alerta de Ganado", {
          body: message,
          icon: "/agrotrack.png", // Asegúrate de tener este icono en tu carpeta pública
        });
      }

      // Actualizar el estado de los animales fuera del radio
      const updatedAnimals = animalsToCheck.map((animal) => {
        const groupCircle = groupCircles.find(
          (circle) => circle.group === animal.group_name
        );
        if (!groupCircle) return animal;

        const distance = getDistanceFromLatLonInMeters(
          groupCircle.centroid.lat,
          groupCircle.centroid.lng,
          animal.latitude,
          animal.longitude
        );

        if (distance > groupCircle.radius * 2) {
          return { ...animal, status: "Robo" };
        } else if (distance > groupCircle.radius) {
          return { ...animal, status: "Posible Robo" };
        } else {
          return { ...animal, status: "Normal" };
        }
      });

      setSimulationAnimals(updatedAnimals);
      setFilteredAnimals(applyFilter(updatedAnimals, selectedFilter));
    } else {
      alert("Todos los animales están dentro de su grupo.");
      // Actualizar el estado de los animales a Normal
      const updatedAnimals = animalsToCheck.map((animal) => ({
        ...animal,
        status: "Normal",
      }));
      setSimulationAnimals(updatedAnimals);
      setFilteredAnimals(applyFilter(updatedAnimals, selectedFilter));
    }
  };

  // Función para actualizar los estados de los animales
  const updateStatuses = (animalsList) => {
    const updatedAnimals = animalsList.map((animal) => {
      const groupCircle = groupCircles.find(
        (circle) => circle.group === animal.group_name
      );
      if (!groupCircle) return { ...animal, status: "Normal" };

      const distance = getDistanceFromLatLonInMeters(
        groupCircle.centroid.lat,
        groupCircle.centroid.lng,
        animal.latitude,
        animal.longitude
      );

      if (distance > groupCircle.radius * 2) {
        return { ...animal, status: "Robo" };
      } else if (distance > groupCircle.radius) {
        return { ...animal, status: "Posible Robo" };
      } else {
        return { ...animal, status: "Normal" };
      }
    });

    setSimulationAnimals(updatedAnimals);
    setFilteredAnimals(applyFilter(updatedAnimals, selectedFilter));
  };

  // Función para calcular la distancia entre dos coordenadas
  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    var R = 6371000; // Radio de la Tierra en metros
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Funciones para Simulaciones
  const startSimulation = () => {
    if (!selectedCow) {
      alert("Por favor, selecciona una vaca para iniciar la simulación.");
      return;
    }
    setIsSimulating(true);
    setOriginalSimulationAnimals(JSON.parse(JSON.stringify(simulationAnimals))); // Guardar estado original
    setSimulationSteps(0);
  };

  const resetSimulation = () => {
    setSimulationAnimals(originalSimulationAnimals);
    setFilteredAnimals(applyFilter(originalSimulationAnimals, selectedFilter));
    recalculateGroupCircles(originalSimulationAnimals);
    setIsSimulating(false);
    setSelectedCow(null);
    setSimulationSteps(0);
  };

  // Manejar Búsqueda y Filtro
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(simulationAnimals, value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    applyFilters(simulationAnimals, value);
  };

  const applyFilters = (animalsList, filter) => {
    if (filter === "All") {
      setFilteredAnimals(animalsList);
    } else if (groupColors[filter]) {
      // Si el filtro es un grupo
      setCenterOnGroup(filter);
      setFilteredAnimals(
        animalsList.filter((animal) => animal.group_name === filter)
      );
    } else {
      // Si el filtro es una vaca específica
      const selected = animalsList.find((animal) => animal.name === filter);
      if (selected) {
        setCenter([selected.latitude, selected.longitude]);
        setFilteredAnimals([selected]);
      }
    }
  };

  const applyFilter = (animalsList, filter) => {
    if (filter === "All") {
      return animalsList;
    } else if (groupColors[filter]) {
      // Si el filtro es un grupo
      return animalsList.filter((animal) => animal.group_name === filter);
    } else {
      // Si el filtro es una vaca específica
      return animalsList.filter((animal) => animal.name === filter);
    }
  };

  // Centrar el mapa en el grupo seleccionado
  const setCenterOnGroup = (group) => {
    const groupCircle = groupCircles.find((c) => c.group === group);
    if (groupCircle) {
      setCenter([groupCircle.centroid.lat, groupCircle.centroid.lng]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-700">
        Mapa de Ubicación del Ganado
      </h1>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Controles de Búsqueda y Filtro */}
      <div className="flex flex-col md:flex-row justify-center items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar vaca por nombre..."
          className="border border-gray-300 p-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={selectedFilter}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">Ver Todas las Vacas</option>
          <optgroup label="Grupos">
            {Object.keys(groupColors).map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </optgroup>
          <optgroup label="Vacas">
            {animals.map((animal) => (
              <option key={animal.id} value={animal.name}>
                {animal.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Sección del Mapa Real */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center text-blue-600">
          Mapa Real
        </h2>
        {animals.length === 0 ? (
          <p className="text-center">No hay datos de ubicación disponibles.</p>
        ) : (
          <div className="flex justify-center">
            <MapContainer
              center={center}
              zoom={15}
              className="h-96 w-full md:w-4/5 lg:w-3/5"
            >
              <ChangeView center={center} zoom={15} />
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Círculos de cada grupo */}
              {groupCircles.map((circle) => (
                <Circle
                  key={circle.group}
                  center={[circle.centroid.lat, circle.centroid.lng]}
                  radius={circle.radius}
                  pathOptions={{ color: circle.color, fillOpacity: 0.1 }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -10]}
                    opacity={1}
                    permanent
                  >
                    {circle.group}
                  </Tooltip>
                </Circle>
              ))}

              {/* Marcadores de animales */}
              {animals.map((animal) => (
                <Marker
                  key={animal.id}
                  position={[animal.latitude, animal.longitude]}
                  icon={createCowIcon(
                    groupColors[animal.group_name] || "#0000FF"
                  )} // Azul por defecto
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold text-lg">{animal.name}</h3>
                      <p>
                        <strong>Especie:</strong> {animal.species}
                      </p>
                      <p>
                        <strong>Raza:</strong> {animal.breed}
                      </p>
                      <p>
                        <strong>Edad:</strong> {animal.age} años
                      </p>
                      <p>
                        <strong>Peso:</strong> {animal.weight} kg
                      </p>
                      <p>
                        <strong>Grupo:</strong> {animal.group_name}
                      </p>
                      <p>
                        <strong>Ubicación:</strong>{" "}
                        {animal.location || "Sin ubicación específica"}
                      </p>
                      <p>
                        <strong>Estado:</strong> {animal.status}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {/* Controles de Simulación */}
      <div className="flex flex-col items-center mb-6 space-y-4">
        <div className="flex flex-wrap justify-center space-x-4">
          {!isSimulating ? (
            <button
              onClick={startSimulation}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Iniciar Simulación
            </button>
          ) : (
            <>
              <button
                onClick={simulateMovement}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
              >
                Simular Movimiento
              </button>
              <button
                onClick={simulateTheft}
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
              >
                Simular Robo de Ganado
              </button>
              <button
                onClick={resetSimulation}
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition"
              >
                Reiniciar Simulación
              </button>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="radius" className="font-semibold">
            Radio (metros):
          </label>
          <input
            type="number"
            id="radius"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="border border-gray-300 p-2 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
            min="100"
            max="5000"
          />
        </div>
        {/* Selección de Vaca para Simulación */}
        {isSimulating && (
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <select
              value={selectedCow ? selectedCow.id : ""}
              onChange={(e) => {
                const cowId = e.target.value;
                const cow = simulationAnimals.find(
                  (animal) => animal.id === cowId
                );
                setSelectedCow(cow || null);
              }}
              className="border border-gray-300 p-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecciona una vaca para simular</option>
              {simulationAnimals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name} ({animal.group_name})
                </option>
              ))}
            </select>
            {selectedCow && (
              <p className="text-center">
                Simulando: <strong>{selectedCow.name}</strong> (
                {selectedCow.group_name})
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sección del Mapa de Simulación */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center text-purple-600">
          Mapa de Simulación
        </h2>
        {filteredAnimals.length === 0 ? (
          <p className="text-center">
            No hay datos de ubicación disponibles para la simulación.
          </p>
        ) : (
          <div className="flex justify-center">
            <MapContainer
              center={center}
              zoom={15}
              className="h-96 w-full md:w-4/5 lg:w-3/5"
            >
              <ChangeView center={center} zoom={15} />
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Círculo del radio */}
              <Circle
                center={center}
                radius={radius}
                color="green"
                fillOpacity={0.1}
              />

              {/* Círculos de cada grupo en simulación */}
              {groupCircles.map((circle) => (
                <Circle
                  key={`${circle.group}-sim`}
                  center={[circle.centroid.lat, circle.centroid.lng]}
                  radius={circle.radius}
                  pathOptions={{ color: circle.color, fillOpacity: 0.1 }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -10]}
                    opacity={1}
                    permanent
                  >
                    {circle.group}
                  </Tooltip>
                </Circle>
              ))}

              {/* Marcadores de animales simulados */}
              {filteredAnimals.map((animal) => (
                <Marker
                  key={animal.id}
                  position={[animal.latitude, animal.longitude]}
                  icon={
                    animal.status === "Robo"
                      ? createCowIcon("#FF0000") // Rojo para Robo
                      : animal.status === "Posible Robo"
                      ? createCowIcon("#FFD700") // Amarillo para Posible Robo
                      : createCowIcon(
                          groupColors[animal.group_name] || "#0000FF"
                        ) // Azul por defecto
                  }
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold text-lg">{animal.name}</h3>
                      <p>
                        <strong>Especie:</strong> {animal.species}
                      </p>
                      <p>
                        <strong>Raza:</strong> {animal.breed}
                      </p>
                      <p>
                        <strong>Edad:</strong> {animal.age} años
                      </p>
                      <p>
                        <strong>Peso:</strong> {animal.weight} kg
                      </p>
                      <p>
                        <strong>Grupo:</strong> {animal.group_name}
                      </p>
                      <p>
                        <strong>Ubicación:</strong>{" "}
                        {animal.location || "Sin ubicación específica"}
                      </p>
                      <p>
                        <strong>Estado:</strong> {animal.status}
                      </p>
                      {animal.status === "Robo" && (
                        <p className="text-red-600 font-bold">
                          ¡Robo Detectado!
                        </p>
                      )}
                      {animal.status === "Posible Robo" && (
                        <p className="text-yellow-500 font-bold">
                          ¡Posible Robo!
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {/* Tabla de Datos de Vacas */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center text-indigo-600">
          Tabla de Vacas
        </h2>
        {filteredAnimals.length === 0 ? (
          <p className="text-center">No hay datos disponibles para mostrar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">
                    Nombre
                  </th>
                  <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">
                    Grupo
                  </th>
                  <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">
                    Latitud
                  </th>
                  <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">
                    Longitud
                  </th>
                  <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredAnimals.map((animal) => (
                  <tr key={animal.id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4">{animal.name}</td>
                    <td className="py-3 px-4">{animal.group_name}</td>
                    <td className="py-3 px-4">{animal.latitude.toFixed(6)}</td>
                    <td className="py-3 px-4">{animal.longitude.toFixed(6)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          animal.status === "Normal"
                            ? "bg-green-100 text-green-800"
                            : animal.status === "Posible Robo"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {animal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mapa;
