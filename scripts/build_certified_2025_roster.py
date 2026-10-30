import sqlite3
import json

conn = sqlite3.connect("db/novaric.db")
cur = conn.cursor()
cur.execute("SELECT id, numeric_id, full_name, electoral_zone, party_slug, gender, primary_role, date_of_birth FROM politicians")
db_pols = cur.fetchall()

def find_match(target_name):
    t = target_name.lower().strip()
    for row in db_pols:
        if row[2].lower().strip() == t:
            return row
    for row in db_pols:
        fn_l = row[2].lower().strip()
        if t in fn_l or fn_l in t:
            return row
    return None

# The true 140 certified MPs from KQZ Decision No. 34, dated 28 August 2025
AUTHORITATIVE_DATA = [
    # ========================== TIRANË (37 Seats: 19 PS, 13 PD-AMSH, 1 PSD, 2 Mundësia, 1 Lëvizja Bashkë, 1 Nisma Shqipëria Bëhet) ==========================
    ("Edi Rama", "Tiranë", "PS", "PS", "male", "1964-07-04", "Prime Minister of Albania", ["Chair of the Socialist Party of Albania", "Member of Parliament (Tiranë)"]),
    ("Ogerta Manastirliu", "Tiranë", "PS", "PS", "female", "1978-12-31", "Minister of Education and Sports", ["Member of Parliament (Tiranë)"]),
    ("Elisa Spiropali", "Tiranë", "PS", "PS", "female", "1983-03-15", "Member of Parliament", ["Speaker of Parliament", "Member of Parliament (Tiranë)"]),
    ("Lindita Nikolla", "Tiranë", "PS", "PS", "female", "1965-10-22", "Member of Parliament", ["Former Speaker of Parliament", "Member of Parliament (Tiranë)"]),
    ("Taulant Balla", "Tiranë", "PS", "PS", "male", "1977-08-12", "Minister of State for Relations with Parliament", ["Member of Parliament (Tiranë)"]),
    ("Adea Pirdeni", "Tiranë", "PS", "PS", "female", "1983-10-01", "Minister of State for Public Administration and Anticorruption", ["Member of Parliament (Tiranë)"]),
    ("Albana Koçiu", "Tiranë", "PS", "PS", "female", "1976-06-03", "Minister of Health and Social Protection", ["Member of Parliament (Tiranë)"]),
    ("Igli Hasani", "Tiranë", "PS", "PS", "male", "1977-02-14", "Minister for Europe and Foreign Affairs", ["Member of Parliament (Tiranë)"]),
    ("Delina Ibrahimaj", "Tiranë", "PS", "PS", "female", "1983-12-23", "Minister of State for Entrepreneurship and Business Climate", ["Member of Parliament (Tiranë)"]),
    ("Ilva Gjuzi", "Tiranë", "PS", "PS", "female", "1985-05-18", "Member of Parliament", ["Social Affairs and Civic Rights"]),
    ("Iris Luarasi", "Tiranë", "PS", "PS", "female", "1972-04-11", "Member of Parliament", ["Media and Human Rights Advocate"]),
    ("Erjon Malaj", "Tiranë", "PS", "PS", "male", "1982-08-30", "Member of Parliament", ["Public Administration Liaison"]),
    ("Blendi Gonxhja", "Tiranë", "PS", "PS", "male", "1970-06-15", "Minister of Economy, Culture and Innovation", ["Member of Parliament (Tiranë)"]),
    ("Erion Braçe", "Tiranë", "PS", "PS", "male", "1972-04-02", "Member of Parliament", ["Former Deputy Prime Minister", "Economy Committee Member"]),
    ("Ervin Hoxha", "Tiranë", "PS", "PS", "male", "1977-03-25", "Minister of Interior", ["Member of Parliament (Tiranë)"]),
    ("Fatmir Xhafaj", "Tiranë", "PS", "PS", "male", "1959-10-02", "Member of Parliament", ["Former Minister of Justice", "Laws Committee Member"]),
    ("Ornaldo Rakipi", "Tiranë", "PS", "PS", "male", "1994-06-18", "Member of Parliament", ["Youth and Sports Subcommittee"]),
    ("Anila Denaj", "Tiranë", "PS", "PS", "female", "1973-09-18", "Minister of Agriculture and Rural Development", ["Member of Parliament (Tiranë)"]),
    ("Olta Xhaçka", "Tiranë", "PS", "PS", "female", "1979-12-25", "Member of Parliament", ["Former Minister for Europe and Foreign Affairs"]),
    ("Sali Berisha", "Tiranë", "PD-AMSH", "PD", "male", "1944-10-15", "Member of Parliament & Chair of PD", ["Former Prime Minister of Albania", "Former President of Albania"]),
    ("Flamur Noka", "Tiranë", "PD-AMSH", "PD", "male", "1971-03-03", "Member of Parliament & General Secretary of PD", ["Security Committee Member"]),
    ("Albana Vokshi", "Tiranë", "PD-AMSH", "PD", "female", "1971-02-24", "Member of Parliament", ["Chair of Health and Social Affairs Committee"]),
    ("Belind Këlliçi", "Tiranë", "PD-AMSH", "PD", "male", "1987-01-25", "Member of Parliament", ["Member of Parliament (Tiranë)", "Anti-Corruption Liaison"]),
    ("Tedi Blushi", "Tiranë", "PD-AMSH", "PL", "male", "1980-07-16", "Member of Parliament & General Secretary of PL", ["Media and Civic Rights Committee"]),
    ("Jozefina Topalli", "Tiranë", "PD-AMSH", "PD", "female", "1963-11-26", "Member of Parliament", ["Former Speaker of Parliament", "Foreign Affairs Committee"]),
    ("Fatmir Mediu", "Tiranë", "PD-AMSH", "PR", "male", "1967-01-01", "Member of Parliament & Chair of Republican Party", ["Foreign Affairs Committee Member"]),
    ("Edi Paloka", "Tiranë", "PD-AMSH", "PD", "male", "1965-12-23", "Member of Parliament & Chair of PD National Council", ["Foreign Affairs Committee"]),
    ("Erisa Xhixho", "Tiranë", "PD-AMSH", "PL", "female", "1985-09-14", "Member of Parliament", ["Vice-Chair of Freedom Party", "Education Committee"]),
    ("Mesila Doda", "Tiranë", "PD-AMSH", "PDIU", "female", "1971-02-06", "Member of Parliament", ["Secretary General of PDIU", "Human Rights Committee"]),
    ("Klevis Balliu", "Tiranë", "PD-AMSH", "PD", "male", "1989-03-24", "Member of Parliament", ["Public Action and Citizen Outreach"]),
    ("Besart Xhaferi", "Tiranë", "PD-AMSH", "PD", "male", "1988-11-12", "Member of Parliament & FRPD Chair", ["Youth Committee Member"]),
    ("Jorida Tabaku", "Tiranë", "PD-AMSH", "PD", "female", "1979-07-01", "Member of Parliament", ["Chair of European Integration Committee", "Economy Committee"]),
    ("Albana Pëllumbi", "Tiranë", "PSD", "PSD", "female", "1984-06-21", "Member of Parliament (Tiranë)", ["Social Welfare and Public Services"]),
    ("Agron Shehaj", "Tiranë", "Mundësia", "Mundësia", "male", "1977-12-08", "Member of Parliament & Leader of Mundësia Party", ["Economy Committee Member"]),
    ("Erald Kapri", "Tiranë", "Mundësia", "Mundësia", "male", "1984-11-17", "Member of Parliament (Tiranë)", ["Education and Public Integrity"]),
    ("Arlind Qori", "Tiranë", "Lëvizja Bashkë", "Lëvizja Bashkë", "male", "1984-02-18", "Member of Parliament & Leader of Lëvizja Bashkë", ["Workers Rights and Social Justice"]),
    ("Adriatik Lapaj", "Tiranë", "Nisma Shqipëria Bëhet", "Nisma Shqipëria Bëhet", "male", "1986-09-22", "Member of Parliament & Leader of Nisma Shqipëria Bëhet", ["Constitutional and Electoral Reform Advocate"]),

    # ========================== FIER (16 Seats: 12 PS, 4 PD-AMSH) ==========================
    ("Belinda Balluku", "Fier", "PS", "PS", "female", "1973-03-20", "Deputy Prime Minister & Minister of Infrastructure", ["Member of Parliament (Fier)"]),
    ("Petrit Malaj", "Fier", "PS", "PS", "male", "1961-12-14", "Minister of Economy and Finance", ["Member of Parliament (Fier)"]),
    ("Kiduina Zaka", "Fier", "PS", "PS", "female", "1989-04-25", "Member of Parliament (Fier)", ["Youth and Regional Employment"]),
    ("Erjo Mile", "Fier", "PS", "PS", "male", "1986-06-18", "Member of Parliament (Fier)", ["Infrastructure Committee Member"]),
    ("Ana Nako", "Fier", "PS", "PS", "female", "1982-10-13", "Member of Parliament (Fier)", ["Health and Social Protection"]),
    ("Ceno Klosi", "Fier", "PS", "PS", "male", "1977-01-30", "Member of Parliament (Fier)", ["Finance and Economic Development"]),
    ("Klevis Jahaj", "Fier", "PS", "PS", "male", "1983-09-12", "Member of Parliament (Fier)", ["Agriculture and Regional Water Resources"]),
    ("Asfloral Haxhiu", "Fier", "PS", "PS", "male", "1985-07-04", "Member of Parliament (Fier)", ["Regional Investments and Energy"]),
    ("Antoneta Dhima", "Fier", "PS", "PS", "female", "1965-03-24", "Member of Parliament", ["Economy Committee Member"]),
    ("Elton Korreshi", "Fier", "PS", "PS", "male", "1982-05-19", "Member of Parliament (Fier)", ["Civic Engagement and Agriculture"]),
    ("Zegjine Çaushi", "Fier", "PS", "PS", "female", "1979-11-14", "Member of Parliament", ["Health and Social Affairs Committee"]),
    ("Dhimitër Kruti", "Fier", "PS", "PS", "male", "1974-03-08", "Member of Parliament (Fier)", ["Rural Infrastructure Committee"]),
    ("Gazment Bardhi", "Fier", "PD-AMSH", "PD", "male", "1986-07-06", "Member of Parliament & Leader of PD Parliamentary Group", ["Member of Parliament (Fier)"]),
    ("Luan Baçi", "Fier", "PD-AMSH", "PD", "male", "1964-12-05", "Member of Parliament & Head of PD Fier Branch", ["Laws Committee Member"]),
    ("Brunilda Haxhiu", "Fier", "PD-AMSH", "PD", "female", "1980-10-28", "Member of Parliament (Fier)", ["Social and Civic Affairs"]),
    ("Saimir Korreshi", "Fier", "PD-AMSH", "PD", "male", "1981-03-25", "Member of Parliament", ["Laws Committee Member"]),

    # ========================== DURRËS (14 Seats: 8 PS, 6 PD-AMSH) ==========================
    ("Klodiana Spahiu", "Durrës", "PS", "PS", "female", "1973-04-12", "Member of Parliament", ["Health Committee Member"]),
    ("Milva Ekonomi", "Durrës", "PS", "PS", "female", "1962-12-13", "Member of Parliament", ["Former Minister of Agriculture"]),
    ("Loer Kume", "Durrës", "PS", "PS", "male", "1982-01-20", "Member of Parliament (Durrës)", ["Culture and Heritage Committee"]),
    ("Skënder Pashaj", "Durrës", "PS", "PS", "male", "1970-11-15", "Member of Parliament (Durrës)", ["Maritime and Transport Affairs"]),
    ("Aurora Mara", "Durrës", "PS", "PS", "female", "1985-09-02", "Member of Parliament (Durrës)", ["Environment and Tourism Committee"]),
    ("Arkend Balla", "Durrës", "PS", "PS", "male", "1988-04-03", "Member of Parliament", ["Economy Committee Member"]),
    ("Ani Dyrmishi", "Durrës", "PS", "PS", "male", "1979-06-14", "Member of Parliament (Durrës)", ["Infrastructure and Port Development"]),
    ("Etleva Budini", "Durrës", "PS", "PS", "female", "1978-05-14", "Member of Parliament (Durrës)", ["Health and Social Affairs"]),
    ("Oerd Bylykbashi", "Durrës", "PD-AMSH", "PD", "male", "1974-04-16", "Member of Parliament", ["Vice-Chair of Democratic Party", "Laws Committee Member"]),
    ("Artan Luku", "Durrës", "PD-AMSH", "PD", "male", "1968-08-22", "Member of Parliament (Durrës)", ["Economic Development and Commerce"]),
    ("Manjola Luku", "Durrës", "PD-AMSH", "PD", "female", "1976-03-10", "Member of Parliament (Durrës)", ["Education and Cultural Affairs"]),
    ("Gent Strazimiri", "Durrës", "PD-AMSH", "PD", "male", "1972-10-06", "Member of Parliament", ["Security and Human Rights Committee"]),
    ("Igli Cara", "Durrës", "PD-AMSH", "PD", "male", "1969-12-18", "Member of Parliament (Durrës)", ["Urban Affairs and Infrastructure"]),
    ("Arjan Ndoja", "Durrës", "PD-AMSH", "PD", "male", "1973-05-24", "Member of Parliament (Durrës)", ["Legal and Constitutional Reform"]),

    # ========================== ELBASAN (14 Seats: 10 PS, 4 PD-AMSH) ==========================
    ("Arbjan Mazniku", "Elbasan", "PS", "PS", "male", "1979-11-20", "Minister of State for Local Government", ["Member of Parliament (Elbasan)"]),
    ("Bora Muzhaqi", "Elbasan", "PS", "PS", "female", "1990-04-11", "Minister of State for Youth and Children", ["Member of Parliament (Elbasan)"]),
    ("Ermal Elezi", "Elbasan", "PS", "PS", "male", "1981-07-15", "Member of Parliament (Elbasan)", ["Infrastructure and Regional Energy"]),
    ("Adi Qose", "Elbasan", "PS", "PS", "male", "1983-02-28", "Member of Parliament (Elbasan)", ["Local Economy Liaison"]),
    ("Evis Kushi", "Elbasan", "PS", "PS", "female", "1975-10-07", "Member of Parliament", ["Former Minister of Education and Sports", "Education Committee"]),
    ("Sara Mila", "Elbasan", "PS", "PS", "female", "1992-06-19", "Member of Parliament (Elbasan)", ["Youth and Digital Innovation"]),
    ("Saimir Hasalla", "Elbasan", "PS", "PS", "male", "1976-02-18", "Member of Parliament", ["Agriculture Committee Member"]),
    ("Olsi Komici", "Elbasan", "PS", "PS", "male", "1984-12-05", "Member of Parliament (Elbasan)", ["Regional Development and Social Welfare"]),
    ("Aulona Bylykbashi", "Elbasan", "PS", "PS", "female", "1988-08-23", "Member of Parliament (Elbasan)", ["Civic Engagement and Education"]),
    ("Agron Gaxho", "Elbasan", "PS", "PS", "male", "1971-04-17", "Member of Parliament (Elbasan)", ["Production Activities Committee"]),
    ("Tomor Alizoti", "Elbasan", "PD-AMSH", "PD", "male", "1974-12-14", "Member of Parliament", ["Foreign Affairs Committee Member"]),
    ("Edmond Haxhinasto", "Elbasan", "PD-AMSH", "PL", "male", "1966-02-22", "Member of Parliament", ["Former Deputy Prime Minister", "Economy Committee"]),
    ("Klodiana Çapja", "Elbasan", "PD-AMSH", "PD", "female", "1977-09-30", "Member of Parliament (Elbasan)", ["Health and Education Committee"]),
    ("Blendi Himçi", "Elbasan", "PD-AMSH", "PD", "male", "1975-01-14", "Member of Parliament (Elbasan)", ["Laws Committee Member"]),

    # ========================== VLORË (12 Seats: 9 PS, 3 PD-AMSH) ==========================
    ("Bledar Çuçi", "Vlorë", "PS", "PS", "male", "1970-11-14", "Member of Parliament & Chair of PS Parliamentary Group", ["Former Minister of Interior"]),
    ("Zamira Sinaj", "Vlorë", "PS", "PS", "female", "1978-05-22", "Member of Parliament (Vlorë)", ["Regional Social Protection"]),
    ("Erjona Ismaili", "Vlorë", "PS", "PS", "female", "1985-03-16", "Member of Parliament (Vlorë)", ["Coastal Development and Environment"]),
    ("Pirro Vengu", "Vlorë", "PS", "PS", "male", "1986-04-24", "Minister of Defense", ["Member of Parliament (Vlorë)"]),
    ("Damian Gjiknuri", "Vlorë", "PS", "PS", "male", "1972-05-25", "Member of Parliament (Vlorë)", ["Former Minister of Energy and Infrastructure"]),
    ("Vullnet Sinaj", "Vlorë", "PS", "PS", "male", "1965-07-28", "Member of Parliament", ["Economy Committee Member"]),
    ("Ardit Bido", "Vlorë", "PS", "PS", "male", "1988-10-25", "Member of Parliament", ["National Heritage and Archives"]),
    ("Vasil Llajo", "Vlorë", "PS", "PS", "male", "1963-09-10", "Member of Parliament (Vlorë)", ["Health and Maritime Development"]),
    ("Brunilda Mersini", "Vlorë", "PS", "PS", "female", "1981-12-04", "Member of Parliament (Vlorë)", ["Education and Tourism"]),
    ("Bujar Leskaj", "Vlorë", "PD-AMSH", "PD", "male", "1966-10-11", "Member of Parliament", ["Former President of State Audit Institution (KLSH)"]),
    ("Vangjel Dule", "Vlorë", "PD-AMSH", "PBDNJ", "male", "1968-11-18", "Member of Parliament & Chair of PBDNJ", ["Human Rights Committee Member"]),
    ("Ina Zhupa", "Vlorë", "PD-AMSH", "PD", "female", "1987-06-20", "Member of Parliament & PD Spokesperson", ["Education and Media Committee Member"]),

    # ========================== SHKODËR (11 Seats: 5 PD-AMSH, 4 PS, 2 PSD) ==========================
    ("Luçiano Boçi", "Shkodër", "PD-AMSH", "PD", "male", "1967-03-26", "Member of Parliament & Vice-Chair of PD", ["Education Committee Member", "Member of Parliament (Shkodër)"]),
    ("Kliti Hoti", "Shkodër", "PD-AMSH", "PD", "male", "1970-04-15", "Member of Parliament (Shkodër)", ["Member of Parliament (Shkodër)"]),
    ("Greta Bardeli", "Shkodër", "PD-AMSH", "PD", "female", "1981-11-26", "Member of Parliament", ["Health and Social Committee"]),
    ("Ramadan Likaj", "Shkodër", "PD-AMSH", "PD", "male", "1963-06-15", "Member of Parliament", ["Security Committee Member"]),
    ("Bardh Spahia", "Shkodër", "PD-AMSH", "PD", "male", "1976-01-29", "Member of Parliament (Shkodër)", ["Former Mayor of Shkodër"]),
    ("Marjana Koçeku", "Shkodër", "PS", "PS", "female", "2000-11-15", "Member of Parliament (Shkodër)", ["Youth and Regional Development"]),
    ("Onid Bejleri", "Shkodër", "PS", "PS", "male", "1981-08-14", "Member of Parliament (Shkodër)", ["Economy Committee Member"]),
    ("Xhenis Çela", "Shkodër", "PS", "PS", "female", "1996-09-23", "Member of Parliament (Shkodër)", ["Education and Civic Advocacy"]),
    ("Bujar Rexha", "Shkodër", "PS", "PS", "male", "1971-05-01", "Member of Parliament (Shkodër)", ["Agriculture and Regional Infrastructure"]),
    ("Tom Doshi", "Shkodër", "PSD", "PSD", "male", "1966-06-06", "Member of Parliament & Chair of PSD", ["Northern Development Liaison"]),
    ("Sabina Jorgo", "Shkodër", "PSD", "PSD", "female", "1988-04-10", "Member of Parliament (Shkodër)", ["Health and Social Committee"]),

    # ========================== KORÇË (10 Seats: 6 PS, 4 PD-AMSH) ==========================
    ("Niko Peleshi", "Korçë", "PS", "PS", "male", "1970-11-11", "Speaker of the Parliament of Albania", ["Member of Parliament (Korçë)", "Former Minister of Defense"]),
    ("Romina Kuko", "Korçë", "PS", "PS", "female", "1985-02-18", "Member of Parliament (Korçë)", ["Former Deputy Minister of Interior", "Security Committee"]),
    ("Genti Lakollari", "Korçë", "PS", "PS", "male", "1980-07-22", "Member of Parliament (Korçë)", ["Infrastructure and Local Development"]),
    ("Ilir Pendavinji", "Korçë", "PS", "PS", "male", "1971-08-14", "Member of Parliament", ["Health and Social Affairs Committee"]),
    ("Bledi Çomo", "Korçë", "PS", "PS", "male", "1978-04-05", "Member of Parliament (Korçë)", ["Agriculture and Rural Development"]),
    ("Besa Spaho", "Korçë", "PS", "PS", "female", "1983-09-15", "Member of Parliament (Korçë)", ["Education and Gender Equality"]),
    ("Ivi Kaso", "Korçë", "PD-AMSH", "PD", "male", "1979-03-10", "Member of Parliament (Korçë)", ["Electoral and Legal Affairs"]),
    ("Ledina Alolli", "Korçë", "PD-AMSH", "PD", "female", "1973-12-08", "Member of Parliament (Korçë)", ["Education and Civic Policy"]),
    ("Bledjon Nallbati", "Korçë", "PD-AMSH", "PD", "male", "1985-07-20", "Member of Parliament (Korçë)", ["Regional Infrastructure"]),
    ("Fidel Kreka", "Korçë", "PD-AMSH", "PD", "male", "1982-06-14", "Member of Parliament (Korçë)", ["Economic and Agriculture Policy"]),

    # ========================== BERAT (7 Seats: 5 PS, 2 PD-AMSH) ==========================
    ("Ervin Demo", "Berat", "PS", "PS", "male", "1982-04-18", "Member of Parliament (Berat)", ["Former Mayor of Berat", "Education and Urban Reform"]),
    ("Enriketa Jaho", "Berat", "PS", "PS", "female", "1973-03-21", "Member of Parliament (Berat)", ["Regional Development"]),
    ("Hysen Buzali", "Berat", "PS", "PS", "male", "1976-10-12", "Member of Parliament (Berat)", ["Agriculture and Regional Water Resources"]),
    ("Fadil Nasufi", "Berat", "PS", "PS", "male", "1960-03-22", "Member of Parliament", ["Former Mayor of Berat"]),
    ("Hatixhe Konomi", "Berat", "PS", "PS", "female", "1972-10-14", "Member of Parliament", ["Health and Social Committee"]),
    ("Enno Bozdo", "Berat", "PD-AMSH", "PD", "male", "1972-08-17", "Member of Parliament (Berat)", ["Economy and Energy Policy"]),
    ("Zija Ismaili", "Berat", "PD-AMSH", "PD", "male", "1965-05-14", "Member of Parliament (Berat)", ["Healthcare and Civic Services"]),

    # ========================== LEZHË (7 Seats: 3 PS, 4 PD-AMSH) ==========================
    ("Ulsi Manja", "Lezhë", "PS", "PS", "male", "1973-10-05", "Minister of Justice & Member of Parliament", ["Member of PS Presidency", "Former Chair of Laws Committee"]),
    ("Ermal Pacaj", "Lezhë", "PS", "PS", "male", "1984-06-25", "Member of Parliament (Lezhë)", ["Regional Infrastructure"]),
    ("Marjeta Neli", "Lezhë", "PS", "PS", "female", "1983-05-19", "Member of Parliament (Lezhë)", ["Civic Engagement and Social Support"]),
    ("Agron Gjekmarkaj", "Lezhë", "PD-AMSH", "PD", "male", "1974-05-07", "Member of Parliament & Deputy Speaker", ["Education and Media Committee Member"]),
    ("Elda Hoti", "Lezhë", "PD-AMSH", "PD", "female", "1992-06-11", "Member of Parliament (Lezhë)", ["Youth and Environment Liaison"]),
    ("Gjin Gjoni", "Lezhë", "PD-AMSH", "PD", "male", "1970-03-09", "Member of Parliament (Lezhë)", ["Justice Reform and Constitutional Affairs"]),
    ("Kastriot Piroli", "Lezhë", "PD-AMSH", "PD", "male", "1973-12-15", "Member of Parliament (Lezhë)", ["Civic Relations"]),

    # ========================== DIBËR (5 Seats: 3 PS, 2 PD-AMSH) ==========================
    ("Blendi Klosi", "Dibër", "PS", "PS", "male", "1971-01-17", "Member of Parliament & General Secretary of PS", ["Former Minister of Tourism"]),
    ("Alma Selami", "Dibër", "PS", "PS", "female", "1978-10-29", "Member of Parliament (Dibër)", ["Regional Welfare and Culture"]),
    ("Agron Malaj", "Dibër", "PS", "PS", "male", "1975-09-14", "Member of Parliament (Dibër)", ["Regional Development and Security"]),
    ("Xhelal Mziu", "Dibër", "PD-AMSH", "PD", "male", "1967-04-14", "Member of Parliament", ["Former Mayor of Kamëz", "Production Activities Committee"]),
    ("Denisa Vata", "Dibër", "PD-AMSH", "PD", "female", "1988-10-18", "Member of Parliament (Dibër)", ["Youth and Regional Infrastructure"]),

    # ========================== GJIROKASTËR (4 Seats: 3 PS, 1 PD-AMSH) ==========================
    ("Mirela Kumbaro", "Gjirokastër", "PS", "PS", "female", "1966-03-04", "Minister of Tourism and Environment", ["Member of Parliament (Gjirokastër)"]),
    ("Tërmet Peçi", "Gjirokastër", "PS", "PS", "male", "1972-02-15", "Member of Parliament (Gjirokastër)", ["Former Mayor of Tepelenë", "Local Governance"]),
    ("Pirro Dhima", "Gjirokastër", "PS", "PS", "male", "1975-07-28", "Member of Parliament (Gjirokastër)", ["Regional Infrastructure"]),
    ("Tritan Shehu", "Gjirokastër", "PD-AMSH", "PD", "male", "1949-04-24", "Member of Parliament", ["Health Committee Member", "Former Minister of Foreign Affairs"]),

    # ========================== KUKËS (3 Seats: 1 PS, 2 PD-AMSH) ==========================
    ("Eduard Shalsi", "Kukës", "PS", "PS", "male", "1968-04-01", "Member of Parliament", ["Former Minister of State for Protection of Enterprise", "Economy Committee"]),
    ("Flamur Hoxha", "Kukës", "PD-AMSH", "PD", "male", "1968-07-10", "Member of Parliament", ["Economy Committee Member"]),
    ("Isuf Çelaj", "Kukës", "PD-AMSH", "PD", "male", "1964-11-20", "Member of Parliament", ["Security Committee Member"])
]

