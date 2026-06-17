# SCHWITZWERK — Projektstand (Stand: 15. Juni 2026)

Cinematic 3D-Scroll-Website für **SCHWITZWERK** (Premium-Fasssaunen einer Manufaktur).
Marke: Schwitzwerk · Betreiber: **Glarehair GmbH**, Kreherstr. 11, 09126 Chemnitz.

---

## 1. Schnellstart / Lokal ansehen

```bash
cd "/Users/szabo/Documents/Claude Projekte/schwitzwerk"
python3 -m http.server 8723
# → http://localhost:8723
```
Alternativ Doppelklick auf `Launch Demo.command`. Server stirbt im Idle.

> Hinweis: Ordner liegt unter iCloud-„Documents". Der Claude-Preview-MCP kann hier KEINEN
> Server starten (Sandbox: `getcwd`/`chdir` „Operation not permitted"). Verifikation läuft
> per `curl` gegen den manuell gestarteten Python-Server auf `:8723`.

---

## 2. Branding / Design-System (styles.css `:root`)

| Token | Wert | Verwendung |
|---|---|---|
| `--bg` | `#08070a` | Haupt-Hintergrund (fast schwarz) |
| `--bg-2` | `#0e0d11` | Karten/Boxen |
| `--ink` | `#f3efe7` | Haupttext (warmweiß) |
| `--ink-dim` | `#a9a39a` | Sekundärtext |
| `--gold` | `#c9a253` | Akzent gold |
| `--gold-bright` | `#e4c178` | Gold hell (Highlights, Links) |
| `--line` | `rgba(201,162,83,0.22)` | Linien/Rahmen |
| `--serif` | „Cormorant Garamond" | Headlines |
| `--sans` | „Jost" | Fließtext |

Stil: dunkel, gold, edel-handwerklich, skandinavisch. Nav transparent, Logo `assets/logo_white.png` (weiß, 62px).
**Wichtig: Dieses Design bleibt unverändert — neue Seiten immer mit derselben styles.css/Nav/Footer bauen.**

---

## 3. Dateien

```
schwitzwerk/
├── index.html          ← Startseite (Scroll-Cinematic)
├── impressum.html      ← Rechtsseite
├── datenschutz.html    ← Rechtsseite
├── agb.html            ← Rechtsseite
├── widerruf.html       ← Rechtsseite
├── styles.css          ← geteiltes Stylesheet (inkl. .legal*-Block)
├── scroll-cinematic.js ← Scroll-Engine (Canvas-Frame-Scrub)
├── PROJEKT.md          ← dieses Dokument
├── Launch Demo.command
├── frames/             ← vipcube, zuber, orbit, pushin (je ~179 JPGs)
├── assets/             ← mp4s, logos, Start-Frames
└── downloads/          ← 4 benannte mp4s zum Download
```

### Startseiten-Sektionen (index.html, in Reihenfolge)
Nav → Hero (#hero, VIP-Cube-Sauna Push-in, mit Text) → Intro-Band → Story/Manufaktur (#story, „Der Saunaprofi" + 4 Fakten) → Badezuber (#zuber, Deckel öffnet, Top-Reveal) → Ausstattung-Grid (6 Features) → Orbit (#features, 360°, ohne Text) → CTA → Google-Rezensionen (5,0 / 24, 3 echte) → Standort/Map (graustufig) → Footer.

### 3D-Frame-Scrub (`window.SCRUB_SECTIONS` unten in index.html)
`#hero→frames/vipcube`, `#zuber→frames/zuber`, `#features→frames/orbit` (je 179 Frames, `frame_0001.jpg` …).
Canvas-Fit in scroll-cinematic.js `draw()`: immer volle Breite, vertikal zentriert (Letterbox statt Beschnitt).

---

## 4. Rechtsseiten (alle fertig ✓)

Alle 4 Rechtsseiten teilen Layout, Nav, Footer, Sprachauswahl und die `.legal*`-Styles in styles.css.
Aufbau je Seite: `nav.scrolled` → `main.legal` (Header `.legal-head` + `.legal-block`-Sektionen + `.legal-back`) → Footer → i18n-Script → reveal-on-scroll IntersectionObserver.

| Seite | Quelle | Inhalt |
|---|---|---|
| `impressum.html` | schwitzwerk.de/impressum | Glarehair GmbH, Kreherstr. 11, 09126 Chemnitz · HRB 33063 AG Chemnitz · vertr. Katarzyna Szablowski · Tel. 0176 306 505 45 · post@schwitzwerk.de · USt-IdNr. DE330866693 · Standorte Sachsen + Brandenburg · EU-Streitschlichtung · Haftung Inhalte/Links · Urheberrecht |
| `datenschutz.html` | schwitzwerk.de/datenschutzerklaerung | Verantwortl. Glarehair · Hosting OVH GmbH Köln · Rechte (Widerruf/Beschwerde/Portabilität/Auskunft) · SSL/TLS · Cookies · Consent Usercentrics · Kontaktformular · Google Analytics/Ads, Meta-Pixel, Google Maps, Google Fonts (lokal) |
| `agb.html` | `AGB_Schwitzwerk.docx` | § 1–§ 13: Geltungsbereich, Vertragsabschluss, Preise (50 % Anzahlung / 50 % bar bei Lieferung), Lieferung (6–12 Wo, bis Bordsteinkante), Gefahrübergang, Eigentumsvorbehalt, Gewährleistung 2 J, Widerrufsrecht §312g, Haftung, Aufstellung/Betrieb, Datenschutz, ODR/Recht, Schluss. Widerrufsbelehrung als `.legal-callout`-Box |
| `widerruf.html` | schwitzwerk.de/widerrufsbelehrung | Widerrufsrecht 14 Tage, Folgen (Rückzahlung/Rücksendung/Kosten/Wertminderung), Ausschluss §312g (Maßanfertigung), Muster-Widerrufsformular (`.legal-callout`-Box) |

**Wichtige Daten-Entscheidung:** Adresse durchgängig **Kreherstr. 11** (Live-Widerrufsseite hatte Tippfehler „Kreherstr. 1").

### Footer-Verlinkung (auf allen Seiten identisch)
- Impressum → `impressum.html`
- Datenschutzerklärung → `datenschutz.html`
- AGB → `agb.html`
- Widerrufsbelehrung → `widerruf.html`
- **Versandarten → noch extern (`https://www.schwitzwerk.de`) = OFFEN**

---

## 5. i18n / Sprachauswahl (DE/EN/FR/RU/PL)

- Dropdown in der Nav neben „Jetzt shoppen". DE = Original-innerHTML, Auswahl in `localStorage` (`sw_lang`).
- Jede Seite hat ihr eigenes `I18N`-Wörterbuch im `<script>` am Seitenende; alle übersetzbaren Texte tragen `data-i18n`-Keys.
- **Konvention:** Startseite + Datenschutz + Widerruf = Volltext übersetzt. Impressum + AGB = nur Überschriften/Chrome übersetzt, rechtsverbindlicher Gesetzestext bleibt Deutsch.
- **Bei Textänderungen müssen die Übersetzungen in allen 4 Sprachen mitgepflegt werden.**

---

## 6. Weitere Detail-Entscheidungen

- Rezensionen: echte Google-Daten (5,0 / 24, 3 Original-Rezensionen). Live-Laden via Places API vorbereitet (`window.GOOGLE_MAPS_API_KEY` leer = graue Platzhalter). Google CID `0x47a74fa7bc23c953:0x3bfa4d0c3751401f`, Standort Gornau/Erzgeb.
- Footer-Standort: nur **Sachsen** (Brandenburg in der Startseite entfernt; im Impressum sind beide gelistet).
- Higgsfield-Clips: `seedance_2_0` (1080p); VIP-Cube final via `grok_video_v15` 720p + ByteDance-Upscale.

## 7. Regeln (User)

- **Netlify/out-Export & Vorschau-ZIP NICHT automatisch bauen — nur auf Anfrage.**
- **Bestehendes Design nicht verändern** — nur additiv erweitern.

## 8. Offene Punkte

- [ ] **Versandarten**-Seite (`versand.html`) im gleichen Stil — Daten z. B. aus AGB § 4 oder separate Quelle.
- [ ] Mobil-Feinschliff (Cinematic-Sektionen < 560vh, Overlay-Text kompakter).
- [ ] Map-Sprache an i18n koppeln.
- [ ] Optional echten Google-Places-API-Key einsetzen.
