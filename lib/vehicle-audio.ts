import type { Language, Vehicle } from "@/lib/vehicles";

/**
 * Convenzione audio del prototipo TRIFLAPS.
 *
 * Tedesco: due file separati, singolare e plurale.
 * Italiano e inglese: un file per carta con una pausa interna di un secondo.
 * Le serie future possono riutilizzare la stessa struttura di cartelle.
 */
export function getRecordedVehicleAudioFiles(
  vehicle: Vehicle,
  language: Language,
): string[] {
  const base = `/audio/transportmittel/${language}/${vehicle.id}`;

  if (language === "de") {
    return [`${base}-singular.mp3`, `${base}-plural.mp3`];
  }

  return [`${base}.mp3`];
}
