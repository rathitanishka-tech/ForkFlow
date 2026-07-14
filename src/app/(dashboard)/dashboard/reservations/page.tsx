"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Loader,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { ReservationTable } from "@/app/dashboard/reservation-table";
import { useCurrentRestaurant } from "@/lib/useCurrentRestaurant";
import type { DashboardAnalytics } from "@/modules/analytics/analytics.types";

interface TableOption {
  id: string;
  number: string;
}

interface ReservationFormState {
  tableId: string;
  name: string;
  phone: string;
  email: string;
  guests: number;
  reservationDate: string;
  occasion: string;
  seatingPreference: string;
  noisePreference: string;
  notes: string;
}

const initialFormState: ReservationFormState = {
  tableId: "",
  name: "",
  phone: "",
  email: "",
  guests: 2,
  reservationDate: "",
  occasion: "",
  seatingPreference: "",
  noisePreference: "",
  notes: "",
};

export default function ReservationsPage() {
  const {
    restaurant,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useCurrentRestaurant();
  const [analytics, setAnalytics] = React.useState<DashboardAnalytics | null>(
    null,
  );
  const [tables, setTables] = React.useState<TableOption[]>([]);
  const [form, setForm] =
    React.useState<ReservationFormState>(initialFormState);
  const [isSaving, setIsSaving] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/dashboard/analytics");
        if (!response.ok) {
          throw new Error("Failed to load reservation metrics.");
        }
        const data: DashboardAnalytics = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAnalytics();
  }, []);

  React.useEffect(() => {
    if (!restaurant?.id) {
      return;
    }

    const loadTables = async () => {
      try {
        const response = await fetch(
          `/api/tables?restaurantId=${restaurant.id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to load tables.");
        }

        const result = await response.json();
        const tableOptions: TableOption[] = Array.isArray(result.data)
          ? result.data.map((table: any) => ({
              id: table.id,
              number: table.number,
            }))
          : [];

        setTables(tableOptions);
        if (tableOptions.length > 0 && !form.tableId) {
          setForm((current) => ({ ...current, tableId: tableOptions[0].id }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadTables();
  }, [restaurant?.id, form.tableId]);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!restaurant?.id) {
      setSubmitError(
        "Please select a restaurant before creating a reservation.",
      );
      return;
    }

    if (!form.tableId || !form.name || !form.phone || !form.reservationDate) {
      setSubmitError("Please complete the required reservation fields.");
      return;
    }

    setIsSaving(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          tableId: form.tableId,
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          reservationDate: new Date(form.reservationDate).toISOString(),
          guests: form.guests,
          occasion: form.occasion || undefined,
          seatingPreference: form.seatingPreference || undefined,
          noisePreference: form.noisePreference || undefined,
          notes: form.notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unable to create reservation.");
      }

      setSuccessMessage("Reservation created successfully.");
      setForm(initialFormState);
      if (tables.length > 0) {
        setForm((current) => ({ ...current, tableId: tables[0].id }));
      }
      const analyticsResponse = await fetch("/api/dashboard/analytics");
      if (analyticsResponse.ok) {
        const analyticsData: DashboardAnalytics =
          await analyticsResponse.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to create reservation.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const reservationRecords = analytics?.recentReservations ?? [];

  return (
    <main className="min-h-screen w-full bg-[#081E19] p-4 text-[#f8f5ef] md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-[#d6b48c]/15 bg-[#fffdf9] p-5 shadow-[0_16px_45px_rgba(11,35,28,0.08)] sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#0f5b4c]">
              Reservations
            </p>
            <h1 className="text-3xl font-semibold text-[#0b2f24]">
              Manage bookings
            </h1>
            <p className="mt-2 text-sm text-[#4b5d53]">
              Create new reservations and review recent bookings for your
              current restaurant.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl border border-[#d6b48c]/20 bg-[#10291f] px-4 py-2 text-sm font-medium text-[#f8f5ef] transition hover:bg-[#153426]"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-[1.5rem] border border-[#29443C] bg-[#10231E] p-6 shadow-[0_16px_45px_rgba(3,15,11,0.14)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[#4b5d53]">Current restaurant</p>
                <p className="text-lg font-semibold text-[#0b2f24]">
                  {restaurant?.name ?? "ForkFlow"}
                </p>
              </div>
              <div className="rounded-2xl bg-[#081E19] px-4 py-3 text-sm text-[#f8f5ef]">
                {analytics?.reservationsTodayCount ?? 0} reservations today
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  <span className="text-[#8ea79d]">Guest name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-[#29443C] bg-[#081E19] px-4 py-3 text-white outline-none transition focus:border-[#0f5b4c]"
                    placeholder="Guest full name"
                    required
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="text-[#8ea79d]">Phone number</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-[#29443C] bg-[#081E19] px-4 py-3 text-white outline-none transition focus:border-[#0f5b4c]"
                    placeholder="+919XXXXXXXXX"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  <span className="text-[#8ea79d]">Email address</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-[#29443C] bg-[#081E19] px-4 py-3 text-white outline-none transition focus:border-[#0f5b4c]"
                    placeholder="guest@example.com"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="text-[#8ea79d]">Party size</span>
                  <input
                    name="guests"
                    type="number"
                    min={1}
                    value={form.guests}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-[#29443C] bg-[#081E19] px-4 py-3 text-white outline-none transition focus:border-[#0f5b4c]"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  <span className="text-[#8ea79d]">Reservation time</span>
                  <input
                    name="reservationDate"
                    type="datetime-local"
                    value={form.reservationDate}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-[#29443C] bg-[#081E19] px-4 py-3 text-white outline-none transition focus:border-[#0f5b4c]"
                    required
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="text-[#8ea79d]">Table</span>
                  <select
                    name="tableId"
                    value={form.tableId}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-[#29443C] bg-[#081E19] px-4 py-3 text-white outline-none transition focus:border-[#0f5b4c]"
                    required
                  >
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        Table {table.number}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  <span className="text-[#8ea79d]">Occasion</span>
                  <input
                    name="occasion"
                    value={form.occasion}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-[#29443C] bg-[#081E19] px-4 py-3 text-white outline-none transition focus:border-[#0f5b4c]"
                    placeholder="Birthday, anniversary..."
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="text-[#8ea79d]">Seating preference</span>
                  <input
                    name="seatingPreference"
                    value={form.seatingPreference}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-[#29443C] bg-[#081E19] px-4 py-3 text-white outline-none transition focus:border-[#0f5b4c]"
                    placeholder="Window, quiet area"
                  />
                </label>
              </div>

              <label className="block text-sm text-slate-300">
                <span className="text-[#8ea79d]">Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-[#29443C] bg-[#081E19] px-4 py-3 text-white outline-none transition focus:border-[#0f5b4c]"
                  placeholder="Add any requests or preferences"
                />
              </label>

              {submitError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              {successMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <p>{successMessage}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving || !restaurant || tables.length === 0}
                className="inline-flex items-center justify-center rounded-2xl bg-[#0f5b4c] px-6 py-3 text-sm font-semibold text-[#f8f5ef] transition hover:bg-[#144433] disabled:cursor-not-allowed disabled:bg-[#16342D] disabled:text-[#8ea79d]"
              >
                {isSaving ? "Saving reservation..." : "Create Reservation"}
              </button>
            </form>
          </section>

          <section className="hidden space-y-6 xl:block">
            <div className="rounded-3xl border border-[#29443C] bg-[#10231E] p-6 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#4b5d53]">Today's Reservations</p>
                  <p className="mt-2 text-3xl font-semibold text-[#f8f5ef]">
                    {analytics?.reservationsTodayCount ?? 0}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#10291f] px-4 py-3 text-sm text-[#f8f5ef]">
                  {restaurant?.name ?? "No restaurant selected"}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#29443C] bg-[#10231E] p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <CalendarCheck className="h-5 w-5 text-[#0f5b4c]" />
                <h2 className="text-lg font-semibold text-[#f8f5ef]">
                  Recent reservations
                </h2>
              </div>
              {reservationRecords.length > 0 ? (
                <ReservationTable reservations={reservationRecords} />
              ) : (
                <div className="rounded-2xl border border-dashed border-[#29443C] bg-[#081E19] p-8 text-center text-[#8ea79d]">
                  No recent reservations are available yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
