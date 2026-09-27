"use client";

import {
  ArrowLeft,
  Check,
  Clock3,
  Copy,
  Globe2,
  Home,
  Medal,
  MousePointer2,
  Play,
  RefreshCcw,
  Trophy,
  User,
  Users,
  Volume2,
  VolumeX,
  Wifi,
  X,
} from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { buildDeck, isTriMatch, type GameCard } from "@/lib/game";
import type { PublicOnlineCard, PublicRoomState } from "@/lib/online-types";
import { getRecordedVehicleAudioFiles } from "@/lib/vehicle-audio";
import {
  LANGUAGE_META,
  VEHICLE_BY_ID,
  type Language,
  type Vehicle,
} from "@/lib/vehicles";

type Screen = "welcome" | "home" | "mode-intro" | "setup" | "local" | "online-setup" | "online" | "rules";
type LocalMode = "solo" | "two";
type Difficulty = 6 | 8 | 10;

type LocalConfig = {
  mode: LocalMode;
  names: [string, string?];
  vehicleCount: Difficulty;
  sessionKey: string;
};

type OnlineSession = {
  code: string;
  token: string;
  room: PublicRoomState;
};

type LeaderboardEntry = {
  playerName: string;
  score: number;
  mode: "solo" | "two" | "online";
  moves: number;
  durationMs: number;
  createdAt: number;
};

const DIFFICULTIES: { value: Difficulty; labelKey: "quick" | "classic" | "expert"; cards: number }[] = [
  { value: 6, labelKey: "quick", cards: 18 },
  { value: 8, labelKey: "classic", cards: 24 },
  { value: 10, labelKey: "expert", cards: 30 },
];

const CARD_BACK_IMAGES: Record<Language, string> = {
  de: "/brand/flaps-card-de.png",
  it: "/brand/flaps-card-it.png",
  en: "/brand/flaps-card-en.png",
};

