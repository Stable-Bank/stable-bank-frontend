export const appRoutes = {
  auth: {
    signIn: "/signin",
    signUp: "/signup",
    bankTag: "/banktag",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  dashboard: {
    home: "/dashboard",
    send: "/dashboard?send=true",
    sendTo: "/dashboard?send=true",
    vcard: "/dashboard/vcard",
    invest: "/dashboard/invest",
    vaults: "/dashboard/vaults",
    savings: "/dashboard/savings",
    rewards: "/dashboard/rewards",
    settings: "/dashboard/settings",
    notifications: "/dashboard/notifications",
  },
};

export const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Business",
    href: "/businesses",
  },
  {
    name: "Institutions",
    href: "/institutions",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export const UFooterLinks = [
  { label: "Help", route: "/help" },
  { label: "Email", route: "mailto:support@stablebank" },
  { label: "Twitter", route: "https://twitter.com/stablebank" },
  { label: "Discord", route: "https://discord.gg/stablebank" },
];
