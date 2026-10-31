
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Quotation } from "../types";

export interface QuotationPdfOrganization {
  name: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
}

interface QuotationPdfDocumentProps {
  quotation: Quotation;
  organization: QuotationPdfOrganization;
  logoDataUrl?: string | null;
}

const navy = "#172B4D";
const muted = "#64748B";
const border = "#DCE3EC";
const pale = "#F4F7FB";

const styles = StyleSheet.create({
  page: {
  paddingTop: 26,
  paddingBottom: 48,
  paddingHorizontal: 32,
  fontFamily: "Helvetica",
  fontSize: 9,
  color: "#202B3C",
  backgroundColor: "#FFFFFF",
},
  companyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: border,
    marginBottom: 14,
  },
  companyInfo: { flex: 1, paddingRight: 14 },
  companyName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 4,
  },
  companyLine: {
    fontSize: 8,
    color: muted,
    lineHeight: 1.5,
    marginBottom: 2,
  },
  logo: {
    width: 64,
    height: 44,
    objectFit: "contain",
  },
  logoPlaceholder: {
    width: 68,
    height: 54,
    backgroundColor: pale,
    alignItems: "center",
    justifyContent: "center",
  },
  logoPlaceholderText: {
    fontSize: 8,
    color: muted,
  },
 titleRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#234A62",
  paddingHorizontal: 14,
  paddingVertical: 10,
  marginBottom: 14,
  borderRadius: 2,
},
  eyebrow: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#D8E7F0",
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    marginBottom: 3,
  },
  quotationNumber: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "right",
  },
  dateText: {
    fontSize: 7.5,
    color: "#E4EDF3",
    lineHeight: 1.6,
    textAlign: "right",
  },
  cards: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: border,
    borderRadius: 5,
    overflow: "hidden",
  },
  cardHeading: {
    backgroundColor: pale,
    paddingHorizontal: 11,
    paddingVertical: 7,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: navy,
    letterSpacing: 0.7,
  },
  cardBody: {
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  cardName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#202B3C",
    marginBottom: 3,
    lineHeight: 1.4,
  },
  cardLine: {
    fontSize: 8,
    color: muted,
    lineHeight: 1.4,
    marginBottom: 1,
  },
  sectionHeading: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom:6,
  },
  table: {
    width: "100%",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: border,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: navy,
    minHeight: 26,
    alignItems: "center",
  },
  tableHeaderCell: {
    paddingHorizontal: 7,
    paddingVertical: 6,
    color: "#FFFFFF",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: border,
  },
  tableRowAlternate: {
    backgroundColor: "#F8FAFC",
  },
  tableCell: {
    paddingHorizontal: 7,
    paddingVertical: 6,
    fontSize: 8,
    lineHeight: 1.5,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: border,
  },
  descriptionHeader: { flex: 1 },
  descriptionCell: { flex: 1 },
  quantityHeader: { width: 42, textAlign: "right" },
  quantityCell: { width: 42, textAlign: "right" },
  priceHeader: { width: 83, textAlign: "right" },
  priceCell: { width: 83, textAlign: "right" },
  amountHeader: { width: 88, textAlign: "right" },
  amountCell: {
    width: 88,
    textAlign: "right",
    borderRightWidth: 0,
    fontFamily: "Helvetica-Bold",
  },
  emptyText: {
    padding: 15,
    textAlign: "center",
    color: muted,
    fontSize: 8,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginTop: 0,
  },
  notes: { flex: 1 },
  notesText: {
    fontSize: 8,
    lineHeight: 1.7,
    color: muted,
  },
  summary: { width: 190 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F5",
    gap: 12,
  },
  summaryLabel: { fontSize: 8, color: muted },
  summaryValue: {
    fontSize: 8,
    color: "#202B3C",
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: navy,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginTop: 5,
    borderRadius: 4,
    gap: 10,
  },
  totalLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  totalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    paddingTop: 7,
    borderTopWidth: 1,
    borderTopColor: border,
    flexDirection: "row",
    justifyContent: "space-between",
    color: muted,
    fontSize: 7,
  },
});