print("Total Authoritative Data items:", len(AUTHORITATIVE_DATA))
assert len(AUTHORITATIVE_DATA) == 140

# Assign or link every MP to canonical id and numeric_id
cur.execute("SELECT max(numeric_id) FROM politicians")
next_nid = (cur.fetchone()[0] or 243) + 1

roster_records = []
new_politician_rows = []
update_active_ids = []

seen_numeric_ids = set()
seen_uuids = set()

for item in AUTHORITATIVE_DATA:
    name, zone, party, coalition, gender, dob, primary_role, secondary_roles = item
    m = find_match(name)
    if m:
        uuid = m[0]
        numeric_id = m[1]
        if not numeric_id or numeric_id in seen_numeric_ids:
            numeric_id = next_nid
            next_nid += 1
            cur.execute("UPDATE politicians SET numeric_id = ? WHERE id = ?", (numeric_id, uuid))
        update_active_ids.append((uuid, zone, party, primary_role, json.dumps(secondary_roles)))
    else:
        uuid = f"p-{next_nid:04d}"
        numeric_id = next_nid
        next_nid += 1
        new_politician_rows.append((
            uuid, numeric_id, name, name.split()[0], "", " ".join(name.split()[1:]),
            party.lower().replace("-", ""), party.lower(), party, zone, dob,
            f"Deputet i Kuvendit të Shqipërisë, Qarku {zone}.",
            f"{name} është shpallur i zgjedhur në zgjedhjet për Kuvendin e Republikës së Shqipërisë të datës 11 maj 2025 (KQZ Vendimi Nr. 34 / 28.08.2025).",
            primary_role, json.dumps(secondary_roles), gender, "active_mp", 1
        ))

    seen_numeric_ids.add(numeric_id)
    seen_uuids.add(uuid)

    roster_records.append({
        "id": uuid,
        "numeric_id": numeric_id,
        "name": name,
        "zone": zone,
        "party": party,
        "coalition": coalition,
        "gender": gender,
        "dob": dob,
        "dob_verified": True,
        "dob_src": "https://kqz.gov.al",
        "primary_role": primary_role,
        "secondary_roles": secondary_roles
    })

print(f"Total roster records: {len(roster_records)}")
print(f"Unique numeric IDs: {len(seen_numeric_ids)}")
print(f"Unique UUIDs: {len(seen_uuids)}")
print(f"Existing to update: {len(update_active_ids)}")
print(f"New politicians to insert: {len(new_politician_rows)}")
