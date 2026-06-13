/** Routes used in the application */
export const ROUTES = {
  HOME: "/",
  BROWSE: "/browse",
  LIST_NEW_TOOL: "/tools/new",
  SAVED: "/saved",
  BORROWS: "/borrows",
  DASHBOARD: "/dashboard",
  LLMS_TXT: "/llms.txt",
};

/** Tool icons used in the hero section */
export const TOOL_ICONS = ["🔧", "🪚", "🔨", "🪜", "🌿", "🚿", "🔩", "🪛"];

/** Steps used in the "How it works" section */
export const STEPS = [
  {
    n: "1",
    title: "Browse what's nearby",
    desc: "See tools your neighbors are willing to lend. Filter by category, neighborhood, or availability.",
  },
  {
    n: "2",
    title: "Request to borrow",
    desc: "Send a quick message. The owner gets a notification and can approve or decline.",
  },
  {
    n: "3",
    title: "Pick it up and return it",
    desc: "Coordinate with the owner directly. When you're done, mark it returned and it's available again.",
  },
];
