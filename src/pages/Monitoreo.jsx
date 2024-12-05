// src/pages/Monitoreo.jsx

import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../client";
import { AuthContext } from "../context/AuthContext";
import Tree from "react-d3-tree";

function Monitoreo() {
  const { ganadero } = useContext(AuthContext);
  const [animals, setAnimals] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState("");

  // Función para obtener los animales
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

  useEffect(() => {
    if (ganadero) {
      fetchAnimals();
    }
  }, [ganadero]);

  // Función para generar datos del árbol genealógico
  const generateTreeDataForAnimal = (animalId) => {
    if (!animalId) {
      setTreeData(null);
      return;
    }

    const buildTree = (animal) => {
      if (!animal) return null;

      const node = {
        name: animal.name,
        attributes: {
          Especie: animal.species,
          Raza: animal.breed || "N/A",
          Edad: animal.age || "N/A",
        },
        children: [],
      };

      // Obtener la madre y el padre
      const mother = animals.find((a) => a.id === animal.mother_id);
      const father = animals.find((a) => a.id === animal.father_id);

      // Construir los subárboles de la madre y el padre
      if (mother) {
        const motherTree = buildTree(mother);
        if (motherTree) node.children.push(motherTree);
      }

      if (father) {
        const fatherTree = buildTree(father);
        if (fatherTree) node.children.push(fatherTree);
      }

      return node;
    };

    const selectedAnimal = animals.find((a) => a.id === animalId);
    const tree = buildTree(selectedAnimal);

    // Verificar si el árbol se generó correctamente
    if (tree) {
      setTreeData(tree);
    } else {
      setTreeData(null);
    }
  };

  useEffect(() => {
    if (selectedAnimalId) {
      generateTreeDataForAnimal(selectedAnimalId);
    } else {
      setTreeData(null);
    }
  }, [selectedAnimalId, animals]);

  // Función para manejar la selección de un animal
  const handleAnimalSelect = (e) => {
    setSelectedAnimalId(e.target.value);
  };

  // Estilos personalizados para el árbol genealógico
  const treeContainerStyles = {
    width: "100%",
    height: "500px",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-700 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white">
          Monitoreo de Ganado
        </h1>

        {/* Seleccionar un animal para ver su árbol genealógico */}
        <div className="mb-12 flex flex-col items-center">
          <label className="mb-4 text-2xl font-semibold text-white">
            Selecciona un Animal:
          </label>
          <select
            value={selectedAnimalId}
            onChange={handleAnimalSelect}
            className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Seleccionar --</option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mostrar datos importantes del ganado */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center text-white">
            Datos del Ganado
          </h2>
          {/* Tabla con los datos de los animales */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-left">Especie</th>
                  <th className="py-3 px-4 text-left">Raza</th>
                  <th className="py-3 px-4 text-left">Edad</th>
                  <th className="py-3 px-4 text-left">Peso (kg)</th>
                  <th className="py-3 px-4 text-left">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((animal, index) => (
                  <tr
                    key={animal.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-3 px-4">{animal.name}</td>
                    <td className="py-3 px-4">{animal.species}</td>
                    <td className="py-3 px-4">{animal.breed || "N/A"}</td>
                    <td className="py-3 px-4">{animal.age || "N/A"}</td>
                    <td className="py-3 px-4">{animal.weight || "N/A"}</td>
                    <td className="py-3 px-4">{animal.group_name || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Árbol Genealógico */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center text-white">
            Árbol Genealógico
          </h2>
          {treeData ? (
            <div className="flex justify-center">
              <div
                id="treeWrapper"
                style={treeContainerStyles}
                className="bg-white rounded-lg shadow-lg p-4"
              >
                <Tree
                  data={treeData}
                  orientation="vertical"
                  translate={{ x: 250, y: 50 }}
                  zoomable={true}
                  scaleExtent={{ min: 0.5, max: 2 }}
                  nodeSize={{ x: 200, y: 200 }}
                  separation={{ siblings: 1, nonSiblings: 1.5 }}
                />
              </div>
            </div>
          ) : (
            <p className="text-center text-white">
              Selecciona un animal para ver su árbol genealógico.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Monitoreo;