function display(value: string | null | undefined): string {
  return value?.trim() || "—";
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value: number): string {
  const amount = Number.isFinite(value) ? value : 0;

  return `Rs. ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export function QuotationPdfDocument({
  quotation,
  organization,
  logoDataUrl,
}: QuotationPdfDocumentProps) {
  const companyName = organization.name?.trim() || "Your Company";
  const customerName =
    quotation.clientName || quotation.prospectName || "Customer";
  const eventName =
    quotation.eventName || quotation.proposedEventName || "Event";

  const items = quotation.items ?? [];

  return (
    <Document
      title={`Quotation ${quotation.quotationNumber}`}
      author={companyName}
      subject={`Quotation for ${customerName}`}
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.companyHeader}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{companyName}</Text>
            {organization.address && (
              <Text style={styles.companyLine}>
                {organization.address}
              </Text>
            )}
            {organization.phone && (
              <Text style={styles.companyLine}>
                {organization.phone}
              </Text>
            )}
            {organization.email && (
              <Text style={styles.companyLine}>
                {organization.email}
              </Text>
            )}
            {organization.website && (
              <Text style={styles.companyLine}>
                {organization.website}
              </Text>
            )}
          </View>

          {logoDataUrl ? (
            <Image src={logoDataUrl} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>BRAND</Text>
            </View>
          )}
        </View>

        <View style={styles.titleRow}>
          <View>
            <Text style={styles.eyebrow}>YOUR EVENT, OUR COMMITMENT</Text>
            <Text style={styles.title}>Quotation</Text>
            <Text style={styles.companyLine}>
              Prepared for {customerName}
            </Text>
          </View>

          <View>
            <Text style={styles.quotationNumber}>
              {quotation.quotationNumber}
            </Text>
            <Text style={styles.dateText}>
              Date: {formatDate(quotation.quotationDate)}
            </Text>
            {quotation.validUntil && (
              <Text style={styles.dateText}>
                Valid until: {formatDate(quotation.validUntil)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.cards}>
          <View style={styles.infoCard}>
            <Text style={styles.cardHeading}>PREPARED FOR</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardName}>{customerName}</Text>
              {quotation.prospectAddress && (
                <Text style={styles.cardLine}>
                  {quotation.prospectAddress}
                </Text>
              )}
              {quotation.prospectPhone && (
                <Text style={styles.cardLine}>
                  {quotation.prospectPhone}
                </Text>
              )}
              {quotation.prospectEmail && (
                <Text style={styles.cardLine}>
                  {quotation.prospectEmail}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardHeading}>EVENT DETAILS</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardName}>{eventName}</Text>
              {quotation.proposedEventType && (
                <Text style={styles.cardLine}>
                  Type: {quotation.proposedEventType}
                </Text>
              )}
              <Text style={styles.cardLine}>
                Date: {formatDate(quotation.proposedEventDate)}
              </Text>
              {quotation.proposedVenue && (
                <Text style={styles.cardLine}>
                  Venue: {quotation.proposedVenue}
                </Text>
              )}
              {quotation.proposedGuestCount > 0 && (
                <Text style={styles.cardLine}>
                  Guests: {quotation.proposedGuestCount}
                </Text>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.sectionHeading}>QUOTATION BREAKDOWN</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader} wrap={false}>
            <Text
              style={[styles.tableHeaderCell, styles.descriptionHeader]}
            >
              Description
            </Text>
            <Text
              style={[styles.tableHeaderCell, styles.quantityHeader]}
            >
              Qty
            </Text>
            <Text style={[styles.tableHeaderCell, styles.priceHeader]}>
              Unit price
            </Text>
            <Text style={[styles.tableHeaderCell, styles.amountHeader]}>
              Amount
            </Text>
          </View>

          {items.length ? (
            items.map((item, index) => (
              <View
                key={item.id || `${index}-${item.description}`}
                style={[
                  styles.tableRow,
                  ...(index % 2 === 1 ? [styles.tableRowAlternate] : []),
                ]}
                wrap={false}
              >
                <View
                  style={[styles.tableCell, styles.descriptionCell]}
                >
                  <Text>{display(item.description)}</Text>
                </View>
                <View style={[styles.tableCell, styles.quantityCell]}>
                  <Text>{String(item.quantity)}</Text>
                </View>
                <View style={[styles.tableCell, styles.priceCell]}>
                  <Text>{formatCurrency(item.unitPrice)}</Text>
                </View>
                <View style={[styles.tableCell, styles.amountCell]}>
                  <Text>{formatCurrency(item.amount)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No items have been added to this quotation.
            </Text>
          )}
        </View>

        <View style={styles.bottomSection}>
          {quotation.notes?.trim() ? (
            <View style={styles.notes}>
              <Text style={styles.sectionHeading}>NOTES</Text>
              <Text style={styles.notesText}>{quotation.notes.trim()}</Text>
            </View>
          ) : (
            <View style={styles.notes} />
          )}

          <View style={styles.summary} wrap={false}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(quotation.subtotal)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>
                - {formatCurrency(quotation.discount)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                + {formatCurrency(quotation.tax)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(quotation.total)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>{companyName} · Thank you for your consideration.</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
