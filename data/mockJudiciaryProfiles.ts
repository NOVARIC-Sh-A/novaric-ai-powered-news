
// FIX: Corrected import path for types.
import { VipProfile } from '../types';

export const mockJudiciaryProfilesData: VipProfile[] = [
  // Constitutional Court
  {
    id: 'jc1',
    name: 'Vitore Tusha',
    imageUrl: 'https://www.reporter.al/wp-content/uploads/2020/11/Vitore-Tusha-e1605697626359.jpg',
    category: 'Gjykata Kushtetuese',
    shortBio: 'Gjyqtare në Gjykatën Kushtetuese, me përvojë të gjatë në drejtësi.',
    detailedBio: 'Vitore Tusha është një juriste e shquar dhe gjyqtare në Gjykatën Kushtetuese të Shqipërisë. Ajo ka një karrierë të gjatë dhe të pasur në sistemin e drejtësisë, duke shërbyer në pozicione të ndryshme para emërimit të saj në gjykatën më të lartë të vendit për çështjet kushtetuese. Kontributi i saj është i fokusuar në mbrojtjen e Kushtetutës dhe të drejtave themelore të njeriut.',
    publicPerception: { positive: 50, neutral: 40, negative: 10 },
    professionalPerformance: { excellent: 55, good: 35, average: 10, needsImprovement: 0 },
    skillsDevelopment: { leadership: 25, communication: 20, expertise: 40, ethics: 15 },
    performanceAnalysis: [
        { dimension: 'Pavarësia dhe Paanshmëria Gjyqësore', score: 85, peerAverage: 80, globalBenchmark: 88, description: 'Aftësia për të marrë vendime të lira nga ndikimet politike dhe të jashtme.', commentary: 'Gëzon një reputacion si gjyqtare e pavarur dhe profesionale, megjithëse presioni politik mbi Gjykatën Kushtetuese është gjithmonë një sfidë.' },
        { dimension: 'Arsyetimi Ligjor dhe Cilësia e Vendimeve', score: 88, peerAverage: 82, globalBenchmark: 90, description: 'Qartësia, koherenca dhe thellësia e arsyetimit ligjor në vendimet e marra.', commentary: 'Njihet për vendime të arsyetuara mirë dhe një qasje teknike ndaj çështjeve kushtetuese.' },
        { dimension: 'Efikasiteti dhe Menaxhimi i Çështjeve', score: 82, peerAverage: 78, globalBenchmark: 85, description: 'Shpejtësia e gjykimit të çështjeve pa kompromentuar cilësinë.', commentary: 'Kontribuon në një ritëm të mirë të punës së gjykatës, duke ndihmuar në reduktimin e çështjeve të prapambetura.' },
        { dimension: 'Integriteti dhe Etika Gjyqësore', score: 90, peerAverage: 85, globalBenchmark: 92, description: 'Sjellja profesionale dhe personale në përputhje me standardet më të larta etike.', commentary: 'Ka kaluar me sukses procesin e vetingut dhe gëzon një reputacion të lartë për integritet.' },
        { dimension: 'Kontributi në Jurisprudencë', score: 84, peerAverage: 80, globalBenchmark: 85, description: 'Ndikimi i vendimeve në zhvillimin e së drejtës kushtetuese në Shqipëri.', commentary: 'Ka kontribuar në disa vendime të rëndësishme që kanë konsoliduar praktikën kushtetuese.' }
    ]
  },
  {
    id: 'jc2',
    name: 'Fiona Papajorgji',
    imageUrl: 'https://shqiptarja.com/uploads/ckeditor/images/Fiona%20Papajorgji.jpg',
    category: 'Gjykata Kushtetuese',
    shortBio: 'Gjyqtare në Gjykatën Kushtetuese, me fokus në të drejtën publike.',
    detailedBio: 'Fiona Papajorgji është një juriste dhe gjyqtare në Gjykatën Kushtetuese. Ajo ka një sfond të fortë akademik dhe profesional në fushën e të drejtës publike dhe kushtetuese. Puna e saj në gjykatë përfshin interpretimin e ligjeve dhe vlerësimin e pajtueshmërisë së tyre me Kushtetutën e Shqipërisë.',
    publicPerception: { positive: 48, neutral: 42, negative: 10 },
    professionalPerformance: { excellent: 50, good: 40, average: 10, needsImprovement: 0 },
    skillsDevelopment: { leadership: 20, communication: 25, expertise: 40, ethics: 15 },
    performanceAnalysis: [
        { dimension: 'Pavarësia dhe Paanshmëria Gjyqësore', score: 84, peerAverage: 80, globalBenchmark: 88, description: 'Aftësia për të marrë vendime të lira nga ndikimet politike dhe të jashtme.', commentary: 'Perceptohet si një gjyqtare teknike dhe e pavarur, duke u fokusuar te argumenti ligjor.' },
        { dimension: 'Arsyetimi Ligjor dhe Cilësia e Vendimeve', score: 87, peerAverage: 82, globalBenchmark: 90, description: 'Qartësia, koherenca dhe thellësia e arsyetimit ligjor në vendimet e marra.', commentary: 'Vlerësohet për qartësinë dhe thellësinë e analizës juridike, veçanërisht në çështje komplekse të së drejtës publike.' },
        { dimension: 'Efikasiteti dhe Menaxhimi i Çështjeve', score: 81, peerAverage: 78, globalBenchmark: 85, description: 'Shpejtësia e gjykimit të çështjeve pa kompromentuar cilësinë.', commentary: 'Mban një ritëm të mirë pune, duke kontribuar në efikasitetin e përgjithshëm të gjykatës.' },
        { dimension: 'Integriteti dhe Etika Gjyqësore', score: 89, peerAverage: 85, globalBenchmark: 92, description: 'Sjellja profesionale dhe personale në përputhje me standardet më të larta etike.', commentary: 'Ka një profil të pastër dhe një reputacion të lartë etik, i konfirmuar edhe nga procesi i vetingut.' },
        { dimension: 'Kontributi në Jurisprudencë', score: 83, peerAverage: 80, globalBenchmark: 85, description: 'Ndikimi i vendimeve në zhvillimin e së drejtës kushtetuese në Shqipëri.', commentary: 'Ka kontribuar në pasurimin e jurisprudencës me perspektiva të reja, veçanërisht nga e drejta evropiane.' }
    ]
  },
  // Supreme Court
  {
    id: 'js1',
    name: 'Sokol Sadushi',
    imageUrl: 'https://www.gjykataelarte.gov.al/wp-content/uploads/2021/03/Sokol-Sadushi-1.jpg',
    category: 'Gjykata e Lartë',
    shortBio: 'Kryetar i Gjykatës së Lartë, me karrierë në fushën e drejtësisë.',
    detailedBio: 'Sokol Sadushi është Kryetari aktual i Gjykatës së Lartë të Republikës së Shqipërisë. Ai ka një karrierë të gjatë si gjyqtar dhe jurist, duke kontribuar në zhvillimin e jurisprudencës në vend. Udhëheqja e tij është e fokusuar në rritjen e efikasitetit dhe transparencës së Gjykatës së Lartë.',
    publicPerception: { positive: 45, neutral: 40, negative: 15 },
    professionalPerformance: { excellent: 50, good: 35, average: 10, needsImprovement: 5 },
    skillsDevelopment: { leadership: 35, communication: 20, expertise: 35, ethics: 10 },
    performanceAnalysis: [
        { dimension: 'Pavarësia dhe Paanshmëria Gjyqësore', score: 80, peerAverage: 78, globalBenchmark: 85, description: 'Aftësia për të marrë vendime të lira nga ndikimet politike dhe të jashtme.', commentary: 'Në rolin e tij si kryetar, përballet me presionin e menaxhimit të gjykatës, por përpiqet të ruajë pavarësinë e institucionit.' },
        { dimension: 'Arsyetimi Ligjor dhe Cilësia e Vendimeve', score: 85, peerAverage: 80, globalBenchmark: 88, description: 'Qartësia, koherenca dhe thellësia e arsyetimit ligjor në vendimet e marra.', commentary: 'Ka një përvojë të gjatë dhe njihet për vendime të argumentuara mirë, veçanërisht në çështje civile.' },
        { dimension: 'Efikasiteti dhe Menaxhimi i Çështjeve', score: 75, peerAverage: 75, globalBenchmark: 82, description: 'Shpejtësia e gjykimit të çështjeve.', commentary: 'Po punon për të reduktuar numrin e madh të çështjeve të prapambetura në Gjykatën e Lartë, por kjo mbetet një sfidë e madhe.' },
        { dimension: 'Integriteti dhe Etika Gjyqësore', score: 88, peerAverage: 85, globalBenchmark: 90, description: 'Sjellja profesionale dhe personale në përputhje me standardet etike.', commentary: 'Ka një imazh pozitiv dhe konsiderohet një figurë me integritet në sistemin e drejtësisë.' },
        { dimension: 'Kontributi në Jurisprudencë', score: 86, peerAverage: 82, globalBenchmark: 86, description: 'Ndikimi i vendimeve në zhvillimin e së drejtës.', commentary: 'Luan një rol kyç në procesin e unifikimit të praktikës gjyqësore, një funksion thelbësor i Gjykatës së Lartë.' }
    ]
  },
  {
    id: 'js2',
    name: 'Albana Boksi',
    imageUrl: 'https://www.gjykataelarte.gov.al/wp-content/uploads/2022/07/Albana-Boksi.jpg',
    category: 'Gjykata e Lartë',
    shortBio: 'Gjyqtare në Gjykatën e Lartë, e specializuar në çështje civile.',
    detailedBio: 'Albana Boksi është gjyqtare në Gjykatën e Lartë, me një specializim të thelluar në çështjet e të drejtës civile dhe tregtare. Ajo ka kontribuar në trajtimin e çështjeve komplekse ligjore dhe unifikimin e praktikës gjyqësore në këto fusha.',
    publicPerception: { positive: 40, neutral: 45, negative: 15 },
    professionalPerformance: { excellent: 45, good: 40, average: 15, needsImprovement: 0 },
    skillsDevelopment: { leadership: 20, communication: 25, expertise: 40, ethics: 15 },
    performanceAnalysis: [
        { dimension: 'Pavarësia dhe Paanshmëria Gjyqësore', score: 83, peerAverage: 78, globalBenchmark: 85, description: 'Aftësia për të marrë vendime të lira nga ndikimet politike dhe të jashtme.', commentary: 'Njihet si një profesioniste e përkushtuar ndaj ligjit, duke ruajtur pavarësinë në vendimmarrje.' },
        { dimension: 'Arsyetimi Ligjor dhe Cilësia e Vendimeve', score: 86, peerAverage: 80, globalBenchmark: 88, description: 'Qartësia, koherenca dhe thellësia e arsyetimit ligjor.', commentary: 'Vlerësohet për cilësinë e lartë të arsyetimit ligjor në vendimet e saj, veçanërisht në fushën civile.' },
        { dimension: 'Efikasiteti dhe Menaxhimi i Çështjeve', score: 80, peerAverage: 75, globalBenchmark: 82, description: 'Shpejtësia e gjykimit të çështjeve.', commentary: 'Kontribuon në mënyrë efikase në përballimin e ngarkesës së madhe të punës në Gjykatën e Lartë.' },
        { dimension: 'Integriteti dhe Etika Gjyqësore', score: 89, peerAverage: 85, globalBenchmark: 90, description: 'Sjellja profesionale dhe personale në përputhje me standardet etike.', commentary: 'Gëzon një reputacion të lartë për integritet dhe etikë profesionale.' },
        { dimension: 'Kontributi në Jurisprudencë', score: 84, peerAverage: 82, globalBenchmark: 86, description: 'Ndikimi i vendimeve në zhvillimin e së drejtës.', commentary: 'Vendimet e saj shërbejnë si referencë e rëndësishme për gjykatat më të ulëta në çështje civile dhe tregtare.' }
    ]
  },
  // Special Court (GJKKO)
  {
    id: 'jgjkko1',
    name: 'Irena Gjoka',
    imageUrl: 'https://cdn.balkanweb.com/wp-content/uploads/2023/12/Irena-Gjoka-GJKKO.jpg',
    category: 'Gjykata e Posaçme (GJKKO)',
    shortBio: 'Kryetare e Gjykatës së Posaçme kundër Korrupsionit dhe Krimit të Organizuar.',
    detailedBio: 'Irena Gjoka është Kryetarja e Gjykatës së Posaçme të Shkallës së Parë për Korrupsionin dhe Krimin e Organizuar (GJKKO). Ajo luan një rol kyç në luftën kundër korrupsionit në nivele të larta dhe krimit të organizuar, duke gjykuar disa nga çështjet më të ndjeshme dhe me interes të lartë publik në Shqipëri.',
    publicPerception: { positive: 35, neutral: 35, negative: 30 },
    professionalPerformance: { excellent: 40, good: 35, average: 15, needsImprovement: 10 },
    skillsDevelopment: { leadership: 30, communication: 20, expertise: 35, ethics: 15 },
    performanceAnalysis: [
        { dimension: 'Pavarësia dhe Paanshmëria Gjyqësore', score: 70, peerAverage: 75, globalBenchmark: 82, description: 'Aftësia për të marrë vendime të lira nga ndikimet politike.', commentary: 'Gjykimi i çështjeve të profilit të lartë politik e ka vënë në qendër të sulmeve dhe akuzave për anshmëri, duke e bërë perceptimin e pavarësisë së saj të diskutueshëm.' },
        { dimension: 'Arsyetimi Ligjor dhe Cilësia e Vendimeve', score: 78, peerAverage: 80, globalBenchmark: 85, description: 'Qartësia dhe koherenca e arsyetimit ligjor në vendime.', commentary: 'Vendimet e saj janë shpesh objekt debatesh, por në përgjithësi ndjekin një linjë të qartë procedurale.' },
        { dimension: 'Menaxhimi i Çështjeve të Ndjeshme', score: 85, peerAverage: 80, globalBenchmark: 84, description: 'Aftësia për të menaxhuar çështje me presion të lartë mediatik dhe politik.', commentary: 'Ka treguar aftësi për të menaxhuar disa nga çështjet më të bujshme në vend, duke ruajtur qetësinë në seanca.' },
        { dimension: 'Integriteti dhe Etika Gjyqësore', score: 72, peerAverage: 85, globalBenchmark: 90, description: 'Sjellja profesionale dhe personale në përputhje me standardet etike.', commentary: 'Reputacioni i saj për integritet është sulmuar vazhdimisht nga palët e akuzuara, gjë që ka ndikuar në perceptimin publik.' },
        { dimension: 'Ndikimi në Luftën Kundër Korrupsionit', score: 88, peerAverage: 82, globalBenchmark: 86, description: 'Roli i vendimeve në luftën kundër korrupsionit dhe krimit të organizuar.', commentary: 'Si kryetare e GJKKO, vendimet e saj kanë një ndikim të drejtpërdrejtë dhe të rëndësishëm në luftën kundër pandëshkueshmërisë.' }
    ]
  },
  {
    id: 'jgjkko2',
    name: 'Florian Kalaja',
    imageUrl: 'https://www.dosja.al/wp-content/uploads/2023/10/Florjan-Kalaja.jpg',
    category: 'Gjykata e Posaçme (GJKKO)',
    shortBio: 'Gjyqtar në Gjykatën e Posaçme, i angazhuar në çështje të krimit të organizuar.',
    detailedBio: 'Florian Kalaja është një gjyqtar në Gjykatën e Posaçme (GJKKO), i cili është i angazhuar në gjykimin e çështjeve komplekse që lidhen me krimin e organizuar dhe korrupsionin. Puna e tij është pjesë e përpjekjeve të Shqipërisë për të forcuar sundimin e ligjit.',
    publicPerception: { positive: 38, neutral: 40, negative: 22 },
    professionalPerformance: { excellent: 42, good: 38, average: 15, needsImprovement: 5 },
    skillsDevelopment: { leadership: 25, communication: 25, expertise: 35, ethics: 15 },
    performanceAnalysis: [
        { dimension: 'Pavarësia dhe Paanshmëria Gjyqësore', score: 80, peerAverage: 75, globalBenchmark: 82, description: 'Aftësia për të marrë vendime të lira nga ndikimet politike.', commentary: 'Njihet për një qasje strikte dhe teknike, duke u fokusuar te provat dhe procedura, gjë që forcon perceptimin e pavarësisë së tij.' },
        { dimension: 'Arsyetimi Ligjor dhe Cilësia e Vendimeve', score: 82, peerAverage: 80, globalBenchmark: 85, description: 'Qartësia dhe koherenca e arsyetimit ligjor në vendime.', commentary: 'Vendimet e tij karakterizohen nga një arsyetim i detajuar procedural dhe ligjor.' },
        { dimension: 'Menaxhimi i Çështjeve të Ndjeshme', score: 83, peerAverage: 80, globalBenchmark: 84, description: 'Aftësia për të menaxhuar çështje me presion të lartë.', commentary: 'Menaxhon seancat me profesionalizëm dhe qetësi, edhe nën presion të lartë mediatik.' },
        { dimension: 'Integriteti dhe Etika Gjyqësore', score: 86, peerAverage: 85, globalBenchmark: 90, description: 'Sjellja profesionale dhe personale në përputhje me standardet etike.', commentary: 'Gëzon një reputacion pozitiv për integritetin e tij profesional brenda sistemit të drejtësisë.' },
        { dimension: 'Ndikimi në Luftën Kundër Korrupsionit', score: 85, peerAverage: 82, globalBenchmark: 86, description: 'Roli i vendimeve në luftën kundër korrupsionit.', commentary: 'Si anëtar i GJKKO, puna e tij është thelbësore dhe ka ndikim direkt në luftën kundër krimit dhe korrupsionit.' }
    ]
  },
   // More Judges
  {
    id: 'jc3',
    name: 'Marsida Xhaferllari',
    imageUrl: 'https://www.gjk.gov.al/wp-content/uploads/2020/12/Marsida-Xhaferllari.jpg',
    category: 'Gjykata Kushtetuese',
    shortBio: 'Gjyqtare në Gjykatën Kushtetuese.',
    detailedBio: 'Marsida Xhaferllari është anëtare e Gjykatës Kushtetuese, duke sjellë përvojën e saj të mëparshme si juriste dhe zyrtare e lartë në institucione të drejtësisë. Ajo kontribuon në vendimmarrjen e gjykatës për çështje me rëndësi themelore për shtetin e së drejtës.',
    publicPerception: { positive: 47, neutral: 43, negative: 10 },
    professionalPerformance: { excellent: 49, good: 41, average: 10, needsImprovement: 0 },
    skillsDevelopment: { leadership: 22, communication: 23, expertise: 40, ethics: 15 },
    performanceAnalysis: [
        { dimension: 'Pavarësia dhe Paanshmëria Gjyqësore', score: 86, peerAverage: 80, globalBenchmark: 88, description: 'Aftësia për të marrë vendime të lira nga ndikimet.', commentary: 'Ka demonstruar pavarësi në vendimmarrje, duke u bazuar në argumente të forta kushtetuese.' },
        { dimension: 'Arsyetimi Ligjor dhe Cilësia e Vendimeve', score: 85, peerAverage: 82, globalBenchmark: 90, description: 'Qartësia dhe thellësia e arsyetimit ligjor.', commentary: 'Vlerësohet për vendime të strukturuara mirë dhe me arsyetim të qartë ligjor.' },
        { dimension: 'Efikasiteti dhe Menaxhimi i Çështjeve', score: 83, peerAverage: 78, globalBenchmark: 85, description: 'Shpejtësia e gjykimit pa kompromentuar cilësinë.', commentary: 'Kontribuon pozitivisht në ritmin e punës së gjykatës.' },
        { dimension: 'Integriteti dhe Etika Gjyqësore', score: 91, peerAverage: 85, globalBenchmark: 92, description: 'Përputhja me standardet më të larta etike.', commentary: 'Ka një reputacion të shkëlqyer për integritet, i cili forcon besimin publik te institucioni.' },
        { dimension: 'Kontributi në Jurisprudencë', score: 82, peerAverage: 80, globalBenchmark: 85, description: 'Ndikimi në zhvillimin e së drejtës kushtetuese.', commentary: 'Ka dhënë kontribut në disa çështje me rëndësi, duke ndihmuar në qartësimin e normave kushtetuese.' }
    ]
  },
  {
    id: 'js3',
    name: 'Ervin Pupe',
    imageUrl: 'https://www.gjykataelarte.gov.al/wp-content/uploads/2022/07/Ervin-Pupe.jpg',
    category: 'Gjykata e Lartë',
    shortBio: 'Gjyqtar në Gjykatën e Lartë.',
    detailedBio: 'Ervin Pupe është gjyqtar në Gjykatën e Lartë, i njohur për kontributin e tij në fushën e të drejtës administrative. Vendimet e tij ndihmojnë në formimin e praktikës gjyqësore për marrëdhëniet midis qytetarëve dhe administratës publike.',
    publicPerception: { positive: 42, neutral: 43, negative: 15 },
    professionalPerformance: { excellent: 46, good: 40, average: 14, needsImprovement: 0 },
    skillsDevelopment: { leadership: 21, communication: 24, expertise: 40, ethics: 15 },
    performanceAnalysis: [
        { dimension: 'Pavarësia dhe Paanshmëria Gjyqësore', score: 82, peerAverage: 78, globalBenchmark: 85, description: 'Aftësia për të marrë vendime të lira nga ndikimet.', commentary: 'Njihet si gjyqtar i pavarur me një qasje të fortë teknike ndaj çështjeve.' },
        { dimension: 'Arsyetimi Ligjor dhe Cilësia e Vendimeve', score: 87, peerAverage: 80, globalBenchmark: 88, description: 'Qartësia dhe thellësia e arsyetimit ligjor.', commentary: 'Shquhet për vendime me arsyetim të thelluar në fushën e të drejtës administrative.' },
        { dimension: 'Efikasiteti dhe Menaxhimi i Çështjeve', score: 79, peerAverage: 75, globalBenchmark: 82, description: 'Shpejtësia e gjykimit të çështjeve.', commentary: 'Punon me efikasitet për të përballuar volumin e çështjeve administrative.' },
        { dimension: 'Integriteti dhe Etika Gjyqësore', score: 88, peerAverage: 85, globalBenchmark: 90, description: 'Përputhja me standardet më të larta etike.', commentary: 'Gëzon një reputacion të mirë për sa i përket etikës dhe integritetit.' },
        { dimension: 'Kontributi në Jurisprudencë', score: 85, peerAverage: 82, globalBenchmark: 86, description: 'Ndikimi në zhvillimin e së drejtës.', commentary: 'Ka dhënë një kontribut të rëndësishëm në unifikimin e praktikës së të drejtës administrative në Shqipëri.' }
    ]
  },
];