
import { ArticleData } from '../types';

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const monthNames = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${monthName}, ${year}`;
};

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 2);
const threeDaysAgo = new Date();
threeDaysAgo.setDate(today.getDate() - 4);

export const mockArticles: ArticleData[] = [
  {
    id: 101,
    title: "Sfida e Inteligjencës Artificiale në Gazetarinë Shqiptare",
    author: "Dr. Ana Koci",
    publishedDate: formatDate(today),
    imageUrl: "https://novaricstorage.blob.core.windows.net/media/AdobeStock_360444658_Preview.jpeg",
    content: "Inteligjenca Artificiale (IA) po transformon industrinë e medias në nivel global, por si po përjetohet ky ndryshim në peizazhin mediatik shqiptar? Ky artikull analizon mundësitë dhe sfidat që IA paraqet për gazetarinë në Shqipëri.\nNga njëra anë, mjetet e IA-së mund të përshpejtojnë procesin e mbledhjes së informacionit, verifikimit të fakteve dhe analizës së të dhënave në shkallë të gjerë. Kjo mund t'i lejojë gazetarët të fokusohen më shumë në investigime të thelluara dhe në krijimin e përmbajtjes cilësore. Nga ana tjetër, ekziston rreziku i përhapjes së dezinformatave të gjeneruara nga IA, si dhe sfida e ruajtjes së vendeve të punës dhe etikës gazetareske.\nAdoptimi i IA-së kërkon një qasje të kujdesshme, duke investuar në trajnimin e gazetarëve dhe duke vendosur standarde të qarta për përdorimin etik të këtyre teknologjive. E ardhmja e gazetarisë shqiptare do të varet nga aftësia për të integruar këto mjete pa kompromentuar integritetin dhe besueshmërinë.",
    isArticleOfTheDay: true,
  },
  {
    id: 102,
    title: "Rëndësia e Transparencës në Qeverisjen Lokale",
    author: "Besnik Leka",
    publishedDate: formatDate(yesterday),
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80",
    content: "Transparenca është një nga shtyllat kryesore të një qeverisjeje të mirë dhe demokratike, veçanërisht në nivelin lokal ku vendimet ndikojnë drejtpërdrejt në jetën e qytetarëve. Në Shqipëri, ndonëse ka pasur përparime, transparenca e bashkive mbetet një sfidë e vazhdueshme.\nQytetarët kanë të drejtë të dinë se si shpenzohen taksat e tyre, si merren vendimet për projektet publike dhe cilat janë planet afatgjata për komunitetin e tyre. Mungesa e kësaj transparence ushqen mosbesimin, korrupsionin dhe apati qytetare.\nTeknologjia ofron mundësi të reja për të rritur transparencën. Platformat online, portalet e të dhënave të hapura (open data) dhe transmetimi i drejtpërdrejtë i mbledhjeve të këshillave bashkiakë janë mjete të fuqishme që duhet të përdoren gjerësisht. Një qeverisje lokale transparente nuk është luks, por një domosdoshmëri për një shoqëri të shëndetshme dhe të angazhuar.",
  },
  {
    id: 103,
    title: "Turizmi Kulturor: Një Thesar i Pashfrytëzuar",
    author: "Elira Gjoni",
    publishedDate: formatDate(threeDaysAgo),
    imageUrl: "https://images.unsplash.com/photo-1547348989-105a56d35b5a?auto=format&fit=crop&w=1000&q=80",
    content: "Ndërsa turizmi bregdetar në Shqipëri ka njohur një rritje eksponenciale, turizmi kulturor mbetet një potencial i madh ende i pashfrytëzuar plotësisht. Vendi ynë është i pasur me kështjella, site arkeologjike, qytete historike dhe tradita unike që mund të tërheqin një kategori tjetër vizitorësh, më kërkues dhe me interes për historinë dhe kulturën.\nZhvillimi i turizmit kulturor kërkon një strategji të integruar. Kjo përfshin restaurimin dhe mirëmbajtjen e monumenteve, përmirësimin e infrastrukturës rrugore drejt tyre, krijimin e itinerareve të dedikuara dhe promovimin e tyre në tregjet ndërkombëtare. Gjithashtu, është thelbësore përfshirja e komuniteteve lokale, duke i bërë ata pjesë të ofertës turistike përmes artizanatit, gastronomisë dhe mikpritjes.\nInvestimi në turizmin kulturor jo vetëm që diversifikon ekonominë, por edhe ndihmon në ruajtjen dhe promovimin e trashëgimisë sonë kombëtare për brezat që vijnë.",
  },
  {
    id: 104,
    title: "E ardhmja e punës: Si po ndikojnë teknologjitë e reja?",
    author: "Arben Visha",
    publishedDate: formatDate(new Date(2024, 4, 28)), // May 28, 2024
    imageUrl: "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=1000&q=80",
    content: "Automatizimi, inteligjenca artificiale dhe puna në distancë po riformësojnë tregun global të punës me një shpejtësi marramendëse. Këto ndryshime paraqesin si mundësi, ashtu edhe sfida për punonjësit dhe kompanitë shqiptare. Aftësitë që kërkoheshin dhjetë vjet më parë mund të jenë të vjetruara sot, ndërsa profesione të reja lindin çdo ditë.\nNë këtë kontekst, përshtatshmëria dhe të mësuarit e vazhdueshëm bëhen thelbësore. Sistemi arsimor duhet të përshtatet për të përgatitur të rinjtë me aftësi digjitale, mendim kritik dhe kreativitet. Nga ana tjetër, kompanitë duhet të investojnë në trajnimin e vazhdueshëm të stafit të tyre për të përballuar tranzicionin teknologjik. Politikat qeveritare duhet të mbështesin këtë tranzicion, duke nxitur inovacionin dhe duke krijuar një rrjet sigurie për ata që preken nga automatizimi. Përqafimi i së ardhmes së punës nuk është një zgjedhje, por një domosdoshmëri për konkurrueshmërinë ekonomike.",
  },
  {
    id: 105,
    title: "IA dhe kontributi i saj në një shoqëri me ritme të shpejta",
    author: "Dr Alban Gj. THIKA",
    publishedDate: "1 Korrik, 2025",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    content: "Jeta moderne ecën me një ritëm që shpesh duket i pamenaxhueshëm. Nga komunikimi i menjëhershëm te ciklet e lajmeve 24/7, gjithçka lëviz më shpejt se kurrë më parë. Në zemër të këtij nxitimi gjendet një forcë transformuese: Inteligjenca Artificiale (IA). Kontributi i IA-së në përshpejtimin e shoqërisë sonë është i thellë dhe i shumëanshëm, duke ndikuar në çdo gjë, nga industria te mënyra se si konsumojmë informacionin.\nNë thelb, IA është një motor efikasiteti. Ajo automatizon detyrat e përsëritura, duke liruar njerëzit të përqendrohen në punë më komplekse dhe kreative. Në industrinë prodhuese, robotët e drejtuar nga IA punojnë pa u lodhur, duke përshpejtuar linjat e montimit. Në financa, algoritmet analizojnë tregjet dhe ekzekutojnë transaksione në fraksione të sekondës. Kjo automatizim shtrihet edhe në logjistikë, ku IA optimizon zinxhirët e furnizimit për të siguruar që produktet të arrijnë te konsumatorët më shpejt se kurrë më parë. Rezultati është një ekonomi globale që operon me një shpejtësi të paimagjinueshme vetëm pak dekada më parë.\nPërtej industrisë, IA ka revolucionarizuar aksesin tonë ndaj informacionit. Motorët e kërkimit përdorin IA për të na dhënë përgjigje të menjëhershme për pyetje komplekse, ndërsa platformat e mediave sociale përdorin algoritme për të kuruar një rrjedhë të pafund informacioni të personalizuar. Kjo qasje e menjëhershme na mban të lidhur dhe të informuar, por gjithashtu ushqen një cikël të vazhdueshëm konsumi informacioni që kontribuon në ndjenjën e një jete të përshpejtuar. Shpejtësia me të cilën lajmet – dhe dezinformatat – mund të përhapen është një dëshmi e fuqisë së IA-së për të përshpejtuar komunikimin masiv.\nMegjithatë, ky ritëm i pandalshëm ka edhe anën e tij të errët. Kultura e 'përgjigjes së menjëhershme' mund të çojë në stres dhe 'burnout', ndërsa presioni për të qenë gjithmonë të lidhur dhe produktiv rritet. Për më tepër, ndërsa IA na ndihmon të filtrojmë sasi të mëdha informacioni, ajo gjithashtu mund të na mbyllë në 'flluska filtruese' (filter bubbles), duke kufizuar ekspozimin tonë ndaj pikëpamjeve të ndryshme dhe duke cenuar aftësinë tonë për mendim të thellë e kritik. Kalimi nga leximi i thelluar te 'skanimi' i titujve është një simptomë e një shoqërie që vlerëson shpejtësinë mbi thellësinë.\nNë përfundim, Inteligjenca Artificiale është padyshim një nga shtytësit kryesorë të shoqërisë sonë me ritëm të shpejtë. Ajo ofron përfitime të jashtëzakonshme në efikasitet, inovacion dhe lidhje. Sidoqoftë, është detyra jonë të menaxhojmë këtë përshpejtim. Duhet të gjejmë një ekuilibër midis shfrytëzimit të fuqisë së IA-së dhe ruajtjes së hapësirës për mendim të thelluar, pushim dhe mirëqenie njerëzore. E ardhmja nuk qëndron në refuzimin e shpejtësisë, por në zotërimin e saj me mençuri."
  },
  {
    id: 106,
    title: "Rasti SHKRELI vs. Beci: Një Studim Rasti",
    author: "Redaksia NOVARIC®",
    publishedDate: "2 Gusht, 2025",
    imageUrl: "https://novaricstorage.blob.core.windows.net/media/shkrela-beci-feature.jpg",
    content: "Një analizë e thelluar e shkarkimit të aktorit Simon SHKRELI nga Bashkia Shkodër, e cila ka ndezur një debat të gjerë publik mbi politizimin e institucioneve kulturore dhe transparencën administrative. Ky artikull i veçantë dekonstrukton argumentet e të dyja palëve.",
    featurePageId: 'newsFeatureShkreliBeci'
  },
  {
    id: 107,
    title: "Letër e Hapur Drejtuar Socialistëve të Shkodrës dhe Qytetarëve të Paangazhuar Politikisht",
    author: "Dr Alban Gj. THIKA",
    publishedDate: "3 Gusht, 2025",
    imageUrl: "https://images.unsplash.com/photo-1583431944738-c2903930b533?auto=format&fit=crop&w=1000&q=80",
    content: "Shkak për këtë thirrje publike është jo vetëm vendimi për largimin e aktorit Simon Shkrela nga Teatri “Migjeni”, por ajo që ky vendim simbolizon për gjendjen mendore, etike dhe administrative të institucioneve tona lokale.\nHabia ime nuk qëndron vetëm tek vetë vendimi, por tek reagimi—ose më saktë, mungesa e reagimit të balancuar. Si është e mundur që në një qytet me histori shekullore si Shkodra, kendvështrimet të jenë kaq të polarizuara, aq të ngurta dhe aq të verbra ndaj realitetit? Në një shoqëri të shëndoshë, mendimi ndryshe është thelb i jetës publike, por kur përçarja bëhet aksi themelor i çdo debati, atëherë s’kemi më pluralizëm, por patologji kolektive.\nNuk është vetëm një çështje e “një vendimi pune”. Është një simptomë më e thellë:\n- E mungesës së profesionalizmit administrativ, ku veprimet burokratike justifikohen me terma të zbrazët si “mungesë efektiviteti”, pa asnjë provë konkrete.\n- E mungesës së transparencës, ku figura publike shkarkohen në heshtje, ndërsa institucionet kulturore heshtin.\n- E mungesës së intuitës politike, ku nuk kuptohet se një aktor me përvojë 20-vjeçare është më shumë se një punonjës—ai është simbol, kujtesë, zë i komunitetit.\n- E mungesës së etikës publike, ku vendimet e rëndësishme për komunitetin nuk merren me dialog, por me arrogancë teknokratike.\nUnë nuk po kërkoj që vendimet administrative të mos zbatohen. Por po kërkoj që të mos fshihemi pas letrave zyrtare për të justifikuar aktet e padenja ndaj njerëzve që përfaqësojnë këtë qytet më shumë se çdo tabelë politike.\nKjo është një thirrje për ju – socialistë të ndershëm të këtij qyteti, që nuk jeni thjesht zbatues të urdhrave, por trashëgimtarë të një filozofie politike që dikur fliste për punëtorin, për artin, për njeriun.\nKjo është një thirrje për ju – qytetarë të paangazhuar, që nuk mbani flamuj partie, por mbani ende në zemër respektin për figurat publike që kanë kontribuar pa kërkuar privilegje.\nKërkojmë përgjegjësi, jo për hakmarrje, por për t’i treguar këtij qyteti se ende ka shpresë.\nSepse Shkodra nuk është një ndërmarrje.\nSepse Shkodra nuk është një kartelë partie.\nSepse Shkodra është një kujtesë kolektive që nuk fal harresën, arrogancën dhe përbuzjen.",
    featurePageId: 'openLetterShkreliBeci'
  },
  {
    id: 108,
    title: "“Asht nga një familje e mirë”: Kapitali Simbolik, Mburojat Morale dhe Bashkëfajësia Institucionale",
    author: "Dr Alban Gj. THIKA & Nora (AI)",
    publishedDate: "17 Shtator, 2026",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80",
    content: "Një hetim ndërdisiplinor mbi etnosociologjinë e Shkodrës, habitusin e 'derës së mirë', kapitalin simbolik të trashëguar, dhe paradoksin e integritetit në administratën publike shqiptare. Përmban matricën analitike të bashkëfajësisë në 12 nivele dhe bibliografinë e plotë me 30 burime akademike.",
    featurePageId: 'shkoderCulturePage'
  },
  {
    id: 109,
    title: "Terapia e Shockut: Një Analizë mbi Zhvillimin Urban dhe Trashëgiminë e Shkodrës",
    author: "Dr Alban Gj. THIKA",
    publishedDate: "10 Shtator, 2026",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    content: "Një analizë e thelluar urbane, ligjore dhe socio-ekonomike mbi transformimet infrastrukturore në Bashkinë Shkodër, ndërhyrjet në qendrën historike dhe ruajtjen e memories kolektive qytetare.",
    featurePageId: 'shkoderShockTherapy'
  }
];