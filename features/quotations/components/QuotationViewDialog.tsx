
"use client";

import { useEffect, useState } from "react";
import { FileDown, MessageCircle } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { QuotationPdfDocument } from "./QuotationPdfDocument";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Quotation } from "../types";

interface QuotationViewDialogProps {
  quotation: Quotation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrganizationDetails {
  name: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
}

const EMPTY_ORGANIZATION: OrganizationDetails = {
  name: null,
  logo_url: null,
  email: null,
  phone: null,
  address: null,
  website: null,
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value: number) {
  const amount = Number.isFinite(value) ? value : 0;

  return `Rs. ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

function safeFilename(value: string) {
  return value.replace(/[<>:"/\\|?*\x00-\x1F]/g, "-");
}

async function getLogoDataUrl(url: string | null) {
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const blob = await response.blob();

    if (!["image/png", "image/jpeg"].includes(blob.type)) {
      return null;
    }

    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(
          typeof reader.result === "string" ? reader.result : null
        );
      };

      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    // A remote logo may block cross-origin requests.
    // PDF generation should still succeed without it.
    return null;
  }
}


async function downloadQuotationPdf(
  quotation: Quotation,
  organization: OrganizationDetails
) {
  const logoDataUrl = await getLogoDataUrl(organization.logo_url);

  const blob = await pdf(
    <QuotationPdfDocument
      quotation={quotation}
      organization={organization}
      logoDataUrl={logoDataUrl}
    />
  ).toBlob();

  const filename = safeFilename(
    quotation.quotationNumber || "quotation"
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${filename}.pdf`;
  link.style.display = "none";

  document.body.appendChild(link);

  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export function QuotationViewDialog({
  quotation,
  open,
  onOpenChange,
}: QuotationViewDialogProps) {
  const [organization, setOrganization] =
    useState<OrganizationDetails>(EMPTY_ORGANIZATION);

  const [organizationLoading, setOrganizationLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    if (!open || !quotation?.organizationId) return;

    let cancelled = false;

    async function loadOrganization() {
      setOrganizationLoading(true);

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("organizations")
          .select("name, logo_url, email, phone, address, website")
          .eq("id", quotation!.organizationId)
          .maybeSingle();

        if (error) throw error;

        if (!cancelled) {
          setOrganization({
            ...EMPTY_ORGANIZATION,
            ...(data ?? {}),
          });
        }
      } catch (error) {
        console.error("Could not load quotation company details:", error);
        if (!cancelled) setOrganization(EMPTY_ORGANIZATION);
      } finally {
        if (!cancelled) setOrganizationLoading(false);
      }
    }

    void loadOrganization();

    return () => {
      cancelled = true;
    };
  }, [open, quotation?.organizationId]);

  if (!quotation) return null;

  const customerName =
    quotation.clientName || quotation.prospectName || "Customer";

  const eventName =
    quotation.eventName || quotation.proposedEventName || "Event";

  const companyName = organization.name?.trim() || "Your Company";

