export const appRoutes = {
  auth: {
    signIn: "/signin",
    signUp: "/signup",
    bankTag: "/banktag",
  },
  dashboard: {
    home: "/dashboard",
    send: "/dashboard/send",
    sendTo: "/dashboard/send/to",
    vcard: "/dashboard/vcard",
    invest: "/dashboard/invest",
    rewards: "/dashboard/rewards",
    settings: "/dashboard/settings",
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
