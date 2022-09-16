import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { PatientRecord } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { formatPhoneNumber } from "react-phone-number-input";

type Props = {
  patients: PatientRecord[];
};

type SortBy = "name" | "phone" | "email" | "createdAt";
type SortDirection = "asc" | "desc";

const Table = ({ patients }: Props) => {
  const [patientsList, setPatientsList] = useState<PatientRecord[]>(() => patients);
  const [order, setOrder] = useState<SortDirection>("desc");
  const [sortField, setSortField] = useState<SortBy>("createdAt");

  const sort = (field: SortBy, order: SortDirection) => {
    const sorted = patientsList.sort((a, b) => {
      return (a[field] > b[field] ? 1 : -1) * (order === "asc" ? 1 : -1);
    });
    setPatientsList(sorted);
  };

  const handleSortingChange = (field: SortBy) => {
    const sortOrder = order === "asc" ? "desc" : "asc";
    setOrder(sortOrder);
    setSortField(field);
    sort(field, sortOrder);
  };

  return (
    <div className="bg-gray-100 px-4 py-10 sm:px-6 lg:px-8 border rounded">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Pacientes</h1>
          <p className="mt-2 text-sm text-gray-700">
            A continuación se muestran los pacientes registrados en el sistema.
          </p>
        </div>
      </div>
      <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="flex py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Nombre
                <button onClick={() => handleSortingChange("name")} className="mx-1">
                  {sortField === "name" && order === "asc" ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </button>
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Correo
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Número de teléfono
              </th>
              <th
                scope="col"
                className="flex px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Fecha
                <button onClick={() => handleSortingChange("createdAt")} className="mx-1">
                  {sortField === "createdAt" && order === "asc" ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </button>
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Abrir</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {patientsList.map((patient) => (
              <tr key={patient.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {patient.name} {patient.lastName}
                </td>
                <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {patient.email}
                </td>
                <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {formatPhoneNumber(patient.phone)}
                </td>
                <td className="whitespace-nowrap px-0 py-4 text-sm text-gray-500">
                  {patient.createdAt.toLocaleDateString("es-ES", {
                    minute: "numeric",
                    hour: "numeric",
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour12: true,
                  })}
                </td>
                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Link href={`/historial-medico/${patient.id}`}>
                    <a className="text-indigo-600 hover:text-indigo-900">
                      Abrir<span className="sr-only">, {patient.name}</span>
                    </a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
