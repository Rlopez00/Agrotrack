// src/pages/Enfermedades.jsx

import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../client";
import { AuthContext } from "../context/AuthContext";

function Enfermedades() {
  const { ganadero } = useContext(AuthContext);
  const [animals, setAnimals] = useState([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [healthRecords, setHealthRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    temperature: "",
    heart_rate: "",
    respiratory_rate: "",
    notes: "",
  });
  const [message, setMessage] = useState("");

  // Obtener la lista de animales del ganadero
  const fetchAnimals = async () => {
    try {
      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .eq("ganadero_id", ganadero.id);

      if (error) {
        console.error("Error fetching animals:", error);
      } else {
        setAnimals(data);
      }
    } catch (err) {
      console.error("Error fetching animals:", err);
    }
  };

  // Obtener los registros de salud del animal seleccionado
  const fetchHealthRecords = async (animalId) => {
    try {
      const { data, error } = await supabase
        .from("health_records")
        .select("*")
        .eq("animal_id", animalId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching health records:", error);
      } else {
        setHealthRecords(data);
      }
    } catch (err) {
      console.error("Error fetching health records:", err);
    }
  };

  useEffect(() => {
    if (ganadero) {
      fetchAnimals();
    }
  }, [ganadero]);

  useEffect(() => {
    if (selectedAnimalId) {
      fetchHealthRecords(selectedAnimalId);
    }
  }, [selectedAnimalId]);

  // Manejar la selección de un animal
  const handleAnimalSelect = (e) => {
    setSelectedAnimalId(e.target.value);
    setHealthRecords([]);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validar datos
    if (!selectedAnimalId) {
      setMessage("Por favor, selecciona un animal.");
      return;
    }

    try {
      const { error } = await supabase.from("health_records").insert([
        {
          animal_id: selectedAnimalId,
          temperature: parseFloat(newRecord.temperature),
          heart_rate: newRecord.heart_rate
            ? parseInt(newRecord.heart_rate)
            : null,
          respiratory_rate: newRecord.respiratory_rate
            ? parseInt(newRecord.respiratory_rate)
            : null,
          notes: newRecord.notes || null,
        },
      ]);

      if (error) {
        console.error("Error inserting health record:", error);
        setMessage("Error al agregar el registro de salud.");
      } else {
        setNewRecord({
          temperature: "",
          heart_rate: "",
          respiratory_rate: "",
          notes: "",
        });
        fetchHealthRecords(selectedAnimalId);
        setMessage("Registro de salud agregado exitosamente.");
      }
    } catch (err) {
      console.error("Error inserting health record:", err);
      setMessage("Error al agregar el registro de salud.");
    }
  };

  // Determinar si el animal está enfermo
  const isAnimalSick = (record) => {
    const normalTemp = 38.5; // Temperatura normal en grados Celsius
    const normalHeartRate = 60; // Frecuencia cardíaca normal
    const normalRespiratoryRate = 30; // Frecuencia respiratoria normal

    if (
      record.temperature > normalTemp ||
      (record.heart_rate && record.heart_rate > normalHeartRate) ||
      (record.respiratory_rate &&
        record.respiratory_rate > normalRespiratoryRate)
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Monitoreo de Enfermedades
      </h1>

      {/* Seleccionar un animal */}
      <div className="mb-8 flex flex-col items-center">
        <label className="mb-2 text-lg font-semibold">
          Selecciona un Animal:
        </label>
        <select
          value={selectedAnimalId}
          onChange={handleAnimalSelect}
          className="border p-2 rounded w-64"
        >
          <option value="">-- Seleccionar --</option>
          {animals.map((animal) => (
            <option key={animal.id} value={animal.id}>
              {animal.name}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario para agregar un nuevo registro de salud */}
      {selectedAnimalId && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Agregar Registro de Salud
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                step="0.1"
                name="temperature"
                placeholder="Temperatura (°C)"
                value={newRecord.temperature}
                onChange={handleChange}
                required
                className="border p-2 rounded w-64"
              />
              <input
                type="number"
                name="heart_rate"
                placeholder="Frecuencia Cardíaca (latidos/min)"
                value={newRecord.heart_rate}
                onChange={handleChange}
                className="border p-2 rounded w-64"
              />
              <input
                type="number"
                name="respiratory_rate"
                placeholder="Frecuencia Respiratoria (resp/min)"
                value={newRecord.respiratory_rate}
                onChange={handleChange}
                className="border p-2 rounded w-64"
              />
              <textarea
                name="notes"
                placeholder="Notas"
                value={newRecord.notes}
                onChange={handleChange}
                className="border p-2 rounded w-64 md:col-span-2"
              ></textarea>
            </div>
            {message && <p className="mt-4">{message}</p>}
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Agregar Registro
            </button>
          </form>
        </div>
      )}

      {/* Mostrar registros de salud */}
      {healthRecords.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Historial de Salud
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Fecha</th>
                  <th className="py-2 px-4 border-b">Temperatura (°C)</th>
                  <th className="py-2 px-4 border-b">Frecuencia Cardíaca</th>
                  <th className="py-2 px-4 border-b">
                    Frecuencia Respiratoria
                  </th>
                  <th className="py-2 px-4 border-b">Notas</th>
                  <th className="py-2 px-4 border-b">Estado</th>
                </tr>
              </thead>
              <tbody>
                {healthRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">
                      {new Date(record.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b">{record.temperature}</td>
                    <td className="py-2 px-4 border-b">
                      {record.heart_rate || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {record.respiratory_rate || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {record.notes || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {isAnimalSick(record) ? (
                        <span className="text-red-600 font-bold">Enfermo</span>
                      ) : (
                        <span className="text-green-600 font-bold">
                          Saludable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enfermedades;
