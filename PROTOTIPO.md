# TRIFLAPS Serie 01: Transportmittel

Questa cartella contiene il prototipo funzionante della futura serie TRIFLAPS.

## Stato della Serie 01

- 50 mezzi di trasporto
- carte in tedesco, italiano e inglese
- articolo, singolare e plurale in ogni lingua
- 200 file audio già collegati
- modalità singolo, due giocatori e online
- punteggio e classifica
- layout adattabile a cellulare, tablet e desktop
- prima schermata con nome del bambino e scelta tra italiano, tedesco e inglese
- interfaccia completa nella lingua scelta

## Identità visiva fissa della serie

Ogni serie TRIFLAPS conserva tre elementi originali riconoscibili:

1. Flaps bianco con il cuore rosa;
2. il divano verde classico con finiture dorate;
3. la casa di Flaps con la campanella.

Questi elementi compaiono nella schermata iniziale, nel menu e in forma compatta durante il gioco. Flaps è la guida, il divano identifica il suo mondo e la casa riporta al menu principale.

Lo sfondo principale approvato è il paesaggio acquerellato di Flaps: casa, divano e Flaps occupano il lato sinistro, mentre il prato sul lato destro resta libero per menu e comandi. I dorsi delle carte sono tutti chiari color avorio; la lingua si distingue tramite Flaps con il simbolo nazionale, la sigla DE, IT o EN e un sottile bordo colorato.

Il nome del bambino e la lingua scelta vengono ricordati sul dispositivo e possono essere modificati in qualsiasi momento.

## Dove conservare il progetto

Conservare sempre due copie:

1. la versione online, che mantiene la cronologia delle modifiche;
2. il file ZIP `TRIFLAPS_Transportmittel_PROTOTIPO`, da archiviare sul computer e su un disco o spazio cloud di backup.

La Serie 01 non va sovrascritta quando viene approvata. Per creare la Serie 02 si duplica la base tecnica e si sostituiscono soltanto tema, vocaboli, immagini e audio.

## Struttura consigliata della collana

```text
TRIFLAPS_SERIE_MASTER/
  00_CORE_MASTER/
  01_SERIE_TRANSPORTMITTEL/
  02_SERIE_NUOVO_TEMA/
  03_SERIE_NUOVO_TEMA/
```

`00_CORE_MASTER` è la base riutilizzabile. `01_SERIE_TRANSPORTMITTEL` è il prototipo e la prima serie completa.

## Convenzione audio

Ogni carta usa lo stesso ID per dati, immagine e audio.

```text
public/audio/transportmittel/
  de/<id>-singular.mp3
  de/<id>-plural.mp3
  it/<id>.mp3
  en/<id>.mp3
```

I file italiani e inglesi contengono singolare, una pausa di un secondo e plurale. I file tedeschi mantengono singolare e plurale separati, come nella V202 originale.

Il gioco interrompe sempre la voce precedente prima di riprodurne un'altra.

## Passaggio alla versione commerciale

Il prototipo resta la base di riferimento. La versione da vendere dovrà essere pubblicata separatamente con dominio, accesso clienti, condizioni di utilizzo, privacy e collegamento al sistema di vendita scelto.

## V1.3 estetica approvata 26.09.2026
- Base tecnica: v1.2, logica di gioco invariata.
- Menu principale sostituito con la grafica TRIFLAPS approvata.
- Inserite schermate approvate 1 Spieler, 2 Spieler, Online spielen come introduzione cliccabile prima dei setup tecnici.
- Inserita grafica Rangliste approvata tra gli asset, mentre la classifica funzionale resta dinamica.
- Nessuna nuova grafica inventata: sono usate esclusivamente le immagini approvate nella conversazione.
- Meccanica invariata: trio dello stesso veicolo DE/IT/EN.
