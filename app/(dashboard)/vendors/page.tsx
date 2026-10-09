
"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  ChevronDown,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Star,
  Store,
  Trash2,
  X,
} from "lucide-react";

import { PageContainer } from "@/components/design-system/PageContainer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useVendors } from "@/features/vendors/hooks/useVendors";
import { VENDOR_CATEGORIES } from "@/features/vendors/types";
import type { Vendor, VendorFormValues } from "@/features/vendors/types";
import { vendorSchema } from "@/features/vendors/validation";

const emptyForm: VendorFormValues = {
  name: "",
  category: "Other",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  website: "",
  notes: "",
  rating: null,
};

const fieldClass = "mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

function VendorForm({
  vendor,
  saving,
  onCancel,
  onSave,
}: {
  vendor: Vendor | null;
  saving: boolean;
  onCancel: () => void;
  onSave: (values: VendorFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<VendorFormValues>(
    vendor ? {
      name: vendor.name,
      category: vendor.category,
      contactPerson: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
      city: vendor.city,
      website: vendor.website,
      notes: vendor.notes,
      rating: vendor.rating,
    } : emptyForm
  );
  const [formError, setFormError] = useState("");

  function update<K extends keyof VendorFormValues>(
    key: K,
    value: VendorFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const parsed = vendorSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Check the form fields.");
      return;
    }

    try {
      await onSave({
        ...emptyForm,
        ...parsed.data,
        contactPerson: parsed.data.contactPerson ?? "",
        phone: parsed.data.phone ?? "",
        email: parsed.data.email ?? "",
        address: parsed.data.address ?? "",
        city: parsed.data.city ?? "",
        website: parsed.data.website ?? "",
        notes: parsed.data.notes ?? "",
        rating: parsed.data.rating ?? null,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save vendor.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Vendor / business name *
          <input className={fieldClass} autoFocus value={values.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Royal Orchid Banquets" />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Category *
          <select className={fieldClass} value={values.category} onChange={(e) => update("category", e.target.value)}>
            {VENDOR_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Contact person
          <input className={fieldClass} value={values.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} placeholder="Contact name" />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Phone
          <input className={fieldClass} value={values.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 ..." />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Email
          <input type="email" className={fieldClass} value={values.email} onChange={(e) => update("email", e.target.value)} placeholder="vendor@example.com" />
        </label>

        <label className="text-sm font-medium text-slate-700">
          City
          <input className={fieldClass} value={values.city} onChange={(e) => update("city", e.target.value)} placeholder="e.g. Gwalior" />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Website
          <input className={fieldClass} value={values.website} onChange={(e) => update("website", e.target.value)} placeholder="https://..." />
        </label>

        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Address
          <input className={fieldClass} value={values.address} onChange={(e) => update("address", e.target.value)} placeholder="Business address" />
        </label>

        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Notes
          <textarea className="mt-1.5 min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100" value={values.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Services, pricing notes, or other details..." />
        </label>
      </div>

      {formError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : vendor ? "Save Changes" : "Add Vendor"}</Button>
      </div>
    </form>
  );
}

function VendorCard({
  vendor,
  onView,
  onEdit,
  onDelete,
}: {
  vendor: Vendor;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <article className="group relative flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Building2 size={21} strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-slate-900" title={vendor.name}>{vendor.name}</h3>
          <p className="mt-1 text-xs font-medium text-blue-700">{vendor.category}</p>
        </div>
        <div className="relative">
          <button type="button" onClick={() => setActionsOpen((open) => !open)} className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label={`Actions for ${vendor.name}`}>
            <MoreHorizontal size={18} />
          </button>
          {actionsOpen && (
            <div className="absolute right-0 top-9 z-20 w-32 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
              <button type="button" onClick={() => { setActionsOpen(false); onView(); }} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50">View</button>
              <button type="button" onClick={() => { setActionsOpen(false); onEdit(); }} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50">Edit</button>
              <button type="button" onClick={() => { setActionsOpen(false); onDelete(); }} className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Delete</button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
        {vendor.contactPerson && <p className="truncate text-slate-700">{vendor.contactPerson}</p>}
        {vendor.phone && <p className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-slate-400" /><span className="truncate">{vendor.phone}</span></p>}
        {vendor.email && <p className="flex items-center gap-2"><Mail size={14} className="shrink-0 text-slate-400" /><span className="truncate">{vendor.email}</span></p>}
        {(vendor.city || vendor.address) && <p className="flex items-center gap-2"><MapPin size={14} className="shrink-0 text-slate-400" /><span className="truncate">{[vendor.city, vendor.address].filter(Boolean).join(" · ")}</span></p>}
        {!vendor.contactPerson && !vendor.phone && !vendor.email && !vendor.city && !vendor.address && <p className="text-xs text-slate-400">Add contact details to complete this vendor profile.</p>}
      </div>

      {vendor.rating !== null && <div className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-600"><Star size={14} fill="currentColor" /> {vendor.rating.toFixed(1)} <span className="font-normal text-slate-400">/ 5</span></div>}

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <Button variant="outline" size="sm" className="h-8 flex-1 gap-1.5" onClick={onView}>View</Button>
        <Button variant="outline" size="sm" className="h-8 flex-1 gap-1.5" onClick={onEdit}><Pencil size={13} /> Edit</Button>
      </div>
    </article>
  );
}

export default function VendorsPage() {
  const { vendors, loading, error, refresh, addVendor, editVendor, removeVendor } = useVendors();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [viewing, setViewing] = useState<Vendor | null>(null);
  const [deleting, setDeleting] = useState<Vendor | null>(null);
  const [actionError, setActionError] = useState("");

  const filteredVendors = useMemo(() => vendors.filter((vendor) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [vendor.name, vendor.category, vendor.contactPerson, vendor.phone, vendor.email, vendor.city].some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (category === "All" || vendor.category === category);
  }), [vendors, search, category]);

  async function saveVendor(values: VendorFormValues) {
    setSaving(true);
    setActionError("");
    try {
      if (editing) await editVendor(editing.id, values);
      else await addVendor(values);
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not save vendor.");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setActionError("");
    try {
      await removeVendor(deleting.id);
      setDeleting(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not delete vendor.");
    }
  }

  function openEdit(vendor: Vendor) {
    setEditing(vendor);
    setFormOpen(true);
  }

  return (
    <PageContainer>
      <main className="mx-auto w-full max-w-[1440px] space-y-5 pb-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Vendors</h1>
            <p className="mt-1 text-sm text-slate-500">Manage the partners who help bring your events to life.</p>
          </div>
          <Button className="h-9 gap-2 rounded-lg px-3.5 shadow-sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus size={16} /> Add Vendor
          </Button>
        </header>

        {actionError && <div role="alert" className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"><span>{actionError}</span><button onClick={() => setActionError("")} aria-label="Dismiss error"><X size={16} /></button></div>}

        {error && <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><Button variant="outline" size="sm" onClick={() => void refresh()}>Retry</Button></div>}

        <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendors, contacts, city..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="relative md:w-56">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                <option value="All">All categories</option>
                {VENDOR_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <span className="text-xs text-slate-500 md:pl-1">{filteredVendors.length} vendor{filteredVendors.length === 1 ? "" : "s"}</span>
          </div>
        </section>

        {loading && vendors.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">Loading vendors...</div>
        ) : filteredVendors.length === 0 ? (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm sm:py-16">
            <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Store size={23} /></span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">{vendors.length === 0 ? "Build your vendor directory" : "No vendors found"}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{vendors.length === 0 ? "Keep your venues, caterers, photographers and other event partners in one place." : "Try a different search or category filter."}</p>
            {vendors.length === 0 ? <Button className="mt-5 gap-2" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus size={16} /> Add your first vendor</Button> : <Button variant="outline" className="mt-5" onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</Button>}
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} onView={() => setViewing(vendor)} onEdit={() => openEdit(vendor)} onDelete={() => setDeleting(vendor)} />
            ))}
          </section>
        )}

        <Dialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditing(null); }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{editing ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
              <DialogDescription>{editing ? "Update this vendor's business and contact information." : "Add an event partner to your private vendor directory."}</DialogDescription>
            </DialogHeader>
            <VendorForm key={editing?.id ?? "new-vendor"} vendor={editing} saving={saving} onCancel={() => { setFormOpen(false); setEditing(null); }} onSave={saveVendor} />
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(viewing)} onOpenChange={(open) => { if (!open) setViewing(null); }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">{viewing?.name}</DialogTitle>
              <DialogDescription>Vendor details and contact information</DialogDescription>
            </DialogHeader>
            {viewing && <div className="space-y-4">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{viewing.category}</span>
              {[
                ["Contact person", viewing.contactPerson],
                ["Phone", viewing.phone],
                ["Email", viewing.email],
                ["City", viewing.city],
                ["Address", viewing.address],
                ["Website", viewing.website],
                ["Notes", viewing.notes],
                ["Rating", viewing.rating === null ? "" : `${viewing.rating}/5`],
              ].filter(([, value]) => Boolean(value)).map(([label, value]) => (
                <div key={label} className="border-b border-slate-100 pb-3 last:border-0">
                  <p className="text-xs font-medium text-slate-500">{label}</p>
                  <p className="mt-1 break-words text-sm text-slate-800">{value}</p>
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
                <Button onClick={() => { const vendor = viewing; setViewing(null); openEdit(vendor); }}><Pencil size={14} className="mr-2" /> Edit Vendor</Button>
              </div>
            </div>}
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(deleting)} onOpenChange={(open) => { if (!open) setDeleting(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete vendor?</DialogTitle>
              <DialogDescription>This will permanently remove {deleting?.name ?? "this vendor"} from your directory. This cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => void confirmDelete()}><Trash2 size={14} className="mr-2" /> Delete Vendor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </PageContainer>
  );
}
