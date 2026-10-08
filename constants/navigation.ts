import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  CreditCard,
  Receipt,
  Building2,
  ClipboardList,
  BarChart3,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Business",
    items: [
      {
        title: "Leads",
        href: "/leads",
        icon: Users,
      },
      {
        title: "Quotations",
        href: "/quotations",
        icon: FileText,
      },
      {
        title: "Clients",
        href: "/clients",
        icon: Users,
      },
      {
        title: "Events",
        href: "/events",
        icon: Calendar,
      },
    ],
  },

  {
    title: "Finance",
    items: [
      {
        title: "Payments",
        href: "/payments",
        icon: CreditCard,
      },
      {
        title: "Expenses",
        href: "/expenses",
        icon: Receipt,
      },
    ],
  },

  {
    title: "Operations",
    items: [
      {
        title: "Vendors",
        href: "/vendors",
        icon: Building2,
      },
      {
        title: "Vendor Entries",
        href: "/vendor-entries",
        icon: ClipboardList,
      },
    ],
  },

  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
    ],
  },
];

export const bottomNavigation = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];