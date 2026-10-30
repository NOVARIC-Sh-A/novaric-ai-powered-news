// data/citationRegistry.ts
// Deduplicated, authoritative academic citations across NOVARIC® framework surfaces

export interface CitationCitingPage {
  page: 'maragonFramework' | 'methodology' | 'standards' | 'articleIntegrity';
  anchorId: string;
  label: string;
}

export interface CitationEntry {
  id: string; // ref:<slug>
  citation_text: string;
  url: string;
  credibility_industry_rating_pct: number;
  authors: string;
  year: number;
  title: string;
  publisher: string;
  academic_category:
    | 'media_systems'
    | 'journalism_ethics'
    | 'framing'
    | 'political_economy'
    | 'critical_theory'
    | 'philosophy'
    | 'information_disorder'
    | 'computational_journalism'
    | 'democracy';
  citing_pages: CitationCitingPage[];
}

export const CITATION_REGISTRY: Record<string, CitationEntry> = {
  'ref:hallin-mancini-2004': {
    id: 'ref:hallin-mancini-2004',
    citation_text: 'Hallin, D. C., & Mancini, P. (2004). Comparing media systems: Three models of media and politics. Cambridge University Press.',
    url: 'https://www.cambridge.org/core/books/comparing-media-systems/9780521543088',
    credibility_industry_rating_pct: 98,
    authors: 'Daniel C. Hallin & Paolo Mancini',
    year: 2004,
    title: 'Comparing media systems: Three models of media and politics',
    publisher: 'Cambridge University Press',
    academic_category: 'media_systems',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:R1.1',
        label: 'MARAGON R1.1 Pajtueshmëria Rregullatore',
      },
    ],
  },
  'ref:kovach-rosenstiel-2014': {
    id: 'ref:kovach-rosenstiel-2014',
    citation_text: 'Kovach, B., & Rosenstiel, T. (2014). The elements of journalism: What newspeople should know and the public should expect (3rd ed.). Three Rivers Press.',
    url: 'https://www.amazon.com/Elements-Journalism-What-Newspeople-Should/dp/0804136787',
    credibility_industry_rating_pct: 98,
    authors: 'Bill Kovach & Tom Rosenstiel',
    year: 2014,
    title: 'The elements of journalism: What newspeople should know and the public should expect',
    publisher: 'Three Rivers Press',
    academic_category: 'journalism_ethics',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:R1.2',
        label: 'MARAGON R1.2 Pajtueshmëria Etike',
      },
      {
        page: 'methodology',
        anchorId: 'citations',
        label: 'Metodologjia: Korpusi Shkencor (Kovach & Rosenstiel 2014)',
      },
      {
        page: 'standards',
        anchorId: 'clause-ETIK-3.1A',
        label: 'Kodi i Standardeve: Neni 3.1 Detyrimi ndaj së Vërtetës',
      },
    ],
  },
  'ref:entman-1993': {
    id: 'ref:entman-1993',
    citation_text: 'Entman, R. M. (1993). Framing: Toward clarification of a fractured paradigm. Journal of Communication, 43(4), 51–58.',
    url: 'https://academic.oup.com/joc/article/43/4/51/4552467',
    credibility_industry_rating_pct: 97,
    authors: 'Robert M. Entman',
    year: 1993,
    title: 'Framing: Toward clarification of a fractured paradigm',
    publisher: 'Journal of Communication, Oxford University Press',
    academic_category: 'framing',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:A2.2',
        label: 'MARAGON A2.2 Paanshmëria & Anshmëria',
      },
    ],
  },
  'ref:davies-2008': {
    id: 'ref:davies-2008',
    citation_text: 'Davies, N. (2008). Flat earth news: An award-winning reporter exposes falsehood, distortion and propaganda in the global media. Chatto & Windus.',
    url: 'https://www.tandfonline.com/loi/cjcs20',
    credibility_industry_rating_pct: 90,
    authors: 'Nick Davies',
    year: 2008,
    title: 'Flat earth news: An award-winning reporter exposes falsehood, distortion and propaganda',
    publisher: 'Chatto & Windus',
    academic_category: 'critical_theory',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:A2.3',
        label: 'MARAGON A2.3 Origjinaliteti & Thellësia',
      },
    ],
  },
  'ref:iyengar-1991': {
    id: 'ref:iyengar-1991',
    citation_text: 'Iyengar, S. (1991). Is anyone responsible? How television frames political issues. University of Chicago Press.',
    url: 'https://press.uchicago.edu/ucp/books/book/chicago/I/bo3631024.html',
    credibility_industry_rating_pct: 96,
    authors: 'Shanto Iyengar',
    year: 1991,
    title: 'Is anyone responsible? How television frames political issues',
    publisher: 'University of Chicago Press',
    academic_category: 'framing',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:A2.4',
        label: 'MARAGON A2.4 Kontekstualizimi',
      },
    ],
  },
  'ref:mungiu-pippidi-2013': {
    id: 'ref:mungiu-pippidi-2013',
    citation_text: "Mungiu-Pippidi, A. (2013). Freedom without impartiality: The Vicious Circle of media capture. In P. N. Howard (Ed.), Democracy's fourth wave? (pp. 45-66). Oxford University Press.",
    url: 'https://academic.oup.com/book/7328',
    credibility_industry_rating_pct: 93,
    authors: 'Alina Mungiu-Pippidi',
    year: 2013,
    title: 'Freedom without impartiality: The Vicious Circle of media capture',
    publisher: 'Oxford University Press',
    academic_category: 'political_economy',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:G3.1',
        label: 'MARAGON G3.1 Ndikimi i Pronësisë',
      },
      {
        page: 'methodology',
        anchorId: 'citations',
        label: 'Metodologjia: Korpusi Shkencor (Mungiu-Pippidi 2013)',
      },
      {
        page: 'standards',
        anchorId: 'clause-TRANSP-4.1A',
        label: 'Kodi i Standardeve: Neni 4.1 Pronësia & Pavarësia',
      },
    ],
  },
  'ref:bourdieu-1998': {
    id: 'ref:bourdieu-1998',
    citation_text: 'Bourdieu, P. (1998). On Television. The New Press.',
    url: 'https://thenewpress.com/books/on-television',
    credibility_industry_rating_pct: 95,
    authors: 'Pierre Bourdieu',
    year: 1998,
    title: 'On Television',
    publisher: 'The New Press',
    academic_category: 'critical_theory',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:G3.2',
        label: 'MARAGON G3.2 Kontrolli Editorial',
      },
    ],
  },
  'ref:livingstone-2004': {
    id: 'ref:livingstone-2004',
    citation_text: 'Livingstone, S. (2004). Media literacy and the challenge of new information and communication technologies. The Communication Review, 7(1), 3–14.',
    url: 'https://www.tandfonline.com/doi/abs/10.1080/10714420490280152',
    credibility_industry_rating_pct: 94,
    authors: 'Sonia Livingstone',
    year: 2004,
    title: 'Media literacy and the challenge of new information and communication technologies',
    publisher: 'The Communication Review, Taylor & Francis',
    academic_category: 'media_systems',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:O4.1',
        label: 'MARAGON O4.1 Promovimi i Edukimit Mediatik',
      },
      {
        page: 'methodology',
        anchorId: 'citations',
        label: 'Metodologjia: Korpusi Shkencor (Livingstone 2004)',
      },
    ],
  },
  'ref:rosen-1999': {
    id: 'ref:rosen-1999',
    citation_text: 'Rosen, J. (1999). What are journalists for?. Yale University Press.',
    url: 'https://yalebooks.yale.edu/book/9780300084533/what-are-journalists-for/',
    credibility_industry_rating_pct: 93,
    authors: 'Jay Rosen',
    year: 1999,
    title: 'What are journalists for?',
    publisher: 'Yale University Press',
    academic_category: 'democracy',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:O4.2',
        label: 'MARAGON O4.2 Kontributi në Diskursin Demokratik',
      },
    ],
  },
  'ref:habermas-1989': {
    id: 'ref:habermas-1989',
    citation_text: 'Habermas, J. (1989). The structural transformation of the public sphere: An inquiry into a category of bourgeois society. MIT Press.',
    url: 'https://mitpress.mit.edu/9780262581081/the-structural-transformation-of-the-public-sphere/',
    credibility_industry_rating_pct: 98,
    authors: 'Jürgen Habermas',
    year: 1989,
    title: 'The structural transformation of the public sphere',
    publisher: 'MIT Press',
    academic_category: 'philosophy',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'vizioni',
        label: 'MARAGON Vizioni: Përtej Metrikave të Thjeshta',
      },
    ],
  },
  'ref:papacharissi-2010': {
    id: 'ref:papacharissi-2010',
    citation_text: 'Papacharissi, Z. (2010). A Private Sphere: Democracy in a Digital Age. Polity Press.',
    url: 'https://www.politybooks.com/bookdetail?book_slug=a-private-sphere-democracy-in-a-digital-age--9780745648873',
    credibility_industry_rating_pct: 92,
    authors: 'Zizi Papacharissi',
    year: 2010,
    title: 'A Private Sphere: Democracy in a Digital Age',
    publisher: 'Polity Press',
    academic_category: 'democracy',
    citing_pages: [
      {
        page: 'maragonFramework',
        anchorId: 'vizioni',
        label: 'MARAGON Vizioni: Përtej Metrikave të Thjeshta',
      },
    ],
  },
  'ref:chadwick-2017': {
    id: 'ref:chadwick-2017',
    citation_text: 'Chadwick, A. (2017). The Hybrid Media System: Politics and Power (2nd ed.). Oxford University Press.',
    url: 'https://global.oup.com/academic/product/the-hybrid-media-system-9780190696726',
    credibility_industry_rating_pct: 96,
    authors: 'Andrew Chadwick',
    year: 2017,
    title: 'The Hybrid Media System: Politics and Power',
    publisher: 'Oxford University Press',
    academic_category: 'media_systems',
    citing_pages: [
      {
        page: 'methodology',
        anchorId: 'citations',
        label: 'Metodologjia: Korpusi Shkencor (Chadwick 2017)',
      },
    ],
  },
  'ref:diakopoulos-2019': {
    id: 'ref:diakopoulos-2019',
    citation_text: 'Diakopoulos, N. (2019). Automating the News: How Algorithms Are Rewriting the Media. Harvard University Press.',
    url: 'https://www.hup.harvard.edu/books/9780674976986',
    credibility_industry_rating_pct: 97,
    authors: 'Nicholas Diakopoulos',
    year: 2019,
    title: 'Automating the News: How Algorithms Are Rewriting the Media',
    publisher: 'Harvard University Press',
    academic_category: 'computational_journalism',
    citing_pages: [
      {
        page: 'methodology',
        anchorId: 'meth:step-1',
        label: 'Metodologjia: Hapi 1 Analiza Fillestare nga IA',
      },
      {
        page: 'standards',
        anchorId: 'clause-MET-J',
        label: 'Kodi i Standardeve: Neni 2.J Inteligjenca Artificiale e Përgjegjshme',
      },
    ],
  },
  'ref:gadamer-1989': {
    id: 'ref:gadamer-1989',
    citation_text: 'Gadamer, H.-G. (1989). Truth and Method (2nd rev. ed., J. Weinsheimer & D. G. Marshall, Trans.). Continuum.',
    url: 'https://www.bloomsbury.com/us/truth-and-method-9781780936284/',
    credibility_industry_rating_pct: 99,
    authors: 'Hans-Georg Gadamer',
    year: 1989,
    title: 'Truth and Method',
    publisher: 'Continuum Publishing Group',
    academic_category: 'philosophy',
    citing_pages: [
      {
        page: 'methodology',
        anchorId: 'meth:step-3',
        label: 'Metodologjia: Hapi 3 Mbikëqyrja Hermeneutike',
      },
      {
        page: 'maragonFramework',
        anchorId: 'vleresimi-individe',
        label: 'MARAGON: Vlerësimi Granular - Individët',
      },
    ],
  },
  'ref:wardle-derakhshan-2017': {
    id: 'ref:wardle-derakhshan-2017',
    citation_text: 'Wardle, C., & Derakhshan, H. (2017). Information Disorder: Toward an interdisciplinary framework for research and policymaking. Council of Europe report DGI(2017)09.',
    url: 'https://edoc.coe.int/en/media/7495-information-disorder-toward-an-interdisciplinary-framework-for-research-and-policy-making.html',
    credibility_industry_rating_pct: 98,
    authors: 'Claire Wardle & Hossein Derakhshan',
    year: 2017,
    title: 'Information Disorder: Toward an interdisciplinary framework for research and policymaking',
    publisher: 'Council of Europe',
    academic_category: 'information_disorder',
    citing_pages: [
      {
        page: 'methodology',
        anchorId: 'dsa-emfa',
        label: 'Metodologjia: Parimi 1 Lufta Kundër Dezinformimit',
      },
      {
        page: 'standards',
        anchorId: 'clause-MET-B',
        label: 'Kodi i Standardeve: Neni 2.B Shqyrtimi i Provave',
      },
    ],
  },
};

export const getCitationById = (id: string): CitationEntry | undefined => {
  const normalizedId = id.startsWith('ref:') ? id : `ref:${id}`;
  return CITATION_REGISTRY[normalizedId];
};

export const getAllCitations = (): CitationEntry[] => {
  return Object.values(CITATION_REGISTRY);
};