const UI_COPY = {
  it: {
    welcomeTitle: "Benvenuto nel mondo di Flaps",
    welcomeIntro: "Dì a Flaps come ti chiami e scegli la tua lingua.",
    nameLabel: "Come ti chiami?",
    namePlaceholder: "Il tuo nome",
    languageLabel: "Scegli la tua lingua",
    enter: "Inizia l’avventura!",
    hello: "Ciao",
    homePrompt: "Come vuoi giocare oggi?",
    solo: "Gioca da solo",
    soloNote: "Allenati e migliora il tuo record",
    two: "Gioca in due",
    twoNote: "Giocate a turno sullo stesso dispositivo",
    online: "Gioca online",
    onlineNote: "Sfida un amico con un codice stanza",
    leaderboard: "Classifica",
    leaderboardNote: "Scopri i migliori risultati",
    rules: "Come si gioca",
    profile: "Cambia nome o lingua",
    home: "Torna al menu",
    soundOn: "Attiva audio",
    soundOff: "Disattiva audio",
    howMany: "Quante carte?",
    quick: "Veloce",
    classic: "Classico",
    expert: "Esperto",
    cards: "carte",
    soloEyebrow: "Partita individuale",
    twoEyebrow: "Sfida sullo stesso dispositivo",
    soloTitle: "Pronto a battere il tuo record?",
    twoTitle: "Chi gioca oggi?",
    setupIntro: "Trova lo stesso mezzo in tedesco, italiano e inglese. Flaps pronuncerà articolo, parola e plurale.",
    firstPlayer: "Primo giocatore",
    secondPlayer: "Secondo giocatore",
    startJourney: "Inizia il viaggio",
    player: "Giocatore",
    turn: "Turno",
    findTrio: "Trova un tris DE · IT · EN",
    itsTurn: "Tocca a",
    yourTurn: "È il tuo turno",
    playing: "Sta giocando",
    gameBoard: "Tavolo di gioco",
    onlineBoard: "Tavolo di gioco online",
    finished: "Partita conclusa",
    draw: "Pareggio!",
    triosCompleted: "Tris completati!",
    attempts: "tentativi",
    playAgain: "Gioca ancora",
    menu: "Menu",
    result: "Risultato partita",
    onlineChallenge: "Sfida online",
    onlineTitle: "Un piccolo viaggio da vivere insieme",
    onlineIntro: "Giocate da due dispositivi e ritrovatevi nello stesso mondo di Flaps.",
    createRoom: "Crea una stanza",
    createRoomCopy: "Ricevi un codice da condividere con l’altro giocatore.",
    createRoomButton: "Crea stanza",
    or: "oppure",
    joinRoom: "Entra con il codice",
    joinRoomCopy: "Scrivi il codice di sei caratteri ricevuto dall’altro giocatore.",
    joinButton: "Entra e gioca",
    roomNote: "Il codice collega soltanto i due giocatori della stessa partita.",
    connectionFailed: "Connessione non riuscita.",
    connectionLost: "Connessione interrotta.",
    moveFailed: "Mossa non riuscita.",
    roomCreated: "Stanza creata",
    invitePlayer: "Invita il secondo giocatore",
    shareCode: "Condividi questo codice. La partita inizierà appena entrerà.",
    copied: "Copiato",
    copyCode: "Copia codice",
    isReady: "è pronto",
    waiting: "In attesa",
    room: "Stanza",
    rulesEyebrow: "Regole di TRIFLAPS",
    rulesTitle: "Tre lingue, un solo mezzo",
    rule1Title: "Gira tre carte",
    rule1Copy: "Il dorso mostra la lingua. Quando giri una carta ascolti articolo, parola e plurale.",
    rule2Title: "Forma il tris",
    rule2Copy: "Cerca lo stesso disegno in tedesco, italiano e inglese.",
    rule3Title: "Guadagna 100 punti",
    rule3Copy: "Se il tris è corretto conquisti le carte e continui. In due, se sbagli passa il turno.",
    rule4Title: "Scala la classifica",
    rule4Copy: "Vince chi trova più tris. Nella modalità solo conta anche il tempo.",
    languageLegend: "Lingue delle carte",
    bestResults: "I migliori risultati",
    all: "Tutti",
    loading: "Carico i punteggi…",
    unavailable: "Classifica non disponibile.",
    emptyLeaderboard: "La classifica aspetta il primo campione.",
    soloMode: "Solo",
    twoMode: "In due",
    onlineMode: "Online",
    close: "Chiudi",
    card: "Carta",
    defaultPlayer: "Flaps Fan",
    defaultPlayerOne: "Giocatore 1",
    defaultPlayerTwo: "Giocatore 2",
    storySoloTitle: "Il viaggio comincia da te",
    storySoloCopy: "Scegli la tua sfida e accompagna Flaps tra parole, immagini e trasporti.",
    storyTwoTitle: "Le scoperte più belle si fanno insieme",
    storyTwoCopy: "Due giocatori, tre lingue e tanti piccoli momenti da ricordare.",
  },
  de: {
    welcomeTitle: "Willkommen in Flaps’ Welt",
    welcomeIntro: "Sag Flaps, wie du heißt, und wähle deine Sprache.",
    nameLabel: "Wie heißt du?",
    namePlaceholder: "Dein Name",
    languageLabel: "Wähle deine Sprache",
    enter: "Ab ins Abenteuer!",
    hello: "Hallo",
    homePrompt: "Wie möchtest du heute spielen?",
    solo: "Allein spielen",
    soloNote: "Übe und verbessere deinen Rekord",
    two: "Zu zweit spielen",
    twoNote: "Spielt abwechselnd an einem Gerät",
    online: "Online spielen",
    onlineNote: "Spiele mit einem Freund über einen Raumcode",
    leaderboard: "Rangliste",
    leaderboardNote: "Entdecke die besten Ergebnisse",
    rules: "Spielregeln",
    profile: "Name oder Sprache ändern",
    home: "Zurück zum Menü",
    soundOn: "Ton einschalten",
    soundOff: "Ton ausschalten",
    howMany: "Wie viele Karten?",
    quick: "Schnell",
    classic: "Klassisch",
    expert: "Profi",
    cards: "Karten",
    soloEyebrow: "Einzelspiel",
    twoEyebrow: "Zwei Spieler an einem Gerät",
    soloTitle: "Bereit für deinen neuen Rekord?",
    twoTitle: "Wer spielt heute?",
    setupIntro: "Finde dasselbe Fahrzeug auf Deutsch, Italienisch und Englisch. Flaps spricht Artikel, Wort und Plural vor.",
    firstPlayer: "Erster Spieler",
    secondPlayer: "Zweiter Spieler",
    startJourney: "Reise starten",
    player: "Spieler",
    turn: "Am Zug",
    findTrio: "Finde ein Trio DE · IT · EN",
    itsTurn: "Jetzt spielt",
    yourTurn: "Du bist dran",
    playing: "Es spielt",
    gameBoard: "Spieltisch",
    onlineBoard: "Online-Spieltisch",
    finished: "Spiel beendet",
    draw: "Unentschieden!",
    triosCompleted: "Alle Trios gefunden!",
    attempts: "Versuche",
    playAgain: "Noch einmal",
    menu: "Menü",
    result: "Spielergebnis",
    onlineChallenge: "Online-Spiel",
    onlineTitle: "Ein kleines Abenteuer, das ihr gemeinsam erlebt",
    onlineIntro: "Spielt an zwei Geräten und trefft euch in Flaps’ Welt.",
    createRoom: "Raum erstellen",
    createRoomCopy: "Du erhältst einen Code für den anderen Spieler.",
    createRoomButton: "Raum erstellen",
    or: "oder",
    joinRoom: "Mit Code beitreten",
    joinRoomCopy: "Gib den sechsstelligen Code des anderen Spielers ein.",
    joinButton: "Beitreten und spielen",
    roomNote: "Der Code verbindet nur die beiden Spieler dieser Partie.",
    connectionFailed: "Verbindung fehlgeschlagen.",
    connectionLost: "Verbindung unterbrochen.",
    moveFailed: "Zug nicht möglich.",
    roomCreated: "Raum erstellt",
    invitePlayer: "Lade den zweiten Spieler ein",
    shareCode: "Teile diesen Code. Das Spiel beginnt, sobald der andere Spieler beitritt.",
    copied: "Kopiert",
    copyCode: "Code kopieren",
    isReady: "ist bereit",
    waiting: "Warten",
    room: "Raum",
    rulesEyebrow: "TRIFLAPS Spielregeln",
    rulesTitle: "Drei Sprachen, ein Fahrzeug",
    rule1Title: "Drehe drei Karten um",
    rule1Copy: "Die Rückseite zeigt die Sprache. Beim Umdrehen hörst du Artikel, Wort und Plural.",
    rule2Title: "Bilde ein Trio",
    rule2Copy: "Finde dasselbe Bild auf Deutsch, Italienisch und Englisch.",
    rule3Title: "Sammle 100 Punkte",
    rule3Copy: "Für ein richtiges Trio bekommst du die Karten. Zu zweit wechselt der Zug nach einem Fehler.",
    rule4Title: "Steige in der Rangliste auf",
    rule4Copy: "Wer die meisten Trios findet, gewinnt. Im Einzelspiel zählt auch die Zeit.",
    languageLegend: "Sprachen der Karten",
    bestResults: "Die besten Ergebnisse",
    all: "Alle",
    loading: "Punkte werden geladen…",
    unavailable: "Rangliste nicht verfügbar.",
    emptyLeaderboard: "Die Rangliste wartet auf den ersten Champion.",
    soloMode: "Allein",
    twoMode: "Zu zweit",
    onlineMode: "Online",
    close: "Schließen",
    card: "Karte",
    defaultPlayer: "Flaps Fan",
    defaultPlayerOne: "Spieler 1",
    defaultPlayerTwo: "Spieler 2",
    storySoloTitle: "Deine Reise beginnt",
    storySoloCopy: "Wähle deine Herausforderung und begleite Flaps durch Wörter, Bilder und Fahrzeuge.",
    storyTwoTitle: "Gemeinsam entdeckt man mehr",
    storyTwoCopy: "Zwei Spieler, drei Sprachen und viele schöne Entdeckungen.",
  },
  en: {
    welcomeTitle: "Welcome to Flaps’ world",
    welcomeIntro: "Tell Flaps your name and choose your language.",
    nameLabel: "What is your name?",
    namePlaceholder: "Your name",
    languageLabel: "Choose your language",
    enter: "Start the adventure!",
    hello: "Hello",
    homePrompt: "How would you like to play today?",
    solo: "Play on your own",
    soloNote: "Practise and improve your record",
    two: "Play together",
    twoNote: "Take turns on the same device",
    online: "Play online",
    onlineNote: "Challenge a friend with a room code",
    leaderboard: "Leaderboard",
    leaderboardNote: "See the best results",
    rules: "How to play",
    profile: "Change name or language",
    home: "Back to the menu",
    soundOn: "Turn sound on",
    soundOff: "Turn sound off",
    howMany: "How many cards?",
    quick: "Quick",
    classic: "Classic",
    expert: "Expert",
    cards: "cards",
    soloEyebrow: "Solo game",
    twoEyebrow: "Two players on one device",
    soloTitle: "Ready to beat your record?",
    twoTitle: "Who is playing today?",
    setupIntro: "Find the same vehicle in German, Italian and English. Flaps will say the article, word and plural.",
    firstPlayer: "First player",
    secondPlayer: "Second player",
    startJourney: "Start the journey",
    player: "Player",
    turn: "Turn",
    findTrio: "Find a DE · IT · EN trio",
    itsTurn: "It is",
    yourTurn: "It is your turn",
    playing: "Now playing",
    gameBoard: "Game board",
    onlineBoard: "Online game board",
    finished: "Game finished",
    draw: "It’s a draw!",
    triosCompleted: "All trios completed!",
    attempts: "attempts",
    playAgain: "Play again",
    menu: "Menu",
    result: "Game result",
    onlineChallenge: "Online challenge",
    onlineTitle: "A little adventure to share",
    onlineIntro: "Play on two devices and meet in Flaps’ world.",
    createRoom: "Create a room",
    createRoomCopy: "Get a code to share with the other player.",
    createRoomButton: "Create room",
    or: "or",
    joinRoom: "Join with a code",
    joinRoomCopy: "Enter the six-character code from the other player.",
    joinButton: "Join and play",
    roomNote: "The code connects only the two players in this game.",
    connectionFailed: "Connection failed.",
    connectionLost: "Connection interrupted.",
    moveFailed: "Move failed.",
    roomCreated: "Room created",
    invitePlayer: "Invite the second player",
    shareCode: "Share this code. The game will begin as soon as the other player joins.",
    copied: "Copied",
    copyCode: "Copy code",
    isReady: "is ready",
    waiting: "Waiting",
    room: "Room",
    rulesEyebrow: "TRIFLAPS rules",
    rulesTitle: "Three languages, one vehicle",
    rule1Title: "Turn over three cards",
    rule1Copy: "The back shows the language. When you turn a card, you hear the article, word and plural.",
    rule2Title: "Make a trio",
    rule2Copy: "Find the same picture in German, Italian and English.",
    rule3Title: "Earn 100 points",
    rule3Copy: "A correct trio wins the cards. With two players, a mistake passes the turn.",
    rule4Title: "Climb the leaderboard",
    rule4Copy: "The player who finds the most trios wins. Time also counts in solo mode.",
    languageLegend: "Card languages",
    bestResults: "Best results",
    all: "All",
    loading: "Loading scores…",
    unavailable: "Leaderboard unavailable.",
    emptyLeaderboard: "The leaderboard is waiting for its first champion.",
    soloMode: "Solo",
    twoMode: "Two players",
    onlineMode: "Online",
    close: "Close",
    card: "Card",
    defaultPlayer: "Flaps Fan",
    defaultPlayerOne: "Player 1",
    defaultPlayerTwo: "Player 2",
    storySoloTitle: "Your journey begins",
    storySoloCopy: "Choose your challenge and join Flaps on a journey through words, pictures and vehicles.",
    storyTwoTitle: "The best discoveries are shared",
    storyTwoCopy: "Two players, three languages and lots of little discoveries.",
  },
} as const;

