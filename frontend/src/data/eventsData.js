/* ===== IMPORT ALL EVENT POSTERS ===== */

// Technical Events
import ADRENA from "../assets/ADARENA.jpeg";
import AIHUNTING from "../assets/AIHUNTING.jpeg";
import AIPROMPTBATTLE from "../assets/AIPROMPTBATTLE.png";
import BIZBRAINCHALLENGE from "../assets/BIZBRAINCHALLENGE.png";
import BLINDCODE from "../assets/BLINDCODE.jpeg";
import BREAKTHEBOT from "../assets/BREAKTHEBOT.png";
import BRIDGEBATTLE from "../assets/BRIDGEBATTLE.jpeg";
import DRONEDASH from "../assets/DRONEDASH.jpeg";
import ESCAPEROOM from "../assets/ESCAPEROOM.png";
import LOGOHUNT from "../assets/LOGOHUNT.jpeg";
import PUZZLEHUNT from "../assets/PUZZLEHUNT.png";
import REALIFEAMONGUS from "../assets/REALLIFEAMONGUS.jpeg";
import REVERSECODING from "../assets/REVERSECODING.png";
import ROBOFOOTBALLCLASH from "../assets/ROBOFOOTBALLCLASH.jpeg";
import ROBOWARPRO from "../assets/ROBOWARPRO.png";
import SQUIDGAME from "../assets/SQUIDGAMEINTECHWORLD.jpeg";
import WEBTREASUREHUNTING from "../assets/WEB-TREASURE-HUNTING.png";
import AISSHAPECIPHER from "../assets/AISSHAPECIPHER.png";
import AIQUIZ from "../assets/AIQUIZ.jpeg";
import BRAINBOOSTERMATH from "../assets/BRAINBOOSTERMATH.jpeg";
import CASECATALYST from "../assets/CASECATALYST.png";
import CRICKETCARNIVAL from "../assets/CRICKETCARNIVAL.jpeg";
import FOLDANDBUILD from "../assets/FOLDANDBUILD.png";
import QUANTUMQUESTPHYSICS from "../assets/QUANTUMQUESTPHYSICS.jpeg";
import ROBOMINDMATRIX from "../assets/ROBOMINDMATRIX.png";
import ROBORUSH from "../assets/ROBORUSH.jpeg";
import SURVIVORDROP from "../assets/SURVIOURDROP.png";
import THECHEMICALDETECTIVE from "../assets/THECHEMICALDETECTIVE.png";
import TREASUREHUNT from "../assets/TREASUREHUNT.jpeg";
import WORDWIZARDENGLISH from "../assets/WORDWIZARDENGLISH.jpeg";



// Non-Technical Events
import BGMI from "../assets/BGMI.jpeg";
import BULLVSBEAR from "../assets/BULLVSBEAR.jpeg";
import DREAMTODEAL from "../assets/DREAMTODEAL.png";
import FREEFIREPRO from "../assets/FREEFIREPRO.png";
import LUDOKING from "../assets/LUDOKING.jpeg";
import MINIMUSTIFORMIN from "../assets/MINIMUSTIFOR1MIN.png";
import MYSTICMOVER from "../assets/MYSTICMOVER.jpeg";
import SPINMANIA from "../assets/SPIN-MANIA.jpeg";
import AUTONOMOUSROBOTICS from "../assets/autonomous-robotics-workshop-final.jpg";
import ROBOTICSCHALLENGE from "../assets/robotics-challenge-final.jpg";

/* ===== EVENTS DATA ===== */

