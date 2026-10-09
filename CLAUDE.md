# E4 Partners — website

Statische marketingsite voor E4 Partners, een recruitmentbureau in Haarlem (NL) dat
organisaties in alle sectoren bedient. Tien pagina's, tweetalig NL/EN.

> **Geen sectorspecialisme.** E4 bedient organisaties in elke sector. Noem in de copy
> geen specifieke branche als specialisme.

Dit bestand is de context voor iedereen — mens of AI — die aan deze site werkt.
Lees het voordat je wijzigingen maakt: er staan keuzes in die bewust zo zijn.

---

## 1. Technische uitgangspunten

**Geen build step, geen framework, geen dependencies.** Platte HTML met één gedeeld
CSS-bestand en één gedeeld JS-bestand. Geen npm, geen bundler, geen preprocessor.
Dit is een expliciete keuze om het onderhoud laagdrempelig te houden.

Enige externe resource: Google Fonts (Inter Tight, Inter, Noto Sans Symbols 2).

**Lokaal draaien** — moet via een server, want alle interne links zijn root-relatief:

```bash
cd "E4 Partners Site"
python3 -m http.server 8000
# open http://localhost:8000
```

Een HTML-bestand rechtstreeks vanaf schijf openen werkt niet: `/diensten` resolvet dan niet.

---

## 2. Structuur

```
.
├── index.html                              homepage
├── CLAUDE.md                               dit bestand
├── netlify.toml                            build- en headerinstellingen
├── sitemap.xml, robots.txt
├── assets/
│   ├── css/styles.css                      ALLE styling
│   ├── js/main.js                          ALLE gedrag
│   └── img/
│       ├── logos/                          14 klantlogo's (marquee)
│       ├── hero.jpg                        hero-achtergrond (CSS background)
│       ├── dienst-1|2|3.jpg                dienstfoto's (kaart + detailpagina)
│       ├── team-*.jpg                      3 partnerportretten
│       ├── favicon-32|512.png, apple-touch-icon.png
│       └── og-image.jpg                    social preview (1200×630)
├── diensten/
│   ├── index.html                          overzicht + dienstenmatrix
│   ├── recruitment-process-outsourcing/
│   ├── interim-recruitment/
│   └── werving-selectie/
├── over-ons/                               team + strategieblok
├── contact/                                formulier + gegevens
├── cases/                                  4 klantquotes
├── privacybeleid/                          noindex
└── algemene-voorwaarden/                   noindex
```

**Let op:** nav- en footer-markup staat in élk HTML-bestand herhaald (geen templating).
Wijzig je daar iets, dan moet dat in alle tien de bestanden — gebruik zoek-en-vervang.

---

## 3. Design system

Alle kleuren lopen via CSS-variabelen in `:root` (`assets/css/styles.css`).
**Hardcode nooit hexwaarden** — gebruik de tokens.

```css
--bg:          #0B1628   /* inkt-navy: hero, donkere secties, footer */
--bg-2:        #111F38   /* iets lichter navy: contact/CTA */
--fg:          #FAF6EE   /* crème-wit: tekst op donker */
--muted:       #8E97A8   /* secundaire tekst op donker */
--light:       #FAF6EE   /* lichte secties */
--white:       #FFFFFF   /* kaarten op licht, logobanner */
--on-light:    #0B1628   /* tekst op licht */
--text-dark:   #4F586B   /* secundaire tekst op licht */
--accent:      #2E4B78   /* staalnavy: knoppen, labels, E4-blok */
--accent-ink:  #2E4B78   /* accent als tekst op licht */
--accent-glow: #A3B6D6   /* accent als tekst op donker */
```

**Palet:** inkt-navy + crème-wit met staalnavy als accent. De keuze voor navy is na
meerdere rondes bewust gemaakt. Introduceer geen extra kleur zonder overleg.

**Vorm — vaste keuzes, overal hetzelfde:**
- `--radius: 16px` voor alle blokken, foto's, kaarten en invoervelden
- `--pill: 999px` voor knoppen, tags, chips en tabs
- Secties zijn altijd volle breedte (donker of licht) en nooit zelf afgerond
- Inhoud maximaal `--maxw: 1240px`, gecentreerd via `--pad-x`; sectieruimte `--section-y`

