// src/pages/Reports.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/reports");
      setReports(response.data.reports);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Cargando reportes...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        Error al cargar los reportes.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-20">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-700">
        Reportes Inteligentes
      </h1>

      {reports.map((report, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            {report.title}
          </h2>
          <p className="mb-4">{report.description}</p>
          <div className="bg-white shadow rounded-lg p-6">
            {/* Visualización basada en el título del reporte */}
            {report.title === "Reporte de Productividad" ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.keys(report.data).map((key) => ({
                    name: key,
                    Production: report.data[key],
                  }))}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Production" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : report.title === "Reporte de Seguridad" ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.keys(report.data).map((key) => ({
                      name: key,
                      value: report.data[key],
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {Object.keys(report.data).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : report.title === "Reporte Financiero" ? (
              <div>
                <div className="flex justify-around">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">Total Costos</h3>
                    <p className="text-2xl text-red-500">
                      ${report.data["Total Costos"].toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">Total Ingresos</h3>
                    <p className="text-2xl text-green-500">
                      ${report.data["Total Ingresos"].toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">Beneficio Neto</h3>
                    <p
                      className={`text-2xl ${
                        report.data["Beneficio Neto"] >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      ${report.data["Beneficio Neto"].toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : report.title === "Reporte de Recursos" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Consumo de Agua
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={Object.keys(report.data["Consumo de Agua"]).map(
                          (key) => ({
                            name: key,
                            value: report.data["Consumo de Agua"][key],
                          })
                        )}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#82ca9d"
                        label
                      >
                        {Object.keys(report.data["Consumo de Agua"]).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Consumo de Alimentos
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={Object.keys(
                          report.data["Consumo de Alimentos"]
                        ).map((key) => ({
                          name: key,
                          value: report.data["Consumo de Alimentos"][key],
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {Object.keys(report.data["Consumo de Alimentos"]).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : report.title === "Reporte Predictivo" ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Predicciones de Salud
                </h3>
                <p className="mb-4">{report.data["Salud"]}</p>
                <h3 className="text-lg font-semibold mb-2">
                  Pronóstico de Productividad
                </h3>
                <p>{report.data["Productividad"]}</p>
              </div>
            ) : (
              <pre>{JSON.stringify(report.data, null, 2)}</pre>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reports;
