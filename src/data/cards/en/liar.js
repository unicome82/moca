// Category IDs match the Korean deck so saved games and settings line up.
// Words are picked for English speakers, not translated from the Korean deck.
// Each list is comma-separated so a word can contain spaces.
const words = (list) => list.split(",").map((word) => word.trim()).filter(Boolean);

export const liarCategories = [
  {
    id: "food",
    name: "Food",
    words: words(`
      pizza, hamburger, hot dog, tacos, burrito, nachos, quesadilla, sushi, ramen, pad thai,
      fried rice, dumplings, spring rolls, curry, spaghetti, lasagna, mac and cheese, garlic bread, caesar salad, grilled cheese,
      BLT, club sandwich, peanut butter and jelly, chicken nuggets, fried chicken, buffalo wings, steak, meatloaf, pot roast, barbecue ribs,
      pulled pork, fish and chips, clam chowder, tomato soup, chicken noodle soup, chili, mashed potatoes, french fries, onion rings, baked potato,
      corn on the cob, coleslaw, potato salad, pancakes, waffles, french toast, scrambled eggs, bacon, omelet, bagel,
      croissant, muffin, donut, cinnamon roll, oatmeal, cereal, yogurt, smoothie, avocado toast, toast,
      apple pie, pumpkin pie, cheesecake, brownie, chocolate chip cookie, cupcake, birthday cake, ice cream, milkshake, popcorn,
      pretzel, potato chips, cotton candy, s'mores, granola bar, peanut butter, honey, maple syrup, ketchup, mustard,
      salsa, guacamole, hummus, cheese, pickles, banana, apple, strawberry, watermelon, pineapple,
      mango, grapes, lemonade, iced tea, hot chocolate, coffee, orange juice, burrito bowl, poke bowl, pho
    `),
  },
  {
    id: "animals",
    name: "Animals",
    words: words(`
      dog, cat, rabbit, hamster, guinea pig, goldfish, parrot, turtle, horse, cow,
      pig, sheep, goat, chicken, duck, goose, turkey, donkey, llama, alpaca,
      lion, tiger, elephant, giraffe, zebra, hippo, rhino, cheetah, leopard, gorilla,
      chimpanzee, monkey, kangaroo, koala, panda, polar bear, grizzly bear, wolf, fox, deer,
      moose, raccoon, squirrel, chipmunk, skunk, beaver, otter, hedgehog, porcupine, bat,
      mouse, owl, eagle, hawk, penguin, flamingo, peacock, swan, pigeon, seagull,
      hummingbird, woodpecker, crow, ostrich, dolphin, whale, shark, octopus, jellyfish, seal,
      sea lion, walrus, starfish, crab, lobster, shrimp, clownfish, sea turtle, frog, toad,
      snake, lizard, crocodile, alligator, chameleon, butterfly, bee, ant, ladybug, spider,
      mosquito, snail, caterpillar, dragonfly, firefly, sloth, camel, hyena, meerkat, armadillo
    `),
  },
  {
    id: "places",
    name: "Places",
    words: words(`
      school, library, hospital, airport, train station, bus stop, gas station, police station, fire station, post office,
      bank, supermarket, mall, bakery, coffee shop, restaurant, diner, food truck, pizza place, bar,
      movie theater, museum, art gallery, zoo, aquarium, amusement park, water park, bowling alley, arcade, gym,
      swimming pool, stadium, golf course, skate park, playground, park, beach, campground, farm, vineyard,
      church, wedding venue, hotel, motel, cruise ship, castle, lighthouse, haunted house, cemetery, office,
      classroom, college campus, dorm room, laboratory, courthouse, city hall, parking lot, elevator, subway, rooftop,
      kitchen, bathroom, bedroom, living room, basement, attic, garage, backyard, porch, laundromat,
      hair salon, nail salon, barbershop, dentist's office, pharmacy, vet clinic, pet store, bookstore, toy store, flower shop,
      hardware store, thrift store, flea market, farmers market, concert hall, nightclub, karaoke bar, casino, spa, sauna,
      ski resort, desert island, jungle, space station, Las Vegas, New York City, Paris, London, Hollywood, Disneyland
    `),
  },
  {
    id: "objects",
    name: "Things",
    words: words(`
      phone, laptop, tablet, headphones, charger, remote control, TV, camera, smartwatch, keyboard,
      mouse pad, flashlight, battery, light bulb, lamp, clock, alarm clock, mirror, umbrella, backpack,
      wallet, purse, keys, sunglasses, glasses, watch, ring, necklace, hat, scarf,
      gloves, socks, sneakers, boots, flip-flops, jacket, hoodie, pajamas, toothbrush, toothpaste,
      hairbrush, comb, towel, soap, shampoo, toilet paper, tissue, pillow, blanket, couch,
      chair, table, desk, bookshelf, bed, rug, curtains, candle, vase, picture frame,
      fridge, microwave, oven, toaster, blender, coffee maker, kettle, frying pan, pot, spatula,
      fork, spoon, knife, chopsticks, plate, bowl, mug, water bottle, lunchbox, trash can,
      pencil, pen, eraser, notebook, scissors, tape, stapler, glue stick, ruler, calculator,
      sticky notes, envelope, stamp, book, map, suitcase, bicycle helmet, tent, sleeping bag, teddy bear
    `),
  },
  {
    id: "activities",
    name: "Hobbies",
    words: words(`
      reading, writing, journaling, drawing, painting, photography, knitting, sewing, crocheting, pottery,
      woodworking, gardening, cooking, baking, grilling, brewing beer, wine tasting, coffee tasting, scrapbooking, origami,
      puzzles, crosswords, sudoku, chess, board games, card games, video games, Dungeons & Dragons, karaoke, singing,
      playing guitar, playing piano, playing drums, DJing, dancing, salsa dancing, ballet, yoga, pilates, meditation,
      running, jogging, hiking, camping, fishing, hunting, rock climbing, cycling, swimming, surfing,
      skiing, snowboarding, ice skating, skateboarding, roller skating, kayaking, sailing, scuba diving, snorkeling, horseback riding,
      golf, tennis, bowling, archery, martial arts, boxing, weightlifting, CrossFit, bird watching, stargazing,
      traveling, road trips, thrifting, collecting stamps, collecting coins, collecting vinyl, sneaker collecting, building LEGO, model trains, magic tricks,
      stand-up comedy, acting, podcasting, blogging, vlogging, streaming, coding, volunteering, learning languages, calligraphy,
      binge-watching, movie nights, picnics, people watching, shopping, flower arranging, candle making, soap making, metal detecting, geocaching
    `),
  },
  {
    id: "jobs",
    name: "Jobs",
    words: words(`
      doctor, nurse, dentist, pharmacist, veterinarian, surgeon, therapist, paramedic, firefighter, police officer,
      lifeguard, soldier, pilot, flight attendant, astronaut, judge, lawyer, accountant, banker, real estate agent,
      teacher, professor, principal, librarian, scientist, engineer, software developer, data analyst, web designer, graphic designer,
      architect, interior designer, artist, sculptor, photographer, journalist, news anchor, writer, poet, translator,
      editor, movie director, actor, singer, songwriter, musician, DJ, model, influencer, YouTuber,
      comedian, magician, athlete, coach, referee, personal trainer, yoga instructor, chef, baker, barista,
      bartender, waiter, cashier, store manager, farmer, fisherman, gardener, florist, carpenter, electrician,
      plumber, mechanic, construction worker, truck driver, bus driver, taxi driver, delivery driver, mail carrier, train conductor, ship captain,
      security guard, janitor, hairdresser, barber, makeup artist, tailor, fashion designer, tour guide, hotel receptionist, wedding planner,
      event planner, babysitter, dog walker, zookeeper, park ranger, detective, spy, politician, president, CEO
    `),
  },
  {
    id: "sports",
    name: "Sports",
    words: words(`
      soccer, baseball, basketball, football, volleyball, tennis, golf, hockey, rugby, cricket,
      softball, lacrosse, handball, badminton, table tennis, squash, pickleball, racquetball, bowling, billiards,
      darts, archery, fencing, boxing, wrestling, judo, karate, taekwondo, kickboxing, MMA,
      sumo wrestling, weightlifting, gymnastics, cheerleading, figure skating, speed skating, ice hockey, curling, bobsled, luge,
      skiing, snowboarding, ski jumping, swimming, diving, water polo, synchronized swimming, rowing, canoeing, kayaking,
      sailing, surfing, windsurfing, wakeboarding, water skiing, white-water rafting, skateboarding, roller derby, BMX, mountain biking,
      cycling, triathlon, marathon, sprinting, hurdles, high jump, long jump, pole vault, shot put, javelin,
      discus, rock climbing, bouldering, parkour, horse racing, polo, rodeo, car racing, Formula 1, motocross,
      dodgeball, kickball, tug of war, frisbee, ultimate frisbee, disc golf, beach volleyball, flag football, cornhole, paintball,
      laser tag, bungee jumping, skydiving, paragliding, hang gliding, jump rope, hula hoop, tag, hide and seek, sack race
    `),
  },
  {
    id: "nature",
    name: "Nature",
    words: words(`
      mountain, ocean, river, lake, waterfall, valley, island, forest, desert, prairie,
      hill, cliff, cave, canyon, volcano, glacier, iceberg, hot spring, swamp, marsh,
      beach, sand dune, coral reef, tide pool, bay, stream, pond, meadow, field, rock,
      pebble, sand, mud, soil, seashell, tree, flower, grass, moss, mushroom,
      seed, acorn, pinecone, leaf, autumn leaves, bamboo, cactus, palm tree, pine tree, oak tree,
      maple tree, cherry blossom, willow tree, sunflower, rose, tulip, daisy, dandelion, ivy, fern,
      wind, breeze, storm, hurricane, tornado, lightning, thunder, rainbow, cloud, fog,
      dew, frost, snow, snowflake, hail, rain, drizzle, blizzard, heat wave, sunshine,
      moonlight, starlight, sunset, sunrise, eclipse, full moon, shooting star, northern lights, high tide, low tide,
      wave, earthquake, avalanche, landslide, drought, flood, wildfire, sky, moon, sun
    `),
  },
  {
    id: "vehicles",
    name: "Vehicles",
    words: words(`
      car, sports car, race car, electric car, minivan, pickup truck, SUV, jeep, convertible, limousine,
      taxi, school bus, city bus, double-decker bus, tour bus, RV, ambulance, fire truck, police car, tow truck,
      garbage truck, delivery van, ice cream truck, food truck, semi truck, tractor, bulldozer, excavator, forklift, cement mixer,
      motorcycle, scooter, electric scooter, moped, dirt bike, bicycle, tandem bike, tricycle, unicycle, e-bike,
      skateboard, longboard, roller skates, inline skates, hoverboard, Segway, wagon, wheelbarrow, shopping cart, stroller,
      wheelchair, golf cart, go-kart, ATV, snowmobile, sled, horse-drawn carriage, rickshaw, cable car, gondola,
      ski lift, elevator, escalator, monorail, subway, train, bullet train, steam train, freight train, tram,
      trolley, ferry, cruise ship, cargo ship, fishing boat, sailboat, yacht, speedboat, canoe, kayak,
      rowboat, raft, inflatable boat, jet ski, submarine, pirate ship, airplane, jet, fighter jet, private jet,
      helicopter, hot air balloon, blimp, glider, drone, rocket, spaceship, space shuttle, tank, UFO
    `),
  },
  {
    id: "beauty",
    name: "Beauty",
    words: words(`
      lipstick, lip gloss, lip balm, lip liner, foundation, concealer, primer, setting spray, powder, blush,
      bronzer, highlighter, contour, eyeshadow, eyeliner, mascara, eyebrow pencil, false eyelashes, eyelash curler, makeup brush,
      beauty blender, cotton pad, makeup remover, face wash, cleanser, toner, serum, moisturizer, night cream, eye cream,
      sunscreen, face mask, sheet mask, clay mask, face scrub, face oil, retinol, vitamin C serum, pimple patch, facial,
      body lotion, body wash, bath bomb, body scrub, hand cream, perfume, cologne, deodorant, dry shampoo, shampoo,
      conditioner, hair mask, hair oil, hair gel, hairspray, mousse, hair dye, highlights, balayage, perm,
      hair straightener, curling iron, hair dryer, hair extensions, wig, bobby pin, scrunchie, headband, haircut, bangs,
      nail polish, nail polish remover, gel nails, acrylic nails, manicure, pedicure, nail file, nail art, cuticle oil, tweezers,
      razor, waxing, eyebrow threading, spray tan, self-tanner, lash extensions, brow lamination, Botox, lip filler, skincare routine,
      makeup bag, vanity mirror, salon, spa day, Sephora, Ulta, no-makeup look, glass skin, red carpet look, smoky eye
    `),
  },
  {
    id: "media",
    name: "Pop Culture",
    words: words(`
      Friends, The Office, Seinfeld, The Simpsons, SpongeBob, Family Guy, South Park, Stranger Things, Game of Thrones, Breaking Bad,
      Grey's Anatomy, Ted Lasso, Squid Game, Wednesday, Bridgerton, The Crown, The Last of Us, Succession, The Bear, Saturday Night Live,
      American Idol, The Voice, Survivor, The Bachelor, Love Island, Shark Tank, Jeopardy!, Wheel of Fortune, The Great British Bake Off, Queer Eye,
      Star Wars, Harry Potter, The Lord of the Rings, Jurassic Park, Titanic, Avatar, The Avengers, Spider-Man, Batman, Barbie,
      Top Gun, Toy Story, Frozen, Finding Nemo, The Lion King, Shrek, Inside Out, Minions, Mean Girls, Home Alone,
      The Godfather, Back to the Future, The Matrix, Pirates of the Caribbean, Fast & Furious, James Bond, Indiana Jones, Rocky, Ghostbusters, Oppenheimer,
      KPop Demon Hunters, Wicked, Taylor Swift, Beyoncé, Drake, Billie Eilish, Ariana Grande, Ed Sheeran, Bad Bunny, Adele,
      Harry Styles, Lady Gaga, Rihanna, BTS, BLACKPINK, The Beatles, Michael Jackson, Elvis, Madonna, Kanye West,
      Super Bowl, Oscars, Grammys, Met Gala, Eras Tour, Coachella, Netflix, Disney+, YouTube, TikTok,
      Instagram, Spotify, memes, viral dance, podcast, reality TV, binge-watching, Marvel, Pokémon, Super Mario
    `),
  },
  {
    id: "life",
    name: "Daily Life",
    words: words(`
      nap, commute, overtime, day off, weekend, weekday, Monday morning, alarm, snooze button, breakfast,
      lunch break, dinner, midnight snack, coffee break, sleeping in, bedtime, blind date, first date, breakup, getting back together,
      apology, making up, phone call, text message, group chat, voicemail, favor, compliment, thank-you note, gift,
      birthday party, surprise party, baby shower, bridal shower, wedding, bachelor party, graduation, prom, family reunion, potluck,
      housewarming, moving day, road trip, vacation, business trip, staycation, walk, workout, grocery shopping, online shopping,
      food delivery, package, cleaning, laundry, dishes, cooking dinner, taking out the trash, recycling, shower, bubble bath,
      job interview, first day at work, team meeting, happy hour, payday, taxes, doctor's appointment, haircut, traffic jam, parking ticket,
      New Year's Eve, New Year's Day, Valentine's Day, St. Patrick's Day, April Fools' Day, Easter, Mother's Day, Father's Day, Memorial Day, Fourth of July,
      Labor Day, back to school, Halloween, trick-or-treating, Thanksgiving, Black Friday, Christmas, Christmas Eve, Hanukkah, Boxing Day,
      snow day, spring break, summer vacation, garage sale, barbecue, sleepover, game night, movie night, brunch, yard work
    `),
  },
];
