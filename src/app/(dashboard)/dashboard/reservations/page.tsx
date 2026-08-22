"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCurrentRestaurant } from "@/lib/useCurrentRestaurant";
import type {
  DashboardAnalytics,
  ReservationSummary,
} from "@/modules/analytics/analytics.types";

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

type ReservationAction = "confirm" | "seat" | "complete" | "cancel" | "no-show";

export default function ReservationsPage() {
  const { restaurant } = useCurrentRestaurant();
  const router = useRouter();
  const [reservations, setReservations] = React.useState<ReservationSummary[]>([]);
  const [tables, setTables] = React.useState<TableOption[]>([]);
  const [form, setForm] = React.useState<ReservationFormState>(initialFormState);
  const [isSaving, setIsSaving] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [actionState, setActionState] = React.useState<{
    isLoading: boolean;
    dialogOpen: boolean;
    currentAction: ReservationAction | null;
    reservationId: string | null;
  }>({
    isLoading: false,
    dialogOpen: false,
    currentAction: null,
    reservationId: null,
  });
  const [reservationsTodayCount, setReservationsTodayCount] = React.useState(0);
  const [isLoadingReservations, setIsLoadingReservations] = React.useState(true);

  React.useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/reservations");

        if (!response.ok) {
          throw new Error("Failed to load reservations.");
        }
        const result = await response.json();
        const data = result.data || [];

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

        let todayCount = 0;
        const mappedReservations = data.map((reservation: any) => {
          const resTime = new Date(reservation.reservationTime);
          if (resTime >= startOfToday && resTime < startOfTomorrow) {
            todayCount++;
          }
          
          let formattedStatus = reservation.status;
          if (formattedStatus === "NO_SHOW") formattedStatus = "No Show";
          else formattedStatus = formattedStatus.charAt(0).toUpperCase() + formattedStatus.slice(1).toLowerCase();

          return {
            id: reservation.id,
            guest: reservation.guest?.name ?? "Guest",
            table: reservation.table?.number ?? "N/A",
            time: resTime.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }),
            guests: reservation.partySize,
            status: formattedStatus,
          };
        });

        setReservationsTodayCount(todayCount);
        setReservations(mappedReservations);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingReservations(false);
      }
    };

    fetchReservations();
  }, [successMessage]);

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
          ? (result.data as Array<{ id: string; number: string }>).map(
              (table) => ({
                id: table.id,
                number: table.number,
              }),
            )
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

  const handleReservationAction = async (
    action: ReservationAction,
    reservationId: string,
  ) => {
    setActionState((prev) => ({ ...prev, isLoading: true, reservationId }));
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to ${action} reservation.`,
        );
      }

      toast.success(`Reservation action '${action}' was successful.`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setActionState({
        isLoading: false,
        dialogOpen: false,
        currentAction: null,
        reservationId: null,
      });
    }
  };

  const openConfirmationDialog = (
    action: ReservationAction,
    reservationId: string,
  ) => {
    setActionState({
      isLoading: false,
      dialogOpen: true,
      currentAction: action,
      reservationId,
    });
  };

  const dialogConfig = {
    complete: {
      title: "Complete Dining?",
      description:
        "This will mark the dining session as completed and set the table to available.",
    },
    cancel: {
      title: "Cancel Reservation?",
      description: "This will cancel the reservation and release the table.",
    },
    "no-show": {
      title: "Mark as No-Show?",
      description:
        "This will mark the guest as a no-show and release the table.",
    },
  };

  const currentDialog = actionState.currentAction
    ? dialogConfig[actionState.currentAction as keyof typeof dialogConfig]
    : null;

  const statusConfig = {
    PENDING: { label: "Pending", className: "bg-amber-500 text-white" },
    CONFIRMED: { label: "Confirmed", className: "bg-blue-500 text-white" },
    SEATED: { label: "Seated", className: "bg-emerald-500 text-white" },
    COMPLETED: { label: "Completed", className: "bg-gray-500 text-white" },
    CANCELLED: { label: "Cancelled", className: "bg-red-500 text-white" },
    NO_SHOW: { label: "No Show", className: "bg-neutral-400 text-white" },
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
          reservationTime: new Date(form.reservationDate).toISOString(),
          partySize: form.guests,
          occasion: form.occasion || undefined,
          seatingPreference: form.seatingPreference || undefined,
          noisePreference: form.noisePreference || undefined,
          notes: form.notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Zod validation errors return an array of issues
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const firstError = errorData.errors[0];
          throw new Error(firstError.message || "Validation failed.");
        }
        
        throw new Error(errorData.message || errorData.error || "Unable to create reservation.");
      }

      setSuccessMessage("Reservation created successfully.");
      setForm(initialFormState);
      if (tables.length > 0) {
        setForm((current) => ({ ...current, tableId: tables[0].id }));
      }
      router.refresh();
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

        <div className="grid gap-6">
          <section className="rounded-[1.5rem] border border-[#29443C] bg-[#10231E] p-6 shadow-[0_16px_45px_rgba(3,15,11,0.14)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[#8ea79d]">Current restaurant</p>
                <p className="text-lg font-semibold text-[#f8f5ef]">
                  {restaurant?.name ?? "ForkFlow"}
                </p>
              </div>
              <div className="rounded-2xl bg-[#081E19] px-4 py-3 text-sm text-[#f8f5ef]">
                {reservationsTodayCount} reservations today
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

          <section className="rounded-[1.5rem] border border-[#29443C] bg-[#10231E] p-6 shadow-[0_16px_45px_rgba(3,15,11,0.14)]">
            <h2 className="text-lg font-semibold text-[#f8f5ef]">
              Recent Reservations
            </h2>
            <p className="mt-1 text-sm text-[#8ea79d]">
              A list of the most recent bookings.
            </p>
            <div className="mt-6 space-y-4">
              {isLoadingReservations ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-[76px] items-center justify-between rounded-2xl border border-[#29443C] bg-[#081E19]/50 p-4 animate-pulse"
                  >
                    <div className="space-y-3">
                      <div className="h-4 w-32 rounded bg-[#153426]"></div>
                      <div className="h-3 w-48 rounded bg-[#153426]"></div>
                    </div>
                    <div className="h-6 w-24 rounded-full bg-[#153426]"></div>
                  </div>
                ))
              ) : reservations.length > 0 ? (
                reservations.map((reservation) => {
                  const statusKey = reservation.status
                    .toUpperCase()
                    .replace(" ", "_") as keyof typeof statusConfig;
                  const config = statusConfig[statusKey];

                  const renderActionButton = () => {
                    switch (statusKey) {
                      case "PENDING":
                        return (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleReservationAction("confirm", reservation.id)
                            }
                          >
                            Confirm
                          </Button>
                        );
                      case "CONFIRMED":
                        return (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleReservationAction("seat", reservation.id)
                            }
                          >
                            Seat Guest
                          </Button>
                        );
                      case "SEATED":
                        return (
                          <Button
                            size="sm"
                            onClick={() =>
                              openConfirmationDialog("complete", reservation.id)
                            }
                          >
                            Complete Dining
                          </Button>
                        );
                      default:
                        return null;
                    }
                  };

                  return (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between rounded-2xl border border-[#29443C] bg-[#081E19] p-4"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          {reservation.guest}
                        </p>
                        <p className="text-sm text-slate-400">
                          Table {reservation.table} &bull; {reservation.guests}{" "}
                          guests &bull; {reservation.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {config && (
                          <Badge className={config.className}>
                            {config.label}
                          </Badge>
                        )}
                        {renderActionButton()}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-slate-400">
                  No recent reservations.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      <AlertDialog
        open={actionState.dialogOpen}
        onOpenChange={(open) =>
          setActionState((prev) => ({
            ...prev,
            dialogOpen: open,
          }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{currentDialog?.title}</AlertDialogTitle>

            <AlertDialogDescription>
              {currentDialog?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (actionState.currentAction && actionState.reservationId) {
                  handleReservationAction(
                    actionState.currentAction,
                    actionState.reservationId,
                  );
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