const eventsData = [
  // ===== TECHNICAL EVENTS =====
  {
    id: 26,
    name: "AI Shape Cipher",
    slug: "ai-shape-cipher",
    category: "Technical",
    poster: AISSHAPECIPHER,
    fee: 50,
    min_members: 2,
    max_members: 3,
  },
  {
    id: 27,
    name: "AI Quiz",
    slug: "ai-quiz",
    category: "Technical",
    poster: AIQUIZ,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 28,
    name: "Brain Booster Math",
    slug: "brain-booster-math",
    category: "Technical",
    poster: BRAINBOOSTERMATH,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 29,
    name: "Case Catalyst",
    slug: "case-catalyst",
    category: "Technical",
    poster: CASECATALYST,
    fee: 50,
    min_members: 3,
    max_members: 4,
  },
  {
    id: 30,
    name: "Cricket Carnival",
    slug: "cricket-carnival",
    category: "Non-Technical",
    poster: CRICKETCARNIVAL,
    fee: 50,
    min_members: 2,
    max_members: 2,
  },
  {
    id: 31,
    name: "Fold & Build",
    slug: "fold-and-build",
    category: "Technical",
    poster: FOLDANDBUILD,
    fee: 50,
    min_members: 2,
    max_members: 2,
  },
  {
    id: 32,
    name: "Quantum Quest Physics",
    slug: "quantum-quest-physics",
    category: "Technical",
    poster: QUANTUMQUESTPHYSICS,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 33,
    name: "Robo Mind Matrix",
    slug: "robo-mind-matrix",
    category: "Technical",
    poster: ROBOMINDMATRIX,
    fee: 50,
    min_members: 4,
    max_members: 4,
  },
  {
    id: 34,
    name: "Robo Rush",
    slug: "robo-rush",
    category: "Technical",
    poster: ROBORUSH,
    fee: 100,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 35,
    name: "Survivor Drop",
    slug: "survivor-drop",
    category: "Non-Technical",
    poster: SURVIVORDROP,
    fee: 50,
    min_members: 2,
    max_members: 2,
  },
  {
    id: 36,
    name: "The Chemical Detective",
    slug: "the-chemical-detective",
    category: "Technical",
    poster: THECHEMICALDETECTIVE,
    fee: 50,
    min_members: 3,
    max_members: 3,
  },
  {
    id: 37,
    name: "Treasure Hunt",
    slug: "treasure-hunt",
    category: "Non-Technical",
    poster: TREASUREHUNT,
    fee: 50,
    min_members: 3,
    max_members: 3,
  },
  {
    id: 38,
    name: "Word Wizard English",
    slug: "word-wizard-english",
    category: "Non-Technical",
    poster: WORDWIZARDENGLISH,
    fee: 50,
    min_members: 2,
    max_members: 2,
  },

  {
    id: 1,
    name: "Ad Arena",
    slug: "adrena",
    category: "Technical",
    poster: ADRENA,
    fee: 50,
    min_members: 2,
    max_members: 4,
  },
  {
    id: 2,
    name: "AI Hunting",
    slug: "ai-hunting",
    category: "Technical",
    poster: AIHUNTING,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 3,
    name: "AI Prompt Battle",
    slug: "ai-prompt-battle",
    category: "Technical",
    poster: AIPROMPTBATTLE,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 4,
    name: "Biz Brain Challenge",
    slug: "biz-brain-challenge",
    category: "Technical",
    poster: BIZBRAINCHALLENGE,
    fee: 50,
    min_members: 2,
    max_members: 3,
  },
  {
    id: 5,
    name: "Blind Code",
    slug: "blind-code",
    category: "Technical",
    poster: BLINDCODE,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 6,
    name: "Break The Bot",
    slug: "break-the-bot",
    category: "Technical",
    poster: BREAKTHEBOT,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 7,
    name: "Bridge Battle",
    slug: "bridge-battle",
    category: "Technical",
    poster: BRIDGEBATTLE,
    fee: 100,
    min_members: 2,
    max_members: 4,
  },
  {
    id: 8,
    name: "Drone Dash",
    slug: "drone-dash",
    category: "Technical",
    poster: DRONEDASH,
    fee: 100,
    min_members: 1,
    max_members: 2,
  },
  {
    id: 9,
    name: "Escape Room",
    slug: "escape-room",
    category: "Technical",
    poster: ESCAPEROOM,
    fee: 50,
    min_members: 2,
    max_members: 4,
  },
  {
    id: 10,
    name: "Logo Hunt",
    slug: "logo-hunt",
    category: "Technical",
    poster: LOGOHUNT,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 11,
    name: "Puzzle Hunt",
    slug: "puzzle-hunt",
    category: "Technical",
    poster: PUZZLEHUNT,
    fee: 50,
    min_members: 4,
    max_members: 4,
  },
  {
    id: 12,
    name: "Real Life Among Us",
    slug: "real-life-among-us",
    category: "Technical",
    poster: REALIFEAMONGUS,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 13,
    name: "Reverse Coding (C Language)",
    slug: "reverse-coding",
    category: "Technical",
    poster: REVERSECODING,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 14,
    name: "Robo Football Clash",
    slug: "robo-football-clash",
    category: "Technical",
    poster: ROBOFOOTBALLCLASH,
    fee: 100,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 15,
    name: "ROBO WAR PRO",
    slug: "robo-war-pro",
    category: "Technical",
    poster: ROBOWARPRO,
    fee: 100,
    min_members: 4,
    max_members: 4,
  },
  {
    id: 16,
    name: "Squid Game: In Tech World",
    slug: "squid-game",
    category: "Technical",
    poster: SQUIDGAME,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 17,
    name: "Web Treasure Hunting",
    slug: "web-treasure-hunting",
    category: "Technical",
    poster: WEBTREASUREHUNTING,
    fee: 0,
    min_members: 2,
    max_members: 2,
  },

  // ===== NON-TECHNICAL EVENTS =====
  {
    id: 18,
    name: "BGMI",
    slug: "bgmi",
    category: "Non-Technical",
    poster: BGMI,
    fee: 50,
    min_members: 4,
    max_members: 4,
  },
  {
    id: 19,
    name: "Bull Vs Bear",
    slug: "bull-vs-bear",
    category: "Non-Technical",
    poster: BULLVSBEAR,
    fee: 50,
    min_members: 2,
    max_members: 2,
  },
  {
    id: 20,
    name: "Dream to Deal",
    slug: "dream-to-deal",
    category: "Non-Technical",
    poster: DREAMTODEAL,
    fee: 50,
    min_members: 2,
    max_members: 4,
  },
  {
    id: 21,
    name: "Free Fire Pro",
    slug: "free-fire-pro",
    category: "Non-Technical",
    poster: FREEFIREPRO,
    fee: 50,
    min_members: 4,
    max_members: 4,
  },
  {
    id: 22,
    name: "Ludo King",
    slug: "ludo-king",
    category: "Non-Technical",
    poster: LUDOKING,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 23,
    name: "Mini Musti For 1 Min",
    slug: "mini-musti-for-1-min",
    category: "Non-Technical",
    poster: MINIMUSTIFORMIN,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 24,
    name: "Mystic Mover",
    slug: "mystic-mover",
    category: "Non-Technical",
    poster: MYSTICMOVER,
    fee: 50,
    min_members: 2,
    max_members: 2,
  },
  {
    id: 25,
    name: "Spin Mania",
    slug: "spin-mania",
    category: "Non-Technical",
    poster: SPINMANIA,
    fee: 50,
    min_members: 1,
    max_members: 1,
  },
  {
    id: 39,
    name: "Autonomous Robotics Workshop",
    slug: "autonomous-robotics-workshop",
    category: "Technical",
    poster: AUTONOMOUSROBOTICS,
    fee: 2000,
    min_members: 1,
    max_members: 5,
  },
  {
    id: 40,
    name: "Robotics Challenge",
    slug: "robotics-challenge",
    category: "Technical",
    poster: ROBOTICSCHALLENGE,
    fee: 150,
    min_members: 1,
    max_members: 4,
  },
];

export default eventsData;