  async function handleDownload() {
    setDownloading(true);
    setDownloadError("");

    try {
      await downloadQuotationPdf(quotation!, organization);
    } catch (error) {
      console.error("Quotation PDF download failed:", error);
      setDownloadError("Could not generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-4xl">
        <DialogHeader className="border-b border-slate-200 px-5 py-4 sm:px-7">
          <DialogTitle className="text-xl font-semibold text-slate-950">
            Quotation preview
          </DialogTitle>
          <DialogDescription>
            Customer-facing document · {quotation.quotationNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-slate-100 p-3 sm:p-5">
          <article className="mx-auto max-w-3xl space-y-5 bg-white p-5 text-slate-900 shadow-sm sm:p-8">
            <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                {organization.logo_url && (
                  <img
                    src={organization.logo_url}
                    alt={`${companyName} logo`}
                    className="h-14 w-14 shrink-0 rounded-md border border-slate-100 object-contain p-1"
                  />
                )}

                <div className="min-w-0">
                  <h2 className="break-words text-lg font-bold tracking-tight">
                    {companyName}
                  </h2>
                  {organization.address && (
                    <p className="mt-1 whitespace-pre-line text-xs leading-5 text-slate-500">
                      {organization.address}
                    </p>
                  )}
                  <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                    {organization.phone && <p>{organization.phone}</p>}
                    {organization.email && <p>{organization.email}</p>}
                    {organization.website && <p>{organization.website}</p>}
                  </div>
                </div>
              </div>

              <div className="shrink-0 sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Quotation
                </p>
                <p className="mt-1 break-all text-base font-bold">
                  {quotation.quotationNumber}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Date: {formatDate(quotation.quotationDate)}
                </p>
                {quotation.validUntil && (
                  <p className="mt-1 text-xs text-slate-500">
                    Valid until: {formatDate(quotation.validUntil)}
                  </p>
                )}
              </div>
            </header>

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Prepared for
                </p>
                <p className="mt-1 break-words text-sm font-semibold">
                  {customerName}
                </p>
                {quotation.prospectAddress && (
                  <p className="mt-1 whitespace-pre-line break-words text-xs leading-5 text-slate-600">
                    {quotation.prospectAddress}
                  </p>
                )}
                {quotation.prospectPhone && (
                  <p className="mt-1 break-words text-xs text-slate-600">
                    {quotation.prospectPhone}
                  </p>
                )}
                {quotation.prospectEmail && (
                  <p className="mt-1 break-all text-xs text-slate-600">
                    {quotation.prospectEmail}
                  </p>
                )}
              </div>

              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Event details
                </p>
                <p className="mt-1 break-words text-sm font-semibold">
                  {eventName}
                </p>
                {quotation.proposedEventType && (
                  <p className="mt-1 text-xs text-slate-600">
                    Type: {quotation.proposedEventType}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-600">
                  Date: {formatDate(quotation.proposedEventDate)}
                </p>
                {quotation.proposedVenue && (
                  <p className="mt-1 break-words text-xs text-slate-600">
                    Venue: {quotation.proposedVenue}
                  </p>
                )}
                {quotation.proposedGuestCount > 0 && (
                  <p className="mt-1 text-xs text-slate-600">
                    Guests: {quotation.proposedGuestCount}
                  </p>
                )}
              </div>
            </section>

            <section>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[490px] table-fixed text-xs">
                  <colgroup>
                    <col />
                    <col className="w-12" />
                    <col className="w-24" />
                    <col className="w-24" />
                  </colgroup>
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-2 py-2.5 text-left font-semibold uppercase tracking-wide text-slate-600">
                        Description
                      </th>
                      <th className="px-2 py-2.5 text-right font-semibold uppercase tracking-wide text-slate-600">
                        Qty
                      </th>
                      <th className="px-2 py-2.5 text-right font-semibold uppercase tracking-wide text-slate-600">
                        Unit price
                      </th>
                      <th className="px-2 py-2.5 text-right font-semibold uppercase tracking-wide text-slate-600">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(quotation.items ?? []).map((item) => (
                      <tr key={item.id}>
                        <td className="break-words px-2 py-2.5 leading-5">
                          {item.description || "Item"}
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          {item.quantity}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2.5 text-right">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2.5 text-right font-medium">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    {!quotation.items?.length && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-2 py-4 text-center text-slate-500"
                        >
                          No items have been added to this quotation.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="flex justify-end">
              <div className="w-full space-y-2 sm:max-w-xs">
                <SummaryRow
                  label="Subtotal"
                  value={formatCurrency(quotation.subtotal)}
                />
                <SummaryRow
                  label="Discount"
                  value={`− ${formatCurrency(quotation.discount)}`}
                />
                <SummaryRow
                  label="Tax"
                  value={`+ ${formatCurrency(quotation.tax)}`}
                />
                <div className="flex items-center justify-between gap-3 border-t border-slate-300 pt-3">
                  <span className="text-sm font-bold">Total</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(quotation.total)}
                  </span>
                </div>
              </div>
            </section>

            {quotation.notes?.trim() && (
              <section className="border-t border-slate-200 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Notes
                </h3>
                <p className="mt-2 whitespace-pre-line break-words text-xs leading-5 text-slate-600">
                  {quotation.notes}
                </p>
              </section>
            )}

            <footer className="border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
              Thank you for the opportunity to work with you.
            </footer>
          </article>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="text-xs text-slate-500">
            {organizationLoading
              ? "Loading company details…"
              : "Preview of the customer-facing quotation."}
            {downloadError && (
              <p className="mt-1 text-red-600">{downloadError}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handleDownload}
               disabled={downloading || organizationLoading}
            >
              <FileDown size={16} />
              {downloading ? "Preparing PDF…" : "Download PDF"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled
              title="Download the PDF and attach it manually in WhatsApp."
            >
              <MessageCircle size={16} />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  );
}
