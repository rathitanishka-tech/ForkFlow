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
    PENDING: { label: "Pending", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" },
    CONFIRMED: { label: "Confirmed", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
    SEATED: { label: "Seated", className: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30" },
    COMPLETED: { label: "Completed", className: "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30" },
    CANCELLED: { label: "Cancelled", className: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30" },
    NO_SHOW: { label: "No Show", className: "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-500/30" },
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
    <main className="min-h-screen w-full bg-background p-4 text-foreground md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-5 shadow-xs sm:flex-row sm:items-center sm:px-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Reservations & Bookings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage guest bookings, party sizes, and dining seatings.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Reservation Booking Form */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-xs lg:col-span-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Restaurant</p>
                <p className="text-base font-bold text-foreground">
                  {restaurant?.name ?? "Govindas Restaurant"}
                </p>
              </div>
              <div className="rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-semibold text-foreground">
                {reservationsTodayCount} bookings today
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Guest name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="Guest full name"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone number</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="+919XXXXXXXXX"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email address</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="guest@example.com"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Party size (Guests)</span>
                  <input
                    name="guests"
                    type="number"
                    min={1}
                    value={form.guests}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reservation time</span>
                  <input
                    name="reservationDate"
                    type="datetime-local"
                    value={form.reservationDate}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assigned Table</span>
                  <select
                    name="tableId"
                    value={form.tableId}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
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
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Occasion</span>
                  <input
                    name="occasion"
                    value={form.occasion}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="Birthday, anniversary..."
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Seating preference</span>
                  <input
                    name="seatingPreference"
                    value={form.seatingPreference}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="Window, quiet area"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Special Requests / Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="Add any special requests, allergy notes, or dietary preferences"
                />
              </label>

              {submitError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-medium text-destructive">
                  {submitError}
                </div>
              )}

              {successMessage && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <p>{successMessage}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving || !restaurant || tables.length === 0}
                className="inline-flex items-center justify-center rounded-xl bg-[#216E46] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1b5838] dark:bg-[#74A96B] dark:text-[#101712] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isSaving ? "Saving reservation..." : "Create Reservation"}
              </button>
            </form>
          </section>

          {/* Recent Bookings List */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-xs lg:col-span-5 flex flex-col">
            <h2 className="text-base font-bold text-foreground">
              Recent Bookings
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              A list of the latest restaurant bookings and guest arrivals.
            </p>
            <div className="mt-5 space-y-3 flex-1 overflow-y-auto max-h-[640px]">
              {isLoadingReservations ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-16 items-center justify-between rounded-xl border border-border bg-muted/40 p-4 animate-pulse"
                  >
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-muted"></div>
                      <div className="h-3 w-48 rounded bg-muted"></div>
                    </div>
                    <div className="h-6 w-24 rounded-full bg-muted"></div>
                  </div>
                ))
              ) : reservations.length > 0 ? (
                reservations.map((reservation) => {
                  const statusKey = reservation.status
                    .toUpperCase()
                    .replace(" ", "_") as keyof typeof statusConfig;
                  const config = statusConfig[statusKey] ?? statusConfig.PENDING;

                  const renderActionButton = () => {
                    switch (statusKey) {
                      case "PENDING":
                        return (
                          <Button
                            size="sm"
                            className="bg-[#216E46] text-white hover:bg-[#1b5838] dark:bg-[#74A96B] dark:text-[#101712] text-xs h-8"
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
                            className="bg-[#216E46] text-white hover:bg-[#1b5838] dark:bg-[#74A96B] dark:text-[#101712] text-xs h-8"
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
                            variant="outline"
                            className="text-xs h-8"
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
                      className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3.5 hover:border-primary/30 transition"
                    >
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {reservation.guest}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Table {reservation.table} &bull; {reservation.guests}{" "}
                          guests &bull; {reservation.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Badge variant="outline" className={config.className}>
                          {config.label}
                        </Badge>
                        {renderActionButton()}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-xs text-muted-foreground py-10">
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
              className="bg-[#216E46] text-white hover:bg-[#1b5838] dark:bg-[#74A96B] dark:text-[#101712]"
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
