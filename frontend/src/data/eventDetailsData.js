import WEBTREASUREHUNTING from "../assets/WEB TREASURE HUNTING.png";
import BLINDCODE from "../assets/BLINDCODE.jpeg";
import REVERSECODING from "../assets/REVERSECODING.png";
import BULLVSBEAR from "../assets/BULLVSBEAR.jpeg";
import AIPROMPTBATTLE from "../assets/AIPROMPTBATTLE.png";
import MINIMASTI from "../assets/MINIMUSTIFOR1MIN.png";
import SQUIDGAME from "../assets/SQUIDGAMEINTECHWORLD.jpeg";
import AMONGUS from "../assets/REALLIFEAMONGUS.jpeg";
import ROBOMINDMATRIX from "../assets/ROBOMINDMATRIX.png";
import AIBUGHUNTING from "../assets/AIHUNTING.jpeg";
import ROBOFOOTBALL from "../assets/ROBOFOOTBALLCLASH.jpeg";
import ROBOWARPRO from "../assets/ROBOWARPRO.png";
import DRONEDASH from "../assets/DRONEDASH.jpeg";
import PUZZLEHUNT from "../assets/PUZZLEHUNT.png";
import BREAKTHEBOT from "../assets/BREAKTHEBOT.png";
import BGMIDOMINATION from "../assets/BGMI.jpeg";
import BRAINBATTLE from "../assets/AIQUIZ.jpeg";
import LOGOHUNT from "../assets/LOGOHUNT.jpeg";
import MYSTICMOVER from "../assets/MYSTICMOVER.jpeg";
import CASECATALYST from "../assets/CASECATALYST.png"; // check filename
import ADARENA from "../assets/ADARENA.jpeg";
import SPINMANIA from "../assets/SPIN MANIA.jpeg";
import DREAMTODEAL from "../assets/DREAMTODEAL.png"; // check filename
import BIZBRAIN from "../assets/BIZBRAINCHALLENGE.png";

