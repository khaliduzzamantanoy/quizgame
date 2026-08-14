// ============================================
// QUIZ.EXE — game logic v2 (unlimited sources)
// ============================================

// ---------------------------------------------------------------
// CATEGORY CONFIG
//   bankId  -> local question bank key (null = merge all banks)
//   apiCat  -> Open Trivia Database category id (null = mixed feed)
// ---------------------------------------------------------------
const CATEGORIES = [
  { id: "mixed",     name: "MIXED / EVERYTHING",      bankId: null,       apiCat: null },
  { id: "countries", name: "COUNTRIES OF THE WORLD",  bankId: "countries", apiCat: 22 },
  { id: "geography", name: "GEOGRAPHY",               bankId: "geography", apiCat: 22 },
  { id: "general",   name: "GENERAL KNOWLEDGE",       bankId: "general",   apiCat: 9 },
  { id: "science",   name: "SCIENCE & NATURE",        bankId: "science",   apiCat: 17 },
  { id: "history",   name: "HISTORY",                 bankId: "history",   apiCat: 23 },
  { id: "computers", name: "COMPUTERS & TECH",        bankId: "computers", apiCat: 18 },
  { id: "sports",    name: "SPORTS",                  bankId: "sports",    apiCat: 21 },
  { id: "movies",    name: "MOVIES & TV",             bankId: "movies",    apiCat: 11 },
  { id: "music",     name: "MUSIC",                   bankId: "music",     apiCat: 12 },
  { id: "mythology", name: "MYTHOLOGY",               bankId: "mythology", apiCat: 20 },
  { id: "animals",   name: "ANIMALS",                 bankId: "animals",   apiCat: 27 },
  { id: "politics",  name: "POLITICS & CURRENT",      bankId: "politics",  apiCat: 24 },
  { id: "art",       name: "ART & LITERATURE",        bankId: "art",       apiCat: 10 }
];

// ---------------------------------------------------------------
// LANGUAGE CONFIG
//   NOTE: the online feed (opentdb) only returns ENGLISH questions —
//   it ignores any language parameter. Only languages with a local
//   bank are offered in the selector, so everything shown works.
//   bank   -> local bank key (null = not available locally)
// ---------------------------------------------------------------
const LANGUAGES = [
  { code: "en",    name: "ENGLISH / ENGLISH",        bank: "en" },
  { code: "bn",    name: "বাংলা / BENGALI (BD)",      bank: "bn" }
];