**Typografie:** Inter Tight voor koppen (`--disp`), Inter voor lopende tekst (`--font`).
Koppen: medium (500), zinsbouw, strak gespatieerd. Beide gratis via Google Fonts, dus
geen licentie nodig en voor elke bezoeker hetzelfde beeld. Wil je ooit een ander font,
dan zijn alleen `--disp` en `--font` in `:root` nodig — alle typografie loopt daarlangs.

**Schaken als knipoog:** zetnotatie in de werkwijze en de "Goede zet"-bevestiging.
De hero toont een schaakbord (`hero.jpg`, op alle tien de pagina's dezelfde foto).
Houd de verwijzing subtiel.

> `og-image.jpg` sluit nog niet aan op de hero. Wie de social preview wil laten
> matchen, maakt daar een uitsnede van `hero.jpg` van (1200×630).

**Beeld: foto's staan in kleur, logo's in grijstinten.** Sinds oktober 2026 staan alle
foto's — de partnerportretten, de dienstfoto's, de sfeerfoto's op de homepage en Over
ons — gewoon in kleur. Eerder lag er een `filter: grayscale(1)` overheen; dat is er
bewust afgehaald. Zet het niet terug zonder overleg.

De **klantlogo's** blijven wél grijs, in de marquee op de homepage en op de
cases-pagina. Veertien merklogo's in hun eigen kleuren naast elkaar wordt rommelig en
trekt de aandacht weg van de tekst.

Foto's zijn 2000px breed op kwaliteit 80 — de breedbeeldfoto's op de dienstpagina's
staan tot 1240px in beeld, dus met minder resolutie ogen ze zichtbaar zacht op een
scherp scherm. Het verschil in bestandsgrootte tussen kwaliteit 68 en 80 is klein,
want het gewicht zit in de resolutie.

De uitsnede van de breedbeeldfoto's (`.section-photo img`) staat per dienst apart
ingesteld. Een láger percentage in `object-position` toont meer van de bovenkant van
de foto, een hóger percentage meer van de onderkant.

**Responsive breakpoints:** 1024px (tablet) en 768px (mobiel). Enkele componenten
gebruiken 900px of 560px waar dat beter uitkomt.

---

## 4. Conventies

### Tweetaligheid (NL/EN)

Elk vertaalbaar element krijgt **beide** attributen:

```html
<h2 data-nl="Onze diensten" data-en="Our services">Onze diensten</h2>
```

`main.js` wisselt de inhoud bij een klik op de taalknop en onthoudt de keuze in
`localStorage` onder de sleutel `e4-lang`. Voor `<meta>`-tags wordt het `content`-attribuut
gezet in plaats van de inhoud.

> **Voeg je tekst toe, geef die dan altijd beide attributen.** Anders blijft die
> Nederlands staan in EN-modus. Dat is eerder misgegaan met de dienstnaam
> "Werving & Selectie" (EN: "Recruitment & Selection").

`<title>`-tags worden **niet** vertaald — bewuste beperking van de huidige opzet.

### Tone of voice

De hele site spreekt de lezer aan met **"je"** en **"jouw"** — persoonlijk, informeel,
geen "u". Alleen het privacybeleid houdt de juridische u-vorm aan.

Vaste formuleringen, overal hetzelfde:

| Waar | Tekst |
|---|---|
| Contactblok op elke pagina | "Vertel ons welk vraagstuk er speelt. We denken graag met je mee." |
| Label berichtveld | "Welk vraagstuk speelt er?" |
| Bevestiging na verzenden | "Goede zet, bedankt. We nemen snel contact op." |
| Footer-tagline | "De juiste zet in recruitment" |

De dienstomschrijvingen staan op vier plekken (homepage-accordeon, dienstenkaarten,
matrix-omschrijvingen, meta-descriptions) en zijn **woordelijk gelijk**. Wijzig je er
één, wijzig ze dan alle vier.

Woordkeuze: "oplossing" (niet "vorm" of "opening"), "behoefte", "vraagstuk" (niet "rol
of vraag"). Werving & Selectie gaat over **snelheid** op urgente vacatures, niet alleen
over kwaliteit.

### Cases

Vier echte klantquotes, in het ritme groot – twee klein – groot. De laatste kaart heeft
de class `mirror`: logo en bron staan rechts, het citaat links. Dat geeft de reeks ritme
zonder dat de DOM-volgorde verandert; op mobiel draait de spiegeling vanzelf terug.

De placeholderkaarten en de knop "Bekijk meer cases" zijn in oktober 2026 verwijderd,
inclusief de bijbehorende CSS en de JS-module. Komen er cases bij, voeg dan gewoon een
`<article class="case-card">` toe en houd het ritme aan.

Logo's in de kaarten zijn genormaliseerd op **gelijk vlak**, niet op gelijke hoogte.
Een breed woordmerk op dezelfde hoogte als een vierkant beeldmerk oogt veel zwaarder —
daarom heeft Follo een eigen hoogte. Voeg je een logo toe, meet dan `width × height`
in de browser en vergelijk met de bestaande (~4200 px² op een grote kaart).

### Links

Alle interne links zijn root-relatief: `/diensten`, `/contact`.
Asset-verwijzingen zijn juist relatief: `../assets/…` afhankelijk van de mapdiepte.

### Afbeeldingen

Alle `<img>` buiten de `<nav>` hebben `loading="lazy"`. Nav-logo's bewust niet
(direct zichtbaar). Alle afbeeldingen hebben een `alt`.

Wissel je een foto, geef de URL dan een versienummer (`hero.jpg?v=3`). Anders blijven
terugkerende bezoekers de oude foto uit hun cache zien. Hetzelfde geldt voor
`styles.css` en `main.js`, die allebei een `?v=` achter zich hebben staan.

---

## 5. De drie diensten

Gepresenteerd in deze volgorde — overal op de site consistent aanhouden
(accordion, dienstenkaarten, matrix-tabs, footer, "overige diensten"):

| # | Dienst | Slug | Tariefmodel |
|---|---|---|---|
| 1 | Recruitment Process Outsourcing | `/diensten/recruitment-process-outsourcing` | vaste maandfee |
| 2 | Interim Recruitment | `/diensten/interim-recruitment` | uurtarief |
| 3 | Werving & Selectie | `/diensten/werving-selectie` | no cure no pay |

### Dienstenmatrix (`/diensten`)

Vijf factoren waarop de diensten scoren. Waarden staan in `main.js` als `VALS`
(percentages, 0–100), in deze volgorde:

1. Vacaturevolume
2. Integratie in je organisatie
3. Snelheid van impact
4. Continuïteit — van de wervingskracht, niet van de plaatsing
5. Kosten per hire — **hoog betekent hier duurder**, niet beter

```js
var VALS = { rpo: [75,60,25,90,20], ir: [75,95,80,50,50], ws: [20,10,80,25,80] };
```

> **Eén rij leest tegen de richting in.** Op alle rijen betekent hoog "meer", behalve
> op *Kosten per hire*, waar hoog duurder betekent. Bewuste keuze: liever eerlijk over
> de prijs dan een as omdraaien.

De matrix opent standaard op RPO (de eerste dienst) — onderaan diezelfde module staat
`select('rpo')`. Wijzig je de dienstenvolgorde, pas dan ook die regel aan.

**Ontwerpprincipe:** elke dienst scoort ergens hoog, zodat de matrix als profiel leest
en niet als ranglijst. RPO wint op continuïteit, Interim op integratie, Werving &
Selectie op snelheid van impact. Houd dat principe intact als je factoren aanpast.

---

## 6. JavaScript (`assets/js/main.js`)

Alles vanilla, geen libraries. Modules, in volgorde:

| Module | Werking |
|---|---|
| Scroll-nav | `nav.scrolled` na 80px scroll (transparant → donker navy) |
| Mobiel menu | hamburger opent overlay; `z-index: 200` boven de nav (100) |
| Taalwissel | `data-nl`/`data-en`, bewaard in localStorage |
| Formulieren | inline POST naar Netlify + bevestiging in beeld |
| Diensten-accordion | homepage, één rij tegelijk open |
| Dienstenmatrix | `/diensten`, tabs verschuiven de stippen |
| Scroll-reveal | IntersectionObserver, faded elementen in |
| Logo-marquee | dupliceert de logoset voor een naadloze loop |

### Scroll-reveal: sloop deze check niet

```js
if (e.isIntersecting || e.boundingClientRect.top < 0) { … }
```

Zonder `e.boundingClientRect.top < 0` blijven secties die je voorbij scrolt (of
voorbijspringt) **permanent onzichtbaar** op `opacity: 0`. Dit was een echte bug.

De `.reveal`-class wordt door JS toegevoegd, niet in de HTML — zonder JS blijft alle
content dus gewoon zichtbaar. Houd dat zo.

---

## 7. Formulieren (Netlify Forms)

Drie formulieren, elk met een **unieke naam** en een honeypot (`bot-field`):

| Naam | Waar |
|---|---|
| `contact` | contactpagina |
| `contact-home` | CTA onderaan homepage |
| `contact-cases` | CTA onderaan cases |

Ze werken **pas na deploy op Netlify**. Lokaal gebeurt er niets bij verzenden.
Bevestigingstekst: "Goede zet, bedankt. We nemen snel contact op."

> **Formulierdetectie moet apart aangezet worden** in Netlify onder
> *Site configuration → Forms*, en daarna moet de site één keer opnieuw deployen.
> Netlify scant de HTML op formulieren tijdens de build; staat die schakelaar uit,
> dan doen alle drie de formulieren niets.

> **Staat die detectie aan, dan haalt Netlify `data-netlify` en `netlify-honeypot`
> uit de HTML.** `main.js` selecteert daarom op het verborgen `form-name`-veld en
> niet op `data-netlify`. Doe je dat laatste toch, dan werkt het formulier lokaal
> prima en live niet: de bezoeker verlaat de pagina en ziet de bevestiging nooit.
> Dit is in oktober 2026 een keer live misgegaan.

Build- en headerinstellingen staan in `netlify.toml`: geen build command, publish
directory `.`. Die waarden winnen van wat er in de Netlify-interface staat.

---

## 8. Valkuilen

**Browsercache.** Verreweg de meest voorkomende verwarring: je wijzigt CSS of JS,
ververst, en ziet niets. Altijd `Cmd + Shift + R`.

**EXIF-rotatie bij iPhone-foto's.** `sips` en de browser interpreteren de oriëntatie
van HEIC/JPG verschillend. Een foto die in de terminal liggend lijkt, kan in de browser
staand renderen. Controleer nieuwe foto's altijd in de browser, niet alleen op afmetingen.

**Root-relatieve links.** Zie sectie 1 — altijd via een lokale server draaien.

**Originele foto's zitten niet in de repo.** De hoge-resolutie bronbestanden staan
buiten het project. Nodig je een andere uitsnede of een groter formaat, vraag ze op
bij een van de partners.

---

## 9. Bedrijfsgegevens

```
E4 Partners
Bingerweg 18F, 2031 JK Haarlem
info@e4partners.nl
KvK 93449852
```

> **Geen telefoonnummer op de site.** Contact loopt uitsluitend via e-mail en de
> formulieren. Voeg geen nummer toe.

Partners: Gerard Kock, Karim Elbaz, Jens Winkel.

De naam verwijst naar de schaakopening e4 — "de juiste openingszet". Die metafoor
komt terug in de copy ("De juiste zet in recruitment", "Goede zet, bedankt").

---

## 10. Werkwijze met Git

Werk lokaal, commit en push via GitHub Desktop.

- **Voor je begint:** Fetch / Pull
- **Als je klaar bent:** Push
- Push liever vaker en kleiner dan één keer per dag

Git voegt wijzigingen automatisch samen zolang jullie niet dezelfde regels in hetzelfde
bestand aanpassen. **Grootste conflictrisico:** `assets/css/styles.css`, omdat de hele
site daarop draait. Stem even af als je aan de styling gaat werken.

Zodra Netlify gekoppeld is, zet **elke push naar `main` de site live**. Push dus geen
halve wijziging.