type UiCopy = (typeof UI_COPY)[Language];

type AppContextValue = {
  language: Language;
  playerName: string;
  copy: UiCopy;
  openProfile: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error("TRIFLAPS context is missing");
  return value;
}

function modeLabel(copy: UiCopy, mode: LeaderboardEntry["mode"]) {
  return mode === "solo" ? copy.soloMode : mode === "two" ? copy.twoMode : copy.onlineMode;
}

function winnerLabel(language: Language, player: string) {
  if (language === "de") return `${player} gewinnt!`;
  if (language === "en") return `${player} wins!`;
  return `${player} vince!`;
}

function safeName(value: string, fallback: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 24) || fallback;
}

function makeSessionKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const values = new Uint32Array(4);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(16)).join("");
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatTime(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

let activeVehicleAudio: HTMLAudioElement | null = null;
let vehicleAudioPlaybackToken = 0;

function stopVehicleAudio() {
  vehicleAudioPlaybackToken += 1;
  if (activeVehicleAudio) {
    activeVehicleAudio.pause();
    activeVehicleAudio.currentTime = 0;
    activeVehicleAudio = null;
  }
  window.speechSynthesis?.cancel();
}

function speakWithBrowserVoice(text: string, language: Language) {
  if (!("speechSynthesis" in window)) return;
  const meta = LANGUAGE_META[language];
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = meta.locale;
  utterance.rate = 0.83;
  utterance.pitch = 1.06;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((voice) => voice.lang.toLowerCase().startsWith(language));
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

function speakVehicle(vehicle: Vehicle, language: Language, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;

  stopVehicleAudio();
  const term = vehicle.terms[language];
  const fallbackText = `${term.singular}. ${term.plural}.`;
  const files = getRecordedVehicleAudioFiles(vehicle, language);
  const token = vehicleAudioPlaybackToken;

  const playFile = (index: number) => {
    if (token !== vehicleAudioPlaybackToken) return;
    if (index >= files.length) {
      activeVehicleAudio = null;
      return;
    }

    const audio = new Audio(files[index]);
    activeVehicleAudio = audio;
    audio.preload = "auto";
    audio.onended = () => {
      if (token !== vehicleAudioPlaybackToken) return;
      activeVehicleAudio = null;
      playFile(index + 1);
    };
    audio.onerror = () => {
      if (token !== vehicleAudioPlaybackToken) return;
      activeVehicleAudio = null;
      speakWithBrowserVoice(fallbackText, language);
    };

    const playback = audio.play();
    if (playback) {
      playback.catch(() => {
        if (token !== vehicleAudioPlaybackToken) return;
        activeVehicleAudio = null;
        speakWithBrowserVoice(fallbackText, language);
      });
    }
  };

  playFile(0);
}

function Brand() {
  return (
    <span className="brand">
      <span className="brand-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand-word">TRI<span>FLAPS</span></span>
    </span>
  );
}

function WorldStage({ compact = false, onHome, homeLabel = "Home" }: { compact?: boolean; onHome?: () => void; homeLabel?: string }) {
  const house = (
    <img className="world-house" src="/brand/flaps-house-classic.png" alt="" draggable={false} />
  );

  return (
    <div className={`flaps-world ${compact ? "compact" : "full"}`} aria-hidden={compact ? undefined : "true"}>
      {onHome ? (
        <button className="world-house-button" type="button" onClick={onHome} aria-label={homeLabel}>
          {house}
        </button>
      ) : house}
      <img className="world-sofa" src="/brand/flaps-sofa.png" alt="" draggable={false} />
      <img className="world-flaps" src="/brand/flaps-original.png" alt="" draggable={false} />
    </div>
  );
}

function WelcomeScreen({
  initialName,
  initialLanguage,
  onContinue,
}: {
  initialName: string;
  initialLanguage: Language;
  onContinue: (profile: { name: string; language: Language }) => void;
}) {
  const [name, setName] = useState(initialName);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const copy = UI_COPY[language];

  useEffect(() => setName(initialName), [initialName]);
  useEffect(() => setLanguage(initialLanguage), [initialLanguage]);

  return (
    <main className="welcome-screen">
      <div className="welcome-sky" aria-hidden="true"><i /><i /><i /><i /></div>
      <section className="welcome-scene">
        <WorldStage />
        <div className="welcome-card">
          <Brand />
          <p className="welcome-kicker">TRIFLAPS · TRANSPORTMITTEL</p>
          <h1>{copy.welcomeTitle}</h1>
          <p className="welcome-intro">{copy.welcomeIntro}</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) return;
              onContinue({ name: safeName(name, copy.defaultPlayer), language });
            }}
          >
            <label className="welcome-name">
              <span>{copy.nameLabel}</span>
              <input
                value={name}
                maxLength={24}
                placeholder={copy.namePlaceholder}
                autoComplete="given-name"
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <fieldset className="welcome-languages">
              <legend>{copy.languageLabel}</legend>
              <div>
                {(["de", "it", "en"] as Language[]).map((item) => (
                  <button
                    key={item}
                    className={language === item ? "active" : ""}
                    type="button"
                    onClick={() => setLanguage(item)}
                    aria-pressed={language === item}
                  >
                    <span>{LANGUAGE_META[item].flag}</span>
                    <strong>{LANGUAGE_META[item].label}</strong>
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="welcome-enter" type="submit" disabled={!name.trim()}>
              <Play size={20} fill="currentColor" /> {copy.enter}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Header({
  soundOn,
  onToggleSound,
  onLeaderboard,
  onHome,
  showHome,
}: {
  soundOn: boolean;
  onToggleSound: () => void;
  onLeaderboard: () => void;
  onHome: () => void;
  showHome: boolean;
}) {
  const { language, playerName, copy, openProfile } = useAppContext();
  return (
    <header className="topbar">
      <div className="topbar-left">
        {showHome && <WorldStage compact onHome={onHome} homeLabel={copy.home} />}
        <Brand />
      </div>
      <div className="topbar-actions">
        <button className="profile-button" type="button" onClick={openProfile} aria-label={copy.profile}>
          <Globe2 size={18} />
          <span><b>{playerName}</b><small>{language.toUpperCase()}</small></span>
        </button>
        <button className="icon-button" type="button" onClick={onToggleSound} aria-label={soundOn ? copy.soundOff : copy.soundOn}>
          {soundOn ? <Volume2 size={21} /> : <VolumeX size={21} />}
        </button>
        <button className="ranking-button" type="button" onClick={onLeaderboard}>
          <Trophy size={19} />
          <span>{copy.leaderboard}</span>
        </button>
      </div>
    </header>
  );
}

function LanguageLegend() {
  const { copy } = useAppContext();
  return (
    <div className="language-legend" aria-label={copy.languageLegend}>
      {(Object.keys(LANGUAGE_META) as Language[]).map((language) => (
        <span key={language}>
          <b>{LANGUAGE_META[language].flag}</b>
          {LANGUAGE_META[language].label}
        </span>
      ))}
    </div>
  );
}

function HomeScreen({
  onChooseMode,
  onOnline,
  onLeaderboard,
  onRules,
}: {
  onChooseMode: (mode: LocalMode) => void;
  onOnline: () => void;
  onLeaderboard: () => void;
  onRules: () => void;
}) {
  return (
    <main className="approved-home-screen">
      <img src="/brand/approved/triflaps-menu-approved.png" alt="TRIFLAPS" className="approved-home-art" />
      <button className="approved-home-hotspot solo" type="button" onClick={() => onChooseMode("solo")} aria-label="1 Spieler" />
      <button className="approved-home-hotspot two" type="button" onClick={() => onChooseMode("two")} aria-label="2 Spieler" />
      <button className="approved-home-hotspot online" type="button" onClick={onOnline} aria-label="Online spielen" />
      <button className="approved-home-hotspot ranking" type="button" onClick={onLeaderboard} aria-label="Rangliste" />
      <button className="approved-rules-access" type="button" onClick={onRules}>?</button>
    </main>
  );
}

function ApprovedModeIntro({ mode, onStart, onBack }: { mode: "solo" | "two" | "online"; onStart: () => void; onBack: () => void }) {
  const src = mode === "solo" ? "/brand/approved/triflaps-solo-approved.png" : mode === "two" ? "/brand/approved/triflaps-two-approved.png" : "/brand/approved/triflaps-online-approved.png";
  return (
    <main className="approved-mode-screen">
      <img src={src} alt="TRIFLAPS" className="approved-mode-art" />
      <button className="approved-back-hotspot" type="button" onClick={onBack} aria-label="Zurück" />
      <button className="approved-start-hotspot" type="button" onClick={onStart} aria-label="Starten" />
    </main>
  );
}

function DifficultyPicker({ value, onChange }: { value: Difficulty; onChange: (value: Difficulty) => void }) {
  const { copy } = useAppContext();
  return (
    <fieldset className="difficulty-picker">
      <legend>{copy.howMany}</legend>
      <div>
        {DIFFICULTIES.map((item) => (
          <button
            key={item.value}
            className={value === item.value ? "active" : ""}
            type="button"
            onClick={() => onChange(item.value)}
          >
            <strong>{copy[item.labelKey]}</strong>
            <span>{item.cards} {copy.cards}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function StorybookCompanion({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  return (
    <aside className="storybook-companion" aria-label="Flaps ti accompagna nel gioco">
      <span className="storybook-spark spark-one" aria-hidden="true">✦</span>
      <span className="storybook-spark spark-two" aria-hidden="true">✦</span>
      <span className="storybook-spark spark-three" aria-hidden="true">✧</span>
      <WorldStage />
      <div className="storybook-plaque">
        <span>TRIFLAPS</span>
        <strong>{title}</strong>
        <p>{copy}</p>
      </div>
    </aside>
  );
}

function LocalSetup({ mode, onStart }: { mode: LocalMode; onStart: (config: LocalConfig) => void }) {
  const { copy, playerName } = useAppContext();
  const [nameOne, setNameOne] = useState(playerName || (mode === "solo" ? copy.defaultPlayer : copy.defaultPlayerOne));
  const [nameTwo, setNameTwo] = useState(copy.defaultPlayerTwo);
  const [difficulty, setDifficulty] = useState<Difficulty>(8);

  return (
    <main className="setup-wrap">
      <div className="setup-book">
        <StorybookCompanion
          title={mode === "solo" ? copy.storySoloTitle : copy.storyTwoTitle}
          copy={mode === "solo" ? copy.storySoloCopy : copy.storyTwoCopy}
        />
        <section className="setup-card">
          <div className={`setup-symbol ${mode}`}>
            {mode === "solo" ? <User /> : <Users />}
          </div>
          <p className="eyebrow plain">{mode === "solo" ? copy.soloEyebrow : copy.twoEyebrow}</p>
          <h1>{mode === "solo" ? copy.soloTitle : copy.twoTitle}</h1>
          <p className="setup-intro">{copy.setupIntro}</p>
          <div className="name-fields">
            <label>
              <span>{mode === "solo" ? copy.namePlaceholder : copy.firstPlayer}</span>
              <input value={nameOne} maxLength={24} onChange={(event) => setNameOne(event.target.value)} autoFocus />
            </label>
            {mode === "two" && (
              <label>
                <span>{copy.secondPlayer}</span>
                <input value={nameTwo} maxLength={24} onChange={(event) => setNameTwo(event.target.value)} />
              </label>
            )}
          </div>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
          <button
            className="primary-button"
            type="button"
            onClick={() =>
              onStart({
                mode,
                names: [
                  safeName(nameOne, mode === "solo" ? copy.defaultPlayer : copy.defaultPlayerOne),
                  mode === "two" ? safeName(nameTwo, copy.defaultPlayerTwo) : undefined,
                ],
                vehicleCount: difficulty,
                sessionKey: makeSessionKey(),
              })
            }
          >
            <Play size={19} fill="currentColor" /> {copy.startJourney}
          </button>
        </section>
      </div>
    </main>
  );
}

function GameCardButton({
  card,
  revealed,
  matched,
  disabled,
  onClick,
}: {
  card: GameCard | PublicOnlineCard;
  revealed: boolean;
  matched: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const { copy } = useAppContext();
  const language = card.language;
  const vehicle = "vehicle" in card ? card.vehicle : VEHICLE_BY_ID.get(card.vehicleId) ?? null;
  const meta = LANGUAGE_META[language];
  const term = vehicle?.terms[language];

  return (
    <button
      className={`game-card ${revealed ? "is-revealed" : ""} ${matched ? "is-matched" : ""}`}
      data-lang={language}
      type="button"
      onClick={onClick}
      disabled={disabled || matched}
      aria-label={revealed && term ? `${term.singular}, ${term.plural}` : `${copy.card} ${meta.label}`}
    >
      <span className="game-card-inner">
        <span className="card-back">
          <span className="back-language">{meta.short}</span>
          <span className="flaps-card-art" aria-hidden="true">
            <img src={CARD_BACK_IMAGES[language]} alt="" />
          </span>
          <span className="back-brand">TRI<b>FLAPS</b><small>{meta.label}</small></span>
        </span>
        <span className="card-front">
          {vehicle && term ? (
            <>
              <span className="front-meta"><span>{meta.flag}</span>{meta.short}<Volume2 size={13} /></span>
              <span className="vehicle-picture"><img src={vehicle.image} alt="" /></span>
              <strong>{term.singular}</strong>
              <small>{term.plural}</small>
              {matched && <span className="match-check"><Check size={16} strokeWidth={3} /></span>}
            </>
          ) : null}
        </span>
      </span>
    </button>
  );
}

function ScoreBar({
  names,
  scores,
  currentPlayer,
  moves,
  elapsed,
  online,
}: {
  names: [string, string?];
  scores: [number, number];
  currentPlayer: 0 | 1;
  moves: number;
  elapsed: number;
  online?: boolean;
}) {
  const { copy } = useAppContext();
  return (
    <div className="scorebar">
      <div className={`player-score ${currentPlayer === 0 ? "active" : ""}`}>
        <span className="player-dot one">1</span>
        <span><small>{online && currentPlayer === 0 ? copy.turn : copy.player}</small><strong>{names[0]}</strong></span>
        <b>{scores[0]}</b>
      </div>
      <div className="round-stats">
        <span><MousePointer2 size={15} /> {moves}</span>
        <span><Clock3 size={15} /> {formatTime(elapsed)}</span>
      </div>
      {names[1] && (
        <div className={`player-score right ${currentPlayer === 1 ? "active" : ""}`}>
          <b>{scores[1]}</b>
          <span><small>{online && currentPlayer === 1 ? copy.turn : copy.player}</small><strong>{names[1]}</strong></span>
          <span className="player-dot two">2</span>
        </div>
      )}
    </div>
  );
}

function FinishPanel({
  names,
  scores,
  moves,
  elapsed,
  onAgain,
  onHome,
}: {
  names: [string, string?];
  scores: [number, number];
  moves: number;
  elapsed: number;
  onAgain: () => void;
  onHome: () => void;
}) {
  const { language, copy } = useAppContext();
  const winner = names[1]
    ? scores[0] === scores[1]
      ? copy.draw
      : winnerLabel(language, scores[0] > scores[1] ? names[0] : names[1])
    : copy.triosCompleted;

  return (
    <div className="finish-shade" role="dialog" aria-modal="true" aria-label={copy.result}>
      <section className="finish-card">
        <span className="finish-medal"><Trophy /></span>
        <p>{copy.finished}</p>
        <h2>{winner}</h2>
        <div className="finish-scores">
          <span><small>{names[0]}</small><strong>{scores[0]}</strong></span>
          {names[1] && <span><small>{names[1]}</small><strong>{scores[1]}</strong></span>}
        </div>
        <div className="finish-meta"><span>{moves} {copy.attempts}</span><span>{formatTime(elapsed)}</span></div>
        <div className="finish-actions">
          <button className="primary-button" type="button" onClick={onAgain}><RefreshCcw size={18} /> {copy.playAgain}</button>
          <button className="secondary-button" type="button" onClick={onHome}><Home size={18} /> {copy.menu}</button>
        </div>
      </section>
    </div>
  );
}

function LocalGame({
  config,
  soundOn,
  onRestart,
  onHome,
}: {
  config: LocalConfig;
  soundOn: boolean;
  onRestart: () => void;
  onHome: () => void;
}) {
  const { copy } = useAppContext();
  const [deck] = useState(() => buildDeck(config.vehicleCount));
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const startedAt = useRef(Date.now());
  const submitted = useRef(false);
  const timers = useRef<number[]>([]);
  const finished = matched.length === deck.length / 3;

  useEffect(() => {
    if (finished) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [finished]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    if (!finished || submitted.current) return;
    submitted.current = true;
    const finishTime = Date.now();
    setEndedAt(finishTime);
    setNow(finishTime);
    const durationMs = finishTime - startedAt.current;
    const entries = config.mode === "solo" ? [0] : [0, 1];
    entries.forEach((index) => {
      void fetch("/api/leaderboard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          playerName: config.names[index] ?? `${copy.player} ${index + 1}`,
          score: scores[index],
          mode: config.mode,
          moves,
          durationMs,
          sourceKey: `${config.sessionKey}:${index}`,
        }),
      });
    });
  }, [config, copy.player, finished, moves, scores]);

  const flipCard = (index: number) => {
    if (locked || finished || open.includes(index)) return;
    const card = deck[index];
    if (matched.includes(card.vehicleId)) return;
    const vehicle = VEHICLE_BY_ID.get(card.vehicleId);
    if (vehicle) speakVehicle(vehicle, card.language, soundOn);
    const nextOpen = [...open, index];
    setOpen(nextOpen);
    if (nextOpen.length < 3) return;

    setLocked(true);
    setMoves((value) => value + 1);
    const selection = nextOpen.map((cardIndex) => deck[cardIndex]);
    const isMatch = isTriMatch(selection);
    const timer = window.setTimeout(
      () => {
        if (isMatch) {
          setMatched((value) => [...value, selection[0].vehicleId]);
          setScores((value) => {
            const next: [number, number] = [...value];
            next[currentPlayer] += 100;
            return next;
          });
        } else {
          if (config.mode === "solo") {
            setScores((value) => [Math.max(0, value[0] - 10), value[1]]);
          } else {
            setCurrentPlayer((value) => (value === 0 ? 1 : 0));
          }
        }
        setOpen([]);
        setLocked(false);
      },
      isMatch ? 650 : 1450,
    );
    timers.current.push(timer);
  };

  const names: [string, string?] = config.mode === "solo" ? [config.names[0]] : config.names;
  const elapsed = (endedAt ?? now) - startedAt.current;

  return (
    <main className="game-screen">
      <ScoreBar names={names} scores={scores} currentPlayer={currentPlayer} moves={moves} elapsed={elapsed} />
      <div className="turn-message">
        {config.mode === "solo" ? copy.findTrio : <>{copy.itsTurn} <strong>{names[currentPlayer]}</strong></>}
      </div>
      <section className={`card-grid count-${config.vehicleCount}`} aria-label={copy.gameBoard}>
        {deck.map((card, index) => (
          <GameCardButton
            key={card.key}
            card={card}
            revealed={open.includes(index) || matched.includes(card.vehicleId)}
            matched={matched.includes(card.vehicleId)}
            disabled={locked}
            onClick={() => flipCard(index)}
          />
        ))}
      </section>
      {finished && (
        <FinishPanel names={names} scores={scores} moves={moves} elapsed={elapsed} onAgain={onRestart} onHome={onHome} />
      )}
    </main>
  );
}

function OnlineSetup({ onSession }: { onSession: (session: OnlineSession) => void }) {
  const { copy, playerName } = useAppContext();
  const [name, setName] = useState(playerName || copy.defaultPlayer);
  const [code, setCode] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>(8);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const callOnline = async (kind: "create" | "join") => {
    setBusy(true);
    setError("");
    try {
      const endpoint = kind === "create" ? "/api/rooms" : `/api/rooms/${code.trim().toUpperCase()}/join`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ playerName: safeName(name, copy.defaultPlayer), vehicleCount: difficulty }),
      });
      const data = (await response.json()) as { token?: string; room?: PublicRoomState; error?: string };
      if (!response.ok || !data.token || !data.room) throw new Error(data.error || copy.connectionFailed);
      onSession({ code: data.room.code, token: data.token, room: data.room });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : copy.connectionFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="online-setup-wrap">
      <section className="online-panel">
        <div className="online-title">
          <div className="online-world"><WorldStage /></div>
          <div><p className="eyebrow plain">{copy.onlineChallenge}</p><h1>{copy.onlineTitle}</h1><p>{copy.onlineIntro}</p></div>
        </div>
        <label className="online-name">
          <span>{copy.namePlaceholder}</span>
          <input value={name} maxLength={24} onChange={(event) => setName(event.target.value)} />
        </label>
        <div className="online-columns">
          <div className="online-option create">
            <span className="option-number">1</span>
            <h2>{copy.createRoom}</h2>
            <p>{copy.createRoomCopy}</p>
            <DifficultyPicker value={difficulty} onChange={setDifficulty} />
            <button className="primary-button" type="button" disabled={busy} onClick={() => void callOnline("create")}>
              <Wifi size={18} /> {copy.createRoomButton}
            </button>
          </div>
          <div className="or-divider"><span>{copy.or}</span></div>
          <div className="online-option join">
            <span className="option-number">2</span>
            <h2>{copy.joinRoom}</h2>
            <p>{copy.joinRoomCopy}</p>
            <input
              className="room-code-input"
              value={code}
              maxLength={6}
              placeholder="ABC123"
              onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
            />
            <button className="secondary-button dark" type="button" disabled={busy || code.length !== 6} onClick={() => void callOnline("join")}>
              <Play size={18} fill="currentColor" /> {copy.joinButton}
            </button>
          </div>
        </div>
        <p className="online-note"><Globe2 size={16} /> {copy.roomNote}</p>
        {error && <p className="form-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}

function OnlineGame({
  session,
  soundOn,
  onUpdate,
  onHome,
  onNewRoom,
}: {
  session: OnlineSession;
  soundOn: boolean;
  onUpdate: (room: PublicRoomState) => void;
  onHome: () => void;
  onNewRoom: () => void;
}) {
  const { copy } = useAppContext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  const refreshRoom = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${session.code}?token=${encodeURIComponent(session.token)}`, { cache: "no-store" });
      const data = (await response.json()) as { room?: PublicRoomState; error?: string };
      if (!response.ok || !data.room) throw new Error(data.error || copy.connectionLost);
      onUpdate(data.room);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : copy.connectionLost);
    }
  }, [onUpdate, session.code, session.token]);

  useEffect(() => {
    const poller = window.setInterval(() => void refreshRoom(), 900);
    return () => window.clearInterval(poller);
  }, [refreshRoom]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const flipOnline = async (card: PublicOnlineCard) => {
    if (busy || card.revealed || session.room.currentPlayer !== session.room.youIndex) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/rooms/${session.code}/flip`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: session.token, index: card.index, version: session.room.version }),
      });
      const data = (await response.json()) as { room?: PublicRoomState; error?: string };
      if (data.room) {
        onUpdate(data.room);
        const revealed = data.room.cards[card.index];
        if (revealed?.vehicle) speakVehicle(revealed.vehicle, revealed.language, soundOn);
      }
      if (!response.ok && !data.room) throw new Error(data.error || copy.moveFailed);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : copy.moveFailed);
      void refreshRoom();
    } finally {
      setBusy(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(session.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (session.room.status === "waiting") {
    return (
      <main className="waiting-wrap">
        <section className="waiting-card">
          <div className="waiting-world"><WorldStage /></div>
          <span className="waiting-orbit"><Wifi /></span>
          <p className="eyebrow plain">{copy.roomCreated}</p>
          <h1>{copy.invitePlayer}</h1>
          <p>{copy.shareCode}</p>
          <button className="big-room-code" type="button" onClick={() => void copyCode()}>
            <strong>{session.code}</strong>
            <span>{copied ? <><Check size={17} /> {copy.copied}</> : <><Copy size={17} /> {copy.copyCode}</>}</span>
          </button>
          <div className="waiting-player"><span className="pulse-dot" /><b>{session.room.players[0]}</b> {copy.isReady}</div>
          <div className="waiting-dots" aria-label={copy.waiting}><i /><i /><i /></div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </section>
      </main>
    );
  }

  const names: [string, string?] = [session.room.players[0], session.room.players[1] ?? copy.defaultPlayerTwo];
  const elapsed = (session.room.endedAt ?? now) - (session.room.startedAt ?? now);
  const isYourTurn = session.room.currentPlayer === session.room.youIndex;

  return (
    <main className="game-screen">
      <div className="room-chip"><Wifi size={14} /> {copy.room} <b>{session.code}</b></div>
      <ScoreBar
        names={names}
        scores={session.room.scores}
        currentPlayer={session.room.currentPlayer}
        moves={session.room.moves}
        elapsed={elapsed}
        online
      />
      <div className={`turn-message ${isYourTurn ? "your-turn" : ""}`}>
        {isYourTurn ? copy.yourTurn : <>{copy.playing} <strong>{names[session.room.currentPlayer]}</strong></>}
      </div>
      {error && <p className="inline-error" role="alert">{error}</p>}
      <section className={`card-grid count-${session.room.cards.length / 3}`} aria-label={copy.onlineBoard}>
        {session.room.cards.map((card) => (
          <GameCardButton
            key={`${session.code}-${card.index}`}
            card={card}
            revealed={card.revealed}
            matched={card.matched}
            disabled={busy || !isYourTurn || Boolean(session.room.revealUntil)}
            onClick={() => void flipOnline(card)}
          />
        ))}
      </section>
      {session.room.status === "finished" && (
        <FinishPanel
          names={names}
          scores={session.room.scores}
          moves={session.room.moves}
          elapsed={elapsed}
          onAgain={onNewRoom}
          onHome={onHome}
        />
      )}
    </main>
  );
}

function RulesScreen() {
  const { copy } = useAppContext();
  return (
    <main className="rules-wrap">
      <section className="rules-card">
        <div className="rules-world"><WorldStage /></div>
        <p className="eyebrow plain">{copy.rulesEyebrow}</p>
        <h1>{copy.rulesTitle}</h1>
        <div className="rule-steps">
          <article><span>1</span><div><h2>{copy.rule1Title}</h2><p>{copy.rule1Copy}</p></div></article>
          <article><span>2</span><div><h2>{copy.rule2Title}</h2><p>{copy.rule2Copy}</p></div></article>
          <article><span>3</span><div><h2>{copy.rule3Title}</h2><p>{copy.rule3Copy}</p></div></article>
          <article><span>4</span><div><h2>{copy.rule4Title}</h2><p>{copy.rule4Copy}</p></div></article>
        </div>
        <LanguageLegend />
      </section>
    </main>
  );
}

function LeaderboardDialog({ onClose }: { onClose: () => void }) {
  const { copy } = useAppContext();
  const [mode, setMode] = useState<"all" | LeaderboardEntry["mode"]>("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const query = mode === "all" ? "" : `?mode=${mode}`;
    fetch(`/api/leaderboard${query}`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as { entries?: LeaderboardEntry[]; error?: string };
        if (!response.ok) throw new Error(data.error || copy.unavailable);
        if (active) setEntries(data.entries ?? []);
      })
      .catch((reason) => active && setError(reason instanceof Error ? reason.message : copy.unavailable))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [copy.unavailable, mode]);

  return (
    <div className="dialog-shade" role="dialog" aria-modal="true" aria-label={`${copy.leaderboard} TRIFLAPS`}>
      <section className="leaderboard-dialog">
        <button className="dialog-close" type="button" onClick={onClose} aria-label={copy.close}><X /></button>
        <div className="leaderboard-heading"><span><Trophy /></span><div><p className="eyebrow plain">{copy.bestResults}</p><h2>{copy.leaderboard} TRIFLAPS</h2></div></div>
        <div className="leaderboard-filters">
          {(["all", "solo", "two", "online"] as const).map((filter) => (
            <button key={filter} className={mode === filter ? "active" : ""} type="button" onClick={() => setMode(filter)}>
              {filter === "all" ? copy.all : modeLabel(copy, filter)}
            </button>
          ))}
        </div>
        <div className="leaderboard-list">
          {loading && <p className="empty-state">{copy.loading}</p>}
          {!loading && error && <p className="empty-state error">{error}</p>}
          {!loading && !error && entries.length === 0 && <p className="empty-state">{copy.emptyLeaderboard}</p>}
          {!loading && !error && entries.map((entry, index) => (
            <div className={`leaderboard-row rank-${index + 1}`} key={`${entry.playerName}-${entry.createdAt}-${index}`}>
              <span className="rank">{index < 3 ? <Medal size={20} /> : index + 1}</span>
              <span className="ranking-name"><strong>{entry.playerName}</strong><small>{modeLabel(copy, entry.mode)} · {entry.moves} {copy.attempts}</small></span>
              <span className="ranking-time">{formatTime(entry.durationMs)}</span>
              <b>{entry.score}</b>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function TriflapsGame() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [introMode, setIntroMode] = useState<"solo" | "two" | "online">("solo");
  const [setupMode, setSetupMode] = useState<LocalMode>("solo");
  const [localConfig, setLocalConfig] = useState<LocalConfig | null>(null);
  const [onlineSession, setOnlineSession] = useState<OnlineSession | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [language, setLanguage] = useState<Language>("it");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("triflaps-profile-v1");
      if (!saved) return;
      const profile = JSON.parse(saved) as { name?: string; language?: Language };
      if (profile.name) setPlayerName(safeName(profile.name, UI_COPY.it.defaultPlayer));
      if (profile.language && ["de", "it", "en"].includes(profile.language)) setLanguage(profile.language);
    } catch {
      // A damaged local preference should never block the game.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const completeWelcome = (profile: { name: string; language: Language }) => {
    setPlayerName(profile.name);
    setLanguage(profile.language);
    window.localStorage.setItem("triflaps-profile-v1", JSON.stringify(profile));
    setScreen("home");
  };

  const openProfile = () => {
    stopVehicleAudio();
    setShowLeaderboard(false);
    setLocalConfig(null);
    setOnlineSession(null);
    setScreen("welcome");
  };

  const goHome = () => {
    stopVehicleAudio();
    setScreen(playerName ? "home" : "welcome");
    setLocalConfig(null);
    setOnlineSession(null);
  };

  const chooseMode = (mode: LocalMode) => {
    setSetupMode(mode);
    setIntroMode(mode);
    setScreen("mode-intro");
  };

  const startLocal = (config: LocalConfig) => {
    setLocalConfig(config);
    setScreen("local");
  };

  const restartLocal = () => {
    if (!localConfig) return;
    setLocalConfig({ ...localConfig, sessionKey: makeSessionKey() });
  };

  const updateOnlineRoom = useCallback((room: PublicRoomState) => {
    setOnlineSession((current) => (current ? { ...current, room } : current));
  }, []);

  const copy = UI_COPY[language];

  return (
    <AppContext.Provider value={{ language, playerName, copy, openProfile }}>
    <div className="app-shell">
      {screen !== "home" && screen !== "welcome" && (
        <Header
          soundOn={soundOn}
          onToggleSound={() => {
            if (soundOn) stopVehicleAudio();
            setSoundOn((value) => !value);
          }}
          onLeaderboard={() => setShowLeaderboard(true)}
          onHome={goHome}
          showHome
        />
      )}

      {screen === "welcome" && (
        <WelcomeScreen initialName={playerName} initialLanguage={language} onContinue={completeWelcome} />
      )}
      {screen === "home" && (
        <HomeScreen
          onChooseMode={chooseMode}
          onOnline={() => { setIntroMode("online"); setScreen("mode-intro"); }}
          onLeaderboard={() => setShowLeaderboard(true)}
          onRules={() => setScreen("rules")}
        />
      )}
      {screen === "mode-intro" && (
        <ApprovedModeIntro
          mode={introMode}
          onBack={() => setScreen("home")}
          onStart={() => setScreen(introMode === "online" ? "online-setup" : "setup")}
        />
      )}
      {screen === "setup" && <LocalSetup key={setupMode} mode={setupMode} onStart={startLocal} />}
      {screen === "local" && localConfig && (
        <LocalGame key={localConfig.sessionKey} config={localConfig} soundOn={soundOn} onRestart={restartLocal} onHome={goHome} />
      )}
      {screen === "online-setup" && (
        <OnlineSetup onSession={(session) => { setOnlineSession(session); setScreen("online"); }} />
      )}
      {screen === "online" && onlineSession && (
        <OnlineGame
          session={onlineSession}
          soundOn={soundOn}
          onUpdate={updateOnlineRoom}
          onHome={goHome}
          onNewRoom={() => { setOnlineSession(null); setScreen("online-setup"); }}
        />
      )}
      {screen === "rules" && <RulesScreen />}
      {showLeaderboard && <LeaderboardDialog onClose={() => setShowLeaderboard(false)} />}
    </div>
    </AppContext.Provider>
  );
}