const eventDetailsData = {
  "web-treasure-hunting": {
    name: "Web Treasure Hunting",
    tagline: "Where searching becomes solving.",
    poster: WEBTREASUREHUNTING,
    fee: "50",
    about: "Web Treasure Hunting is a problem-solving event where participants explore websites to find hidden clues and flags using logical thinking and analytical skills.",
    registration: "The participation fee for individuals is free.",
    rules: [
      "Participation is solo only.",
      "Participants may use browser-based services and AI tools.",
      "Participants may use their mobile phones only for temporary logins.",
      "Pre-made prompts or templates are strictly not allowed.",
      "You can only use the web we give you.",
      "You cannot damage any college property.",
      "Coordinator’s decision is final.",
      "Mobile phones and electronic devices from outside are not allowed during gameplay."
    ],
    rounds: [
      "Round 1: Navigate websites using GUI and find all flags (no coding required).",
      "Round 2: Decrypt flags using online tools or AI."
    ],
    venue: "210A, B",
    time: "11:30 AM onwards",
    prizes: "Winners will be awarded with attractive prizes.",
    facultyCoordinator: "Hardik Soneria",
    studentCoordinators: ["Jay Sorathiya – BCA 23", "Janvi Chavda – Comp 31"],
    contact: "Jay Sorathiya – 6354409902"
  },

  "blind-code": {
    name: "Blind Code",
    tagline: "Real coder doesn't need to see their code",
    poster: BLINDCODE,
    fee: "50",
    about: "A test of memory and logic where you must write C code with the monitor turned off.",
    registration: "The participation fee for individuals is 40",
    rules: [
      "Participation is strictly individual.",
      "Each participant will be given one C programming problem at the start of the event.",
      "The monitor will be put into sleep mode immediately after the problem statement is read.",
      "Time limit: 15 minutes per participant.",
      "Participants are not allowed to wake, refresh, adjust, or turn on the monitor at any time during coding.",
      "Only one attempt is allowed. Restarting the editor or system is prohibited.",
      "Use of mobile phones, notes, books, internet, or external help is strictly forbidden.",
      "Any attempt to peek at the screen, mirror display, or use shortcuts to wake the monitor will lead to instant disqualification.",
      "The code must be written entirely in C language.",
      "All final decisions will be made by the event coordinator, and such decisions shall be final and binding."
    ],
    rounds: [
      "Round 1: Top five selected based on successful compilation, correct output, and minimal syntax errors.",
      "Round 2: Top three selected based on successful compilation, correct output, and minimal syntax errors (1st, 2nd, 3rd positions)."
    ],
    venue: "Room No. 217(A)",
    time: "Round 1: 10:00 AM - 3:00 PM | Round 2: Next Day 10:30 AM - 1:00 PM",
    prizes: "Winners will be awarded with attractive prizes.",
    facultyCoordinator: "Prof. Priyanka D. Rathod (8154841041)",
    studentCoordinators: ["Raj Kheni - 9099351056"],
    contact: "Raj Kheni - 9099351056"
  },

  "reverse-coding": {
    name: "Reverse Coding (C Language)",
    tagline: "Where logic meets intuition – welcome to reverse coding",
    poster: REVERSECODING,
    fee: "50",
    about: "Analyze the output and write the code that generates it. A test of reverse engineering skills.",
    registration: "The participation fee for individuals is 40",
    rules: [
      "Participation is individual only.",
      "Each participant will be provided with a fixed output and optional sample input/constraints.",
      "Participants must write a C program that produces the exact given output.",
      "Time limit: 20 minutes per participant.",
      "Internet usage, mobile phones, books, notes, or external help are strictly prohibited.",
      "Code plagiarism or copying from others will lead to immediate disqualification.",
      "The output generated by the code must exactly match the given output.",
      "Judges’ decisions regarding logic, correctness, and evaluation will be final."
    ],
    rounds: [
      "Round 1: Top five advance based on compilation and correct output.",
      "Round 2: Top three advance based on compilation and correct output."
    ],
    venue: "Room No. 217(B)",
    time: "Round 1: 10:00 AM - 3:00 PM | Round 2: Next Day 10:30 AM - 1:00 PM",
    prizes: "Winners will be awarded with attractive prizes.",
    facultyCoordinator: "Prof. Priyanka D. Rathod (8154841041)",
    studentCoordinators: ["Arpan Kalsariya - 7285045716"],
    contact: "Arpan Kalsariya - 7285045716"
  },

  "bull-vs-bear": {
    name: "Bull Vs Bear",
    tagline: "Market. Mind. Mastery. Where Bulls Rise and Bears Strike",
    poster: BULLVSBEAR,
    fee: "50",
    about: "A high-energy trading game where teams react to constant market news and try to build the highest portfolio value.",
    registration: "The participation fee is 100",
    rules: [
      "A high-energy trading game where teams react to constant market news.",
      "Each team must consist of 2 members.",
      "Every team starts with one Trading account.",
      "Further rules will be explained on the day of the event.",
      "All final decisions will be made by the event coordinator."
    ],
    rounds: ["Trading Session"],
    venue: "209",
    time: "10:00 AM to 3:00 PM",
    prizes: "Winners will be awarded with attractive prizes.",
    facultyCoordinator: "Prof. Priyanka D. Rathod (8154841041)",
    studentCoordinators: ["Neel Balar - 8460810248"],
    contact: "Neel Balar - 8460810248"
  },

  "ai-prompt-battle": {
    name: "AI Prompt Battle",
    tagline: "Master the prompt. Command the AI.",
    poster: AIPROMPTBATTLE,
    fee: "50",
    about: "Competitive event showcasing prompt engineering skills by generating AI art and building mini chatbots.",
    registration: "The participation fee for individual is Rs. 50 per participant.",
    rules: [
      "Participation is individual only.",
      "Participants may use any browser-based service and any AI tools.",
      "Participants may use mobile phones only for temporary logins.",
      "Use of WhatsApp, Telegram, email, etc. leads to disqualification.",
      "Pre-made prompts or templates are strictly not allowed.",
      "All work must be created during the event time only."
    ],
    rounds: [
      "Round 1: AI Art Arena – Generate artwork based on a theme.",
      "Round 2: Mini Chatbot Builder – Create a working mini chatbot using only prompts."
    ],
    venue: "Lab No. 109-A (2nd Day)",
    time: "10:30 AM to 12:30 PM",
    prizes: "Winners will be awarded with cash and attractive prizes.",
    facultyCoordinator: "Prof. Divya Padhiyar, Prof. Bhumika Rana",
    studentCoordinators: ["Chintan Andani – 96386 12976", "Shreya Patel – 63581 08937"],
    contact: "Chintan Andani – 96386 12976"
  },

  "mini-masti": {
    name: "Mini Masti For 1 Minute",
    tagline: "Quick 1-Minute Games, Loads of Fun!",
    poster: MINIMASTI,
    fee: "50",
    about: "Fun-filled event featuring quick one-minute games testing speed, accuracy, and presence of mind.",
    registration: "The participation fee for individual is Rs. 50 per participant.",
    rules: [
      "Each game will have a total time limit of 1 minute.",
      "Participation is individual only.",
      "Game task and instructions explained before start.",
      "Fair play is mandatory.",
      "Tie-breaker rounds will be conducted if necessary."
    ],
    rounds: [
      "Round 1: All participants take part in the same 1-minute challenge.",
      "Round 2: Remaining players advance based on speed/accuracy."
    ],
    venue: "Room No. 408 (1st Day)",
    time: "01:00 PM to 03:00 PM",
    prizes: "Winners will be awarded with cash and attractive prizes.",
    facultyCoordinator: "Prof. Divya Padhiyar, Prof. Bhumika Rana",
    studentCoordinators: ["Chintan Andani – 96386 12976", "Shreya Patel – 63581 08937"],
    contact: "Chintan Andani – 96386 12976"
  },

  "squid-game": {
    name: "Squid Game: In Tech World",
    tagline: "Trust No One. Win at all Cost.",
    poster: SQUIDGAME,
    fee: "FREE EVENT",
    about: "A competitive themed event where participants face multiple challenge-based rounds with suspenseful gameplay.",
    registration: "FREE FOR FIRST 150 PARTICIPANT WHO PARTICIPATE IN MINIMUM 2 EVENTS.",
    rules: [
      "Battle consists of three themed rounds.",
      "Solo participants compete individually.",
      "Game details revealed only at the moment the round begins.",
      "Two designated frontmen will oversee the event.",
      "Participants must arrive 15 mins early."
    ],
    rounds: [
      "Round 1: Fastest Finger First style test based on Squid Game & Tech knowledge.",
      "Round 2: (Confidential) - Revealed at event time.",
      "Round 3: (Confidential) - Revealed at event time (Next Day)."
    ],
    venue: "Lab: 210 A, B",
    time: "Round 1: 09:15 AM | Round 2: 10:15 AM | Round 3: Next Day 09:15 AM",
    prizes: "Winners will be awarded with cash and attractive prizes.",
    facultyCoordinator: "Prof. Vipul Kania, Prof. Smruti Dave",
    studentCoordinators: ["Ankit Savaliya – 7567280374", "Aastha Gorsiya – 9081020346"],
    contact: "Ankit Savaliya – 7567280374"
  },

  "among-us": {
    name: "Among Us in Real Life",
    tagline: "Guess me, if you can?",
    poster: AMONGUS,
    fee: "50",
    about: "A non-tech mystery game based on trust, observation, and betrayal.",
    registration: "Fee: Rs. 50 per participant. Max Entry: 200.",
    rules: [
      "Battle consists of three themed rounds.",
      "Details revealed only when round begins.",
      "No mobile phones unless allowed.",
      "Cheating or signaling is prohibited.",
      "Decisions by Game Coordinator are final."
    ],
    rounds: [
      "Round 1: Test of trust and observation.",
      "Round 2: Actions speak louder than words.",
      "Round 3: Nothing is what it seems. One wrong decision changes everything."
    ],
    venue: "Room No. 310",
    time: "Round 1: 9:30 AM | Round 2: 1:00 PM | Round 3: Next Day 10:00 AM",
    prizes: "Winners will be awarded with cash and attractive prizes.",
    facultyCoordinator: "Prof. Nidhi Patel, Prof. Mehul Patel",
    studentCoordinators: ["Maitri Vasoya", "Harsh Navadiya", "Priyansh Masiyava"],
    contact: "Maitri Vasoya – 9879580263"
  },

  "robo-mind-matrix": {
    name: "Robo Mind Matrix",
    tagline: "Brains Decide Your Move",
    poster: ROBOMINDMATRIX,
    fee: "50",
    about: "A fast-paced team quiz challenge combining Ludo-strategy and image puzzles.",
    registration: "Fee: Rs 50 per participant. Team size: 4 (compulsory).",
    rules: [
      "Round 1: Ludo Court. One member plays, 3 answer. Questions replace dice. Right answer = move forward, Wrong = backward.",
      "Round 2: Image Observation. 20-second display time. Correct answers unlock puzzle pieces."
    ],
    rounds: [
      "Round 1: Ludo-based quiz game",
      "Round 2: Puzzle Piece Quiz Battle"
    ],
    venue: "Round 1: 401 | Round 2: 306",
    time: "Round 1: 09:30 AM | Round 2: Next Day 9:30 AM",
    prizes: "Winners will be awarded with cash and certificate.",
    facultyCoordinator: "Prof. Drasti Chauhan, Prof. Trupti Dilhiwala",
    studentCoordinators: ["Nakrani Pranjal – 9067686532", "Vaghasiya Aisha - 9081053559"],
    contact: "Nakrani Pranjal – 9067686532"
  },

  "ai-bug-hunting": {
    name: "AI Bug Hunting: Debug to Dominate",
    tagline: "Fix Fast. Think Faster.",
    poster: AIBUGHUNTING,
    fee: "50",
    about: "A hybrid debugging challenge where participants analyze a broken repository, identify errors, and repair them using AI-assisted reasoning.",
    registration: "₹50 per participant | Offline event",
    rules: [
      "Participants must have working knowledge of HTML, CSS, JS, Bootstrap.",
      "Internet access provided; no textbooks.",
      "Team discussion allowed only within the group.",
      "All necessary hints embedded in question paper."
    ],
    rounds: [
      "Stage 1: One common repository to debug and optimize.",
      "Stage 2: Choice of two repositories."
    ],
    venue: "Room 409",
    time: "12:00 PM onwards",
    prizes: "Cash awards and certificates",
    facultyCoordinator: "Prof. Swetal Patel (7990642546)",
    studentCoordinators: ["Deep Savaliya — 97232 08066"],
    contact: "Deep Savaliya — 97232 08066"
  },

  "robo-football-clash": {
    name: "Robo Football Clash",
    tagline: "Drive the bot. Dominate the pitch.",
    poster: ROBOFOOTBALL,
    fee: "100",
    about: "A high-energy robotic football competition where players control a robot to score goals.",
    registration: "₹100 per participant | Outdoor event",
    rules: [
      "Participants must follow instructions.",
      "All hints provided on paper.",
      "No discussion with other teams.",
      "Any misconduct leads to disqualification."
    ],
    rounds: [
      "Round 1: 3 minutes | 3 points to qualify",
      "Final Round: 5 minutes | 5 points to win"
    ],
    venue: "Boys Parking Area",
    time: "11:00 AM onwards",
    prizes: "Cash prizes and trophies",
    facultyCoordinator: "Prof. Vipul Chaudhary (8799502338)",
    studentCoordinators: ["Parth Narola — 97731 49639"],
    contact: "Parth Narola — 97731 49639"
  },

  "robowar-pro": {
    name: "RoboWar PRO",
    tagline: "No Mercy. Only Metal.",
    poster: ROBOWARPRO,
    fee: "100",
    about: "Knock-out based robot fighting competition in a 300cm x 250cm arena.",
    registration: "Max 4 students per team.",
    rules: [
      "Weight limit: 5-7 kg.",
      "Dimensions: 35cm x 35cm x 35cm.",
      "Battery: 24V DC Max. Sealed batteries only.",
      "Weapons: Mechanical (lifters, rammers) allowed. Fire, liquids, spinners prohibited."
    ],
    rounds: [
      "Round 1: RoboWar battle.",
      "Round 2: Knock-out continues."
    ],
    venue: "Student Parking Area",
    time: "Max 5 minutes per round",
    prizes: "Winners will be awarded with cash and attractive prizes.",
    facultyCoordinator: "Prof. Ankita Mistry",
    studentCoordinators: ["Pal Ambaliya", "Trushti Vaishnav", "Kashish Lukhi", "Meet Gajera"],
    contact: "9723880192"
  },

  "drone-dash": {
    name: "Drone Dash",
    tagline: "Fly smart. Fly safe. Fly to win.",
    poster: DRONEDASH,
    fee: "100",
    about: "Navigate obstacle courses and perform tasks using drones.",
    registration: "Max Entry: 30. Team size 1-4.",
    rules: [
      "Drone weight under 500g.",
      "Scoring based on accuracy, time, and stability.",
      "Penalties for touching obstacles.",
      "PPE must be worn."
    ],
    rounds: [
      "Round 1: Fly through obstacles.",
      "Round 2: Fly to perform activities."
    ],
    venue: "Student Parking Slot",
    time: "Day 1: 10:30 AM - 2:00 PM | Day 2: 10:00 AM - 12:00 PM",
    prizes: "Winners will be awarded with cash and attractive prizes.",
    facultyCoordinator: "Prof. Hetali A. Patel",
    studentCoordinators: ["Rudrali Patel", "Aarshi Vaghasiya"],
    contact: "8866112630"
  },

  "puzzle-hunt": {
    name: "Puzzle Hunt",
    tagline: "Find the pieces, fix the Fragments",
    poster: PUZZLEHUNT,
    fee: "50",
    about: "Team-based problem solving where participants find puzzle parts and assemble them.",
    registration: "Team size 4 participants.",
    rules: [
      "Team members cannot change after registration.",
      "Strictly follow clues.",
      "Forceful fitting of pieces not allowed.",
      "Stealing from other teams prohibited."
    ],
    rounds: [
      "Round 1: Puzzle Round (Small) - 30 mins.",
      "Round 2: Wrong Answer Only Round.",
      "Round 3: Jigsaw Puzzle Round (Big/Complex) - Day 2."
    ],
    venue: "Room No. 403, 405, 406",
    time: "Day 1: 10:30 AM - 3:30 PM | Day 2: 9:30 AM - 12:00 PM",
    prizes: "Winners will be awarded with cash and attractive prizes.",
    facultyCoordinator: "Dr. Krupali Umaria",
    studentCoordinators: ["Lahar Priyanshi", "Lakhani Hensi"],
    contact: "8780600676, 9327103493"
  },

  "break-the-bot": {
    name: "Break The Bot",
    tagline: "Break the Logic, Not the Rules",
    poster: BREAKTHEBOT,
    fee: "50",
    about: "Use smart prompts and logic to outthink a custom AI and reveal hidden behavior.",
    registration: "Fee: 50 per individual.",
    rules: [
      "Individual only.",
      "15 minutes to interact with AI.",
      "No restarting the AI.",
      "No abusive language."
    ],
    rounds: [
      "Round 1: Outsmart AI to reveal password.",
      "Round 2: Break the repeating response loop."
    ],
    venue: "109-A",
    time: "10:00 AM onwards",
    prizes: "Winners will be awarded with attractive prizes.",
    facultyCoordinator: "Prof. Foram Patel",
    studentCoordinators: ["Dhrutik Khunt", "Rajpurohit Tanish", "Nadar Shiva"],
    contact: "Krish Gangani - 9773120553"
  },

  "bgmi-domination": {
    name: "BGMI Domination",
    tagline: "Survive. Eliminate. Dominate.",
    poster: BGMIDOMINATION,
    fee: "50",
    about: "High-intensity squad battle in custom classic matches.",
    registration: "Fee: 200 per team (4 players).",
    rules: [
      "Mobile devices only. No emulators/hacks.",
      "Map: Classic.",
      "Placement + Kill points system.",
      "Screenshot mandatory."
    ],
    rounds: [
      "Round 1: Classic Match in custom room.",
      "Tie-Breaker: WWCD > Placement > Kills."
    ],
    venue: "111",
    time: "10:00 AM onwards",
    prizes: "Winners will be awarded with attractive prizes.",
    facultyCoordinator: "Prof. Sujal Patel, Prof. Bhavini Patel",
    studentCoordinators: ["Yash Chaklasiya", "Darsh Kalathiya", "Aksh Jogani"],
    contact: "Krish Gangani - 9773120553"
  },

  "brain-battle": {
    name: "Brain Battle",
    tagline: "Answer Fast. Rank Faster.",
    poster: BRAINBATTLE,
    fee: "50",
    about: "Fast-paced IT & AI quiz with buzzer system.",
    registration: "Fee: 50 per individual.",
    rules: [
      "Round 1: 20 MCQs. +2 Correct, -1 Wrong.",
      "Round 2: Rapid fire, no options. +3 Correct, -2 Wrong.",
      "Buzzer system applies."
    ],
    rounds: [
      "Round 1: MCQ with buzzer.",
      "Round 2: Rapid-fire concept questions."
    ],
    venue: "113",
    time: "10:00 AM onwards",
    prizes: "Winners will be awarded with attractive prizes.",
    facultyCoordinator: "Prof. Nilam Patoliya",
    studentCoordinators: ["Teesha Shingala", "Siya Dudhat"],
    contact: "Krish Gangani - 9773120553"
  },

  "logo-hunt": {
    name: "Logo Hunt",
    tagline: "Create the Mark. Animate the Identity.",
    poster: LOGOHUNT,
    fee: "50",
    about: "Create and animate an original logo for TechFest.",
    registration: "Fee: 50 per individual.",
    rules: [
      "Use browser-based AI tools.",
      "No pre-made templates.",
      "Same logo for both rounds."
    ],
    rounds: [
      "Round 1: Design original logo (Robotics theme).",
      "Round 2: Animate the logo."
    ],
    venue: "109-B",
    time: "10:00 AM onwards",
    prizes: "Winners will be awarded with attractive prizes.",
    facultyCoordinator: "Prof. Mittal Patel",
    studentCoordinators: ["Tiya Godhani", "Janvi Hansapara"],
    contact: "Krish Gangani - 9773120553"
  },

  "mystic-mover": {
    name: "Mystic Mover",
    tagline: "Trust, Precision, and Communication!",
    poster: MYSTICMOVER,
    fee: "50",
    about: "One player guides a blindfolded partner to collect boxes.",
    registration: "Fee: 50 per team (2 persons).",
    rules: [
      "Guide gives verbal instructions only.",
      "Collector is blindfolded.",
      "Touching red lines = -1 point.",
      "Collected box = +2 points."
    ],
    rounds: [
      "Round 1: Collect boxes in maze (3 mins).",
      "Round 2: Solve puzzles from collected boxes.",
      "Round 3: First to collect 3 boxes wins."
    ],
    venue: "112",
    time: "10:00 AM onwards",
    prizes: "Winners will be awarded with attractive prizes.",
    facultyCoordinator: "Prof. Preeti Namdeo",
    studentCoordinators: ["Patel Surbhi", "Patel Jemy"],
    contact: "Krish Gangani - 9773120553"
  },

  "case-catalyst": {
    name: "Case Catalyst",
    tagline: "Think with Your Brain and Solve the Case",
    poster: CASECATALYST,
    fee: "50",
    about: "Crime-based case study solving.",
    registration: "Fee: 50 per participant. Team size: 5.",
    rules: [
      "Round 1: Observe crime scene image for 30s. Analyze and answer.",
      "Round 2: Deep analysis of image to find solution."
    ],
    rounds: [
      "Round 1: Crime Scene Case Analysis",
      "Round 2: Final Case Solving Challenge"
    ],
    venue: "Room No. 412",
    time: "To be announced 2-3 days prior.",
    prizes: "Certificates and cash prizes/vouchers.",
    facultyCoordinator: "Prof. Jyoti Puriya",
    studentCoordinators: ["Varun Ranpariya", "Drashti Kakadiya"],
    contact: "Varun Ranpariya – 9106088498"
  },

  "ad-arena": {
    name: "Ad Arena",
    tagline: "Perform Advertisement in Your Way",
    poster: ADARENA,
    fee: "50",
    about: "Prepare and perform advertisements.",
    registration: "Fee: 50 per participant. Team size 3-4.",
    rules: [
      "No PPTs.",
      "Round 1: Perform ad (2-4 mins).",
      "Round 2: Ad with a twist (Pick character + product)."
    ],
    rounds: [
      "Round 1: Own choice advertisement.",
      "Round 2: Chit-based character/product combo."
    ],
    venue: "Room 408",
    time: "To be announced 2-3 days prior.",
    prizes: "Certificates and cash/vouchers.",
    facultyCoordinator: "Prof. Bina Raval",
    studentCoordinators: ["Jeel Gaudani", "Shruti Kalathiya"],
    contact: "Jeel Gaudani: 7383243455"
  },

  "spin-mania": {
    name: "Spin Mania",
    tagline: "Let the Wheel Decide Your Destiny",
    poster: SPINMANIA,
    fee: "50",
    about: "Luck and skill-based game using a spinning wheel.",
    registration: "Fee: 50 per participant.",
    rules: [
      "Wheel decides activity/task.",
      "Points added to team score.",
      "Final round is individual."
    ],
    rounds: [
      "Round 1: Group Spin Challenge",
      "Round 2: Team Knockout",
      "Final Round: Individual Spin Battle"
    ],
    venue: "Room 413",
    time: "09:30 AM onwards",
    prizes: "Cash prizes and certificates.",
    facultyCoordinator: "Karan Kachhadiya",
    studentCoordinators: ["Krisha Zalavadiya"],
    contact: "Krisha Zalavadiya – 8200435607"
  },

  "dream-to-deal": {
    name: "Dream to Deal",
    tagline: "Turn Your Ideas into Business Reality",
    poster: DREAMTODEAL,
    fee: "50",
    about: "Live business pitch competition.",
    registration: "Fee: 50 per student. Team 2-4.",
    rules: [
      "Ideas must be original.",
      "10 min presentation + QA.",
      "PPT required."
    ],
    rounds: ["Single Round: Live Business Pitching"],
    venue: "TBA",
    time: "TBA",
    prizes: "Certificates and attractive prizes.",
    facultyCoordinator: "Prof. Birju Patil",
    studentCoordinators: ["Jiyani Devanshi", "Nehil Lathiya"],
    contact: "Jiyani Devanshi – 9601033835"
  },

  "biz-brain-challenge": {
    name: "Biz Brain Challenge",
    tagline: "Brains Decide Your Move",
    poster: BIZBRAIN,
    fee: "50",
    about: "Management and current affairs quiz.",
    registration: "Fee: 50 per participant. Team size 2.",
    rules: [
      "Round 1: Oral MCQ (Management).",
      "Round 2: Current Affairs (Lifelines available).",
      "Round 3: Rapid fire mix."
    ],
    rounds: [
      "Round 1: Management concept quiz",
      "Round 2: Current affairs quiz",
      "Round 3: Mix quiz"
    ],
    venue: "Round 1: 413 | Round 2: 414",
    time: "To be announced 2-3 days prior.",
    prizes: "Certificate and cash prize.",
    facultyCoordinator: "Prof. Bhargav Sodha",
    studentCoordinators: ["Baflipara Hesvi", "Sonani Yug"],
    contact: "Baflipara Hesvi - 9979584531"
  }
};

export default eventDetailsData;