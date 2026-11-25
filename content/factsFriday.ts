// FactsFriday: NDESC's weekly science series, first posted on the club's Facebook page.
// Text, dates and pictures are the club's own posts (pictures from the club's Drive folder, captions
// copied from each Facebook post, 23 Nov 2026). Two early posts were pictures only; their text was
// written later in the series' style from checked sources (writtenLater, 23 Nov 2026), with those
// sources listed. Hashtags and the student ID in one credit line were left out.
//
// To add a post: copy an entry, give it a new slug, put the cover in public/factsfriday/ as
// <slug>-400.webp and <slug>-800.webp, and list the sizes. It then shows up on /factsfriday/, gets its
// own page at /factsfriday/<slug>/, and the newest one appears on /explore/.

export type FactsCategory = "space" | "earth" | "biology" | "environment" | "physics" | "general";

export const factsCategories: Record<FactsCategory, string> = {
  space: "Astronomy & Space",
  earth: "Earth Science",
  biology: "Biology",
  environment: "Environment",
  physics: "Physics",
  general: "General Science",
};

export type FactsFridayPost = {
  slug: string;
  title: string;
  /** Date it was posted, YYYY-MM-DD. */
  date: string;
  category: FactsCategory;
  /** One or two sentences for the archive and search results. */
  summary: string;
  /** The full post, one string per paragraph. */
  body: string[];
  /** Square cover: files at `${base}-${size}.webp` for each size; width is the largest available. */
  cover: { base: string; sizes: number[]; width: number };
  /** The original Facebook post. */
  facebook?: string;
  /** Writer credit, only when the post itself names them. */
  credit?: string;
  /** Sources named in the post (or, for writtenLater posts, the sources the text was written from). Shown only when there are some. */
  references?: { label: string; url?: string }[];
  /** True when the post had no caption and the text is copied from its picture. */
  fromImage?: boolean;
  /** True when no caption was posted and the text was written later in the series' style. */
  writtenLater?: boolean;
};

