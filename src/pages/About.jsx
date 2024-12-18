// src/pages/About.jsx

import { useState, useEffect } from "react";
import { supabase } from "../client";

function About() {
  const [animals, setAnimals] = useState([]);
  const [newAnimal, setNewAnimal] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    location: "",
    latitude: "",
    longitude: "",
    group_name: "",
    mother_id: "",
    father_id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Valor fijo para ganadero_id
  const ganadero_id = "default-ganadero-id"; // Reemplaza esto con el ID deseado

  // Función para obtener la lista de animales del ganadero
  const fetchAnimals = async () => {
    const { data, error } = await supabase
      .from("animals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching animals:", error);
      setError("Error al obtener los animales.");
    } else {
      setAnimals(data);
    }
  };

  // Cargar la lista de animales al montar el componente
  useEffect(() => {
    fetchAnimals();
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar las coordenadas
    const latitude = parseFloat(newAnimal.latitude);
    const longitude = parseFloat(newAnimal.longitude);

    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError("Por favor, ingresa coordenadas válidas para la ubicación.");
      return;
    }

    try {
      const { error } = await supabase.from("animals").insert([
        {
          ganadero_id: ganadero_id, // Usar el valor fijo
          name: newAnimal.name,
          species: newAnimal.species,
          breed: newAnimal.breed || null,
          age: newAnimal.age ? parseInt(newAnimal.age) : null,
          weight: newAnimal.weight ? parseFloat(newAnimal.weight) : null,
          location: newAnimal.location || null,
          latitude: latitude,
          longitude: longitude,
          group_name: newAnimal.group_name || null,
          mother_id: newAnimal.mother_id || null,
          father_id: newAnimal.father_id || null,
        },
      ]);

      if (error) {
        console.error("Error inserting animal:", error);
        setError("Error al agregar el animal.");
      } else {
        // Limpiar el formulario y actualizar la lista
        setNewAnimal({
          name: "",
          species: "",
          breed: "",
          age: "",
          weight: "",
          location: "",
          latitude: "",
          longitude: "",
          group_name: "",
          mother_id: "",
          father_id: "",
        });
        fetchAnimals();
        setSuccess("Animal agregado exitosamente.");
      }
    } catch (err) {
      setError("Error al agregar el animal.");
      console.error(err);
    }
  };

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registro de Animales</h1>

      {/* Formulario para agregar un nuevo animal */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campos existentes */}
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={newAnimal.name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="species"
            placeholder="Especie"
            value={newAnimal.species}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="breed"
            placeholder="Raza"
            value={newAnimal.breed}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="age"
            placeholder="Edad"
            value={newAnimal.age}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            step="0.01"
            name="weight"
            placeholder="Peso (kg)"
            value={newAnimal.weight}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Ubicación"
            value={newAnimal.location}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            step="0.0001"
            name="latitude"
            placeholder="Latitud"
            value={newAnimal.latitude}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            step="0.0001"
            name="longitude"
            placeholder="Longitud"
            value={newAnimal.longitude}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* Nuevo campo para el grupo */}
          <input
            type="text"
            name="group_name"
            placeholder="Grupo"
            value={newAnimal.group_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* Campos para seleccionar los padres */}
          <select
            name="mother_id"
            value={newAnimal.mother_id}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Selecciona la Madre</option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name} (ID: {animal.id})
              </option>
            ))}
          </select>

          <select
            name="father_id"
            value={newAnimal.father_id}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Selecciona el Padre</option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name} (ID: {animal.id})
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Animal
        </button>
      </form>

      {/* Lista de animales */}
      <h2 className="text-xl font-semibold mb-4">Animales Registrados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Especie</th>
              <th className="py-2 px-4 border-b">Raza</th>
              <th className="py-2 px-4 border-b">Edad</th>
              <th className="py-2 px-4 border-b">Peso (kg)</th>
              <th className="py-2 px-4 border-b">Ubicación</th>
              <th className="py-2 px-4 border-b">Grupo</th>
              <th className="py-2 px-4 border-b">Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {animals.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-2 px-4 text-center">
                  No hay animales registrados.
                </td>
              </tr>
            ) : (
              animals.map((animal) => (
                <tr key={animal.id}>
                  <td className="py-2 px-4 border-b">{animal.name}</td>
                  <td className="py-2 px-4 border-b">{animal.species}</td>
                  <td className="py-2 px-4 border-b">
                    {animal.breed || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">{animal.age || "N/A"}</td>
                  <td className="py-2 px-4 border-b">
                    {animal.weight || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {animal.location || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {animal.group_name || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(animal.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default About;
