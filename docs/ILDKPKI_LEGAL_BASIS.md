# Baza Ligjore dhe Protokolli i Auditimit për ILDKPKI (PARAGON® D2)

**Dokument Rregullator i Brendshëm — NOVARIC® Media & Governance Intelligence**  
**Data e Miratimit:** 15 Shtator 2026  
**Statusi:** Aktiv / I detyrueshëm për të gjitha modulet e tërheqjes së të dhënave (P2 Pipeline)

---

## 1. Kuadri Ligjor i Zbatueshëm (Republika e Shqipërisë)

Tërheqja, përpunimi dhe auditimi i deklaratave të pasurisë dhe interesave private të funksionarëve të zgjedhur bazohet rigorozisht në legjislacionin në fuqi të Republikës së Shqipërisë:

1. **Ligji Nr. 9049, datë 10.04.2003** *"Për deklarimin dhe kontrollin e pasurive, të detyrimeve financiare të të zgjedhurve dhe të disa nëpunësve publikë"*, i ndryshuar:
   - **Neni 4:** Përcakton subjektet deklaruese, përfshirë deputetët e Kuvendit të Shqipërisë dhe anëtarët e Këshillit të Ministrave.
   - **Neni 34 (Transparenca dhe e drejta e publikut për t'u njohur me deklaratat):** Deklaratat e pasurisë të personave të zgjedhur janë dokumente publike dhe çdo person ose organizatë ka të drejtë të njihet me përmbajtjen e tyre, në përputhje me procedurat e përcaktuara.

2. **Ligji Nr. 119/2014** *"Për të Drejtën e Informimit"*:
   - Garanton të drejtën e publikut dhe medias për të aksesuar të dhëna zyrtare të krijuara ose të mbajtura nga organet publike (ILDKPKI).

3. **Ligji Nr. 9887, datë 10.03.2008** *"Për Mbrojtjen e të Dhënave Personale"*, i ndryshuar:
   - Të dhënat konfidenciale (si numri personal i identifikimit NID/ID card, adresat e banimit privat, të dhënat bankare konfidenciale si IBAN/numra llogarie, dhe të dhënat e të miturve) **NUK** publikohen dhe redaktohen përpara paraqitjes në sistem.
   - Përpunohen vetëm vlerat totale, llojet e aseteve, dhe statusi i dorëzimit në afat/jashtë afatit.

---

## 2. Protokolli Teknik i Qasjes (Automated Ingestion Protocol)

Përpara çdo veprimi scraping ose tërheqjeje të të dhënave nga portali i ILDKPKI (`http://www.ildkpki.al`):

### Hapi 1: Kontrolli Paraprak i `robots.txt` dhe Termave të Shërbimit
- Sistemi **DUHET** të kontrollojë skedarin `robots.txt` në rrënjën e domenit të ILDKPKI.
- Nëse rrugët e deklaratave janë të lejuara, tërheqja vijon me shpejtësi të kufizuar (rate-limited).
- Nëse ka kufizime, sistemi ndalon menjëherë procesin automatik dhe raporton nevojën për qasje nëpërmjet kërkesës zyrtare të informacionit (FoI).

### Hapi 2: Përparësi Eksporteve Zyrtare dhe Të Dhënave të Hapura
- Sistemi i jep përparësi absolute skedarëve të strukturuar zyrtarë (Open Data Albania, Fletorja Zyrtare, publikimet vjetore në format CSV/XLSX/PDF të ILDKPKI).
- Web scraping zbatohet **VETËM** si mekanizëm dytësor kur mungon eksporti i strukturuar, duke ruajtur gjithnjë kopjen e pandryshuar (raw snapshot).

### Hapi 3: Ruajtja e Provueshmërisë (Provenance & Audit Trail)
Çdo rekord i ruajtur në bazën e të dhënave për dimensionin D2 duhet të përmbajë:
1. `snapshot_url`: URL-ja e saktë nga u tërhoq deklarata ose buletini zyrtar.
2. `retrieval_date`: Data dhe ora ekzakte e marrjes (ISO 8601).
3. `sha256_hash`: Hash-i kriptografik i dokumentit origjinal për garantimin e paprekshmërisë.
4. `legal_basis_ref`: Referenca te ky dokument (`docs/ILDKPKI_LEGAL_BASIS.md`).
5. `clean_null_fallback`: Në mungesë të një deklarate të verifikueshme, vlera mbetet `null` ("Në pritje të auditimit") dhe kurrë nuk fabrikohet.

### Hapi 4: Orari Jashtë-Pikut (Off-Peak Crawling)
- Të gjitha kërkesat e sinkronizimit me serverat e ILDKPKI kryhen jashtë orarit zyrtar të punës (22:00 – 06:00 UTC) me një vonesë minimale prej 2.0 sekondash mes kërkesave për të mos ngarkuar infrastrukturën publike.

---

## 3. Matrica e Përgjegjësisë

| Fusha | Përshkrimi | Burimi i Verifikuar |
| :--- | :--- | :--- |
| `asset_declaration_on_time` | Dorëzimi brenda afatit ligjor (31 Mars të çdo viti) | Regjistri vjetor i ILDKPKI |
| `asset_audit_clean` | Mbyllja e kontrollit të plotë pa masa administrative | Raportet vjetore të ILDKPKI para Kuvendit |
| `snapshot_url` | Adresa zyrtare e dokumentit/buletinit | Portali ILDKPKI / Arkivi Zyrtar |
| `retrieval_date` | Timestamp i saktë i marrjes | Sistemi Ingestion NOVARIC |
