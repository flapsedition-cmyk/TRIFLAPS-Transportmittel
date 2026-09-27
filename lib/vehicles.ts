export type Language = "de" | "it" | "en";

export type Term = {
  singular: string;
  plural: string;
};

export type Vehicle = {
  id: string;
  image: string;
  category: Record<Language, string>;
  terms: Record<Language, Term>;
};

export const LANGUAGE_META: Record<
  Language,
  { flag: string; short: string; label: string; locale: string; color: string }
> = {
  de: {
    flag: "🇩🇪",
    short: "DE",
    label: "Deutsch",
    locale: "de-DE",
    color: "#e6b93f",
  },
  it: {
    flag: "🇮🇹",
    short: "IT",
    label: "Italiano",
    locale: "it-IT",
    color: "#55a879",
  },
  en: {
    flag: "🇬🇧",
    short: "EN",
    label: "English",
    locale: "en-GB",
    color: "#5f7fc4",
  },
};

export const LANGUAGES: Language[] = ["de", "it", "en"];

export const VEHICLES: Vehicle[] = [
  {
    id: "auto",
    image: "/transportmittel/images_026_965bc6c434278288.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "das Auto", plural: "die Autos" },
      it: { singular: "la macchina", plural: "le macchine" },
      en: { singular: "the car", plural: "the cars" },
    },
  },
  {
    id: "zug",
    image: "/transportmittel/images_027_5f7e63fc9987f955.webp",
    category: { de: "Schiene", it: "binari", en: "rail" },
    terms: {
      de: { singular: "der Zug", plural: "die Züge" },
      it: { singular: "il treno", plural: "i treni" },
      en: { singular: "the train", plural: "the trains" },
    },
  },
  {
    id: "strassenbahn",
    image: "/transportmittel/images_028_1f7f2c70d6c145dc.webp",
    category: { de: "Schiene", it: "binari", en: "rail" },
    terms: {
      de: { singular: "die Straßenbahn", plural: "die Straßenbahnen" },
      it: { singular: "il tram", plural: "i tram" },
      en: { singular: "the tram", plural: "the trams" },
    },
  },
  {
    id: "ubahn",
    image: "/transportmittel/images_029_90dc3bd95fe55f17.webp",
    category: { de: "Schiene", it: "binari", en: "rail" },
    terms: {
      de: { singular: "die U-Bahn", plural: "die U-Bahnen" },
      it: { singular: "la metropolitana", plural: "le metropolitane" },
      en: {
        singular: "the underground train",
        plural: "the underground trains",
      },
    },
  },
  {
    id: "gueterzug",
    image: "/transportmittel/images_030_e9aef913ee016398.webp",
    category: { de: "Schiene", it: "binari", en: "rail" },
    terms: {
      de: { singular: "der Güterzug", plural: "die Güterzüge" },
      it: { singular: "il treno merci", plural: "i treni merci" },
      en: { singular: "the freight train", plural: "the freight trains" },
    },
  },
  {
    id: "fahrrad",
    image: "/transportmittel/images_031_a917987bbd816acc.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "das Fahrrad", plural: "die Fahrräder" },
      it: { singular: "la bicicletta", plural: "le biciclette" },
      en: { singular: "the bicycle", plural: "the bicycles" },
    },
  },
  {
    id: "tandem",
    image: "/transportmittel/images_032_3ac9d8595ca6bdbe.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "das Tandem", plural: "die Tandems" },
      it: { singular: "il tandem", plural: "i tandem" },
      en: {
        singular: "the tandem bicycle",
        plural: "the tandem bicycles",
      },
    },
  },
  {
    id: "motorroller",
    image: "/transportmittel/images_033_cc7a18bd3d703e2c.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Motorroller", plural: "die Motorroller" },
      it: { singular: "lo scooter", plural: "gli scooter" },
      en: { singular: "the scooter", plural: "the scooters" },
    },
  },
  {
    id: "motorrad",
    image: "/transportmittel/images_034_d91c92f6f7ffe4a6.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "das Motorrad", plural: "die Motorräder" },
      it: { singular: "la motocicletta", plural: "le motociclette" },
      en: { singular: "the motorcycle", plural: "the motorcycles" },
    },
  },
  {
    id: "tretroller",
    image: "/transportmittel/images_035_7facaa7cb50d872a.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Tretroller", plural: "die Tretroller" },
      it: { singular: "il monopattino", plural: "i monopattini" },
      en: { singular: "the kick scooter", plural: "the kick scooters" },
    },
  },
  {
    id: "skateboard",
    image: "/transportmittel/images_036_e27217227d2b6421.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "das Skateboard", plural: "die Skateboards" },
      it: { singular: "lo skateboard", plural: "gli skateboard" },
      en: { singular: "the skateboard", plural: "the skateboards" },
    },
  },
  {
    id: "inlineskates",
    image: "/transportmittel/images_037_eda2b2c4a8ad1a4c.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "die Inlineskates", plural: "die Inlineskates" },
      it: {
        singular: "i pattini in linea",
        plural: "i pattini in linea",
      },
      en: { singular: "the inline skates", plural: "the inline skates" },
    },
  },
  {
    id: "rollstuhl",
    image: "/transportmittel/images_038_faa8cd754d418267.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Rollstuhl", plural: "die Rollstühle" },
      it: {
        singular: "la sedia a rotelle",
        plural: "le sedie a rotelle",
      },
      en: { singular: "the wheelchair", plural: "the wheelchairs" },
    },
  },
  {
    id: "taxi",
    image: "/transportmittel/images_039_b65e039c9da51e80.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "das Taxi", plural: "die Taxis" },
      it: { singular: "il taxi", plural: "i taxi" },
      en: { singular: "the taxi", plural: "the taxis" },
    },
  },
  {
    id: "limousine",
    image: "/transportmittel/images_040_42757952e16cf11c.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "die Limousine", plural: "die Limousinen" },
      it: { singular: "la limousine", plural: "le limousine" },
      en: { singular: "the limousine", plural: "the limousines" },
    },
  },
  {
    id: "lastwagen",
    image: "/transportmittel/images_041_2f453a41b0ab2339.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Lastwagen", plural: "die Lastwagen" },
      it: { singular: "il camion", plural: "i camion" },
      en: { singular: "the truck", plural: "the trucks" },
    },
  },
  {
    id: "lieferwagen",
    image: "/transportmittel/images_042_c000a715a78c4e2a.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Lieferwagen", plural: "die Lieferwagen" },
      it: { singular: "il furgone", plural: "i furgoni" },
      en: { singular: "the delivery van", plural: "the delivery vans" },
    },
  },
  {
    id: "muellwagen",
    image: "/transportmittel/images_043_ee2d783ca6e8bdfa.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Müllwagen", plural: "die Müllwagen" },
      it: {
        singular: "il camion della spazzatura",
        plural: "i camion della spazzatura",
      },
      en: { singular: "the garbage truck", plural: "the garbage trucks" },
    },
  },
  {
    id: "feuerwehrauto",
    image: "/transportmittel/images_044_1b5bca2d452078c8.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: {
        singular: "das Feuerwehrauto",
        plural: "die Feuerwehrautos",
      },
      it: {
        singular: "il camion dei pompieri",
        plural: "i camion dei pompieri",
      },
      en: { singular: "the fire engine", plural: "the fire engines" },
    },
  },
  {
    id: "polizeiauto",
    image: "/transportmittel/images_045_cc67e8be7ca2a5aa.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "das Polizeiauto", plural: "die Polizeiautos" },
      it: {
        singular: "l’auto della polizia",
        plural: "le auto della polizia",
      },
      en: { singular: "the police car", plural: "the police cars" },
    },
  },
  {
    id: "krankenwagen",
    image: "/transportmittel/images_046_953a0d2c4324d97c.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Krankenwagen", plural: "die Krankenwagen" },
      it: { singular: "l’ambulanza", plural: "le ambulanze" },
      en: { singular: "the ambulance", plural: "the ambulances" },
    },
  },
  {
    id: "schulbus",
    image: "/transportmittel/images_047_af6ad3e6ee63fb5b.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Schulbus", plural: "die Schulbusse" },
      it: { singular: "lo scuolabus", plural: "gli scuolabus" },
      en: { singular: "the school bus", plural: "the school buses" },
    },
  },
  {
    id: "reisebus",
    image: "/transportmittel/images_048_8b20b51750f82508.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Reisebus", plural: "die Reisebusse" },
      it: { singular: "il pullman", plural: "i pullman" },
      en: { singular: "the coach", plural: "the coaches" },
    },
  },
  {
    id: "anhaenger",
    image: "/transportmittel/images_049_757aee8d1fa93873.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Anhänger", plural: "die Anhänger" },
      it: { singular: "il rimorchio", plural: "i rimorchi" },
      en: { singular: "the trailer", plural: "the trailers" },
    },
  },
  {
    id: "wohnwagen",
    image: "/transportmittel/images_050_92cb268aecb01b68.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "der Wohnwagen", plural: "die Wohnwagen" },
      it: { singular: "la roulotte", plural: "le roulotte" },
      en: { singular: "the caravan", plural: "the caravans" },
    },
  },
  {
    id: "wohnmobil",
    image: "/transportmittel/images_051_199817c07785199d.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "das Wohnmobil", plural: "die Wohnmobile" },
      it: { singular: "il camper", plural: "i camper" },
      en: { singular: "the motorhome", plural: "the motorhomes" },
    },
  },
  {
    id: "kutsche",
    image: "/transportmittel/images_052_a384233c7d5e2e03.webp",
    category: { de: "Straße", it: "strada", en: "road" },
    terms: {
      de: { singular: "die Kutsche", plural: "die Kutschen" },
      it: { singular: "la carrozza", plural: "le carrozze" },
      en: { singular: "the carriage", plural: "the carriages" },
    },
  },
  {
    id: "traktor",
    image: "/transportmittel/images_053_1f79c98c3abfa3af.webp",
    category: { de: "Landwirtschaft", it: "agricoltura", en: "farming" },
    terms: {
      de: { singular: "der Traktor", plural: "die Traktoren" },
      it: { singular: "il trattore", plural: "i trattori" },
      en: { singular: "the tractor", plural: "the tractors" },
    },
  },
  {
    id: "maehdrescher",
    image: "/transportmittel/images_054_85d8953898045f75.webp",
    category: { de: "Landwirtschaft", it: "agricoltura", en: "farming" },
    terms: {
      de: { singular: "der Mähdrescher", plural: "die Mähdrescher" },
      it: { singular: "la mietitrebbia", plural: "le mietitrebbie" },
      en: {
        singular: "the combine harvester",
        plural: "the combine harvesters",
      },
    },
  },
  {
    id: "schubkarre",
    image: "/transportmittel/images_055_c14dfe3a942a0d55.webp",
    category: { de: "Baustelle", it: "cantiere", en: "building site" },
    terms: {
      de: { singular: "die Schubkarre", plural: "die Schubkarren" },
      it: { singular: "la carriola", plural: "le carriole" },
      en: { singular: "the wheelbarrow", plural: "the wheelbarrows" },
    },
  },
  {
    id: "bagger",
    image: "/transportmittel/images_056_2c0e4ca85cb9a415.webp",
    category: { de: "Baustelle", it: "cantiere", en: "building site" },
    terms: {
      de: { singular: "der Bagger", plural: "die Bagger" },
      it: { singular: "l’escavatore", plural: "gli escavatori" },
      en: { singular: "the excavator", plural: "the excavators" },
    },
  },
  {
    id: "kran",
    image: "/transportmittel/images_057_84b6a2c32e6ab54f.webp",
    category: { de: "Baustelle", it: "cantiere", en: "building site" },
    terms: {
      de: { singular: "der Kran", plural: "die Kräne" },
      it: { singular: "la gru", plural: "le gru" },
      en: { singular: "the crane", plural: "the cranes" },
    },
  },
  {
    id: "gabelstapler",
    image: "/transportmittel/images_058_1ecaa795f05a975e.webp",
    category: { de: "Baustelle", it: "cantiere", en: "building site" },
    terms: {
      de: { singular: "der Gabelstapler", plural: "die Gabelstapler" },
      it: {
        singular: "il carrello elevatore",
        plural: "i carrelli elevatori",
      },
      en: { singular: "the forklift", plural: "the forklifts" },
    },
  },
  {
    id: "flugzeug",
    image: "/transportmittel/images_059_09b9836ae901635c.webp",
    category: { de: "Luft", it: "aria", en: "air" },
    terms: {
      de: { singular: "das Flugzeug", plural: "die Flugzeuge" },
      it: { singular: "l’aereo", plural: "gli aerei" },
      en: { singular: "the aeroplane", plural: "the aeroplanes" },
    },
  },
  {
    id: "duesenjet",
    image: "/transportmittel/images_060_5edcd56ca61b4fb7.webp",
    category: { de: "Luft", it: "aria", en: "air" },
    terms: {
      de: { singular: "der Düsenjet", plural: "die Düsenjets" },
      it: {
        singular: "l’aereo a reazione",
        plural: "gli aerei a reazione",
      },
      en: { singular: "the jet", plural: "the jets" },
    },
  },
  {
    id: "hubschrauber",
    image: "/transportmittel/images_061_28d693e7b4a22e3f.webp",
    category: { de: "Luft", it: "aria", en: "air" },
    terms: {
      de: { singular: "der Hubschrauber", plural: "die Hubschrauber" },
      it: { singular: "l’elicottero", plural: "gli elicotteri" },
      en: { singular: "the helicopter", plural: "the helicopters" },
    },
  },
  {
    id: "krankenhubschrauber",
    image: "/transportmittel/images_062_6b975007db221a3e.webp",
    category: { de: "Luft", it: "aria", en: "air" },
    terms: {
      de: {
        singular: "der Krankenhubschrauber",
        plural: "die Krankenhubschrauber",
      },
      it: {
        singular: "l’elisoccorso",
        plural: "gli elicotteri di soccorso",
      },
      en: {
        singular: "the rescue helicopter",
        plural: "the rescue helicopters",
      },
    },
  },
  {
    id: "heissluftballon",
    image: "/transportmittel/images_063_0f8660a98bb89e3a.webp",
    category: { de: "Luft", it: "aria", en: "air" },
    terms: {
      de: {
        singular: "der Heißluftballon",
        plural: "die Heißluftballons",
      },
      it: { singular: "la mongolfiera", plural: "le mongolfiere" },
      en: {
        singular: "the hot air balloon",
        plural: "the hot air balloons",
      },
    },
  },
  {
    id: "zeppelin",
    image: "/transportmittel/images_064_08fb67e223b43b2c.webp",
    category: { de: "Luft", it: "aria", en: "air" },
    terms: {
      de: { singular: "der Zeppelin", plural: "die Zeppeline" },
      it: { singular: "il dirigibile", plural: "i dirigibili" },
      en: { singular: "the airship", plural: "the airships" },
    },
  },
  {
    id: "rakete",
    image: "/transportmittel/images_065_fa9ce4ea4c21fd2a.webp",
    category: { de: "Luft", it: "aria", en: "air" },
    terms: {
      de: { singular: "die Rakete", plural: "die Raketen" },
      it: { singular: "il razzo", plural: "i razzi" },
      en: { singular: "the rocket", plural: "the rockets" },
    },
  },
  {
    id: "schiff",
    image: "/transportmittel/images_066_67c79d7c7fefde4f.webp",
    category: { de: "Wasser", it: "acqua", en: "water" },
    terms: {
      de: { singular: "das Schiff", plural: "die Schiffe" },
      it: { singular: "la nave", plural: "le navi" },
      en: { singular: "the ship", plural: "the ships" },
    },
  },
  {
    id: "boot",
    image: "/transportmittel/images_067_f6742d02da140aef.webp",
    category: { de: "Wasser", it: "acqua", en: "water" },
    terms: {
      de: { singular: "das Boot", plural: "die Boote" },
      it: { singular: "la barca", plural: "le barche" },
      en: { singular: "the boat", plural: "the boats" },
    },
  },
  {
    id: "ruderboot",
    image: "/transportmittel/images_068_39d8ef1b9b61608e.webp",
    category: { de: "Wasser", it: "acqua", en: "water" },
    terms: {
      de: { singular: "das Ruderboot", plural: "die Ruderboote" },
      it: { singular: "la barca a remi", plural: "le barche a remi" },
      en: { singular: "the rowing boat", plural: "the rowing boats" },
    },
  },
  {
    id: "segelboot",
    image: "/transportmittel/images_069_94faaa40a97bc739.webp",
    category: { de: "Wasser", it: "acqua", en: "water" },
    terms: {
      de: { singular: "das Segelboot", plural: "die Segelboote" },
      it: { singular: "la barca a vela", plural: "le barche a vela" },
      en: { singular: "the sailing boat", plural: "the sailing boats" },
    },
  },
  {
    id: "motorboot",
    image: "/transportmittel/images_070_88e3eee09b219020.webp",
    category: { de: "Wasser", it: "acqua", en: "water" },
    terms: {
      de: { singular: "das Motorboot", plural: "die Motorboote" },
      it: { singular: "il motoscafo", plural: "i motoscafi" },
      en: { singular: "the motorboat", plural: "the motorboats" },
    },
  },
  {
    id: "faehre",
    image: "/transportmittel/images_071_841accb43d9fd451.webp",
    category: { de: "Wasser", it: "acqua", en: "water" },
    terms: {
      de: { singular: "die Fähre", plural: "die Fähren" },
      it: { singular: "il traghetto", plural: "i traghetti" },
      en: { singular: "the ferry", plural: "the ferries" },
    },
  },
  {
    id: "uboot",
    image: "/transportmittel/images_072_eaa57f2f0e6918ec.webp",
    category: { de: "Wasser", it: "acqua", en: "water" },
    terms: {
      de: { singular: "das U-Boot", plural: "die U-Boote" },
      it: { singular: "il sottomarino", plural: "i sottomarini" },
      en: { singular: "the submarine", plural: "the submarines" },
    },
  },
  {
    id: "kanu",
    image: "/transportmittel/images_073_88c4b4d423c67252.webp",
    category: { de: "Wasser", it: "acqua", en: "water" },
    terms: {
      de: { singular: "das Kanu", plural: "die Kanus" },
      it: { singular: "la canoa", plural: "le canoe" },
      en: { singular: "the canoe", plural: "the canoes" },
    },
  },
  {
    id: "seilbahn",
    image: "/transportmittel/images_074_6c4f8df76aa77970.webp",
    category: { de: "Berg & Schnee", it: "montagna e neve", en: "mountains" },
    terms: {
      de: { singular: "die Seilbahn", plural: "die Seilbahnen" },
      it: { singular: "la funivia", plural: "le funivie" },
      en: { singular: "the cable car", plural: "the cable cars" },
    },
  },
  {
    id: "schlitten",
    image: "/transportmittel/images_075_df402b3ac070e831.webp",
    category: { de: "Berg & Schnee", it: "montagna e neve", en: "mountains" },
    terms: {
      de: { singular: "der Schlitten", plural: "die Schlitten" },
      it: { singular: "la slitta", plural: "le slitte" },
      en: { singular: "the sledge", plural: "the sledges" },
    },
  },
];

export const VEHICLE_BY_ID = new Map(VEHICLES.map((vehicle) => [vehicle.id, vehicle]));
