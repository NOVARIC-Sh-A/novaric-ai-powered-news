# PARAGON® metodologjia v0.2 [PARAGON® methodology v0.2]

Statusi [Status]: **Draft metodologjik, 1 nëntor 2026** [Methodological draft, 1 November 2026].

Versioni [Version]: `methodology_v0.2_2026-11-01`. Teksti i v0.1 ruhet i paprekur te `docs/paragon/PARAGON_METHODOLOGY_v0.1.md`. Ky dokument nuk e rishkruan atë, as `docs/PARAGON_ASERTIVITETI.md`, `docs/PARAGON_REMAINING_DIMENSIONS.md` ose `docs/PARAGON_METHODOLOGY_v2.md`.

Porta e publikimit mbetet e mbyllur [The publication gate stays fail-closed]. Një numër bëhet publik vetëm me autorizim të shprehur, gjendje auditimi `published`, dhe prejardhje për atë vlerë. Skenarët e peshave, pragjet e mbulimit dhe pragjet e Krippendorff alpha janë **PROPOZIME NË PRITJE TË VENDIMIT TË BORDIT EDITORIAL** [PROPOSALS PENDING EDITORIAL BOARD DECISION]. Nuk janë koeficientë të vlerësuar [They are not validated coefficients].

Studimi i kalibrimit nuk është kryer [The calibration study has NOT been executed]. Testi i ndjeshmërisë nuk është kryer [The sensitivity test has not been run].

## 1. Përmbledhje ekzekutive [Executive summary]

Shtatë dimensionet mbeten kornizë konceptuale [The seven dimensions stay a conceptual frame]. Treguesit e tyre ripërcaktohen këtu [Their indicators are redefined here]. Matja bëhet për deputet, për rol dhe për periudhë [Measurement is per MP, per role and per period].

Tri klasa mbahen të ndara [Three classes stay separate]:

- Fakti [Fact], klasa F.
- Modeli [Model], klasa M.
- Opinioni [Opinion], klasa O. Opinioni editorial përjashtohet nga çdo llogaritje [Editorial opinion is excluded from all calculation].

Kompoziti mbetet i pezulluar [The composite stays suspended].

Njoftimi i pezullimit [Suspension notice]:

`PARAGON® — Audit në proces`

`Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave.`

`null` nuk bëhet kurrë 0 dhe nuk bëhet kurrë 50 [null never becomes 0 and never becomes 50]. Zero është vetëm një zero e matur [Zero is only a measured zero].

## 2. Klasat e burimit [Source classes]

- **F, fakt** [F, fact]. Burim parësor, me datë dhe me numërues/emërues [Primary source, with a date and a numerator/denominator].
- **A, pretendim** [A, allegation]. Vetëm statusi procedural [Procedural status only]. Prezumohet pafajësia [Presumption of innocence].
- **O, opinion** [O, opinion]. Editorial. Përjashtohet nga çdo llogaritje [Excluded from all calculation].
- **M, vlerësim modeli** [M, model estimate]. Kërkon metodë, vlerësim, pasiguri dhe auditim [Needs a method, validation, uncertainty and an audit].