export const factsFriday: FactsFridayPost[] = [
  {
    "slug": "mount-kelimutu",
    "title": "Mount Kelimutu",
    "date": "2026-11-20",
    "category": "earth",
    "summary": "Mount Kelimutu is an active stratovolcano located in Indonesia, featuring three volcanic crater lakes at its summit.",
    "body": [
      "Mount Kelimutu is an active stratovolcano located in Indonesia, featuring three volcanic crater lakes at its summit. Each of these lakes usually displays a different colour despite being extremely close together.",
      "The reason for these different colours is geochemical activity from the volcanic vents beneath the lakes and the metals present in the water. These vents regularly release gases like sulfur dioxide, hydrogen sulfide, and carbon dioxide, which change the oxidation state of dissolved metals such as iron and manganese to give each lake its unique hue. Because of variations in oxygen and sulfur levels, along with shifting volcanic activity, weather changes, and other natural phenomena, each lake can change colour independently, so all three can display different colours at the same time.",
      "Each different colour of the lake gives their water different characteristics. During turquoise phases, the water looks cloudy and chalky and during white phases, a sulfur froth can be found floating on top. When the lakes are red or black, rusting iron turns the water dark and thick, trapping heat and causing the lakes to release steam into the air."
    ],
    "cover": {
      "base": "/factsfriday/mount-kelimutu",
      "sizes": [
        400,
        800
      ],
      "width": 1080
    },
    "facebook": "https://www.facebook.com/share/p/1EvqivAdHJ/"
  },
  {
    "slug": "ion-thrusters",
    "title": "Ion Thrusters",
    "date": "2026-11-13",
    "category": "space",
    "summary": "Humanity's approach towards Mars and the deep reaches of the solar system existed for a long time.",
    "body": [
      "Humanity's approach towards Mars and the deep reaches of the solar system existed for a long time. Still, we keep running into the same stubborn problem, fuel crisis; chemical rockets just aren't built for long haul space travel. Burning massive amounts of propellant is great for blasting off Earth's surface, but carrying all that heavy fuel across millions of miles of open space quickly becomes a liability. That’s where ion propulsion comes in.",
      "Instead of burning liquid fuel to create hot exhaust, ion thrusters rely on electricity from solar panels or miniature nuclear reactors to strip electrons from inert gases like Xenon. Electric grids then shoot those charged ions through the back of the spacecraft at speeds surpassing 30 km/s. An ion engine, by contrast, delivers a barely felt whisper of force which is equivalent to the weight of a single piece of paper. But in the frictionless vacuum of space, that soft push never stops. Day after day, month after month, that tiny force builds up, eventually accelerating the craft to incredible speeds without needing a giant fuel tank.",
      "Missions like NASA’s Dawn probe and Europe’s BepiColombo have already proven this concept in deep space. Ion engines are quietly turning once impossible interplanetary journeys into regular routes."
    ],
    "cover": {
      "base": "/factsfriday/ion-thrusters",
      "sizes": [
        400,
        800
      ],
      "width": 2048
    },
    "facebook": "https://www.facebook.com/share/1CJpCwj7PC/"
  },
  {
    "slug": "the-sixth-sense",
    "title": "The Sixth Sense",
    "date": "2026-09-18",
    "category": "biology",
    "summary": "Cartilaginous fishes like sharks and basal bony fishes like sturgeons have electroreceptors called Ampullae of Lorenzini, which are small, jelly-filled pores concentrated on the head and around the eyes, which appear…",
    "body": [
      "Cartilaginous fishes like sharks and basal bony fishes like sturgeons have electroreceptors called Ampullae of Lorenzini, which are small, jelly-filled pores concentrated on the head and around the eyes, which appear as small black dots on the shark's skin. These organs are connected to the shark's sensory cells through canals and help with the detection of electric fields, temperature, and salinity.",
      "All living creatures generate weak electric fields just from muscle contractions and nerve activity. As sharks are sensitive enough to detect electric fields of five billionths of a volt, they can even sense a fish's heartbeat under sand.",
      "Sharks use this sense to find hidden prey where senses of sight and smell may fail. Some researchers say that some fishes use their electroreceptors to navigate through oceans using the Earth's magnetic field.",
      "The Ampullae of Lorenzini have also inspired research into underwater navigation and object detection devices, as well as medical bioelectric devices, and may help further advance ocean research."
    ],
    "cover": {
      "base": "/factsfriday/the-sixth-sense",
      "sizes": [
        400,
        800
      ],
      "width": 912
    },
    "facebook": "https://www.facebook.com/share/1DjoePEhgE/"
  },
  {
    "slug": "the-leaping-throat",
    "title": "The Leaping Throat",
    "date": "2026-09-11",
    "category": "biology",
    "summary": "Moray eels usually live inside tight coral reef crevices and rocky holes.",
    "body": [
      "Moray eels usually live inside tight coral reef crevices and rocky holes. As a result, it is difficult for them to suction feed like similar marine animals. So, their bodies have evolved in a way that lets them easily hunt from their home.",
      "Aside from their oral teeth, moray eels have pharyngeal teeth located in their pharynx, or throat, which have the unique ability to move from their pharynx into their oral cavity, crossing nearly their entire skull's length. When hunting, moray eels use their oral teeth to take hold of their prey, and their pharyngeal teeth leap forward to pull the prey into their body.",
      "While many other animals have sets of pharyngeal teeth, moray eels are the only ones in the world that have a movable set of pharyngeal teeth instead of a permanently fixed one. Their pharyngeal teeth are also the only ones used for hunting rather than just grinding food."
    ],
    "cover": {
      "base": "/factsfriday/the-leaping-throat",
      "sizes": [
        400,
        800
      ],
      "width": 1080
    },
    "facebook": "https://www.facebook.com/share/1HUD4FzX7h/"
  },
  {
    "slug": "the-sealed-world",
    "title": "The Sealed World",
    "date": "2026-09-04",
    "category": "biology",
    "summary": "The Movile Cave sits about 60 feet underground, completely sealed off from the outside world for 5.5 million years with no natural entrance.",
    "body": [
      "The Movile Cave sits about 60 feet underground, completely sealed off from the outside world for 5.5 million years with no natural entrance. The air inside the cave is filled with carbon dioxide, hydrogen sulfide, and ammonia, with very low oxygen. Additionally, it sits at a constant 21°C with a relative humidity of 100%.",
      "Due to the lack of light and oxygen, the cave has developed an ecosystem surrounding chemosynthetic bacteria, which use sulphur and methane oxidation to fix Carbon and produce biomass. As a result, the cave hosts about 57 known species, including centipedes, spiders, snails, leeches, and scorpions, among others; 37 of which are endemic, which have adapted to survive in the cave's dark, toxic, low-oxygen environment, feeding on these bacteria and other animals present in the cave.",
      "Researchers believe that the unique conditions and ecosystem of this cave can help us understand how life evolves and survives in toxic conditions, which can help predict life forms on our planet as well as other planets with parallel conditions."
    ],
    "cover": {
      "base": "/factsfriday/the-sealed-world",
      "sizes": [
        400,
        800
      ],
      "width": 1254
    },
    "facebook": "https://www.facebook.com/share/1D9uaqwZsq/"
  },
  {
    "slug": "life-under-a-coral-reef",
    "title": "Life Under a Coral Reef",
    "date": "2026-08-28",
    "category": "biology",
    "summary": "The Great Barrier Reef, located off the north-east coast of Australia, is the world's largest coral reef, comprising approximately 2,500 to 2,900 individual reefs.",
    "body": [
      "The Great Barrier Reef, located off the north-east coast of Australia, is the world's largest coral reef, comprising approximately 2,500 to 2,900 individual reefs. Rich in natural beauty and marine biodiversity, it is a UNESCO World Heritage Site. 400 types of coral, 1,500 species of marine fish and over four thousand species of molluscs have made this coral reef a biodiversity paradise.",
      "Alongside these creatures, it also provides refuge for many endangered animals, such as the dugong or sea cow and the green turtle. Together, they have formed another world on Earth, completely distinct from our own. In 1981, UNESCO recognised it as a World Heritage Site. UNESCO divides the region into 70 bioregions, 30 of which are coral. This gigantic bioregion was not formed overnight. According to scientists, the continental shelves were transformed into the coral reef through four major cycles of ice melting and refreezing. The Great Barrier Reef is not just a vast coral reef & it also features enormous, mosaic-patterned coral, extensive sandy beaches, the mangrove forests of the Hinchinbrook Channel, and dense rainforest.",
      "A total of 215 bird species, including 22 species of seabirds and 32 species of coastal birds, fly over the Great Barrier Reef region. Among these, the White-bellied Eagle and the Rosetta Tern are found only in this region. The highest concentration of birds is found at the two extremes, namely in the north and the south. The birds also generally choose these two locations for breeding. Around 1.7 million birds breed in these two areas each year. To accommodate such a vast number of birds, the islands of the Great Barrier Reef are home to 2,195 species of plants. While the plants in the southern region are predominantly tree species, most of the plants in the northern region are shrubs and herbs. There are also over 300 species of sea urchins. Meanwhile, biologists have found nearly 500 species of algae on the coral reef here, including 13 species of Halimeda. This creates a covering across the entire reef, forming 'mini-ecosystems'. This mini-ecosystem is often compared to a rainforest."
    ],
    "cover": {
      "base": "/factsfriday/life-under-a-coral-reef",
      "sizes": [
        400,
        800
      ],
      "width": 1024
    },
    "facebook": "https://www.facebook.com/share/1525gtUo3Ek/"
  },
  {
    "slug": "the-fermi-paradox",
    "title": "The Fermi Paradox",
    "date": "2026-08-21",
    "category": "space",
    "summary": "Although the universe has existed for billions of years and thousands of potentially habitable exoplanets have been identified, humanity has yet to ascertain or make contact with any extraterrestrial life.",
    "body": [
      "Although the universe has existed for billions of years and thousands of potentially habitable exoplanets have been identified, humanity has yet to ascertain or make contact with any extraterrestrial life.",
      "Several theories attempt to explain this silence. The Zoo Hypothesis suggests that advanced alien life exists but deliberately avoids contact, allowing humanity to develop naturally on its own. Similarly, the Dark Forest Hypothesis proposes that advanced alien life exists but remains intentionally silent and hidden, out of fear of a greater, unseen danger.",
      "The Berserker Hypothesis theorizes that self-replicating Von Neumann probes, sent out by an advanced civilization, roam the universe destroying other life before self-destructing, leaving no trace behind.",
      "In contrast, the Great Filter theory suggests that a universal barrier exists somewhere along the path of evolution, one that prevents most species from advancing beyond a certain stage.",
      "While we have no definitive answer to the Fermi Paradox yet, these theories and hypotheses may hint at the truth, or at least inspire the pursuit of it."
    ],
    "cover": {
      "base": "/factsfriday/the-fermi-paradox",
      "sizes": [
        400,
        800
      ],
      "width": 1080
    },
    "facebook": "https://www.facebook.com/share/1VhT4wjrjj/"
  },
  {
    "slug": "the-wood-wide-web",
    "title": "The Wood Wide Web",
    "date": "2026-08-14",
    "category": "biology",
    "summary": "Fungi such as arbuscular mycorrhizae and ectomycorrhizae can use their hyphae to cover or even penetrate the roots of trees.",
    "body": [
      "Fungi such as arbuscular mycorrhizae and ectomycorrhizae can use their hyphae to cover or even penetrate the roots of trees. When the fungi do this to multiple trees, those trees can join a \"network\" where the fungi can transfer resources between the trees through their hyphae.",
      "Although it is disputed whether it can truly be called helping, connected trees can send resources to trees that are deprived of certain resources through the network. It has been documented that adult trees send resources to saplings or young plants to help them grow. Some researchers have also observed dying trees \"donating\" their resources to the network, and injured trees receiving excess resources from healthier trees, though this evidence is less firmly established. Injured trees have likewise been observed alerting other trees through the network in some studies.",
      "Some researchers say that the network is more like parasitism and self-interest than cooperation, and that this behaviour may occur more rarely than is commonly believed. Either way, it is an amazing study that shows us how even plants can cooperate or use each other from hundreds of meters away and help their ecosystem and forest thrive."
    ],
    "cover": {
      "base": "/factsfriday/the-wood-wide-web",
      "sizes": [
        400,
        800
      ],
      "width": 1080
    },
    "facebook": "https://www.facebook.com/share/1Dfd8EYouR/"
  },
  {
    "slug": "beating-a-genetic-curse",
    "title": "Beating a Genetic Curse",
    "date": "2026-07-24",
    "category": "biology",
    "summary": "Hunter syndrome, or MPS II, is an extremely rare genetic disorder that affects about 1 in 100,000 male births.",
    "body": [
      "Hunter syndrome, or MPS II, is an extremely rare genetic disorder that affects about 1 in 100,000 male births. Previously lacking any actual cure, a recent medical breakthrough has provided a potential cure for this typically fatal disease.",
      "MPS II occurs when cells don't produce the IDS enzyme, which breaks down complex sugar molecules (GAGs). GAGs, if left unbroken, accumulate in the body, damaging organs and causing physical deformities. Most patients experience impaired brain development and often die before the age of 20.",
      "Before this, only one treatment existed: Elaprase, a lifelong weekly medication costing over USD 300,000 annually, which only slowed disease progression. Stem cell research has found a new solution. 3-year-old patient Oliver Chu had his defective stem cells removed, which were then corrected by inserting a functional IDS gene using a viral carrier and then reintroduced into his body. These modified stem cells repopulated, restoring enzyme production and possibly permanently curing the disease.",
      "This breakthrough shows us the immense potential of stem cell research and gene therapy in advancing human medicine."
    ],
    "cover": {
      "base": "/factsfriday/beating-a-genetic-curse",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1EsbULjFmU/"
  },
  {
    "slug": "the-cosmic-hamburger",
    "title": "The Cosmic Hamburger",
    "date": "2026-07-10",
    "category": "space",
    "summary": "IRAS 23077+6707, popularly known as ”Dracula’s Chivito” is an infrared source discovered by IRAS.",
    "body": [
      "IRAS 23077+6707, popularly known as ”Dracula’s Chivito” is an infrared source discovered by IRAS. It is named “Chivito” because its asymmetrical shape resembles an Uruguayan national dish that looks like a hamburger.",
      "The 23077 Accretion Disc lies in the constellation “Cepheus”. Rich in dust and gas, this disc is capable of producing gas giants like Jupiter and terrestrial planets like Earth around a young central star. Astronomers estimate it to be a scaled-up analogue of our solar system. In fact, planetary systems universally originate from such discs of gas and dust encircling a newly formed star. Over time, all the gas continues to accrete onto the central star while the remaining dust clump together via collisions and gravitational attraction, ultimately giving rise to planets.",
      "Surprisingly this accretion disc is super asymmetrical. Observations from Hubble Space Telescope images revealed that the turbulence at the upper disc is significantly more intense than expected. Scientists suggest that this could be occurring due to infall, stellar winds and gravitational Instability.",
      "Although planet formation occurs on a far grander scale, the fundamental mechanisms driving the process remain largely unchanged."
    ],
    "cover": {
      "base": "/factsfriday/the-cosmic-hamburger",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1A5qxSg6fG/"
  },
  {
    "slug": "the-life-sealed-under-ice",
    "title": "The Life Sealed Under Ice",
    "date": "2026-07-03",
    "category": "biology",
    "summary": "Research teams in Antarctica, using drills and modern technology, have managed to dig out thousands of metres of the Antarctic ice sheet.",
    "body": [
      "Research teams in Antarctica, using drills and modern technology, have managed to dig out thousands of metres of the Antarctic ice sheet. Studying this ice, scientists have managed to find microbial and other forms of life from thousands to millions of years ago, frozen in time.",
      "Using advanced cameras and drones, scientists were also able to look into the lakes hidden beneath Antarctica and find active life in a place where life shouldn't be possible. From sponges to small fish, these organisms rely on currents to bring them nutrition thousands of metres below the ice.",
      "Studying these frozen and active organisms, scientists can find how life can survive in extremely cold conditions, how slow metabolism affects organisms and how life, climate and weather were thousands of years ago and how organisms reacted to them. This way, scientists can also learn more about climates and predict climate change and climate in the future and even how life could survive outside of our planet."
    ],
    "cover": {
      "base": "/factsfriday/the-life-sealed-under-ice",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1KFwAyMuNn/"
  },
  {
    "slug": "phytoplankton",
    "title": "Phytoplankton",
    "date": "2026-06-26",
    "category": "environment",
    "summary": "Take a deep breath.",
    "body": [
      "Take a deep breath. Now take another. You can say that the oxygen you breathe is a blend from the forests and the ocean. Tiny, invisible drifters called phytoplankton are the true unsung heroes of our planet. Drifting on the sunlit surface of the ocean, these microscopic powerhouses produce over half of Earth's oxygen while silently absorbing carbon dioxide from the atmosphere, keeping our global climate stable and all of us alive.",
      "We typically call the Amazon rainforest the lungs of the Earth, but the true breath of our planet comes from the blue, not the green. Phytoplanktons are microscopic, plant-like organisms that drift across the world's oceans in numbers too vast to count. Like plants on land, they operate on sunlight, soaking up solar energy and carbon dioxide to create fuel. In this silent process, they release a massive by-product that we desperately need: oxygen.",
      "If these microscopic oxygen factories disappeared, the ocean ecosystem would collapse, and our own air supply would be hampered. It is a reminder for us that the smallest things shouldn’t be overlooked."
    ],
    "cover": {
      "base": "/factsfriday/phytoplankton",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1M6Rp64RF8/"
  },
  {
    "slug": "rings-of-light",
    "title": "Rings of Light",
    "date": "2026-06-19",
    "category": "space",
    "summary": "Einstein-Chwolson rings are manifestations of the gravitational lensing effect where a celestial body warps the surrounding fabric of spacetime thanks to its mass.",
    "body": [
      "Einstein-Chwolson rings are manifestations of the gravitational lensing effect where a celestial body warps the surrounding fabric of spacetime thanks to its mass. The curved spacetime can act like a giant cosmic lens, capable of magnifying faint and distant objects.",
      "Alongside Einstein, Orest Chwolson was one of the first to discuss the “halo effect” formed when the source, lens, and observer are in near perfect alignment.",
      "Although there are several known Einstein rings-some complete, others partial- a ‘truly perfect ring’ remains elusive with the most flawless instance to date being Euclid’s “Altieri’s Lens” around NGC 6505.",
      "Setting aside the complexities of rare alignment, difficult modeling, background uncertainties and contamination, these rings serve as crucial tools in probing dark matter and studying our universe."
    ],
    "cover": {
      "base": "/factsfriday/rings-of-light",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1A9qSvwdAZ/"
  },
  {
    "slug": "beneath-the-bedrock",
    "title": "Beneath the Bedrock",
    "date": "2026-05-22",
    "category": "biology",
    "summary": "About 10 kilometres below the continental surface and about 21 kilometres below the sea surface, where temperatures can reach up to 120° C, there exists a large community of microbes.",
    "body": [
      "About 10 kilometres below the continental surface and about 21 kilometres below the sea surface, where temperatures can reach up to 120° C, there exists a large community of microbes.",
      "Unlike other microbes which rely on sunlight, the scarcity of sunlight below the surface means that these microbes have to rely on water seeping through the surface and have to “eat” rocks for nutrition and “breath” using the rocks and minerals available to them.",
      "Due to the lack of nutrition, their metabolism is extremely slow, with microbes from thousands of years ago still existing and slowly dividing themselves over several years, and yet they comprise 10-30% of the Earth's entire biomass.",
      "Their discovery is a great breakthrough in learning about life in places which do not favour life and figuring out different ways through which life can thrive."
    ],
    "cover": {
      "base": "/factsfriday/beneath-the-bedrock",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/19yZsNe9jt/"
  },
  {
    "slug": "the-horologium-supercluster",
    "title": "The Horologium Supercluster",
    "date": "2026-05-15",
    "category": "space",
    "summary": "The Horologium-Reticulum Supercluster, aka the Horologium Supercluster, is a Laniakea-like supercluster that can be visible in the Horologium, Eridanus and Reticulum constellations.",
    "body": [
      "The Horologium-Reticulum Supercluster, aka the Horologium Supercluster, is a Laniakea-like supercluster that can be visible in the Horologium, Eridanus and Reticulum constellations. It is one of the largest structures known in the nearby Universe with its enormous concentration of galaxy clusters featuring a mass of the order of 10¹⁷ solar masses spanning approximately 550 million light-years, over an estimated distance of 550-700 million light-years from planet Earth. It houses about 5,000 galaxy groups containing 30,000 giant galaxies and 300,000 dwarf galaxies. The Horologium Supercluster is larger than the Shapley Supercluster in spatial extent, even though the Shapley Supercluster is denser than Horologium. The supercluster is dynamically active, with clusters moving toward common gravitational centres, providing astronomers with a natural laboratory for studying large-scale structure formation, cosmic flows, and the role of dark matter in shaping the universe. De Lisle Stewart first published information about the Horologium Supercluster in 1899, but Harlow Shapley conducted a thorough initial investigation of the Horologium Supercluster in 1935, cataloguing thousands of galaxies in this region. Despite being one of the gigantic and richest superclusters known, the Horologium Supercluster has remained largely overlooked and inadequately studied."
    ],
    "cover": {
      "base": "/factsfriday/the-horologium-supercluster",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1UQewe11aF/"
  },
  {
    "slug": "the-marine-snow",
    "title": "The Marine Snow",
    "date": "2026-05-08",
    "category": "earth",
    "summary": "Tiny particles of organic detritus clump together to form aggregates that float down the water column, forming a critical part of the biological pump.",
    "body": [
      "Tiny particles of organic detritus clump together to form aggregates that float down the water column, forming a critical part of the biological pump. Marine snow thus allows for a flow of energy from the photic ocean layers down to the aphotic layers, where it becomes the basis of nutrition for deep-sea organisms such as sea cucumbers & Vampire squid.",
      "Blanketed with the debris, the deep ocean floors become a hub of microbial activity. The snow plays a fundamental role in carbon cycling as carbon transported by the biological pump can remain sequestered and out of contact from the atmosphere for almost 1000 years.",
      "An intriguing biological phenomenon, marine snow stands testament to the wonders of the deep ocean."
    ],
    "cover": {
      "base": "/factsfriday/the-marine-snow",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/18isVZFZkj/"
  },
  {
    "slug": "the-big-crunch-theory",
    "title": "The Big Crunch Theory",
    "date": "2026-02-13",
    "category": "space",
    "summary": "The base of this hypothesis was staged in 1922, when Russian physicist Alexander Friedmann created a set of equations that shows that the end of the universe depends on its density.",
    "body": [
      "The base of this hypothesis was staged in 1922, when Russian physicist Alexander Friedmann created a set of equations that shows that the end of the universe depends on its density. It could either expand or contract instead of staying stable, and with enough matter, gravity could stop the expansion of the universe and eventually reverse it. Such an event can cause the universe to collapse in on itself.",
      "As the universe collapses on itself, it will be condensed into a singularity with nearly infinite temperature. And according to the big bounce hypothesis, the universe might restart with another big bang. Though hypothetical, this could potentially repeat forever in a phenomenon known as a cyclic universe.",
      "However, this hypothesis is largely rejected because observations show the expansion of the universe is accelerating due to dark energy. Nonetheless, this hypothesis helped us shift from a static to dynamic framework and forced the study of extreme physical regimes like singularity and high-density physics."
    ],
    "cover": {
      "base": "/factsfriday/the-big-crunch-theory",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1KScp6spvS/",
    "references": [
      {
        "label": "Wikipedia: Big Crunch",
        "url": "https://en.wikipedia.org/wiki/Big_Crunch"
      },
      {
        "label": "Fiveable: Big Crunch",
        "url": "https://fiveable.me/key-terms/history-science/big-crunch"
      }
    ]
  },
  {
    "slug": "oceans-neural-miracle",
    "title": "Ocean's Neural Miracle",
    "date": "2026-01-30",
    "category": "biology",
    "summary": "New research has flipped what we thought about sea urchins: far from being “brainless” spiky balls, these creatures actually host a highly complex, brain-like network that spans their entire body.",
    "body": [
      "New research has flipped what we thought about sea urchins: far from being “brainless” spiky balls, these creatures actually host a highly complex, brain-like network that spans their entire body. A team led by Periklis Paganos and Jack Ullrich-Lüter used single-cell gene expression analysis to map the neurons in young sea urchins and discovered hundreds of distinct neuronal types, many of which use genes that are remarkably similar to those in our own vertebrate central nervous system.",
      "The study found that genes normally used to build a “torso” in other animals are only active in the sea urchin’s internal systems like its gut and water-vascular network. But the genes that define “head” regions are switched on all over its body, meaning, in a way, the urchin is just head, everywhere.",
      "Surprisingly, sea urchins can sense light even without eyes, their bodies are dotted with photoreceptor cells using opsins like melanopsin and Go-opsin. This means much of their nervous system can respond directly to light."
    ],
    "cover": {
      "base": "/factsfriday/oceans-neural-miracle",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1CGR3t5htS/"
  },
  {
    "slug": "the-great-nothing",
    "title": "The Great Nothing",
    "date": "2026-01-16",
    "category": "space",
    "summary": "Imagine the Earth alone, thinking the solar system is the only thing in space.",
    "body": [
      "Imagine the Earth alone, thinking the solar system is the only thing in space. How lonely would it feel? If our solar system were truly located in the great nothing, we would feel like this.",
      "Cosmic voids are vast, underdense regions between the filaments of the cosmic web, containing notably fewer galaxies or matter than average, acting as the universe's \"empty spaces.\" The Eridanus Supervoid, the Hercules Void or the Perseus–Pisces Void are among many discovered cosmic voids. Our own Milky Way resides in the KBC Void.",
      "The Boötes Void, also known as the Great Nothing, is one of the gigantic known voids. This is a nearly spherical territory of emptiness located approximately 700 million light-years away near the constellation Boötes. Discovered in 1981, this \"supervoid\" represents a massive anomaly in the expected distribution of matter in the universe. Scientists theorize this \"cosmic desert\" may have formed by smaller \"bubbles\" of empty space merging together over billions of years, similar to soap bubbles joining in a sink. This great nothing forces us to reconsider how the universe evolved."
    ],
    "cover": {
      "base": "/factsfriday/the-great-nothing",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/19jVf6LhqP/"
  },
  {
    "slug": "the-great-attractor",
    "title": "The Great Attractor",
    "date": "2025-11-28",
    "category": "space",
    "summary": "The Great Attractor is a gravitational anomaly existing in the direction of The Southern Triangle and constellation Norma, approximately 150-250 million light years away.",
    "body": [
      "The Great Attractor is a gravitational anomaly existing in the direction of The Southern Triangle and constellation Norma, approximately 150-250 million light years away.",
      "After a series of measurements on ‘peculiar velocities’ and redshift surveys of galaxies during the 1970s-80s an unseen force was discovered to be pulling nearly 100,000 galaxies, including our own Milky way, towards itself with velocities of almost 700 km a second (relative to the cosmic microwave background).",
      "The anomaly is now theorized to be the apparent center of gravitation of the Laniakea supercluster. Estimations for the amount of localized mass present in this region may reach up to 10¹⁶ solar masses.",
      "However, the cosmic anomaly is quite challenging to study due to its presence in the ‘Zone of Avoidance’, the area in the sky obscured by the milky way."
    ],
    "cover": {
      "base": "/factsfriday/the-great-attractor",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1E9oJUg4a9/"
  },
  {
    "slug": "the-martian-colossus",
    "title": "The Martian Colossus",
    "date": "2025-11-07",
    "category": "space",
    "summary": "With a height of 21.9km, width of around 600km, and an area of 300,000 square kilometers, Olympus Mons is a shield volcano, meaning it has a very gentle slope of around 5%.",
    "body": [
      "With a height of 21.9km, width of around 600km, and an area of 300,000 square kilometers, Olympus Mons is a shield volcano, meaning it has a very gentle slope of around 5%. It formed during a volcanically active geological time period on Mars known as the “Hesperian Period”.",
      "Over the course of hundreds of millions of years, highly fluid, basaltic lava flowed from deep magma chambers through vents which resulted in the formation of Olympus Mons. The relatively low gravity of Mars, coupled with little erosion, also played a hand in the formation of the great mountain.",
      "In the 19th century, an albedo phenomenon on the surface of Mars was catalogued as Nix Olympica(Snows of Olympus). It was later confirmed to be a volcano by the Mariner 9 Spacecraft in the 1970s and was ultimately named “Olympus Mons” after the Nix Olympus phenomenon."
    ],
    "cover": {
      "base": "/factsfriday/the-martian-colossus",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1K8AzvR8Tg/"
  },
  {
    "slug": "the-leafy-disguise",
    "title": "The Leafy Disguise",
    "date": "2025-10-31",
    "category": "biology",
    "summary": "The only species under the Phycodurus genus, Leafy Sea Dragons belong to the class ‘Actinopterygii’.",
    "body": [
      "The only species under the Phycodurus genus, Leafy Sea Dragons belong to the class ‘Actinopterygii’. Their 20-24 cm long bodies bear leaf-like lobes of skin for camouflage.",
      "Small transparent pectoral fins and a dorsal fin undulate almost invisibly, allowing the creature to drift like floating seaweed with coloration that strengthens the disguise.",
      "Leafy Sea Dragons are unsuitable for captivity and live a solitary lifestyle around kelp-covered rocks or seagrass with the male carrying eggs after mating. They use their long pipe-like snout to feed on small crustaceans and larval fish.",
      "Currently, this living jewel is protected by Australian Law from threats like habitat loss and illegal trade."
    ],
    "cover": {
      "base": "/factsfriday/the-leafy-disguise",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/19m9pbvdUc/"
  },
  {
    "slug": "lunar-alchemy-of-colours",
    "title": "Lunar Alchemy of Colours",
    "date": "2025-08-29",
    "category": "space",
    "summary": "Imagine harnessing the moon’s shimmering palette—black as secrets stirring beneath the surface, silver as illumination of the soul, white as cleansing clarity, budding yellow as dawn’s awakening, and red as radiant…",
    "body": [
      "Imagine harnessing the moon’s shimmering palette—black as secrets stirring beneath the surface, silver as illumination of the soul, white as cleansing clarity, budding yellow as dawn’s awakening, and red as radiant culmination. This is Lunar Alchemy of Colours, a poetic journey blending ancient alchemical symbolism with modern mystique.",
      "Colour as Cosmic Language:",
      "In the alchemical Magnum Opus, practitioners moved through color-coded transformations:",
      "(Black): the shadowed beginning, purging impurity.",
      "Albedo (White): evaporation and purification, the emergence of clarity.",
      "Citrinitas (Yellow): the golden dawn, inner awakening.",
      "Rubedo (Red): fulfillment and rebirth, the radiant climax.",
      "Together, these chromatic stages mirror the moon’s journey—from dark new moon to luminous full phase."
    ],
    "cover": {
      "base": "/factsfriday/lunar-alchemy-of-colours",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1LiSXA7uoE/"
  },
  {
    "slug": "el-nino",
    "title": "El Niño",
    "date": "2025-03-14",
    "category": "environment",
    "summary": "The El Niño–Southern Oscillation is a single climate phenomenon that quasi-periodically fluctuates between three phases: Neutral, La Niña or El Niño.",
    "body": [
      "The El Niño–Southern Oscillation is a single climate phenomenon that quasi-periodically fluctuates between three phases: Neutral, La Niña or El Niño. The cycle influences the wind, rainfall, temperature in regions like the Tropical Pacific, North and South America, Asia and Africa resulting in adverse weather conditions.",
      "El Niño may cause unexpected decrease/increase in rainfall resulting in droughts and floods which in turn affects agriculture. This leads to disruption in food safety, supply, lack of clean water etc.",
      "Change in ocean surface temperatures results in damaging of marine ecosystems and decrease in fish stocks, harming the fisheries industry in countries like Peru and Ecuador.",
      "Atypical changes in wind and rainfall patterns engender disasters such as floods, droughts, wildfires, heatwaves, hurricanes and cyclones which heavily impact lives worldwide.",
      "El Niño events occur every 2 to 7 years lasting around 9-12 months with varying intensity of effects, from mild to severe. For scientists, predicting El Niño’s arrival has proven to be a complex task, yet it remains a crucial focus as its global effects can be felt from Asia to South America. The influence of El Niño may even become more pronounced as the time goes on."
    ],
    "cover": {
      "base": "/factsfriday/el-nino",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1AAF7jLZLb/"
  },
  {
    "slug": "the-doomsday-fish",
    "title": "The Doomsday Fish",
    "date": "2024-12-13",
    "category": "biology",
    "summary": "The oarfish, a deep-sea dweller, holds the title of the longest bony fish in the world, capable of reaching lengths of up to 30 feet.",
    "body": [
      "The oarfish, a deep-sea dweller, holds the title of the longest bony fish in the world, capable of reaching lengths of up to 30 feet. Often mistaken for mythical sea serpents, these fishes are heavily linked to folklore and superstitions, particularly in Japan. In 2011, numerous oarfish were found washed ashore in Japan shortly before the catastrophic Tohoku earthquake and tsunami and the subsequent Fukushima Daiichi nuclear disaster, which gave them the title “Doomsday Fish”."
    ],
    "cover": {
      "base": "/factsfriday/the-doomsday-fish",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1JLuMrbm9q/"
  },
  {
    "slug": "seagrass-meadow",
    "title": "Seagrass Meadow",
    "date": "2024-11-22",
    "category": "environment",
    "summary": "Seagrass meadows play an vital role in maintaining the health of our oceans and combating climate change.",
    "body": [
      "Seagrass meadows play an vital role in maintaining the health of our oceans and combating climate change. Despite covering only a small fraction of the ocean floor, seagrass meadows alone store nearly 10% of the ocean’s carbon, making them powerful natural carbon sinks. These ecosystems are also biodiversity hotspots, providing essential habitats and food for countless marine species, many of which are endangered.",
      "Unfortunately, these ecosystems are increasingly under threat due to pollution, overfishing, and the impacts of climate change. Preserving and restoring them is essential for ensuring the health of our oceans and combating global environmental challenges."
    ],
    "cover": {
      "base": "/factsfriday/seagrass-meadow",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1F6ANREQsf/"
  },
  {
    "slug": "once-in-a-lifetime-visit",
    "title": "Once in a Lifetime Visit",
    "date": "2024-11-08",
    "category": "space",
    "summary": "Originating from the Oort Cloud, C/2023 A3 or Comet Tsuchinshan–ATLAS was first discovered on 9 January 2023 by the Purple Mountain Observatory in China and later by ATLAS, South Africa on 22 February.",
    "body": [
      "Originating from the Oort Cloud, C/2023 A3 or Comet Tsuchinshan–ATLAS was first discovered on 9 January 2023 by the Purple Mountain Observatory in China and later by ATLAS, South Africa on 22 February. Its highly elliptical orbit means it won't return to the inner solar system until the next 80 thousand years. It reached a magnitude of -4.9 on 9 October."
    ],
    "cover": {
      "base": "/factsfriday/once-in-a-lifetime-visit",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1KLvMah7XM/"
  },
  {
    "slug": "the-blaze-star",
    "title": "The Blaze Star",
    "date": "2024-10-25",
    "category": "space",
    "summary": "An extraordinary phenomenon has appeared in the night sky!",
    "body": [
      "An extraordinary phenomenon has appeared in the night sky! It is a binary star system which undergoes dramatic eruptions every 80 years, briefly brightening from near invisibility to rival the North Star in luminosity. As a symbiotic star, it consists of a red giant and a white dwarf locked in an intense gravitational dance, creating explosive outbursts."
    ],
    "cover": {
      "base": "/factsfriday/the-blaze-star",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1KPJ6u7soo/"
  },
  {
    "slug": "cruithne-3753",
    "title": "Cruithne 3753",
    "date": "2024-01-26",
    "category": "space",
    "summary": "Cruithne 3753, often known as Earth's second moon, is a quasi-satellite following a horseshoe-shaped orbit around our planet.",
    "body": [
      "Cruithne 3753, often known as Earth's second moon, is a quasi-satellite following a horseshoe-shaped orbit around our planet. Discovered in 1986, Cruithne doesn't actually orbit Earth but has a synchronized relationship with our planet. This celestial companion provides a unique perspective on gravitational dynamics and orbital mechanics, reminding us of a great lesson —",
      "“To think about alternate viewpoints in our exploration.”"
    ],
    "cover": {
      "base": "/factsfriday/cruithne-3753",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1Df44KAfqK/"
  },
  {
    "slug": "where-spacetime-swaps",
    "title": "Where Spacetime Swaps",
    "date": "2023-12-29",
    "category": "physics",
    "summary": "Beyond the event horizon of a black hole, there occurs an interchange of space and time.",
    "body": [
      "Beyond the event horizon of a black hole, there occurs an interchange of space and time.",
      "So, if one endeavors to exit the event horizon, one must travel against the direction of time!",
      "And there the impossibility arises."
    ],
    "cover": {
      "base": "/factsfriday/where-spacetime-swaps",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1ECr4L6Y3D/"
  },
  {
    "slug": "lunar-regolith",
    "title": "Lunar Regolith",
    "date": "2023-12-01",
    "category": "space",
    "summary": "Lunar regolith, that celestial tapestry of lunar landscapes, is a poetic quilt woven by eons of cosmic choreography.",
    "body": [
      "Lunar regolith, that celestial tapestry of lunar landscapes, is a poetic quilt woven by eons of cosmic choreography. Composed of shattered dreams of ancient impacts, this lunar soil whispers the tales of celestial collisions that birthed it. Sparkling with remnants of solar flares, it cradles secrets in its embrace.",
      "Each grain, a silent witness to the moon's ballet through time, reflects the brilliance of a million lunar nights. This regolith, a celestial confetti, invites exploration, holding the allure of extraterrestrial mysteries in its silvery embrace, a testament to the moon's silent symphony etched in the dust of cosmic wonder."
    ],
    "cover": {
      "base": "/factsfriday/lunar-regolith",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1HhZSThavx/"
  },
  {
    "slug": "axolotl",
    "title": "Axolotl",
    "date": "2023-11-17",
    "category": "biology",
    "summary": "Nature, working in its mysterious ways, never fails to leave its flabbergasting marks on those who love the natural phenomenon.",
    "body": [
      "Nature, working in its mysterious ways, never fails to leave its flabbergasting marks on those who love the natural phenomenon. One such example is the ‘Axolotl‘, a creature of Divine Nature that can restore its body, even from the most unfavourable of conditions. Its ability to recover vital morphological aspects is a showcasing of the animal's will to live until the very end, a natural instinct shared by all of the living world."
    ],
    "cover": {
      "base": "/factsfriday/axolotl",
      "sizes": [
        206
      ],
      "width": 206
    },
    "facebook": "https://www.facebook.com/share/p/1Ehds1DhSR/"
  },
  {
    "slug": "fulgurite",
    "title": "Fulgurite",
    "date": "2023-11-10",
    "category": "earth",
    "summary": "Fulgurites are the result of lightning strikes on sand which instantly melts and fuses the silica to form jagged, intricate patterns with extending branches, which, due to their unique structure, have been dubbed as…",
    "body": [
      "Fulgurites are the result of lightning strikes on sand which instantly melts and fuses the silica to form jagged, intricate patterns with extending branches, which, due to their unique structure, have been dubbed as \"fossilized lightning\"."
    ],
    "cover": {
      "base": "/factsfriday/fulgurite",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/1NHBsvwaZN/"
  },
  {
    "slug": "ufo-sightings-confirmed",
    "title": "UFO Sightings Confirmed",
    "date": "2023-08-04",
    "category": "general",
    "summary": "Three military veterans allege, during a Congressional hearing, that the government is covering up evidence of UFOs.",
    "body": [
      "Three military veterans allege, during a Congressional hearing, that the government is covering up evidence of UFOs. The veterans said they have encountered Unidentified Aerial Phenomena (UAP) performing inexplicable maneuvers that couldn't be piloted by humans. They confirmed that nonhuman 'biologics' have been traced and the Govt. is trying to cover it up, without bringing it to the public. One of the ex-officers said he hasn't personally seen any alien vehicles or alien bodies, and that his opinions are based on the accounts of over 40 witnesses he interviewed over four years in his role with the UAP task force, many of whom also shared compelling evidence in the form of photography, official documentation, and classified oral testimony. Their statement also included that the sightings could be a national security problem. Although The Pentagon has denied his claims, Pentagon officials say they are studying unidentified objects, but deny there has been any evidence of extraterrestrial life or evidence of objects that defy physics."
    ],
    "cover": {
      "base": "/factsfriday/ufo-sightings-confirmed",
      "sizes": [
        206
      ],
      "width": 206
    },
    "facebook": "https://www.facebook.com/share/p/19WAh87Cjp/",
    "references": [
      {
        "label": "CNN"
      }
    ]
  },
  {
    "slug": "valles-marineris",
    "title": "Valles Marineris",
    "date": "2023-03-24",
    "category": "space",
    "summary": "\"Vallas Marineris\" is a place on the planet Mars where numerous interconnected canyons coalesced together to stretch a total a of 4000 kilometres across the planet.",
    "body": [
      "\"Vallas Marineris\" is a place on the planet Mars where numerous interconnected canyons coalesced together to stretch a total a of 4000 kilometres across the planet. It was discovered in 1971 by the \"Mariner 9\"."
    ],
    "cover": {
      "base": "/factsfriday/valles-marineris",
      "sizes": [
        206
      ],
      "width": 206
    },
    "facebook": "https://www.facebook.com/share/p/1EKimV5VZU/"
  },
  {
    "slug": "whales-can-aid-in-the-battle-against-climate-change",
    "title": "Whales Can Aid in the Battle Against Climate Change",
    "date": "2023-01-27",
    "category": "environment",
    "summary": "Whales, according to scientists, can help alleviate global warming, which is defined as long-term alterations in temperatures and weather events.",
    "body": [
      "Whales, according to scientists, can help alleviate global warming, which is defined as long-term alterations in temperatures and weather events.",
      "Whales may be the greatest living carbon sink in the open ocean's pelagic zone, according to research done by the University of Otago and the University of Alaska Southeast.",
      "The report concentrated on carbon sequestration, which describes the mechanism of absorbing and conserving co2 in the atmosphere. The method is intended to reduce the concentration of CO2 emitted into the atmosphere.",
      "Carbon dioxide (CO2), the most ubiquitous trace gas, must be contained and absorbed, as per scientists, if climate change is to be halted. Carbon sequestration mostly refers to tree planting or rehabilitating wetlands.",
      "As a matter of fact, while analyzing whales, scientists indicated that, due to their vast size, they can naturally soak up a large amount of CO2. This implies that neither of the carbon will be discharged into the environment when the animals die and sink to the ocean floor.",
      "According to reports, whales will consume up to 4% of their body weight each day. They eat a lot of krill and photosynthetic plankton. For a blue whale, this applies to around 3.6 tons of food per day. Whales can help with the photosynthesis of krill and plankton, which absorb carbon."
    ],
    "cover": {
      "base": "/factsfriday/whales-can-aid-in-the-battle-against-climate-change",
      "sizes": [
        206
      ],
      "width": 206
    },
    "facebook": "https://www.facebook.com/share/p/14wBHa8FAtG/",
    "credit": "Md. Hasibul Hassan"
  },
  {
    "slug": "ice-vii",
    "title": "Ice VII",
    "date": "2023-01-20",
    "category": "physics",
    "summary": "Ice VII, the ultimate cubic crystalline form of ice, is formed from liquid water above 3gigaPa by lowering its temperature to room temperature.",
    "body": [
      "Ice VII, the ultimate cubic crystalline form of ice, is formed from liquid water above 3gigaPa by lowering its temperature to room temperature. It is the densest form of ice anticipated to be found vastly around the solar system like Europa and in the exoplanets like Gliese 436b. Being nonexistent on Earth, it was identified accidentally among the inclusions found in natural diamonds beneath our surface."
    ],
    "cover": {
      "base": "/factsfriday/ice-vii",
      "sizes": [
        206
      ],
      "width": 206
    },
    "facebook": "https://www.facebook.com/share/p/1H7zqxUjfY/"
  },
  {
    "slug": "socotra",
    "title": "Socotra",
    "date": "2023-01-06",
    "category": "earth",
    "summary": "Socotra is the largest island of the Socotra Archipelago, a group of four islands in the Arabian Sea that belongs to Yemen.",
    "body": [
      "Socotra is the largest island of the Socotra Archipelago, a group of four islands in the Arabian Sea that belongs to Yemen. Cut off from mainland Africa and Arabia for a very long time, the island has evolved plants and animals found nowhere else on Earth, which is why it is often called the most alien-looking place on the planet.",
      "Of Socotra's 825 plant species, 307, or about 37%, are endemic, along with 90% of its reptiles and 95% of its land snails. The most famous of them is the dragon's blood tree (Dracaena cinnabari). Its umbrella-shaped crown of upward-facing leaves catches moisture from the mists that roll over the island's highlands, and when its bark is cut, it releases a deep red resin that gives the tree its name. Islanders have harvested this resin for medicine for centuries.",
      "Because of this unique biodiversity, UNESCO declared the archipelago a World Heritage Site in 2008. However, its wildlife now faces threats from cyclones and development, and recent cyclones have destroyed thousands of dragon's blood trees on the Diksam Plateau."
    ],
    "cover": {
      "base": "/factsfriday/socotra",
      "sizes": [
        400,
        526
      ],
      "width": 526
    },
    "facebook": "https://www.facebook.com/share/p/18dnCmMKeM/",
    "references": [
      {
        "label": "UNESCO World Heritage Centre: Socotra Archipelago",
        "url": "https://whc.unesco.org/en/list/1263/"
      },
      {
        "label": "IUCN World Heritage Outlook: Socotra Archipelago",
        "url": "https://worldheritageoutlook.iucn.org/node/1154"
      },
      {
        "label": "National Geographic: Can Socotra, Yemen's 'Dragon's Blood Island,' be saved?",
        "url": "https://www.nationalgeographic.com/environment/article/socotra-yemen-biodiversity-photography"
      }
    ],
    "writtenLater": true
  },
  {
    "slug": "plants-on-the-lunar-soil",
    "title": "Plants on the Lunar Soil",
    "date": "2022-06-17",
    "category": "biology",
    "summary": "In May 2022, scientists at the University of Florida became the first to grow plants in soil brought back from the Moon.",
    "body": [
      "In May 2022, scientists at the University of Florida became the first to grow plants in soil brought back from the Moon. The NASA-funded team planted seeds of Arabidopsis thaliana, a small relative of mustard greens, in lunar regolith collected during the Apollo 11, 12 and 17 missions.",
      "The team had only 12 grams of regolith to work with, so each plant got about a gram, moistened with a nutrient solution. The seeds sprouted, but the plants grew more slowly than those in a lunar simulant made from volcanic ash, which was used for comparison. They had stunted roots, smaller leaves and clear signs of stress, and plants in the older, more weathered samples struggled the most.",
      "The results, published in Communications Biology, show that plants can grow in lunar regolith but need help to thrive. This is an important step towards growing food and producing oxygen for astronauts during long stays on the Moon."
    ],
    "cover": {
      "base": "/factsfriday/plants-on-the-lunar-soil",
      "sizes": [
        206
      ],
      "width": 206
    },
    "facebook": "https://www.facebook.com/share/p/1CVbzsCked/",
    "references": [
      {
        "label": "NASA: Scientists Grow Plants in Lunar Soil",
        "url": "https://www.nasa.gov/humans-in-space/scientists-grow-plants-in-lunar-soil/"
      },
      {
        "label": "University of Florida News: A first: Scientists grow plants in soil from the moon",
        "url": "https://news.ufl.edu/2022/05/lunar-plants/"
      },
      {
        "label": "Eos: Lunar Soil Can Grow Plants",
        "url": "https://eos.org/articles/lunar-soil-can-grow-plants"
      }
    ],
    "writtenLater": true
  }
];

/** Newest first. */
export function sortedFacts(): FactsFridayPost[] {
  return [...factsFriday].sort((a, b) => b.date.localeCompare(a.date));
}

export function getFact(slug: string): FactsFridayPost | undefined {
  return factsFriday.find((f) => f.slug === slug);
}
