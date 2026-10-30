
import { TVPersonalityAnalysis } from '../types';

export const mockTVAnalyses: TVPersonalityAnalysis[] = [
  {
    id: 'vip4',
    name: 'Blendi Fevziu',
    imageUrl: 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/BF_Opinion.jfif',
    analysis: [
      {
        dimension: 'Saktësia dhe Verifikimi i Fakteve',
        description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.',
        score: 85,
        peerAverage: 72,
        globalBenchmark: 88,
        commentary: 'Fevziu tregon një nivel të lartë të përgatitjes, por shpejtësia e formatit live ndonjëherë lejon pasaktësi të vogla që zakonisht korrigjohen. Mbështetet shumë në reputacionin e të ftuarve.'
      },
      {
        dimension: 'Paanshmëria dhe Objektiviteti',
        description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.',
        score: 78,
        peerAverage: 65,
        globalBenchmark: 90,
        commentary: 'Ndonëse synon paanshmëri, stili i tij konfrontues dhe ndërprerjet e shpeshta mund të perceptohen si favorizim ose si mungesë ekuilibri nga audienca, pavarësisht qëllimit.'
      },
      {
        dimension: 'Etika dhe Integriteti Profesional',
        description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.',
        score: 88,
        peerAverage: 75,
        globalBenchmark: 92,
        commentary: 'Ruan një reputacion të fortë etik, duke e mbajtur emisionin larg skandaleve të mëdha etike. Mban distancë profesionale nga subjektet që mbulon.'
      },
      {
        dimension: 'Aftësitë e Komunikimit dhe Angazhimi',
        description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.',
        score: 95,
        peerAverage: 80,
        globalBenchmark: 90,
        commentary: 'Një nga pikat e tij më të forta. Është një komunikues i shkëlqyer, i shpejtë dhe me aftësi të jashtëzakonshme për të mbajtur vëmendjen e audiencës dhe tensionin në studio.'
      },
      {
        dimension: 'Profesionalizmi në Mediat Sociale',
        description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.',
        score: 90,
        peerAverage: 70,
        globalBenchmark: 85,
        commentary: 'Llogaritë e tij sociale përdoren kryesisht për të promovuar punën dhe për të ndarë opinione të peshuara, duke shmangur polemikat e panevojshme personale.'
      },
      {
        dimension: 'Ndikimi dhe Relevanca Publike',
        description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.',
        score: 92,
        peerAverage: 75,
        globalBenchmark: 88,
        commentary: '"Opinion" mbetet një pikë reference kyçe në median shqiptare. Temat e trajtuara dhe debatet e zhvilluara shpesh dominojnë ciklin e lajmeve të ditëve në vijim.'
      }
    ]
  },
  {
    id: 'vip9',
    name: 'Sokol Balla',
    imageUrl: 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/SB_Real-Story.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 82, peerAverage: 72, globalBenchmark: 88, commentary: 'Balla shfaq një përkushtim të mirë ndaj verifikimit, por nganjëherë mbështetet te burime politike që kërkojnë verifikim të mëtejshëm.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 75, peerAverage: 65, globalBenchmark: 90, commentary: 'Përpiqet të mbajë një qasje të ekuilibruar, por dinamika e debatit mund të anojë në varësi të të ftuarve në panel.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 85, peerAverage: 75, globalBenchmark: 92, commentary: 'Njihet për një karrierë pa kompromise të mëdha etike. Mban një linjë të qartë profesionale.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 88, peerAverage: 80, globalBenchmark: 90, commentary: 'Komunikues i qartë dhe moderator i aftë. Menaxhon mirë debatet me shumë panelistë.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 80, peerAverage: 70, globalBenchmark: 85, commentary: 'Përdor mediat sociale në mënyrë profesionale, kryesisht për të promovuar emisionin e tij.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 84, peerAverage: 75, globalBenchmark: 88, commentary: 'Emisioni i tij është një platformë e rëndësishme për diskursin politik, duke kontribuar rregullisht në debatin publik.' }
    ]
  },
  {
      id: 'vip10',
      name: 'Eni Vasili',
      imageUrl: 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/EV_Open.jfif',
      analysis: [
          { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 88, peerAverage: 72, globalBenchmark: 88, commentary: 'Tregon një rigorozitet të lartë në përgatitjen e temave dhe verifikimin e fakteve, veçanërisht në dosjet investigative.' },
          { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 80, peerAverage: 65, globalBenchmark: 90, commentary: 'Arrnon të jetë një moderatore e paanshme, duke u dhënë hapësirë të gjitha palëve, edhe pse stili i saj është energjik.' },
          { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 86, peerAverage: 75, globalBenchmark: 92, commentary: 'Ruan standarde të larta etike, duke u fokusuar te përmbajtja dhe jo te skandalet personale apo profesionale.' },
          { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 90, peerAverage: 80, globalBenchmark: 90, commentary: 'Shumë e aftë në menaxhimin e debateve të ashpra, duke mbajtur kontrollin e studios dhe duke bërë pyetje të drejtpërdrejta.' },
          { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 85, peerAverage: 70, globalBenchmark: 85, commentary: 'Menaxhon një prani profesionale online, duke e përdorur për të angazhuar audiencën me temat e emisionit.' },
          { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 87, peerAverage: 75, globalBenchmark: 88, commentary: '"Open" është një nga emisionet më me ndikim në vend, duke trajtuar tema që shpesh vendosin axhendën mediatike.' }
      ]
  },
  {
      id: 'vip14',
      name: 'Arian Çani',
      imageUrl: 'https://dosja.al/wp-content/uploads/2019/06/Arian-Cani.jpg',
      analysis: [
          { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 65, peerAverage: 72, globalBenchmark: 88, commentary: 'Formati i emisionit fokusohet më shumë te opinioni dhe spektakli sesa te verifikimi rigoroz i fakteve. Shpesh bazohet te deklaratat e të ftuarve.' },
          { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 60, peerAverage: 65, globalBenchmark: 90, commentary: 'Stili i tij provokues dhe shpesh subjektiv e bën të vështirë vlerësimin e objektivitetit. Qëllimi është më shumë argëtimi sesa paanshmëria gazetareske.' },
          { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 70, peerAverage: 75, globalBenchmark: 92, commentary: 'Ndonëse shpesh në kufijtë e etikës televizive për hir të show-t, ka arritur të shmangë shkelje të rënda profesionale.' },
          { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 92, peerAverage: 80, globalBenchmark: 90, commentary: 'Mjeshtër i krijimit të situatave televizive dhe angazhimit të audiencës përmes polemikave dhe humorit.' },
          { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 75, peerAverage: 70, globalBenchmark: 85, commentary: 'E përdor median sociale si një zgjatim të personalitetit të tij televiziv, duke ruajtur të njëjtin stil.' },
          { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 85, peerAverage: 75, globalBenchmark: 88, commentary: 'Pavarësisht kritikave, "Zonë e Lirë" ka një audiencë besnike dhe ndikim të konsiderueshëm në kulturën pop, duke qenë një platformë ku shumë figura publike duan të jenë.' }
      ]
  },
  {
      id: 'vip15',
      name: 'Arbana Osmani',
      imageUrl: 'https://ata.gov.al/wp-content/uploads/2023/01/Arbana-Osmani.jpg',
      analysis: [
          { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 80, peerAverage: 72, globalBenchmark: 88, commentary: 'Në formatet që drejton (reality show), fokusi nuk është te faktet, por te menaxhimi i narrativës së programit. Megjithatë, ajo ruan saktësi në komunikimin e rregullave dhe vendimeve të produksionit.' },
          { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 85, peerAverage: 65, globalBenchmark: 90, commentary: 'Tregon një aftësi të lartë për të qëndruar neutrale dhe për të menaxhuar situata të tensionuara live pa treguar anshmëri ndaj konkurrentëve, një aftësi kyçe për formatin.' },
          { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 90, peerAverage: 75, globalBenchmark: 92, commentary: 'Gëzon një reputacion shumë të pastër dhe profesional. Vlerësohet për qasjen e saj etike në trajtimin e personazheve dhe situatave delikate.' },
          { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 94, peerAverage: 80, globalBenchmark: 90, commentary: 'E shkëlqyer në komunikim, me një aftësi të spikatur për të menaxhuar transmetime të gjata live, për të mbajtur audiencën të angazhuar dhe për të kontrolluar ritmin e spektaklit.' },
          { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 88, peerAverage: 70, globalBenchmark: 85, commentary: 'Përdor mediat sociale në mënyrë shumë profesionale, duke promovuar punën e saj dhe duke ndërvepruar me audiencën në një mënyrë pozitive dhe të kontrolluar.' },
          { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 96, peerAverage: 75, globalBenchmark: 88, commentary: 'Si drejtuese e "Big Brother VIP", ajo është në krye të programit më me ndikim në Shqipëri, duke dominuar diskursin publik dhe mediatik për muaj të tërë.' }
      ]
  },
   {
      id: 'vip17',
      name: 'Sonila Meço',
      imageUrl: 'https://novaric.co/wp-content/uploads/2025/12/SonilaMECO.jpg',
      analysis: [
          { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 92, peerAverage: 72, globalBenchmark: 88, commentary: 'Shquhet për përgatitje rigoroze dhe saktësi në informacion. Rrallë kapet në pasaktësi, duke reflektuar një standard të lartë gazetaresk.' },
          { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 85, peerAverage: 65, globalBenchmark: 90, commentary: 'Ruan një nivel të lartë paanshmërie dhe objektiviteti në moderimin e debateve, duke qenë e prerë, por e drejtë me të gjitha palët.' },
          { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 90, peerAverage: 75, globalBenchmark: 92, commentary: 'Gëzon një reputacion të lartë për etikë dhe integritet, duke qëndruar larg kompromiseve profesionale.' },
          { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 88, peerAverage: 80, globalBenchmark: 90, commentary: 'Ka një komunikim të qartë, të strukturuar dhe autoritar. Bën pyetje të informuara dhe menaxhon mirë kohën televizive.' },
          { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 87, peerAverage: 70, globalBenchmark: 85, commentary: 'Prania e saj online është profesionale, shpesh duke ndarë analiza dhe komente të thelluara mbi çështjet që trajton.' },
          { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 85, peerAverage: 75, globalBenchmark: 88, commentary: 'Është një zë i besueshëm dhe me ndikim në analizën politike dhe sociale, e ndjekur nga një audiencë që vlerëson thellësinë.' }
      ]
  },
  {
      id: 'vip18',
      name: 'Marin Mema',
      imageUrl: 'https://novaric.co/wp-content/uploads/2025/12/MarinMEMA.jpg',
      analysis: [
          { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 94, peerAverage: 72, globalBenchmark: 88, commentary: 'Puna e tij bazohet në kërkim të thelluar historik dhe në terren. Vlerësohet për saktësinë e fakteve dhe dokumenteve që paraqet.' },
          { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 82, peerAverage: 65, globalBenchmark: 90, commentary: 'Ndonëse emisioni ka një këndvështrim të qartë patriotik, ai përpiqet të paraqesë faktet në mënyrë objektive brenda këtij kuadri.' },
          { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 91, peerAverage: 75, globalBenchmark: 92, commentary: 'Ka një integritet të lartë profesional dhe personal, duke u bërë një figurë shumë e respektuar për punën e tij kërkimore.' },
          { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 87, peerAverage: 80, globalBenchmark: 90, commentary: 'Narrator i shkëlqyer, me një aftësi të veçantë për ta bërë historinë tërheqëse dhe të kuptueshme për një audiencë të gjerë.' },
          { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 85, peerAverage: 70, globalBenchmark: 85, commentary: 'Përdor mediat sociale për të promovuar gjetjet e tij dhe për të angazhuar audiencën në tema historike e kulturore.' },
          { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 90, peerAverage: 75, globalBenchmark: 88, commentary: 'Ka një ndikim të jashtëzakonshëm në formësimin e ndërgjegjes historike dhe kombëtare. Emisioni i tij është një fenomen kulturor.' }
      ]
  },
  {
      id: 'vip25',
      name: 'Ilva Tare',
      imageUrl: 'https://shqiptarja.com/uploads/ckeditor/images/ilva%20tare%20e.jpg',
      analysis: [
          { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 93, peerAverage: 72, globalBenchmark: 88, commentary: 'Një nga standardet më të larta në treg për verifikimin e fakteve dhe përgatitjen e thelluar para emisionit.' },
          { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 90, peerAverage: 65, globalBenchmark: 90, commentary: 'Vlerësohet gjerësisht si një nga moderatoret më të paanshme, duke i dhënë hapësirë të barabartë dhe duke sfiduar të gjitha palët.' },
          { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 94, peerAverage: 75, globalBenchmark: 92, commentary: 'Karrierë e ndërtuar mbi integritet dhe standarde të larta etike, duke shërbyer si model në gazetari.' },
          { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 91, peerAverage: 80, globalBenchmark: 90, commentary: 'Komunikim i qetë, i matur por i mprehtë. Aftësi e shkëlqyer për të menaxhuar debate komplekse pa humbur kontrollin.' },
          { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 88, peerAverage: 70, globalBenchmark: 85, commentary: 'Ruan një profil profesional dhe të përmbajtur në mediat sociale, në përputhje me imazhin e saj publik.' },
          { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 89, peerAverage: 75, globalBenchmark: 88, commentary: 'Për vite me radhë, emisioni i saj ka qenë një platformë thelbësore për debatin politik dhe vendosjen e axhendës publike.' }
      ]
  },
  {
    id: 'vip32',
    name: 'Ylli Rakipi',
    imageUrl: 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/YR_TePaEks.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 75, peerAverage: 72, globalBenchmark: 88, commentary: 'Fokusohet më shumë në opinionin editorial dhe denoncimin sesa në verifikimin e detajuar të fakteve brenda formatit të emisionit.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 62, peerAverage: 65, globalBenchmark: 90, commentary: 'Ka një linjë të qartë editoriale kritike ndaj qeverisë. Emisioni nuk pretendon të jetë i balancuar, por një zë opozitar.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 78, peerAverage: 75, globalBenchmark: 92, commentary: 'Ndonëse me qëndrime të forta, ai ruan një integritet në përputhje me linjën e tij editoriale të deklaruar si kritike.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 85, peerAverage: 80, globalBenchmark: 90, commentary: 'Ka një stil unik dhe të drejtpërdrejtë që angazhon një audiencë specifike që kërkon gazetari pa kompromis.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 70, peerAverage: 70, globalBenchmark: 85, commentary: 'Përdor mediat sociale për të amplifikuar mesazhet dhe gjetjet e emisionit të tij.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 80, peerAverage: 75, globalBenchmark: 88, commentary: 'Ka një ndikim të konsiderueshëm në segmentin opozitar të opinionit publik dhe shërben si një platformë për zërat kritikë.' }
    ]
  },
  {
    id: 'vip5',
    name: 'Ardit Gjebrea',
    imageUrl: 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/Ardit-GJEBREA.png',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 85, peerAverage: 72, globalBenchmark: 88, commentary: 'Në rubrikat sociale, tregon kujdes për saktësinë e historive njerëzore. Në argëtim, ky kriter është më pak i aplikueshëm.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 88, peerAverage: 65, globalBenchmark: 90, commentary: 'Në rolin e tij si prezantues i formateve argëtuese, ai ruan një neutralitet të plotë dhe qasje pozitive ndaj të gjithë pjesëmarrësve.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 92, peerAverage: 75, globalBenchmark: 92, commentary: 'Një nga figurat më të pastra dhe më etike në tregun mediatik, i vlerësuar për qasjen humane dhe profesionalizmin.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 96, peerAverage: 80, globalBenchmark: 90, commentary: 'I jashtëzakonshëm në komunikim. Ka një aftësi natyrale për t\'u lidhur me audiencën dhe për të menaxhuar spektakle të gjata e komplekse.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 90, peerAverage: 70, globalBenchmark: 85, commentary: 'Menaxhon një imazh shumë pozitiv dhe profesional online, duke e përdorur për bamirësi dhe për të promovuar punën e tij.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 94, peerAverage: 75, globalBenchmark: 88, commentary: 'Programi i tij është një institucion televiziv që ndiqet masivisht dhe ka një ndikim të thellë kulturor dhe social në shoqërinë shqiptare.' }
    ]
  },
  {
    id: 'vip13',
    name: 'Alketa Vejsiu',
    imageUrl: 'https://novaric.co/wp-content/uploads/2025/12/AlketaVEJSIU.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 82, peerAverage: 72, globalBenchmark: 88, commentary: 'Ashtu si Gjebrea, në formatet e saj fokusi është te menaxhimi i spektaklit. Ruan saktësi në prezantimin e informacionit të produksionit.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 86, peerAverage: 65, globalBenchmark: 90, commentary: 'Profesionale dhe e paanshme në rolin e saj si prezantuese, duke u dhënë hapësirë të gjithë konkurrentëve apo të ftuarve.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 89, peerAverage: 75, globalBenchmark: 92, commentary: 'Shquhet për profesionalizëm dhe etikë të lartë në punën e saj si prezantuese dhe producente.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 93, peerAverage: 80, globalBenchmark: 90, commentary: 'Shumë elokuente dhe energjike, me një aftësi të spikatur për të drejtuar shfaqje të mëdha live dhe për të krijuar një lidhje të fortë me publikun.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 85, peerAverage: 70, globalBenchmark: 85, commentary: 'Prani e kuruar dhe profesionale në mediat sociale, e fokusuar te puna, moda dhe mesazhet pozitive.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 88, peerAverage: 75, globalBenchmark: 88, commentary: 'Ka drejtuar disa nga spektaklet më të mëdha, duke qenë një figurë me ndikim të madh në botën e showbiz-it shqiptar.' }
    ]
  },
  {
    id: 'vip16',
    name: 'Adi Krasta',
    imageUrl: 'https://kallxo.com/wp-content/uploads/2022/10/ad-krasta-1-scaled.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 90, peerAverage: 72, globalBenchmark: 88, commentary: 'Vlerësohet për qasjen e tij intelektuale dhe përgatitjen e thelluar. Rrallë bën kompromise me saktësinë e fakteve.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 84, peerAverage: 65, globalBenchmark: 90, commentary: 'Ndonëse ka një qëndrim të qartë kritik, ai e bazon atë në argumente dhe analiza, duke ruajtur një objektivitet intelektual.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 92, peerAverage: 75, globalBenchmark: 92, commentary: 'Një nga zërat më të pavarur dhe me integritet në median shqiptare, shpesh duke paguar një çmim për këtë.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 91, peerAverage: 80, globalBenchmark: 90, commentary: 'Elokuent, me një fjalor të pasur dhe aftësi për të artikuluar mendime komplekse në mënyrë të qartë dhe bindëse.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 86, peerAverage: 70, globalBenchmark: 85, commentary: 'Përdor mediat sociale si një platformë për të ndarë analiza dhe editoriale të thelluara, duke ruajtur stilin e tij elitar.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 85, peerAverage: 75, globalBenchmark: 88, commentary: 'Ka një ndikim të fortë në një segment të audiencës intelektuale dhe kritike, duke shërbyer si një pikë referimi për analizë cilësore.' }
    ]
  },
  {
    id: 'vip19',
    name: 'Blendi Salaj',
    imageUrl: 'https://sot.com.al/wp-content/uploads/2023/07/blendi-salaj.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 80, peerAverage: 72, globalBenchmark: 88, commentary: 'Në formatin e tij radiofonik, fokusi është te komenti i shpejtë i lajmit. Përgjithësisht i saktë, por jo investigativ.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 76, peerAverage: 65, globalBenchmark: 90, commentary: 'Shpreh opinione të qarta, por përpiqet të jetë i drejtë në kritikat e tij ndaj të gjitha palëve politike dhe fenomeneve sociale.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 84, peerAverage: 75, globalBenchmark: 92, commentary: 'Ruan një standard të mirë etik, duke përdorur humorin dhe ironinë pa kaluar në sulme personale denigruese.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 90, peerAverage: 80, globalBenchmark: 90, commentary: 'Zë radiofonik shumë i njohur, me aftësi të shkëlqyera për të krijuar ritëm dhe për të mbajtur një audiencë të gjerë të angazhuar.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 82, peerAverage: 70, globalBenchmark: 85, commentary: 'Shumë aktiv dhe profesional në mediat sociale, duke i përdorur si platformë për aktivizëm qytetar dhe koment.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 83, peerAverage: 75, globalBenchmark: 88, commentary: 'Ka një ndikim të rëndësishëm si opinionist, veçanërisht në audiencën urbane dhe të re, duke formësuar bisedën e mëngjesit.' }
    ]
  },
  {
    id: 'vip20',
    name: 'Enkel Demi (Tomi)',
    imageUrl: 'https://novaric.co/wp-content/uploads/2025/12/EnkelDEMI.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 84, peerAverage: 72, globalBenchmark: 88, commentary: 'Në komentet e tij, mbështetet në një kulturë të gjerë dhe informacion të mirë-përpunuar, duke treguar saktësi.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 78, peerAverage: 65, globalBenchmark: 90, commentary: 'Ka një qasje humaniste dhe kritike, por e ruan objektivitetin intelektual pa rënë në anshmëri partiake.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 88, peerAverage: 75, globalBenchmark: 92, commentary: 'Vlerësohet për integritetin dhe qasjen e tij të kulturuar, duke shërbyer si një model pozitiv në gazetari.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 89, peerAverage: 80, globalBenchmark: 90, commentary: 'Një mjeshtër i fjalës së shkruar dhe të folur. Ka një stil unik që ndërthur ironinë, kulturën dhe komentin social.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 80, peerAverage: 70, globalBenchmark: 85, commentary: 'Prani e matur dhe intelektuale në mediat sociale, në përputhje me profilin e tij.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 81, peerAverage: 75, globalBenchmark: 88, commentary: 'Ka një ndikim të thellë në segmentin kulturor dhe intelektual të audiencës, duke kontribuar në një diskurs më të pasur publik.' }
    ]
  },
  {
    id: 'vip23',
    name: 'Mustafa Nano',
    imageUrl: 'https://dosja.al/wp-content/uploads/2023/01/mustafa-nano.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 78, peerAverage: 72, globalBenchmark: 88, commentary: 'Analizat e tij bazohen më shumë në interpretimin e fakteve dhe opinionin editorial sesa në raportimin e fakteve të reja.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 68, peerAverage: 65, globalBenchmark: 90, commentary: 'Ka qëndrime të forta dhe shpesh polemizuese. Nuk synon të jetë objektiv, por të mbrojë një këndvështrim specifik, shpesh kundër rrymës.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 75, peerAverage: 75, globalBenchmark: 92, commentary: 'Integriteti i tij qëndron në koherencën e mendimit të tij, edhe pse shpesh kritikohet për qëndrimet e tij.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 86, peerAverage: 80, globalBenchmark: 90, commentary: 'Shumë i aftë në artikulimin e ideve provokuese dhe në gjenerimin e debateve. Stili i tij është polemik dhe tërheqës.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 72, peerAverage: 70, globalBenchmark: 85, commentary: 'I përdor mediat sociale për të shprehur opinionet e tij pa filtra, shpesh duke krijuar debat.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 82, peerAverage: 75, globalBenchmark: 88, commentary: 'Ka një ndikim të rëndësishëm në opinionin publik, duke qenë një zë i domosdoshëm që sfidon narrativat tradicionale.' }
    ]
  },
  {
    id: 'vip26',
    name: 'Dalina Buzi',
    imageUrl: 'https://politiko.al/wp-content/uploads/2022/10/dalinabuzi.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 83, peerAverage: 72, globalBenchmark: 88, commentary: 'Në punën e saj si skenariste dhe producente, tregon kujdes për detajet dhe realitetin social që pasqyron. Në portal, standardet variojnë.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 80, peerAverage: 65, globalBenchmark: 90, commentary: 'Në opinionet e saj publike, shpreh një këndvështrim të qartë, por në punën e saj si producente synon të pasqyrojë realitete të ndryshme.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 85, peerAverage: 75, globalBenchmark: 92, commentary: 'Ka ndërtuar një markë mediatike të suksesshme duke ruajtur standarde të mira etike dhe duke qenë një zë për gratë e reja.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 88, peerAverage: 80, globalBenchmark: 90, commentary: 'Komunikuese e shkëlqyer, me një aftësi për të identifikuar dhe artikuluar temat që i interesojnë audiencës së re.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 90, peerAverage: 70, globalBenchmark: 85, commentary: 'Një nga përdorueset më të afta të mediave sociale, duke e integruar atë në mënyrë organike me biznesin e saj mediatik.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 89, peerAverage: 75, globalBenchmark: 88, commentary: 'Ka një ndikim të jashtëzakonshëm në audiencën e re dhe femërore, duke formësuar trendet dhe opinionet në këtë segment.' }
    ]
  },
  {
    id: 'vip27',
    name: 'Ledion Liço',
    imageUrl: 'https://www.gazetadita.al/wp-content/uploads/2024/02/Ledion-Lico-696x463-1.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 79, peerAverage: 72, globalBenchmark: 88, commentary: 'Në formatet argëtuese që drejton, saktësia lidhet me komunikimin korrekt të rregullave të lojës dhe informacionit të produksionit, ku ai është i saktë.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 84, peerAverage: 65, globalBenchmark: 90, commentary: 'Tregon paanshmëri dhe profesionalizëm në rolin e tij si moderator, duke mos favorizuar konkurrentët.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 86, peerAverage: 75, globalBenchmark: 92, commentary: 'Ruan një profil profesional dhe etik, pa u përfshirë në polemika që dëmtojnë imazhin e tij.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 91, peerAverage: 80, globalBenchmark: 90, commentary: 'Prezantues dinamik, modern dhe me shumë energji, i aftë të menaxhojë skena të mëdha dhe të angazhojë publikun.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 83, peerAverage: 70, globalBenchmark: 85, commentary: 'Ka një prani të kuruar dhe profesionale, e cila mbështet imazhin e tij televiziv.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 87, peerAverage: 75, globalBenchmark: 88, commentary: 'Si drejtues i disa prej formateve më të rëndësishme, ka një ndikim të madh në botën e televizionit dhe showbiz-it.' }
    ]
  },
  {
    id: 'vip28',
    name: 'Dritan Shakohoxha',
    imageUrl: 'https://kallxo.com/wp-content/uploads/2018/06/dritan-shakohoxha-1.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 85, peerAverage: 72, globalBenchmark: 88, commentary: 'Përgjithësisht i saktë në faktet dhe statistikat që raporton gjatë komentimit, por forca e tij është te pasioni.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 70, peerAverage: 65, globalBenchmark: 90, commentary: 'Shpreh hapur preferencat dhe pasionin për Kombëtaren Shqiptare, duke e bërë komentimin subjektiv, por kjo është pikërisht ajo që audienca vlerëson tek ai.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 88, peerAverage: 75, globalBenchmark: 92, commentary: 'Një figurë shumë e respektuar dhe me integritet në gazetarinë sportive shqiptare.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 98, peerAverage: 80, globalBenchmark: 90, commentary: 'I pakrahasueshëm në aftësinë për të përcjellë emocion dhe për të angazhuar audiencën. Ka krijuar një stil unik dhe të papërsëritshëm.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 80, peerAverage: 70, globalBenchmark: 85, commentary: 'Përdor mediat sociale për të ndarë pasionin e tij për sportin me ndjekësit.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 93, peerAverage: 75, globalBenchmark: 88, commentary: 'Është zëri i futbollit për një komb të tërë. Ndikimi i tij në kulturën sportive është i jashtëzakonshëm.' }
    ]
  },
  {
    id: 'vip12',
    name: 'Ermal Mamaqi',
    imageUrl: '/photos/ermal_mamaqi.jpg',
    analysis: [
        { dimension: 'Saktësia dhe Verifikimi i Fakteve', description: 'Vlerëson rigorozitetin në verifikimin e informacionit para transmetimit, atribuimin e saktë të burimeve dhe dallimin e qartë midis faktit dhe opinionit.', score: 70, peerAverage: 72, globalBenchmark: 88, commentary: 'Fokusi i tij është te humori dhe argëtimi, kështu që saktësia faktike nuk është kriteri kryesor i vlerësimit.' },
        { dimension: 'Paanshmëria dhe Objektiviteti', description: 'Mat aftësinë për të moderuar debatin në mënyrë të paanshme, duke u dhënë kohë dhe hapësirë të barabartë të gjitha palëve dhe duke shmangur paragjykimet personale.', score: 75, peerAverage: 65, globalBenchmark: 90, commentary: 'Në rolet e tij argëtuese, ai është përgjithësisht neutral. Në rolin si trajner motivimi, ai promovon një këndvështrim specifik.' },
        { dimension: 'Etika dhe Integriteti Profesional', description: 'Vlerëson respektimin e standardeve etike, si shmangia e konfliktit të interesit, mbrojtja e burimeve dhe trajtimi me dinjitet i të ftuarve.', score: 80, peerAverage: 75, globalBenchmark: 92, commentary: 'Ka arritur të ndërtojë një markë të suksesshme pa u përfshirë në skandale të mëdha, duke ruajtur një imazh pozitiv.' },
        { dimension: 'Aftësitë e Komunikimit dhe Angazhimi', description: 'Përfshin qartësinë, elokuencën, aftësinë për të bërë pyetje të mprehta dhe për të menaxhuar dinamikën e një debati të drejtpërdrejtë.', score: 92, peerAverage: 80, globalBenchmark: 90, commentary: 'Shumë i aftë në komunikim, humor dhe në krijimin e një lidhjeje të fortë me audiencën, si në TV ashtu edhe në eventet e tij.' },
        { dimension: 'Profesionalizmi në Mediat Sociale', description: 'Analizon mënyrën se si personaliteti e përdor median sociale, duke ruajtur standardet e paanshmërisë dhe profesionalizmit edhe jashtë studios.', score: 93, peerAverage: 70, globalBenchmark: 85, commentary: 'Përdorues mjeshtëror i mediave sociale për të ndërtuar markën e tij personale dhe për të promovuar bizneset e tij.' },
        { dimension: 'Ndikimi dhe Relevanca Publike', description: 'Mat aftësinë e emisionit dhe prezantuesit për të ndikuar në diskursin publik, për të vendosur axhendën dhe për t\'u perceptuar si një burim i rëndësishëm informacioni.', score: 88, peerAverage: 75, globalBenchmark: 88, commentary: 'Ka një ndikim të madh në audiencën e gjerë përmes filmave, emisioneve dhe së fundmi, si një figurë motivuese.' }
    ]
  }
];