// ---------------------------------------------------------------
// LOCAL DATABASE (offline, always usable)
// ---------------------------------------------------------------
const LOCAL_BANK_EN = {
  general: [
    { q: "What does 'HTTP' stand for?", options: ["HyperText Transfer Protocol", "High Transfer Text Program", "Home Tool Transport Process", "HyperLink Text Transmission"], correct: 0 },
    { q: "How many colors are in a rainbow?", options: ["5", "6", "7", "8"], correct: 2 },
    { q: "What is the largest planet in our solar system?", options: ["Mars", "Jupiter", "Saturn", "Neptune"], correct: 1 },
    { q: "What is the tallest mountain on Earth?", options: ["K2", "Kilimanjaro", "Mount Everest", "Denali"], correct: 2 },
    { q: "How many bones are in the adult human body?", options: ["206", "201", "210", "196"], correct: 0 },
    { q: "What is the main ingredient of guacamole?", options: ["Tomato", "Onion", "Avocado", "Bell pepper"], correct: 2 },
    { q: "Which company created the iPhone?", options: ["Samsung", "Apple", "Google", "Nokia"], correct: 1 },
    { q: "What does 'www' stand for?", options: ["World Wide Web", "Wide World Web", "Web World Wide", "World Web Wide"], correct: 0 },
    { q: "Which planet is closest to the sun?", options: ["Venus", "Mercury", "Earth", "Mars"], correct: 1 },
    { q: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], correct: 1 },
    { q: "What is the currency of Japan?", options: ["Won", "Yuan", "Yen", "Ringgit"], correct: 2 },
    { q: "What is the hardest natural substance?", options: ["Iron", "Diamond", "Quartz", "Gold"], correct: 1 }
  ],
  countries: [
    { q: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2 },
    { q: "Which country has the largest land area?", options: ["China", "United States", "Russia", "Canada"], correct: 2 },
    { q: "Which country is known as the Land of the Rising Sun?", options: ["China", "Japan", "South Korea", "Thailand"], correct: 1 },
    { q: "What is the currency of Switzerland?", options: ["Euro", "Swiss Franc", "Krone", "Lira"], correct: 1 },
    { q: "Which country has the largest population?", options: ["China", "India", "United States", "Indonesia"], correct: 1 },
    { q: "Which country is home to the Eiffel Tower?", options: ["Germany", "France", "Italy", "Belgium"], correct: 1 },
    { q: "What is the capital city of Brazil?", options: ["Sao Paulo", "Rio de Janeiro", "Brasilia", "Salvador"], correct: 2 },
    { q: "Which African country has Cairo as its capital?", options: ["Libya", "Egypt", "Sudan", "Morocco"], correct: 1 },
    { q: "The Great Pyramids are located near which city?", options: ["Memphis", "Giza", "Aswan", "Alexandria"], correct: 1 },
    { q: "Which country is the smallest in the world?", options: ["Monaco", "Vatican City", "Malta", "San Marino"], correct: 1 },
    { q: "Which country's flag features a red maple leaf?", options: ["United States", "United Kingdom", "Canada", "Japan"], correct: 2 },
    { q: "What is the capital of Canada?", options: ["Ottawa", "Toronto", "Vancouver", "Montreal"], correct: 0 }
  ],
  geography: [
    { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
    { q: "What is considered the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: 1 },
    { q: "On which continent is the Sahara Desert?", options: ["Africa", "Asia", "Australia", "South America"], correct: 0 },
    { q: "What is the capital of Japan?", options: ["Osaka", "Kyoto", "Tokyo", "Sapporo"], correct: 2 },
    { q: "Near which country is the Great Barrier Reef?", options: ["Fiji", "Indonesia", "Australia", "Philippines"], correct: 2 },
    { q: "Mount Everest sits on the border of Nepal and which country?", options: ["India", "China", "Bhutan", "Pakistan"], correct: 1 },
    { q: "What is the smallest continent?", options: ["Antarctica", "Australia", "Asia", "Europe"], correct: 1 },
    { q: "What is the capital of Italy?", options: ["Milan", "Rome", "Naples", "Venice"], correct: 1 },
    { q: "How many continents are there?", options: ["5", "6", "7", "8"], correct: 2 },
    { q: "Which desert is the largest hot desert?", options: ["Sahara", "Gobi", "Kalahari", "Mojave"], correct: 0 },
    { q: "The Amazon River flows mainly through which country?", options: ["Argentina", "Chile", "Brazil", "Peru"], correct: 2 },
    { q: "What is the capital of Egypt?", options: ["Cairo", "Alexandria", "Giza", "Luxor"], correct: 0 },
    { q: "Which ocean is the deepest?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct: 1 }
  ],
  science: [
    { q: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
    { q: "H2O is commonly known as what?", options: ["Oxygen", "Salt", "Water", "Hydrogen peroxide"], correct: 2 },
    { q: "What is the largest organ in the human body?", options: ["Liver", "Skin", "Brain", "Heart"], correct: 1 },
    { q: "Which force pulls objects toward the Earth?", options: ["Magnetism", "Friction", "Gravity", "Inertia"], correct: 2 },
    { q: "Which gas do plants absorb from the air?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 1 },
    { q: "Approximately what is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "3,000,000 km/s", "30,000 km/s"], correct: 0 },
    { q: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correct: 2 },
    { q: "What is the pH of pure water?", options: ["0", "7", "14", "1"], correct: 1 },
    { q: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], correct: 2 },
    { q: "What is the smallest unit of life?", options: ["Cell", "Atom", "Molecule", "Organ"], correct: 0 },
    { q: "Who proposed the theory of relativity?", options: ["Newton", "Einstein", "Galileo", "Hawking"], correct: 1 },
    { q: "What does DNA stand for?", options: ["Deoxyribonucleic Acid", "Dinucleic Acid", "Deoxyribose Nucleotide Acid", "Double Nucleus Acid"], correct: 0 }
  ],
  history: [
    { q: "In what year did the Berlin Wall fall?", options: ["1987", "1989", "1991", "1993"], correct: 1 },
    { q: "Who wrote '1984'?", options: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "H.G. Wells"], correct: 2 },
    { q: "Who was the first President of the United States?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], correct: 1 },
    { q: "Who painted the Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Van Gogh", "Picasso"], correct: 1 },
    { q: "In which year did the Titanic sink?", options: ["1905", "1912", "1918", "1920"], correct: 1 },
    { q: "Which ancient civilization built the pyramids at Giza?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], correct: 2 },
    { q: "Who was the first person to walk on the Moon?", options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"], correct: 1 },
    { q: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], correct: 2 },
    { q: "The Magna Carta was signed in which year?", options: ["1066", "1215", "1492", "1517"], correct: 1 },
    { q: "Which empire was ruled by Julius Caesar?", options: ["Greek", "Roman", "Ottoman", "Persian"], correct: 1 },
    { q: "Who was known as the 'Iron Lady'?", options: ["Margaret Thatcher", "Indira Gandhi", "Angela Merkel", "Golda Meir"], correct: 0 },
    { q: "The French Revolution began in what year?", options: ["1789", "1776", "1860", "1815"], correct: 0 }
  ],
  computers: [
    { q: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Process Unit"], correct: 0 },
    { q: "Which language runs natively in the browser?", options: ["Python", "JavaScript", "C++", "Ruby"], correct: 1 },
    { q: "How many bits are in a byte?", options: ["4", "8", "16", "32"], correct: 1 },
    { q: "What does HTML stand for?", options: ["HyperText Markup Language", "HighText Modern Language", "HyperTransfer Markup Language", "Home Tool Markup Language"], correct: 0 },
    { q: "Who co-founded Microsoft?", options: ["Steve Jobs", "Bill Gates", "Larry Page", "Mark Zuckerberg"], correct: 1 },
    { q: "What does RAM stand for?", options: ["Random Access Memory", "Read Access Memory", "Rapid Access Module", "Random Allocator Module"], correct: 0 },
    { q: "What is the binary representation of the decimal number 2?", options: ["10", "11", "100", "01"], correct: 0 },
    { q: "What does URL stand for?", options: ["Uniform Resource Locator", "Universal Reference Link", "Unified Resource Label", "User Response Locator"], correct: 0 },
    { q: "Which of these is an operating system?", options: ["Windows", "Microsoft Office", "Photoshop", "Chrome"], correct: 0 },
    { q: "Who is credited with writing the first computer program?", options: ["Ada Lovelace", "Alan Turing", "Charles Babbage", "Grace Hopper"], correct: 0 },
    { q: "Which HTTP status code means 'Not Found'?", options: ["200", "404", "500", "301"], correct: 1 },
    { q: "What does GPU stand for?", options: ["Graphics Processing Unit", "General Purpose Unit", "Graphical Power Unit", "Gaming Processor Utility"], correct: 0 }
  ],
  sports: [
    { q: "How many players are on a soccer team on the pitch?", options: ["10", "11", "12", "9"], correct: 1 },
    { q: "Which country won the first FIFA World Cup?", options: ["Brazil", "Argentina", "Uruguay", "Italy"], correct: 2 },
    { q: "How many points is a touchdown worth in American football?", options: ["3", "6", "7", "2"], correct: 1 },
    { q: "Which sport uses a shuttlecock?", options: ["Tennis", "Badminton", "Squash", "Table Tennis"], correct: 1 },
    { q: "Usain Bolt became famous in which event?", options: ["Sprinting", "Marathon", "Shot put", "Long jump"], correct: 0 },
    { q: "What is the maximum score in a single frame of bowling?", options: ["100", "300", "500", "30"], correct: 1 },
    { q: "In tennis, what is a score of zero called?", options: ["Nil", "Love", "Zero", "Duck"], correct: 1 },
    { q: "How many rings are on the Olympic flag?", options: ["4", "5", "6", "7"], correct: 1 },
    { q: "Which country hosted the 2024 Summer Olympics?", options: ["France", "United States", "Japan", "China"], correct: 0 },
    { q: "In which sport do you hit a 'home run'?", options: ["Cricket", "Golf", "Baseball", "Tennis"], correct: 2 },
    { q: "Michael Jordan is widely famous for which sport?", options: ["Basketball", "Baseball", "American Football", "Boxing"], correct: 0 },
    { q: "How many minutes long is a standard NBA quarter?", options: ["10", "12", "15", "20"], correct: 1 }
  ],
  movies: [
    { q: "Who directed the film 'Titanic'?", options: ["James Cameron", "Christopher Nolan", "Steven Spielberg", "Ridley Scott"], correct: 0 },
    { q: "Which film popularized the line 'I'll be back'?", options: ["The Terminator", "Rocky", "Rambo", "Die Hard"], correct: 0 },
    { q: "Who played Iron Man in the Marvel Cinematic Universe?", options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correct: 1 },
    { q: "Who voiced Woody in 'Toy Story'?", options: ["Tom Hanks", "Tim Allen", "Robin Williams", "Steve Martin"], correct: 1 },
    { q: "What is the name of the wizarding school in 'Harry Potter'?", options: ["Hogwarts", "Beauxbatons", "Durmstrang", "Ilvermorny"], correct: 0 },
    { q: "Which actor stars in 'The Matrix'?", options: ["Keanu Reeves", "Will Smith", "Brad Pitt", "Tom Cruise"], correct: 0 },
    { q: "What is Darth Vader's real name?", options: ["Anakin Skywalker", "Luke Skywalker", "Obi-Wan Kenobi", "Mace Windu"], correct: 0 },
    { q: "Who directed 'Jurassic Park'?", options: ["James Cameron", "Steven Spielberg", "George Lucas", "Peter Jackson"], correct: 1 },
    { q: "Who played Jack Sparrow in 'Pirates of the Caribbean'?", options: ["Johnny Depp", "Orlando Bloom", "Keanu Reeves", "Hugh Jackman"], correct: 0 },
    { q: "Which studio produced 'The Lion King' (1994)?", options: ["Warner Bros.", "Disney", "DreamWorks", "Universal"], correct: 1 },
    { q: "Which franchise features the character 'Groot'?", options: ["DC", "Marvel", "Transformers", "Star Wars"], correct: 1 },
    { q: "Who is the main character in the 'Indiana Jones' films?", options: ["Jack Dalton", "Dr. Henry 'Indiana' Jones Jr.", "Nathan Drake", "Lara Croft"], correct: 1 },
    { q: "In which film does the character 'Forrest Gump' run across the USA?", options: ["Forrest Gump", "Cast Away", "Green Book", "Rain Man"], correct: 0 }
  ],
  music: [
    { q: "Which band performed 'Bohemian Rhapsody'?", options: ["The Rolling Stones", "Queen", "The Beatles", "Led Zeppelin"], correct: 1 },
    { q: "Who is known as the King of Pop?", options: ["Elvis Presley", "Michael Jackson", "Prince", "Madonna"], correct: 1 },
    { q: "How many strings does a standard guitar have?", options: ["5", "6", "7", "12"], correct: 1 },
    { q: "Who composed 'Fur Elise'?", options: ["Mozart", "Beethoven", "Bach", "Chopin"], correct: 1 },
    { q: "What is the highest female vocal range?", options: ["Alto", "Soprano", "Mezzo", "Contralto"], correct: 1 },
    { q: "Who performed 'Rolling in the Deep'?", options: ["Beyonce", "Adele", "Rihanna", "Lizzo"], correct: 1 },
    { q: "Which instrument has 88 keys?", options: ["Organ", "Piano", "Harpsichord", "Accordion"], correct: 1 },
    { q: "In which city was the band The Beatles formed?", options: ["London", "Liverpool", "Manchester", "Birmingham"], correct: 1 },
    { q: "Which music genre originated in New Orleans?", options: ["Rock", "Jazz", "Country", "Reggae"], correct: 1 },
    { q: "Who composed the opera 'The Magic Flute'?", options: ["Handel", "Mozart", "Verdi", "Wagner"], correct: 1 },
    { q: "Who is called the Queen of Pop?", options: ["Madonna", "Celine Dion", "Ariana Grande", "Taylor Swift"], correct: 0 },
    { q: "Which artist performed 'Gangnam Style'?", options: ["BTS", "PSY", "BLACKPINK", "EXO"], correct: 1 }
  ],
  mythology: [
    { q: "Who is the Greek god of the sea?", options: ["Zeus", "Poseidon", "Hades", "Ares"], correct: 1 },
    { q: "Who is the king of the Greek gods?", options: ["Zeus", "Poseidon", "Apollo", "Hades"], correct: 0 },
    { q: "Who is the Norse god of thunder?", options: ["Loki", "Thor", "Odin", "Baldr"], correct: 1 },
    { q: "Who is the Egyptian sun god?", options: ["Horus", "Ra", "Anubis", "Osiris"], correct: 1 },
    { q: "Which creature has snakes for hair and turns people to stone?", options: ["Sphinx", "Medusa", "Harpy", "Kraken"], correct: 1 },
    { q: "Who wields the hammer named Mjolnir?", options: ["Odin", "Thor", "Zeus", "Hercules"], correct: 1 },
    { q: "Who is the Greek hero famed for superhuman strength?", options: ["Achilles", "Hercules", "Perseus", "Jason"], correct: 1 },
    { q: "Who is the messenger god in Greek mythology?", options: ["Ares", "Hermes", "Dionysus", "Hephaestus"], correct: 1 },
    { q: "Who is the Roman god of war?", options: ["Jupiter", "Mars", "Neptune", "Vulcan"], correct: 1 },
    { q: "What is the three-headed dog that guards Hades called?", options: ["Cerberus", "Hydra", "Chimera", "Minotaur"], correct: 0 },
    { q: "Who is the Greek goddess of wisdom?", options: ["Aphrodite", "Athena", "Artemis", "Demeter"], correct: 1 },
    { q: "In Greek myth, who is the wife of Zeus?", options: ["Aphrodite", "Hera", "Persephone", "Athena"], correct: 1 }
  ],
  animals: [
    { q: "What is the largest animal on Earth?", options: ["African elephant", "Blue whale", "Giraffe", "Saltwater crocodile"], correct: 1 },
    { q: "How many legs does a spider have?", options: ["6", "8", "10", "12"], correct: 1 },
    { q: "What is the fastest land animal?", options: ["Cheetah", "Lion", "Horse", "Greyhound"], correct: 0 },
    { q: "What is a baby kangaroo called?", options: ["Joey", "Cub", "Calf", "Fawn"], correct: 0 },
    { q: "How many hearts does an octopus have?", options: ["1", "2", "3", "4"], correct: 2 },
    { q: "Which animal cannot jump?", options: ["Kangaroo", "Elephant", "Frog", "Rabbit"], correct: 1 },
    { q: "Which of these birds cannot fly?", options: ["Pigeon", "Penguin", "Hawk", "Sparrow"], correct: 1 },
    { q: "What is the only mammal capable of true flight?", options: ["Bat", "Flying squirrel", "Sugar glider", "Colugo"], correct: 0 },
    { q: "What is a group of lions called?", options: ["Pack", "Pride", "Herd", "Murder"], correct: 1 },
    { q: "Which animal is known as the King of the Jungle?", options: ["Tiger", "Lion", "Elephant", "Leopard"], correct: 1 },
    { q: "What do bees produce?", options: ["Silk", "Honey", "Wax", "Milk"], correct: 1 },
    { q: "What is the tallest animal on Earth?", options: ["Giraffe", "Elephant", "Ostrich", "Camel"], correct: 0 }
  ],
  politics: [
    { q: "How many stripes are on the United States flag?", options: ["10", "13", "50", "15"], correct: 1 },
    { q: "How many states are in the United States?", options: ["48", "49", "50", "51"], correct: 2 },
    { q: "Washington, D.C. is the capital of which country?", options: ["United Kingdom", "United States", "Canada", "Australia"], correct: 1 },
    { q: "In what year was the United Nations founded?", options: ["1945", "1939", "1950", "1918"], correct: 0 },
    { q: "How many member countries are in the United Nations (approx)?", options: ["152", "164", "193", "201"], correct: 2 },
    { q: "What is the head of government of Canada called?", options: ["President", "Prime Minister", "Chancellor", "Governor"], correct: 1 },
    { q: "Which document begins with the words 'We the People'?", options: ["Magna Carta", "US Constitution", "Declaration of Independence", "Bill of Rights"], correct: 1 },
    { q: "The G7 is a group of how many major economies?", options: ["5", "6", "7", "8"], correct: 2 },
    { q: "Which city serves as the de facto capital of the European Union?", options: ["Paris", "Brussels", "London", "Berlin"], correct: 1 },
    { q: "How many houses make up the UK Parliament?", options: ["One", "Two", "Three", "Four"], correct: 1 },
    { q: "Who was the first female Prime Minister of the United Kingdom?", options: ["Theresa May", "Margaret Thatcher", "Liz Truss", "Angela Merkel"], correct: 1 },
    { q: "Which US party uses the elephant as its symbol?", options: ["Democratic", "Republican", "Independent", "Green"], correct: 1 }
  ],
  art: [
    { q: "Which artist famously cut off part of his ear?", options: ["Picasso", "Van Gogh", "Monet", "Cezanne"], correct: 1 },
    { q: "Who painted 'Starry Night'?", options: ["Claude Monet", "Vincent van Gogh", "Salvador Dali", "Pablo Picasso"], correct: 1 },
    { q: "Who painted 'The Persistence of Memory' (melting clocks)?", options: ["Dali", "Munch", "Klimt", "Warhol"], correct: 0 },
    { q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], correct: 1 },
    { q: "Which novel was written by Jane Austen?", options: ["Wuthering Heights", "Pride and Prejudice", "Great Expectations", "Jane Eyre"], correct: 1 },
    { q: "Who wrote 'Moby-Dick'?", options: ["Herman Melville", "Ernest Hemingway", "Nathaniel Hawthorne", "Edgar Allan Poe"], correct: 0 },
    { q: "Which famous painting shows a woman with a mysterious smile?", options: ["The Scream", "Mona Lisa", "Girl with a Pearl Earring", "American Gothic"], correct: 1 },
    { q: "Who sculpted the statue of 'David'?", options: ["Michelangelo", "Donatello", "Bernini", "Rodin"], correct: 0 },
    { q: "What color do you get by mixing red and blue?", options: ["Green", "Purple", "Orange", "Brown"], correct: 1 },
    { q: "Who painted 'The Scream'?", options: ["Edvard Munch", "Gustav Klimt", "Jackson Pollock", "Francisco Goya"], correct: 0 },
    { q: "Who wrote 'The Great Gatsby'?", options: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "J.D. Salinger"], correct: 1 },
    { q: "Which art movement does Picasso's 'Guernica' belong to?", options: ["Impressionism", "Cubism", "Surrealism", "Pop Art"], correct: 1 }
  ]
};

// ---------------------------------------------------------------
// LOCAL DATABASE — BENGALI (বাংলা)
// ---------------------------------------------------------------
const LOCAL_BANK_BN = {
  general: [
    { q: "'HTTP' এর পূর্ণরূপ কী?", options: ["HyperText Transfer Protocol", "High Transfer Text Program", "Home Tool Transport Process", "HyperLink Text Transmission"], correct: 0 },
    { q: "রংধনুতে কয়টি রং থাকে?", options: ["5", "6", "7", "8"], correct: 2 },
    { q: "আমাদের সৌরজগতের বৃহত্তম গ্রহ কোনটি?", options: ["মঙ্গল", "বৃহস্পতি", "শনি", "নেপচুন"], correct: 1 },
    { q: "পৃথিবীর সর্বোচ্চ পর্বত কোনটি?", options: ["K2", "কিলিমাঞ্জারো", "এভারেস্ট", "ডেনালি"], correct: 2 },
    { q: "প্রাপ্তবয়স্ক মানুষের দেহে কয়টি হাড় থাকে?", options: ["২০৬", "২০১", "২১০", "১৯৬"], correct: 0 },
    { q: "আইফোন কোন কোম্পানি তৈরি করে?", options: ["স্যামসাং", "অ্যাপল", "গুগল", "নকিয়া"], correct: 1 },
    { q: "'www' এর পূর্ণরূপ কী?", options: ["ওয়ার্ল্ড ওয়াইড ওয়েব", "ওয়াইড ওয়ার্ল্ড ওয়েব", "ওয়েব ওয়ার্ল্ড ওয়াইড", "ওয়ার্ল্ড ওয়েব ওয়াইড"], correct: 0 },
    { q: "সূর্যের সবচেয়ে কাছের গ্রহ কোনটি?", options: ["শুক্র", "বুধ", "পৃথিবী", "মঙ্গল"], correct: 1 },
    { q: "ষড়ভুজের কয়টি বাহু থাকে?", options: ["৫", "৬", "৭", "৮"], correct: 1 },
    { q: "জাপানের মুদ্রা কী?", options: ["ওন", "ইউয়ান", "ইয়েন", "রিঙ্গিত"], correct: 2 },
    { q: "পৃথিবীর সবচেয়ে শক্ত প্রাকৃতিক পদার্থ কোনটি?", options: ["লোহা", "হীরক", "কোয়ার্টজ", "সোনা"], correct: 1 },
    { q: "গুয়াকামোলের প্রধান উপাদান কী?", options: ["টমেটো", "পেঁয়াজ", "অ্যাভোকাডো", "ক্যাপসিকাম"], correct: 2 }
  ],
  countries: [
    { q: "অস্ট্রেলিয়ার রাজধানী কোনটি?", options: ["সিডনি", "মেলবোর্ন", "ক্যানবেরা", "পার্থ"], correct: 2 },
    { q: "কোন দেশের আয়তন সবচেয়ে বেশি?", options: ["চীন", "যুক্তরাষ্ট্র", "রাশিয়া", "কানাডা"], correct: 2 },
    { q: "কোন দেশকে 'উদীয়মান সূর্যের দেশ' বলা হয়?", options: ["চীন", "জাপান", "দক্ষিণ কোরিয়া", "থাইল্যান্ড"], correct: 1 },
    { q: "সুইজারল্যান্ডের মুদ্রা কী?", options: ["ইউরো", "সুইস ফ্রাংক", "ক্রোনা", "লিরা"], correct: 1 },
    { q: "কোন দেশের জনসংখ্যা সবচেয়ে বেশি?", options: ["চীন", "ভারত", "যুক্তরাষ্ট্র", "ইন্দোনেশিয়া"], correct: 1 },
    { q: "আইফেল টাওয়ার কোন দেশে অবস্থিত?", options: ["জার্মানি", "ফ্রান্স", "ইতালি", "বেলজিয়াম"], correct: 1 },
    { q: "ব্রাজিলের রাজধানী শহর কোনটি?", options: ["সাও পাওলো", "রিও ডি জেনেইরো", "ব্রাসিলিয়া", "সালভাদর"], correct: 2 },
    { q: "কায়রো কোন দেশের রাজধানী?", options: ["লিবিয়া", "মিশর", "সুদান", "মরক্কো"], correct: 1 },
    { q: "পৃথিবীর ক্ষুদ্রতম দেশ কোনটি?", options: ["মোনাকো", "ভ্যাটিকান সিটি", "মাল্টা", "সান মারিনো"], correct: 1 },
    { q: "কোন দেশের পতাকায় লাল ম্যাপল পাতা আছে?", options: ["যুক্তরাষ্ট্র", "যুক্তরাজ্য", "কানাডা", "জাপান"], correct: 2 },
    { q: "কানাডার রাজধানী কোনটি?", options: ["অটোয়া", "টরন্টো", "ভ্যাঙ্কুভার", "মন্ট্রিল"], correct: 0 },
    { q: "গিজার পিরামিডগুলো কোন শহরের কাছে অবস্থিত?", options: ["মেমফিস", "গিজা", "আসওয়ান", "আলেকজান্দ্রিয়া"], correct: 1 }
  ],
  geography: [
    { q: "পৃথিবীর বৃহত্তম মহাসাগর কোনটি?", options: ["আটলান্টিক", "ভারতীয়", "আর্কটিক", "প্রশান্ত"], correct: 3 },
    { q: "বিশ্বের দীর্ঘতম নদী হিসেবে বিবেচিত কোনটি?", options: ["আমাজন", "নীল", "ইয়াংসি", "মিসিসিপি"], correct: 1 },
    { q: "সahara মরুভূমি কোন মহাদেশে অবস্থিত?", options: ["আফ্রিকা", "এশিয়া", "অস্ট্রেলিয়া", "দক্ষিণ আমেরিকা"], correct: 0 },
    { q: "জাপানের রাজধানী কোনটি?", options: ["ওসাকা", "কিয়োটো", "টোকিও", "সাপ্পোরো"], correct: 2 },
    { q: "ক্ষুদ্রতম মহাদেশ কোনটি?", options: ["অ্যান্টার্কটিকা", "অস্ট্রেলিয়া", "এশিয়া", "ইউরোপ"], correct: 1 },
    { q: "ইতালির রাজধানী কোনটি?", options: ["মিলান", "রোম", "নাপোলি", "ভেনিস"], correct: 1 },
    { q: "পৃথিবীতে কয়টি মহাদেশ আছে?", options: ["৫", "৬", "৭", "৮"], correct: 2 },
    { q: "বৃহত্তম উষ্ণ মরুভূমি কোনটি?", options: ["সahara", "গোবি", "কালাহারি", "মোজাভে"], correct: 0 },
    { q: "আমাজন নদী মূলত কোন দেশের মধ্য দিয়ে প্রবাহিত?", options: ["আর্জেন্টিনা", "চিলি", "ব্রাজিল", "পেরু"], correct: 2 },
    { q: "মিশরের রাজধানী কোনটি?", options: ["কায়রো", "আলেকজান্দ্রিয়া", "গিজা", "লুক্সর"], correct: 0 }
  ],
  science: [
    { q: "সোনার রাসায়নিক সংকেত কী?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
    { q: "H2O সাধারণত কী নামে পরিচিত?", options: ["অক্সিজেন", "লবণ", "পানি", "হাইড্রোজেন পারক্সাইড"], correct: 2 },
    { q: "মানবদেহের বৃহত্তম অঙ্গ কোনটি?", options: ["যকৃত", "চামড়া", "মস্তিষ্ক", "হৃৎপিণ্ড"], correct: 1 },
    { q: "কোন শক্তি বস্তুকে পৃথিবীর দিকে টানে?", options: ["চুম্বকত্ব", "ঘর্ষণ", "মাধ্যাকর্ষণ", "জড়তা"], correct: 2 },
    { q: "কোন গ্রহ 'লাল গ্রহ' নামে পরিচিত?", options: ["শুক্র", "বৃহস্পতি", "মঙ্গল", "শনি"], correct: 2 },
    { q: "জীবনের ক্ষুদ্রতম একক কোনটি?", options: ["কোষ", "পরমাণু", "অণু", "অঙ্গ"], correct: 0 },
    { q: "DNA এর পূর্ণরূপ কী?", options: ["Deoxyribonucleic Acid", "Dinucleic Acid", "Deoxyribose Nucleotide Acid", "Double Nucleus Acid"], correct: 0 },
    { q: "আপেক্ষিকতার তত্ত্ব কে দেন?", options: ["নিউটন", "আইনস্টাইন", "গ্যালিলিও", "হকিং"], correct: 1 }
  ],
  history: [
    { q: "বার্লিন প্রাচীর কোন সালে পতিত হয়?", options: ["১৯৮৭", "১৯৮৯", "১৯৯১", "১৯৯৩"], correct: 1 },
    { q: "'১৯৮৪' বইটি কে লিখেছেন?", options: ["অ্যালডাস হাক্সলি", "রে ব্র্যাডবেরি", "জর্জ অরওয়েল", "এইচ.জি. ওয়েলস"], correct: 2 },
    { q: "মোনালিসা কে এঁকেছিলেন?", options: ["মাইকেলেঞ্জেলো", "লিওনার্দো দা ভিঞ্চি", "ভ্যান গগ", "পিকাসো"], correct: 1 },
    { q: "টাইটানিক কোন সালে ডুবে যায়?", options: ["১৯০৫", "১৯১২", "১৯১৮", "১৯২০"], correct: 1 },
    { q: "চাঁদে প্রথম মানুষ হিসেবে পা রাখেন কে?", options: ["বাজ অলড্রিন", "নিল আর্মস্ট্রং", "ইউরি গ্যাগারিন", "জন গ্লেন"], correct: 1 },
    { q: "দ্বিতীয় বিশ্বযুদ্ধ কোন সালে শেষ হয়?", options: ["১৯৪৩", "১৯৪৪", "১৯৪৫", "১৯৪৬"], correct: 2 },
    { q: "'আয়রন লেডি' নামে কে পরিচিত ছিলেন?", options: ["মার্গারেট থ্যাচার", "ইন্দিরা গান্ধী", "অ্যাঙ্গেলা মের্কেল", "গোল্ডা মেয়ার"], correct: 0 }
  ],
  computers: [
    { q: "CPU এর পূর্ণরূপ কী?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Process Unit"], correct: 0 },
    { q: "কোন ভাষা ব্রাউজারে নেটিভভাবে চলে?", options: ["পাইথন", "জাভাস্ক্রিপ্ট", "C++", "রুবি"], correct: 1 },
    { q: "এক বাইটে কয়টি বিট থাকে?", options: ["৪", "৮", "১৬", "৩২"], correct: 1 },
    { q: "HTML এর পূর্ণরূপ কী?", options: ["HyperText Markup Language", "HighText Modern Language", "HyperTransfer Markup Language", "Home Tool Markup Language"], correct: 0 },
    { q: "মাইক্রোসফটের সহ-প্রতিষ্ঠাতা কে?", options: ["স্টিভ জবস", "বিল গেটস", "ল্যারি পেজ", "মার্ক জাকারবার্গ"], correct: 1 },
    { q: "কোনটি একটি অপারেটিং সিস্টেম?", options: ["উইন্ডোজ", "মাইক্রোসফট অফিস", "ফটোশপ", "ক্রোম"], correct: 0 }
  ],
  sports: [
    { q: "ফুটবল মাঠে কতজন খেলোয়াড় থাকে?", options: ["১০", "১১", "১২", "৯"], correct: 1 },
    { q: "প্রথম ফিফা বিশ্বকাপ কোন দেশ জিতেছে?", options: ["ব্রাজিল", "আর্জেন্টিনা", "উরুগুয়ে", "ইতালি"], correct: 2 },
    { q: "অলিম্পিক পতাকায় কয়টি রিং থাকে?", options: ["৪", "৫", "৬", "৭"], correct: 1 },
    { q: "২০২৪ গ্রীষ্মকালীন অলিম্পিক কোন দেশে অনুষ্ঠিত হয়?", options: ["ফ্রান্স", "যুক্তরাষ্ট্র", "জাপান", "চীন"], correct: 0 },
    { q: "মাইকেল জর্ডান কোন খেলার জন্য বিখ্যাত?", options: ["বাস্কেটবল", "বেসবল", "আমেরিকান ফুটবল", "বক্সিং"], correct: 0 }
  ],
  movies: [
    { q: "'টাইটানিক' চলচ্চিত্রের পরিচালক কে?", options: ["জেমস ক্যামেরন", "ক্রিস্টোফার নোলান", "স্টিভেন স্পিলবার্গ", "রিডলি স্কট"], correct: 0 },
    { q: "'আই উইল বি ব্যাক' লাইনটি কোন চলচ্চিত্রে জনপ্রিয় হয়?", options: ["দ্য টার্মিনেটর", "রকি", "র্যাম্বো", "ডাই হার্ড"], correct: 0 },
    { q: "মার্ভেল সিনেমাটিক ইউনিভার্সে আয়রন ম্যান কে অভিনয় করেন?", options: ["ক্রিস ইভান্স", "রবার্ট ডাউনি জুনিয়র", "ক্রিস হেমসওয়ার্থ", "মার্ক রাফালো"], correct: 1 },
    { q: "'হ্যারি পটার'-এ জাদু স্কুলটির নাম কী?", options: ["হগওয়ার্টস", "বোউক্সবাটনস", "ডার্মস্ট্রাং", "ইলভারমর্নি"], correct: 0 }
  ],
  music: [
    { q: "'বোহেমিয়ান র‍্যাপসডি' কোন ব্যান্ড গেয়েছে?", options: ["দ্য রোলিং স্টোনস", "কুইন", "দ্য বিটলস", "লেড জেপেলিন"], correct: 1 },
    { q: "'পপের রাজা' নামে কে পরিচিত?", options: ["এলভিস প্রিসলি", "মাইকেল জ্যাকসন", "প্রিন্স", "ম্যাডোনা"], correct: 1 },
    { q: "স্ট্যান্ডার্ড গিটারে কয়টি তার থাকে?", options: ["৫", "৬", "৭", "১২"], correct: 1 },
    { q: "কোন যন্ত্রে ৮৮টি চাবি থাকে?", options: ["অর্গান", "পিয়ানো", "হার্পসিকর্ড", "অ্যাকর্ডিয়ন"], correct: 1 }
  ],
  mythology: [
    { q: "গ্রিক পৌরাণিক কাহিনীতে সমুদ্রের দেবতা কে?", options: ["জিউস", "পসেইডন", "হেডিস", "আরেস"], correct: 1 },
    { q: "গ্রিক দেবতাদের রাজা কে?", options: ["জিউস", "পসেইডন", "অ্যাপোলো", "হেডিস"], correct: 0 },
    { q: "নর্স পৌরাণিক কাহিনীতে বজ্রের দেবতা কে?", options: ["লোকি", "থর", "ওডিন", "বাল্ডার"], correct: 1 },
    { q: "গ্রিক জ্ঞানের দেবী কে?", options: ["অ্যাফ্রোডাইট", "অ্যাথেনা", "আর্টেমিস", "ডিমিটার"], correct: 1 }
  ],
  animals: [
    { q: "পৃথিবীর বৃহত্তম প্রাণী কোনটি?", options: ["আফ্রিকান হাতি", "নীল তিমি", "জিরাফ", "লবণাক্ত পানির কুমির"], correct: 1 },
    { q: "মাকড়সার কয়টি পা থাকে?", options: ["৬", "৮", "১০", "১২"], correct: 1 },
    { q: "পৃথিবীর দ্রুততম স্থল প্রাণী কোনটি?", options: ["চিতা", "সিংহ", "ঘোড়া", "গ্রেহাউন্ড"], correct: 0 },
    { q: "অক্টোপাসের কয়টি হৃৎপিণ্ড থাকে?", options: ["১", "২", "৩", "৪"], correct: 2 },
    { q: "কোন প্রাণী লাফাতে পারে না?", options: ["ক্যাঙ্গারু", "হাতি", "ব্যাঙ", "খরগোশ"], correct: 1 },
    { q: "পৃথিবীর সবচেয়ে লম্বা প্রাণী কোনটি?", options: ["জিরাফ", "হাতি", "উটপাখি", "উট"], correct: 0 }
  ]
};

const LOCAL_BANKS = {
  en: LOCAL_BANK_EN,
  bn: LOCAL_BANK_BN
};

// ---------------------------------------------------------------
// GLOBAL SETTINGS
// ---------------------------------------------------------------
const TIME_PER_QUESTION = 15;
const HIGHSCORE_KEY = "quizexe_highscore";
const RANK_KEY = "quizexe_rankings";
const RANK_LIMIT = 10;
const ONLINE_AMOUNT_LIMIT = 20;   // safe single-request amount for live feed
const FETCH_TIMEOUT_MS = 15000;

// ---------- state ----------
let currentIndex = 0;
let score = 0;
let timeLeft = TIME_PER_QUESTION;
let timerId = null;
let answered = false;
let shuffledQuestions = [];
let playerName = "PLAYER1";
let sourceNote = "LOCAL";

// ---------- DOM refs ----------
const screens = {
  start: document.getElementById("screen-start"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
  rank: document.getElementById("screen-rank")
};

const nameInput = document.getElementById("player-name");
const btnStart = document.getElementById("btn-start");
const btnNext = document.getElementById("btn-next");
const btnRestart = document.getElementById("btn-restart");
const btnRank = document.getElementById("btn-rank");
const btnRankBack = document.getElementById("btn-rank-back");
const nameError = document.getElementById("name-error");
const rankTable = document.getElementById("rank-table");

const sourceSelect = document.getElementById("quiz-source");
const categorySelect = document.getElementById("quiz-category");
const languageSelect = document.getElementById("quiz-language");
const difficultySelect = document.getElementById("quiz-difficulty");
const difficultyRow = document.getElementById("difficulty-row");
const countSelect = document.getElementById("quiz-count");
const sourceStatus = document.getElementById("source-status");

const hudScore = document.getElementById("hud-score");
const hudProgress = document.getElementById("hud-progress");
const hudTimer = document.getElementById("hud-timer");
const hudBox = document.querySelector(".hud");
const progressFill = document.getElementById("progress-fill");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedbackText = document.getElementById("feedback-text");

const resultHeading = document.getElementById("result-heading");
const scoreBlock = document.getElementById("score-block");
const resultMessage = document.getElementById("result-message");

const highscoreValue = document.getElementById("highscore-value");
const statusLeft = document.getElementById("status-left");

// ---------- helpers ----------

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getHighScore() {
  return parseInt(localStorage.getItem(HIGHSCORE_KEY) || "0", 10);
}

function setHighScore(value) {
  localStorage.setItem(HIGHSCORE_KEY, String(value));
}

function loadHighScoreDisplay() {
  highscoreValue.textContent = getHighScore();
}

function getRankings() {
  try {
    return JSON.parse(localStorage.getItem(RANK_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveRankings(list) {
  localStorage.setItem(RANK_KEY, JSON.stringify(list));
}

function addRanking(score, total) {
  const list = getRankings();
  list.push({
    name: playerName,
    score,
    total,
    time: Date.now()
  });
  list.sort((a, b) => b.score - a.score || b.total - a.total || a.time - b.time);
  saveRankings(list.slice(0, RANK_LIMIT));
}

function renderRankings() {
  const list = getRankings();
  if (list.length === 0) {
    rankTable.textContent = "NO RECORDS YET.\nBE THE FIRST, OPERATOR.";
    return;
  }
  const rows = list.map((r, i) => {
    const pct = r.total ? Math.round((r.score / r.total) * 100) : 0;
    return `${String(i + 1).padStart(2, "0")}  ${r.name.padEnd(12, ".")}  ${String(r.score).padStart(2, "0")}/${String(r.total).padStart(2, "0")}  ${String(pct).padStart(3, " ")}%`;
  });
  const header = "#   NAME         SCORE   %\n" + "-".repeat(30);
  rankTable.textContent = header + "\n" + rows.join("\n");
}

function decodeHtml(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

function resolveMaxCount(rawCount) {
  const n = parseInt(rawCount, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// ---------- question sources ----------

function buildLocalPool(categoryId, count, langCode) {
  const lang = LANGUAGES.find(l => l.code === langCode);
  const bank = lang && lang.bank ? LOCAL_BANKS[lang.bank] : LOCAL_BANK_EN;
  const cat = CATEGORIES.find(c => c.id === categoryId);
  let pool = [];
  if (cat && cat.bankId) {
    pool = bank[cat.bankId] || [];
    if (pool.length === 0 && bank !== LOCAL_BANK_EN) {
      pool = LOCAL_BANK_EN[cat.bankId] || [];
    }
  } else {
    pool = Object.values(bank).flat();
  }
  if (count > 0) pool = pool.slice(0, count);
  return pool;
}

function normalizeApiQuestion(raw) {
  const correct = decodeHtml(raw.correct_answer);
  const options = shuffle([...raw.incorrect_answers.map(decodeHtml), correct]);
  return { q: decodeHtml(raw.question), options, correct: options.indexOf(correct) };
}

async function fetchUnlimitedQuestions(categoryId, difficulty, count, langCode) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  const amount = Math.min(count > 0 ? count : ONLINE_AMOUNT_LIMIT, 50);
  const params = new URLSearchParams({ amount: String(amount), type: "multiple" });
  if (cat && cat.apiCat) params.set("category", String(cat.apiCat));
  if (difficulty && difficulty !== "any") params.set("difficulty", difficulty);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`https://opentdb.com/api.php?${params.toString()}`, { signal: controller.signal });
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    if (data.response_code !== 0) throw new Error("api code " + data.response_code);
    return data.results.map(normalizeApiQuestion);
  } finally {
    clearTimeout(timeout);
  }
}

// ---------- game flow ----------

async function startGame() {
  playerName = nameInput.value.trim().toUpperCase();
  if (!playerName) {
    nameError.hidden = false;
    nameInput.focus();
    return;
  }
  nameError.hidden = true;
  score = 0;
  currentIndex = 0;

  const source = sourceSelect.value;
  const category = categorySelect.value;
  const language = languageSelect.value;
  const difficulty = difficultySelect.value;
  const count = resolveMaxCount(countSelect.value);
  const cat = CATEGORIES.find(c => c.id === category);
  const lang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const langTag = lang ? ` / ${lang.name.split(" / ")[1]}` : "";

  btnStart.disabled = true;
  btnStart.textContent = "[ LOADING... ]";
  statusLeft.textContent = "ACCESSING QUESTION SOURCE...";

  let pool = [];
  if (source === "unlimited") {
    try {
      pool = await fetchUnlimitedQuestions(category, difficulty, count, language);
      sourceNote = "LIVE FEED OK — " + cat.name + langTag;
    } catch (err) {
      pool = buildLocalPool(category, count, language);
      sourceNote = "LIVE FEED FAILED — LOCAL DB" + langTag;
    }
    if (pool.length === 0) {
      pool = buildLocalPool("mixed", count, language);
      sourceNote = "LIVE FEED EMPTY — LOCAL MIX" + langTag;
    }
  } else {
    pool = buildLocalPool(category, count, language);
    sourceNote = "LOCAL DB — " + cat.name + langTag;
  }

  if (pool.length === 0) {
    pool = buildLocalPool("mixed", 0, language);
  }

  btnStart.disabled = false;
  btnStart.textContent = "[ PRESS START ]";

  shuffledQuestions = shuffle(pool);
  showScreen("quiz");
  statusLeft.textContent = `RUNNING QUIZ.EXE AS ${playerName} — ${sourceNote}...`;
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  timeLeft = TIME_PER_QUESTION;
  feedbackText.textContent = "\u00A0";
  btnNext.disabled = true;
  hudBox.classList.remove("timer-warning");

  const item = shuffledQuestions[currentIndex];
  questionText.textContent = item.q;
  hudScore.textContent = score;
  hudProgress.textContent = `Q ${String(currentIndex + 1).padStart(2, "0")}/${shuffledQuestions.length}`;
  progressFill.style.width = `${(currentIndex / shuffledQuestions.length) * 100}%`;
  hudTimer.textContent = timeLeft;

  optionsContainer.innerHTML = "";
  const letters = ["A", "B", "C", "D"];
  item.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${opt}</span>`;
    btn.addEventListener("click", () => selectAnswer(i));
    optionsContainer.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    hudTimer.textContent = timeLeft;
    if (timeLeft <= 5) {
      hudBox.classList.add("timer-warning");
    }
    if (timeLeft <= 0) {
      clearInterval(timerId);
      selectAnswer(-1); // time's up, no selection
    }
  }, 1000);
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const item = shuffledQuestions[currentIndex];
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");

  optionButtons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === item.correct) {
      btn.classList.add("correct");
    } else if (i === selectedIndex) {
      btn.classList.add("incorrect");
    }
  });

  if (selectedIndex === item.correct) {
    score++;
    feedbackText.textContent = "> CORRECT.";
  } else if (selectedIndex === -1) {
    feedbackText.textContent = "> TIME'S UP.";
  } else {
    feedbackText.textContent = "> INCORRECT.";
  }

  hudScore.textContent = score;
  btnNext.disabled = false;
  btnNext.focus();
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= shuffledQuestions.length) {
    endGame();
  } else {
    loadQuestion();
  }
}

function endGame() {
  clearInterval(timerId);
  progressFill.style.width = "100%";

  const prevHigh = getHighScore();
  const isNewHigh = score > prevHigh;
  if (isNewHigh) {
    setHighScore(score);
  }

  scoreBlock.textContent = `${String(score).padStart(2, "0")} / ${shuffledQuestions.length}`;

  let heading, message;
  const pct = score / shuffledQuestions.length;
  if (pct === 1) {
    heading = "FLAWLESS RUN";
    message = `PERFECT SCORE, ${playerName}. NOTHING LEFT TO PROVE.`;
  } else if (pct >= 0.7) {
    heading = "PROCESS COMPLETE";
    message = `SOLID RUN, ${playerName}. SYSTEM APPROVES.`;
  } else if (pct >= 0.4) {
    heading = "PROCESS COMPLETE";
    message = `NOT BAD, ${playerName}. ROOM TO OPTIMIZE.`;
  } else {
    heading = "SYSTEM FAILURE";
    message = `REBOOT AND TRY AGAIN, ${playerName}.`;
  }

  if (isNewHigh) {
    message += " NEW HIGH SCORE!";
  }

  resultHeading.textContent = heading;
  resultMessage.textContent = message;
  statusLeft.textContent = "READY.";
  loadHighScoreDisplay();
  addRanking(score, shuffledQuestions.length);

  showScreen("result");
}

function restartGame() {
  nameInput.value = playerName === "PLAYER1" ? "" : playerName;
  showScreen("start");
  loadHighScoreDisplay();
}

function openRankings() {
  renderRankings();
  showScreen("rank");
}

// ---------- setup UI ----------

function populateCategories() {
  CATEGORIES.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    categorySelect.appendChild(opt);
  });
}

function populateLanguages() {
  LANGUAGES.forEach(lang => {
    const opt = document.createElement("option");
    opt.value = lang.code;
    opt.textContent = lang.name;
    languageSelect.appendChild(opt);
  });
}

function updateSourceUI() {
  const online = sourceSelect.value === "unlimited";
  difficultyRow.classList.toggle("hidden", !online);
  if (online) {
    languageSelect.disabled = true;
    languageSelect.value = "en";
    languageSelect.title = "ONLINE FEED IS ENGLISH ONLY";
  } else {
    languageSelect.disabled = false;
    languageSelect.title = "";
  }
  sourceStatus.textContent = online
    ? "<SOURCE: UNLIMITED ONLINE FEED> (ENGLISH ONLY)"
    : "<SOURCE: LOCAL DATABASE>";
}

// ---------- events ----------

btnStart.addEventListener("click", startGame);
nameInput.addEventListener("keydown", e => {
  if (e.key === "Enter") startGame();
});
btnNext.addEventListener("click", nextQuestion);
btnRestart.addEventListener("click", restartGame);
btnRank.addEventListener("click", openRankings);
btnRankBack.addEventListener("click", () => {
  showScreen("start");
  loadHighScoreDisplay();
});
nameInput.addEventListener("input", () => { nameError.hidden = true; });
sourceSelect.addEventListener("change", updateSourceUI);

// ---------- init ----------
populateCategories();
populateLanguages();
updateSourceUI();
loadHighScoreDisplay();