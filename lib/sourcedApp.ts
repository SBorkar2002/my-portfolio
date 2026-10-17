// The Sourced prototype, read from the Figma component set "Sourced · App (tappable)" (52:833).
// 20 screens, 83 hotspots. Coordinates are in the 412 x 917 screen frame.
// [label, x, y, w, h, target screen]
export type Hotspot = [label: string, x: number, y: number, w: number, h: number, to: number];

export type Screen = { name: string; hotspots: Hotspot[] };

export const SCREEN_W = 412;
export const SCREEN_H = 917;

const navHome: Hotspot = ["Home tab", 0, 834, 82, 60, 4];
const navFlow: Hotspot = ["Flow tab", 82, 834, 82, 60, 12];
const navCreate: Hotspot = ["Create", 165, 834, 82, 60, 7];
const navInbox: Hotspot = ["Inbox tab", 247, 834, 82, 60, 14];
const navProfile: Hotspot = ["Profile tab", 330, 834, 82, 60, 16];

export const screens: Record<number, Screen> = {
  1: {
    name: "Welcome",
    hotspots: [
      ["Get started", 20, 800, 372, 52, 2],
      ["I already have an account", 100, 860, 212, 32, 4],
    ],
  },
  2: {
    name: "How will you use Sourced",
    hotspots: [
      ["Browse", 20, 260, 372, 96, 4],
      ["AI artist", 20, 476, 372, 96, 4],
      ["Pick Art Buddies", 20, 800, 372, 52, 3],
    ],
  },
  3: {
    name: "Pick Art Buddies",
    hotspots: [
      ["Continue", 20, 800, 372, 52, 4],
      ["Skip", 350, 72, 52, 36, 4],
    ],
  },
  4: {
    name: "Home, human-made feed",
    hotspots: [
      navFlow,
      navCreate,
      navInbox,
      navProfile,
      ["AI art feed", 206, 106, 186, 44, 5],
      ["Evidence", 287, 688, 105, 30, 6],
      ["Your WIP", 14, 190, 74, 92, 13],
      ["Jen's WIP", 90, 190, 74, 92, 15],
      ["Jen's profile", 14, 304, 120, 46, 19],
      ["Notifications", 350, 48, 50, 48, 14],
    ],
  },
  5: {
    name: "Home, AI art feed",
    hotspots: [navHome, navFlow, navCreate, navInbox, navProfile, ["Human-made feed", 20, 106, 186, 44, 4]],
  },
  6: { name: "Evidence", hotspots: [["Back", 20, 52, 40, 40, 4]] },
  7: {
    name: "Create: how it was made",
    hotspots: [
      ["Close", 20, 52, 40, 40, 4],
      ["AI-assisted", 20, 598, 372, 96, 8],
      ["Add evidence", 20, 800, 372, 52, 9],
    ],
  },
  8: {
    name: "Create: AI art",
    hotspots: [
      ["Close", 20, 52, 40, 40, 4],
      ["Human-made", 20, 490, 372, 96, 7],
      ["Details", 20, 800, 372, 52, 11],
    ],
  },
  9: {
    name: "Add evidence",
    hotspots: [
      ["Back", 20, 52, 40, 40, 7],
      ["Details", 20, 800, 372, 52, 10],
    ],
  },
  10: {
    name: "Details",
    hotspots: [
      ["Back", 20, 52, 40, 40, 9],
      ["Save draft", 20, 800, 150, 52, 4],
      ["Post", 182, 800, 210, 52, 4],
    ],
  },
  11: {
    name: "Details, AI art",
    hotspots: [
      ["Back", 20, 52, 40, 40, 8],
      ["Save draft", 20, 800, 150, 52, 5],
      ["Post", 182, 800, 210, 52, 5],
    ],
  },
  12: {
    name: "Flow, today",
    hotspots: [
      navHome,
      navCreate,
      navInbox,
      navProfile,
      ["Send WIP", 236, 318, 148, 48, 13],
      ["Jen, buddy", 20, 676, 87, 136, 15],
    ],
  },
  13: {
    name: "Send WIP",
    hotspots: [
      ["Back", 20, 52, 40, 40, 12],
      ["Send", 20, 800, 372, 52, 12],
      ["Add more buddies", 20, 704, 372, 52, 3],
    ],
  },
  14: {
    name: "Inbox",
    hotspots: [
      navHome,
      navFlow,
      navCreate,
      navProfile,
      ["Today's summary", 20, 172, 372, 68, 15],
      ["Conversation with Jen", 20, 262, 372, 72, 15],
    ],
  },
  15: {
    name: "WIP thread",
    hotspots: [
      ["Back", 20, 52, 40, 40, 14],
      ["Jen's profile", 66, 48, 130, 48, 19],
    ],
  },
  16: {
    name: "Profile, gallery",
    hotspots: [navHome, navFlow, navCreate, navInbox, ["Menu", 352, 52, 40, 40, 20], ["About tab", 113, 470, 93, 48, 17]],
  },
  17: {
    name: "Profile, about",
    hotspots: [navHome, navFlow, navCreate, navInbox, navProfile, ["Menu", 352, 52, 40, 40, 20], ["Gallery tab", 20, 470, 93, 48, 16]],
  },
  18: {
    name: "Artist, Flow",
    hotspots: [navHome, navFlow, navCreate, navInbox, navProfile, ["Back", 20, 52, 40, 40, 4], ["Gallery tab", 20, 470, 93, 48, 19]],
  },
  19: {
    name: "Artist, gallery",
    hotspots: [navHome, navFlow, navCreate, navInbox, navProfile, ["Back", 20, 52, 40, 40, 4], ["Flow tab", 299, 470, 93, 48, 18]],
  },
  20: { name: "Menu", hotspots: [["Close menu", 0, 0, 412, 390, 16]] },
};

export function screenSrc(n: number) {
  return `/images/sourced_s${String(n).padStart(2, "0")}-412.webp`;
}