Periudha e paracaktuar është 12 muaj kalendarikë, e përshtatur me datën e fillimit dhe të mbarimit të mandatit [The default period is 12 calendar months, adjusted to the mandate's start and end dates]. Të dhënat që mbajmë sot fillojnë më 2025-09-01, data e depozitimit të fletëve që kemi lexuar, dhe mbarojnë te data e verifikimit të secilit skedar. Nuk zgjatet artificialisht në 12 muaj [It is not stretched to 12 months].

Burime kandidate [Candidate sources]: Kuvendi, KQZ, ILDKPKI, KLSH, SPAK dhe vendimet e gjykatës vetëm për statusin procedural [SPAK and court rulings, procedural status only], Fletorja Zyrtare, dhe fact-check-e të dokumentuara [documented fact-checks]. Disponueshmëria e secilit burim auditohet. Nuk supozohet [Each source's availability must be audited, never assumed].

## 3. Dimensionet [Dimensions]

Asnjë dimension nuk ka pikë publike në këtë version [No dimension has a public score in this version].

### D1 Angazhimi politik [Political engagement]

Konstrukti [Construct]: sa herë deputeti merr pjesë në votim, në komisionin e vet dhe në aktivitet legjislativ që i atribuohet atij [How often the MP takes part in votes, in their own committee, and in legislative activity attributed to them].

| Treguesi [Indicator] | Burimi [Source] | Numëruesi / emëruesi [Numerator / denominator] |
|---|---|---|
| Pjesëmarrja në votim [Voting participation] | Fletë votimi, Kuvendi | Vota të hedhura / fletë votimi ku deputeti është i listuar [Votes cast / roll calls on which the MP is listed] |
| Pjesëmarrja në komision [Committee participation] | Procesverbalet e komisionit, lista «Marrin pjesë» / «Mungojnë» | I pranishëm / mbledhje të komisionit të tij ku lista e emërton [Present / meetings of their committee where the list names them] |
| Aktiviteti legjislativ [Legislative activity] | Aktet e Kuvendit, vetëm nëse propozuesi është deputeti | Nisma të atribuara / nisma të listuara në periudhë [Attributed initiatives / initiatives listed in the period] |

Periudha [Period]: nga fillimi i mandatit të regjistruar deri te data e verifikimit, brenda dritares 12-mujore kur mandati është më i gjatë [From the recorded mandate start to the verification date, inside the 12-month window when the mandate is longer].

Normalizimi [Normalization]: raporti, për atë deputet dhe atë rol. Nuk krahasohet një ministër me një deputet pa modul roli [The ratio, for that MP and that role. A minister is not compared with an MP without a role module].

E dhëna që mungon [Missing data]: `null` kur fletët nuk e emërtojnë. Nuk vendoset 0.

Shtrembërimet [Biases]: përputhja e emrit mund ta lidhë rreshtin me personin e gabuar [Name matching can attach a row to the wrong person]. Pjesëmarrja nuk mat cilësinë e votës [Participation does not measure the quality of the vote].

Statusi [Status]: **pjesërisht i matshëm** [partly measurable]. Pjesëmarrja në votim dhe në komision lexohen nga skedarët që kemi. Aktiviteti legjislativ nuk i atribuohet deputetit: aktet emërtojnë kodin e propozuesit institucional, jo anëtarin, dhe skedarët e nismës së përdorur janë 0.

### D2 Llogaridhënia [Accountability]

Konstrukti [Construct]: përmbushja e detyrimit për deklarim, përgjigjja ndaj mbikëqyrjes dhe korrigjimet e dokumentuara [Disclosure compliance, oversight responsiveness, and documented corrections].

| Treguesi [Indicator] | Burimi [Source] | Numëruesi / emëruesi [Numerator / denominator] |
|---|---|---|
| Përputhja me deklarimin në ILDKPKI [ILDKPKI disclosure compliance] | Regjistri publik i deklarimeve | Deklarime të dorëzuara në afat / deklarime të detyrueshme në periudhë [Filings on time / filings required in the period] |
| Përgjigjja ndaj mbikëqyrjes [Oversight responsiveness] | Regjistër përgjigjesh, procesverbal | Përgjigje të dokumentuara / kërkesa të dokumentuara [Documented answers / documented requests] |
| Korrigjime të dokumentuara [Documented corrections] | Burim parësor i korrigjimit | Korrigjime të regjistruara / pretendime faktike të verifikuara [Recorded corrections / verified factual claims] |

Periudha [Period]: 12 muaj, e prerë te mandati.

Normalizimi [Normalization]: për rol. Një përgjigje e kërkuar nga një ministër nuk i atribuohet një deputeti që nuk e ka atë detyrë [A reply required of a minister is not attributed to an MP who does not hold that duty].

E dhëna që mungon [Missing data]: `null`.

Shtrembërimet [Biases]: një hetim i hapur është klasë A, jo fakt i fajësisë [An open investigation is class A, not a fact of guilt].

Statusi [Status]: **NUK MATET ME TË DHËNAT AKTUALE** [NOT MEASURABLE WITH CURRENT DATA]. Nuk kemi regjistër ILDKPKI, regjistër përgjigjesh, apo korpus korrigjimesh.

### D3 Përfaqësimi [Representation]

Konstrukti [Construct]: çështje të qarkut të ngritura në seancë, nisma të lidhura me qarkun dhe konsultime të dokumentuara [Constituency issues raised in plenary, constituency-linked initiatives, and documented consultations].

| Treguesi [Indicator] | Burimi [Source] | Numëruesi / emëruesi [Numerator / denominator] |
|---|---|---|
| Çështje të qarkut në seancë [Constituency issues raised in plenary] | Procesverbal plenar | Ndërhyrje që emërtojnë çështjen e qarkut / ndërhyrje të klasifikuara [Turns that name a constituency issue / classified turns] |
| Nisma të lidhura me qarkun [Constituency-linked initiatives] | Akti, kur propozuesi është deputeti | Nisma të qarkut / nisma të atribuara [Constituency initiatives / attributed initiatives] |
| Konsultime të dokumentuara [Documented consultations] | Burim parësor i konsultimit | Konsultime me datë dhe vend / periudha [Consultations with date and place / the period] |

Pjesa e votave të partisë në qark **përjashtohet** [Party vote share is excluded]. Ajo nuk është votë parapëlqyese e deputetit [It is not the MP's preferential vote].

Periudha [Period]: 12 muaj, e prerë te mandati.

Normalizimi [Normalization]: për qark dhe për rol. Nuk ndahet e njëjta përqindje partie te çdo deputet i atij subjekti [The same party percentage is not copied onto every MP of that subject].

E dhëna që mungon [Missing data]: `null`. Aktiviteti mund të përshkruhet kur procesverbali e emërton. Cilësia e përgjithshme e përfaqësimit nuk matet [Activity can be described. Overall quality is not measurable].

Shtrembërimet [Biases]: një qark i madh prodhon më shumë rreshta pa qenë më i përfaqësuar [A large district produces more rows without being better represented].

Statusi [Status]: aktiviteti përshkruhet vetëm kur është fakt i atribuar. Cilësia e përgjithshme **nuk është e matshme** [overall quality is not measurable].

### D4 Asertiviteti, si nismë konstruktive [Assertiveness, meaning constructive initiative]

Konstrukti [Construct]: propozime thelbësore, ndjekja e nismës dhe pyetje të mbështetura në prova [Substantive proposals, initiative follow-through, and evidence-backed questions]. Vëllimi i fjalës dhe agresiviteti **përjashtohen** [Speech volume and aggression are excluded].

| Treguesi [Indicator] | Burimi [Source] | Numëruesi / emëruesi [Numerator / denominator] |
|---|---|---|
| Propozime thelbësore [Substantive proposals] | Teksti i nismës, i koduar verbërisht me rubrikë [Blind-coded rubric] | Pikë të rubrikës / pikë të mundshme të rubrikës [Rubric points / possible rubric points] |
| Ndjekja e nismës [Initiative follow-through] | Hapat e mëpasshëm në procesverbal ose në akt | Hapa të dokumentuar / nisma të hapura [Documented steps / initiatives opened] |
| Pyetje të mbështetura në prova [Evidence-backed questions] | Pyetja dhe burimi që ajo citon | Pyetje me burim të cituar / pyetje të atribuara [Questions that cite a source / attributed questions] |

Periudha [Period]: 12 muaj, e prerë te mandati.

Normalizimi [Normalization]: rubrika është e njëjtë për çdo tekst. Rezultati i modelit nuk u tregohet vlerësuesve [The model output is not shown to raters].

E dhëna që mungon [Missing data]: `null`. Numri i ndërhyrjeve dhe numri i fjalëve nuk hyjnë në këtë dimension [The intervention count and the word count do not enter this dimension].

Shtrembërimet [Biases]: një rubrikë e pakalibruar mat gjuhën e koduesit [An uncalibrated rubric measures the coder's language].

Statusi [Status]: **i pilotueshëm** [pilotable]. Rubrika nuk është regjistruar paraprakisht dhe nuk është zbatuar.

### D5 Qeverisja [Governance]

Konstrukti [Construct]: përfundimi i detyrës formale, ndjekja e gjetjeve të KLSH vetëm për rolet ekzekutive, dhe procedurat e përfunduara [Formal duty completion, KLSH audit follow-up for executive roles only, and completed procedures].

| Treguesi [Indicator] | Burimi [Source] | Numëruesi / emëruesi [Numerator / denominator] |
|---|---|---|
| Përfundimi i detyrës formale [Formal duty completion] | Akti i emërimit dhe akti i përfundimit | Detyra të përfunduara / detyra të caktuara në atë rol [Duties completed / duties assigned in that role] |
| Ndjekja e auditimit të KLSH [KLSH audit follow-up] | Raporti i KLSH, vetëm për rol ekzekutiv | Rekomandime të mbyllura / rekomandime të adresuara atij roli [Recommendations closed / recommendations addressed to that role] |
| Procedura të përfunduara [Completed procedures] | Procesverbali i procedurës | Procedura të mbyllura / procedura të hapura në periudhë [Procedures closed / procedures opened in the period] |

Periudha [Period]: koha e atij roli, brenda 12 muajve.

Normalizimi [Normalization]: modul i veçantë për çdo rol. Nuk është një shkallë e vetme për çdo deputet [A separate module for each role. Not one scale for every MP].

E dhëna që mungon [Missing data]: `null`. Pjesëmarrja në komision nuk është qeverisje dhe nuk hyn këtu [Committee attendance is not governance and does not enter here].

Shtrembërimet [Biases]: një rol pa detyrë ekzekutive do të dilte bosh dhe nuk dënohet për boshllek [A role with no executive duty would be empty and is not penalised for that emptiness].

Statusi [Status]: **NUK MATET si dimension universal** [NOT MEASURABLE as a universal dimension]. I duhet një modul sipas rolit [It needs a role-specific module]. Nuk kemi raporte KLSH.

### D6 Kohësioni [Cohesion]

Konstrukti [Construct]: nisma të përbashkëta ndër grupe, bashkëpunim në komision dhe produkte të përbashkëta [Cross-group co-initiatives, committee collaboration, and joint outputs].

| Treguesi [Indicator] | Burimi [Source] | Numëruesi / emëruesi [Numerator / denominator] |
|---|---|---|
| Nisma ndër grupe [Cross-group co-initiatives] | Akti, me emrat e propozuesve | Nisma me të paktën dy grupe / nisma të atribuara [Initiatives with at least two groups / attributed initiatives] |
| Bashkëpunimi në komision [Committee collaboration] | Procesverbali i komisionit | Pika të bashkë-raportuara / pika ku deputeti është relator ose bashkë-relator [Co-reported items / items where the MP is rapporteur or co-rapporteur] |
| Produkte të përbashkëta [Joint outputs] | Teksti i nënshkruar | Produkte me më shumë se një nënshkrues të grupeve të ndryshme / produkte të atribuara [Outputs with signatories from more than one group / attributed outputs] |

Përputhja e votës me grupin parlamentar **përjashtohet** [Group vote alignment is excluded]. Mendimi i ndryshëm i ligjshëm nuk dënohet kurrë [Legitimate dissent is never penalized].

Periudha [Period]: 12 muaj, e prerë te mandati.

Normalizimi [Normalization]: për deputet. Nuk përdoret përqindja e votave me shumicën e grupit [The share of votes with the group majority is not used].

E dhëna që mungon [Missing data]: `null`.

Shtrembërimet [Biases]: një grup i madh ka më shumë raste për të bashkë-nënshkruar [A large group has more chances to co-sign]. Kjo nuk është disiplinë votimi [This is not voting discipline].

Statusi [Status]: **pjesërisht i matshëm** [partly measurable]. Skedarët e votimit e kanë përputhjen me grupin, por ajo nuk përdoret. Nismat ndër grupe nuk janë të nxjerra si numërues i atribuar.

### D7 Narrativa, si komunikim faktik [Narrative, meaning factual communication]

Konstrukti [Construct]: pretendime të verifikueshme, korrigjime publike dhe burim i dokumentuar [Verifiable claims, public corrections, and documented sourcing]. Përqendrimi i temës **përjashtohet** [Topic concentration is excluded].

| Treguesi [Indicator] | Burimi [Source] | Numëruesi / emëruesi [Numerator / denominator] |
|---|---|---|
| Pretendime të verifikueshme [Verifiable claims] | Fjali e cituar dhe burimi që e verifikon | Pretendime të verifikuara / pretendime të kampionuara [Verified claims / sampled claims] |
| Korrigjime publike [Public corrections] | Teksti i korrigjimit | Korrigjime të publikuara / pretendime të gabuara të dokumentuara [Published corrections / documented false claims] |
| Burimi i dokumentuar [Documented sourcing] | Teksti dhe URL-ja që ai citon | Pretendime me burim / pretendime të kampionuara [Claims with a source / sampled claims] |

Periudha [Period]: 12 muaj, e prerë te mandati.

Normalizimi [Normalization]: vetëm mbi një kampion të tërhequr para se të shihen rezultatet [Only on a sample drawn before the results are seen].

E dhëna që mungon [Missing data]: `null`. Leksiku i temave nuk hyn [The topic lexicon does not enter].

Shtrembërimet [Biases]: një kampion i zgjedhur pas rezultateve e mat historinë që kërkojmë [A sample chosen after the results measures the story we went looking for].

Statusi [Status]: **NUK MATET** pa një kampion përfaqësues dhe pa verifikim të pavarur [NOT MEASURABLE without a representative sample and independent verification].

## 4. Peshat [Weighting]

Tri skenarë. Të tre janë **PROPOZIME NË PRITJE TË VENDIMIT TË BORDIT EDITORIAL** [PROPOSALS PENDING EDITORIAL BOARD DECISION], jo koeficientë të vlerësuar [not validated coefficients].

| Dimensioni [Dimension] | A, të barabarta [equal 1/7] | B, aktiviteti [activity] | C, llogaridhënia [accountability] |
|---|---:|---:|---:|
| D1 | 1/7 | 25 | 10 |
| D2 | 1/7 | 10 | 25 |
| D3 | 1/7 | 20 | 15 |
| D4 | 1/7 | 15 | 10 |
| D5 | 1/7 | 10 | 20 |
| D6 | 1/7 | 10 | 10 |
| D7 | 1/7 | 10 | 10 |

Testi i ndjeshmërisë [Sensitivity test]: tre skenarët, plus 1 000 kombinime të regjistruara para se të shihen rezultatet [1,000 pre-registered combinations], me Spearman rho, Kendall tau dhe zhvendosjen mesatare dhe maksimale [mean and max shift]. Ai ekzekutohet **vetëm** mbi dosje sintetike ose të anonimizuara, kurrë mbi deputetë realë [ONLY on synthetic or anonymised dossiers, never on real MPs]. Nuk është kryer.

Peshat nuk rishpërndahen automatikisht kur një dimension mungon [Weights are never redistributed automatically].

## 5. Piloti i kalibrimit [Calibration pilot]

Ky pilot **nuk është kryer** [This pilot has NOT been executed].

- 36 dosje deputetësh [36 MP dossiers].
- 3 vlerësues të pavarur dhe të verbër për secilën dosje [3 independent blind raters each].
- Shtresëzim sipas shumicës/opozitës, partisë, qarkut, gjinisë, rolit, kohës në mandat dhe aktivitetit [Stratified by majority/opposition, party, district, gender, role, tenure and activity].
- Rubrika regjistrohet para kodimit [Pre-registered rubric].
- Vlerësuesit nuk e shohin rezultatin e modelit [Raters never see model output].
- Mospërputhjet regjistrohen dhe i dërgohen një paneli të ndarë [Disagreements are recorded and referred to a separate panel].

Krippendorff alpha, si **PROPOZIM NË PRITJE TË VENDIMIT TË BORDIT** [PROPOSAL PENDING BOARD DECISION]:

- 0.80 ose më lart: kalon [passes].
- 0.67 deri në 0.79: i përkohshëm [provisional].
- nën 0.67: nuk kalon [fails].

Auditim i mekanizmit të së dhënës që mungon [Missing-data mechanism audit]: për çdo `null` regjistrohet nëse mungesa vjen nga burimi, nga atribimi, nga roli, apo nga periudha [For every null, record whether the gap comes from the source, from attribution, from the role, or from the period]. Një `null` nuk plotësohet.

## 6. Formula e mbulimit [Coverage formula]

`C_d = (Σ w_i × v_i) / (Σ w_i × a_i)`

`v_i` është 1 kur treguesi është i matur, 0 kur nuk është [1 when the indicator is measured, 0 when it is not]. `a_i` është 1 kur treguesi i aplikohet atij roli, 0 kur nuk i aplikohet [1 when the indicator applies to that role, 0 when it does not]. `C_d` është `null` kur asnjë tregues nuk aplikohet [null when no indicator applies].

Pragje pilot, **propozime** [pilot thresholds, proposals]:

| Dimensioni [Dimension] | Pragu [Threshold] | Kushti shtesë [Extra condition] |
|---|---:|---|
| D1 | 90 | Të tri treguesit e zbatueshëm kanë burim, ose `null` i arsyetuar me rolin [All three applicable indicators have a source, or a null explained by the role] |
| D2 | 90 | Regjistri ILDKPKI është i lexueshëm për atë periudhë [The ILDKPKI register is readable for that period] |
| D3 | 85 | Pjesa e votave të partisë nuk hyn në numërues [Party vote share does not enter the numerator] |
| D4 | 85 | Rubrika e verbër është e regjistruar para kodimit [The blind rubric is registered before coding] |
| D5 | 90 | Moduli i rolit ekziston; KLSH vetëm për rol ekzekutiv [The role module exists; KLSH only for an executive role] |
| D6 | 85 | Përputhja e votës me grupin nuk hyn [Group vote alignment does not enter] |
| D7 | 90 | Kampioni është tërhequr para verifikimit [The sample was drawn before verification] |

Kompoziti mbetet i ndaluar derisa të shtatë dimensionet të jenë të vlerësuar dhe asnjë të jetë `null` [The composite stays banned until all 7 dimensions are validated and none is null]. Peshat nuk rishpërndahen automatikisht [Never redistribute weights automatically].

## 7. Lista e publikimit [Publication checklist]

Një vlerë publikohet vetëm kur të gjitha këto janë të vërteta [A value is published only when all of these are true]:

1. Identiteti kanonik dhe historia e rolit [Canonical identity and role history].
2. Burimi, URL-ja, data dhe segmenti për çdo vlerë [Source, URL, date and segment for every value].
3. Formula e riprodhueshme [Reproducible formula].
4. Konstrukti i vlerësuar [Validated construct].
5. Mbulimi e ka kaluar pragun [Coverage passed].
6. Besueshmëria, shtrembërimi dhe ndjeshmëria janë testuar [Reliability, bias and sensitivity tested].
7. Versioni i metodologjisë plus dy nënshkrime recensentësh [Methodology version plus 2 reviewer sign-offs].
8. Autorizim i shprehur për profilin, dimensionin dhe periudhën [Explicit authorization per profile, dimension and period].

Porta mbetet e mbyllur në mungesë të këtyre [The gate stays fail-closed]. Një ndryshim material e kthen zërin në shqyrtim [A material change sends the item back to review].

## 8. Pasiguria [Uncertainty]

Mbulimi, besueshmëria dhe pasiguria statistikore mbahen të ndara [Coverage, reliability and statistical uncertainty stay separate].

Numërimi i universit të plotë nuk merr interval artificial [Full-universe counts get no artificial interval]. Të dhënat e kampionuara mund të përdorin një bootstrap të grupuar sipas seancës vetëm kur ai justifikohet [Sampled data may use a session-clustered bootstrap only when it is justified]. Në çdo rast tjetër shkruhet:

`Pasiguria statistikore: Nuk është vlerësuar`

Asnjë vlerë `±` nuk fabrikohet [No ± value is ever fabricated].

## 9. Gjashtë pyetjet për bordin editorial [The six editorial board questions]

1. Cilin skenar peshash, nëse ndonjë, miraton bordi: A, B, C, apo asnjë? [Which weight scenario, if any, does the board adopt: A, B, C, or none?]
2. A i miraton bordi pragjet e propozuara të Krippendorff alpha? [Does the board adopt the proposed Krippendorff alpha thresholds?]
3. A i miraton bordi pragjet e propozuara të mbulimit? [Does the board adopt the proposed coverage thresholds?]
4. A qëndron i përjashtuar përputhja e votës me grupin, dhe a qëndron i pandëshkuar mendimi i ndryshëm? [Does group-vote alignment stay excluded, and does legitimate dissent stay unpenalised?]
5. A qëndron D5 vetëm si modul sipas rolit, jo si dimension universal? [Does D5 stay a role-specific module only, not a universal dimension?]
6. A qëndron i ndaluar kompoziti derisa të shtatë dimensionet të jenë të vlerësuar dhe asnjë të jetë `null`? [Does the composite stay banned until all seven dimensions are validated and none is null?]

Këto pyetje nuk kanë përgjigje në këtë draft [These questions have no answer in this draft].

## 10. Fazat e riaktivizimit [Reactivation phases]

1. Observatori faktik [Factual observatory]. Vetëm klasa F, pa pikë.
2. Kalibrimi [Calibration]. Piloti i seksionit 5.
3. Auditimi i pavarur [Independent audit]. Dy recensentë dhe lista e seksionit 7.
4. Publikimi i kontrolluar [Controlled publication]. Autorizim për profil, dimension dhe periudhë. Porta hapet vetëm atëherë [The gate opens only then].

Jemi në fazën 1 [We are in phase 1].

## Disponueshmëria e të dhënave sot [Data availability today]

Auditim i skedarëve në këtë depo më 1 nëntor 2026 [Audit of the files in this repository on 1 November 2026]. Disponueshmëria nuk është supozuar [Availability was not assumed].

| Burimi [Source] | Çfarë kemi [What we hold] | Çfarë nuk kemi [What we do not hold] |
|---|---|---|
| Kuvendi, fletë votimi [roll calls] | `data/official/kuvendi_rollcall_scores.json`. 291 skedarë të lexuar, që nga 2025-09-01, të verifikuar 2026-10-31. Katalogu: `https://kuvendiapi.azurewebsites.net/api/dokumentet`. | Lista e pjesëmarrjes nga `api/mbledhjet`. Ai skedar ka rend dite dhe orë, jo listë emrash. |
| Kuvendi, procesverbal plenar [plenary minutes] | `data/official/plenary_assertiveness.json`. 76 procesverbalë të përdorur nga 431 të listuar, të verifikuar 2026-10-31. | 118 skedarë nisme të listuar, 0 të përdorur. Numri i fjalëve nuk përdoret si cilësi. |
| Kuvendi, procesverbal komisioni [committee minutes] | `data/official/committee_governance.json`. 251 procesverbalë të përdorur nga 263, të verifikuar 2026-11-01. Lista e hapjes, jo i gjithë teksti. | Pjesëmarrja si masë e qeverisjes. Ajo mbetet numër faktik, jo pikë e D5. |
| Kuvendi, CV dhe regjistër [CVs and register] | `data/official/kuvendi_anetaret.snapshot.json`, `data/official/kuvendi_details.snapshot.json`, dhe `fieldSources` në `db/paragon_scores_export.json`. | Biografia e plotë për çdo profil. Shumë fusha biografike janë `null`. |
| KQZ | `data/official/kqz_2025_zone_results.json` dhe lista e certifikuar e mandateve. | Vota parapëlqyese e kandidatit. Pjesa e partisë në qark nuk hyn në observator dhe nuk hyn në D3. |
| ILDKPKI | Asnjë deklarim i lexuar. Më 2026-10-31 `http://www.ildkpki.al` nuk u hap, dhe `deklarimi.ildkpki.al` është faqe hyrjeje, jo regjistër publik. Shënimi është te `blocked` në skedarin e fletëve të votimit. | Deklarimet, afatet, mospërputhjet. |
| KLSH | Asnjë raport në depo. | Rekomandimet dhe ndjekja e tyre. |
| Regjistër përgjigjesh ndaj mbikëqyrjes [oversight-response register] | Nuk është në depo. | Numëruesi dhe emëruesi i D2. |
| Kampionë fact-check [fact-check samples] | Nuk janë në depo. | Numëruesi i D7. |
| SPAK dhe gjykata [SPAK and courts] | Nuk ka arkiv vendimesh në depo. Statusi procedural, ku ekziston në një profil, mbetet klasë A. | Çdo përdorim si pikë. |
| Fletorja Zyrtare [Official Gazette] | Nuk është e nxjerrë si korpus në depo. | Aktet e atribuara deputetit. |

Observatori faktik i fazës 1 lexon vetëm pesë numërime të klasës F që këta skedarë i mbajnë: pjesëmarrjen në votim, prezencën plenare, pjesëmarrjen në komision, numrin e ndërhyrjeve plenare, dhe aktivitetin legjislativ vetëm kur ai është i atribuar. Sot aktiviteti legjislativ mbetet në pritje të të dhënave [Today legislative activity stays awaiting data].
