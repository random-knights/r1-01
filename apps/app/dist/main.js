// 0rac1es - Crystal-ball oracle carousel for the Rabbit R1 (build-free dist).
// This is the no-bundler version: assets are referenced by relative path so it
// loads in a plain webview with NO build step. Logic mirrors src/main.js.
//
//   - "Rand0m Kn1ghts" (index 0, the DEFAULT landing orb) is the HOUSE oracle:
//     it channels a random STATIC quote from a random character.
//   - "0rac1e" is the R1-AI oracle: it asks the R1's OWN native LLM (via
//     PluginMessageHandler) for a fresh line, with a bundled fallback so it
//     never dead-ends in a plain browser.
//   - The other 13 are static-quote characters (unchanged).
//
// The only AI is the R1's native LLM. No rand0m.ai / favorite-agent code.

// ---------------------------------------------------------------------------
// Oracle data. Quotes are verbatim parody / fair-use lines.
//   - index 0 "Rand0m Kn1ghts": DEFAULT house oracle; surfaces a random quote
//     from a random character.
//   - "0rac1e": the R1-AI oracle (isAI); asks the R1's native LLM, with a
//     bundled fallback.
// ---------------------------------------------------------------------------
var oracles = [
  {
    name: 'Rand0m Kn1ghts',
    isRandom: true,
    png: './assets/Rand0m Kn1ghts.png',
    gif: './assets/Rand0m Kn1ghts.gif',
    quotes: []
  },
  {
    name: '0rac1e',
    isAI: true,
    png: './assets/0rac1e.png',
    gif: './assets/0rac1e.gif',
    quotes: []
  },
  {
    name: 'The Dude',
    png: './assets/The Dude.png',
    gif: './assets/The Dude.gif',
    quotes: [
      "The Dude abides.",
      "Yeah, well, you know, that’s just, like, your opinion, man.",
      "Careful, man, there’s a beverage here!",
      "I’m not into the whole brevity thing.",
      "This aggression will not stand, man.",
      "Sometimes you eat the bar, and sometimes the bar eats you.",
      "That rug really tied the room together.",
      "I take it easy for all you sinners.",
      "New shit has come to light.",
      "Mind if I do a J?",
      "Life goes on, man.",
      "I’m just helping her conceive, man.",
      "That’s marvelous.",
      "Let’s go bowling.",
      "The bums will always lose.",
      "You’re not wrong, Walter, you’re just an asshole.",
      "Strong men also cry.",
      "The Dude minds.",
      "I had a rough night and I hate the Eagles.",
      "The Dude is not in.",
      "This is a bummer, man.",
      "That had not occurred to us, Dude.",
      "Are you employed, sir?",
      "I’m the Dude, so that’s what you call me.",
      "Abide."
    ]
  },
  {
    name: 'Ron Burgundy',
    png: './assets/Ron Burgundy.png',
    gif: './assets/Ron Burgundy.gif',
    quotes: [
      "I’m kind of a big deal.",
      "Stay classy.",
      "I love lamp.",
      "60% of the time, it works every time.",
      "That escalated quickly.",
      "You stay classy, San Diego.",
      "I immediately regret this decision.",
      "Boy, that escalated quickly.",
      "Milk was a bad choice.",
      "I don’t know how to put this, but I’m kind of a big deal.",
      "I have many leather-bound books.",
      "I ate a big red candle.",
      "By the beard of Zeus!",
      "I'm not even mad. That's amazing.",
      "Discovered by the Germans in 1904.",
      "You’re a smelly pirate hooker.",
      "I’m very important.",
      "I’m in a glass case of emotion!",
      "I pooped a solid brick.",
      "I will not be ignored.",
      "Great Odin’s raven!",
      "I don’t know what we’re yelling about!",
      "News team, assemble!",
      "This is science.",
      "I'm not a baby."
    ]
  },
  {
    name: 'Bob Ross',
    png: './assets/Bob Ross.png',
    gif: './assets/Bob Ross.gif',
    quotes: [
      "We don't make mistakes, just happy little accidents.",
      "There are no limits here.",
      "You can do anything here.",
      "Let's get crazy.",
      "Just let your imagination wander.",
      "You need the dark in order to show the light.",
      "That's a crooked tree. We'll send him to Washington.",
      "Let’s build us a happy little cloud.",
      "Anything you can imagine, you can create.",
      "You can do anything you want to do.",
      "This is your world.",
      "Talent is a pursued interest.",
      "There’s nothing wrong with having a tree as a friend.",
      "We want happy paintings.",
      "Just relax and float downstream.",
      "That’s where the little squirrels live.",
      "Let’s put a little happy bush here.",
      "Go out on a limb — that’s where the fruit is.",
      "Trees cover up a multitude of sins.",
      "Just beat the devil out of it.",
      "We’re just having fun.",
      "Let your heart take you to wherever you want to be.",
      "A thin paint will stick to a thick paint.",
      "You create the dream.",
      "All you need is a dream in your heart."
    ]
  },
  {
    name: 'Leslie Knope',
    png: './assets/Leslie Knope.png',
    gif: './assets/Leslie Knope.gif',
    quotes: [
      "We need to remember what’s important in life: friends, waffles, work.",
      "Anything is possible when you have the right people there to support you.",
      "I am big enough to admit that I am often inspired by myself.",
      "We have to remember what’s important in life.",
      "I have never taken the high road, but I tell other people to.",
      "Time is money; money is power; power is pizza; pizza is knowledge.",
      "I am nourished by your hatred.",
      "We should all have breakfast food for dinner.",
      "You can trust me because I don’t care enough about you to lie.",
      "There’s nothing we can’t do if we work hard, never sleep, and shirk all other responsibilities.",
      "I love you and I like you.",
      "I’m a goddess, a glorious female warrior.",
      "The thing about youth culture is… I don’t understand it.",
      "No one achieves anything alone.",
      "Dreams are like puppies.",
      "I am super chill all the time.",
      "What I hear when I’m being yelled at is people caring loudly.",
      "We’re like a ninja turtle.",
      "I regret nothing.",
      "If you don’t like waffles, then I’m sorry, you’re wrong.",
      "I have the most organized binders.",
      "History began on July 4th, 1776.",
      "I’m very good at delegating.",
      "I will take a bullet for you.",
      "Friends first, always."
    ]
  },
  {
    name: 'Dwight Schrute',
    png: './assets/Dwight Schrute.png',
    gif: './assets/Dwight Schrute.gif',
    quotes: [
      "Whenever I’m about to do something, I think, ‘Would an idiot do that?’",
      "I am fast. To give you a reference point, I am somewhere between a snake and a mongoose.",
      "Identity theft is not a joke, Jim.",
      "In the wild, there is no healthcare.",
      "Through concentration, I can raise and lower my cholesterol.",
      "I love catching people in the act. That’s why I always whip open doors.",
      "I am better than you have ever been or ever will be.",
      "I am not superstitious, but I am a little stitious.",
      "Security is a paradox.",
      "If I can’t scuba, then what’s this all been about?",
      "I will look so handsome for you, Darryl.",
      "Blood alone moves the wheels of history.",
      "Today, smoking is going to save lives.",
      "The eyes are the groin of the head.",
      "I don't believe you. Continue.",
      "I am the assistant regional manager.",
      "Bears. Beets. Battlestar Galactica.",
      "I have been cultivating mass.",
      "When someone smiles at me, all I see is a chimpanzee begging for its life.",
      "I am faster than 80% of all snakes.",
      "Power points are my specialty.",
      "I know nothing.",
      "False.",
      "That is a Schrute promise.",
      "Respect."
    ]
  },
  {
    name: 'Rick Sanchez',
    png: './assets/Rick Sanchez.png',
    gif: './assets/Rick Sanchez.gif',
    quotes: [
      "Wubba Lubba Dub-Dub!",
      "Nobody exists on purpose.",
      "Sometimes science is more art than science.",
      "What, so everyone’s supposed to sleep every single night now?",
      "Listen, Morty, I hate to break it to you.",
      "Boom! Big reveal!",
      "To live is to risk it all.",
      "I’m sorry you think you deserve an apology.",
      "Existence is pain.",
      "Your boos mean nothing.",
      "Don’t think about it.",
      "I’m a scientist; because I invent, transform, create.",
      "Being nice is something stupid people do.",
      "Let’s get riggity-riggity wrecked.",
      "I don’t discuss problems, I incinerate them.",
      "Love is just a chemical reaction.",
      "Think for yourselves.",
      "The universe is basically an animal.",
      "I turned myself into a pickle.",
      "Nothing matters.",
      "Welcome to the club, pal.",
      "I know everything.",
      "Time is a flat circle—wrong show.",
      "Get your shit together.",
      "Peace among worlds."
    ]
  },
  {
    name: 'Yoda',
    png: './assets/Yoda.png',
    gif: './assets/Yoda.gif',
    quotes: [
      "Do, or do not. There is no try.",
      "Fear is the path to the dark side.",
      "Truly wonderful, the mind of a child is.",
      "When nine hundred years old you reach, look as good you will not.",
      "Size matters not.",
      "Named must your fear be.",
      "Train yourself to let go.",
      "Always pass on what you have learned.",
      "Patience you must have.",
      "Control, control, you must learn control.",
      "In a dark place we find ourselves.",
      "Clear your mind must be.",
      "The greatest teacher, failure is.",
      "Much to learn, you still have.",
      "Adventure. Excitement. A Jedi craves not these things.",
      "Judge me by my size, do you?",
      "Feel the Force.",
      "To answer power with power, the Jedi way this is not.",
      "A challenge life-long it is.",
      "Use the Force wisely.",
      "Difficult to see. Always in motion is the future.",
      "Ready are you?",
      "Mind what you have learned.",
      "Consume you, fear will.",
      "Pass on what you have learned."
    ]
  },
  {
    name: 'Moira Rose',
    png: './assets/Moira Rose.png',
    gif: './assets/Moira Rose.gif',
    quotes: [
      "I am positively bedeviled with meetings.",
      "The crows have eyes, Jocelyn.",
      "Love that journey for me.",
      "I am appalled.",
      "What you did was impulsive, capricious, and melodramatic.",
      "Allow me to expand my vocabulary.",
      "I will not be shamed for my emotional arc.",
      "Let the naysayers know you are unassailable.",
      "This is not my natural habitat.",
      "I have never heard someone say so many wrong things.",
      "Bébé.",
      "One must champion oneself.",
      "I shall not be stifled.",
      "The world is falling apart.",
      "I’m positively tickled.",
      "This wine is awful.",
      "You do realize the baby is crying.",
      "I am not capable of mundane tasks.",
      "I am agog.",
      "Let us proceed with caution.",
      "It’s my turn to take a selfish.",
      "You’ve done well, dear.",
      "I shall survive this.",
      "I need a break from reality.",
      "Simply divine."
    ]
  },
  {
    name: 'Hermione Granger',
    png: './assets/Hermione Granger.png',
    gif: './assets/Hermione Granger.gif',
    quotes: [
      "Books! And cleverness!",
      "It’s leviosa, not leviosar.",
      "Fear of a name increases fear of the thing itself.",
      "I’m hoping to do some good in the world.",
      "Just because it’s taken you three years doesn’t mean I can’t do it.",
      "We could all have been killed.",
      "Everything’s going to change now.",
      "It’s leviOsa, not levioSA!",
      "I checked this out weeks ago.",
      "You’re a great wizard, Harry.",
      "At least my happiness doesn’t depend on Ron’s goalkeeping ability.",
      "You have the emotional range of a teaspoon.",
      "Dumbledore would have wanted this.",
      "Fear of a name only increases fear of the thing itself.",
      "Logic can take you from A to Z.",
      "Being different isn’t a bad thing.",
      "We’re stronger together.",
      "I believe in preparation.",
      "It’s not Hogwarts without you.",
      "Courage comes in many forms.",
      "Rules exist for a reason.",
      "I trust books.",
      "I’m going to bed before either of you come up with another clever idea.",
      "Justice matters.",
      "Always keep learning."
    ]
  },
  {
    name: 'Taco Jesus',
    png: './assets/Taco Jesus.png',
    gif: './assets/Taco Jesus.gif',
    quotes: [
      "Blessed are the hungry, for tacos shall be provided.",
      "Break tortillas, not hearts.",
      "In queso you trust.",
      "Peace be with your salsa.",
      "Turn water into horchata.",
      "Thou shalt not skip Taco Tuesday.",
      "Faith is believing the taco truck will still be open.",
      "Guac is extra, but worth it.",
      "Love thy neighbor’s hot sauce.",
      "Turn the other cheek… unless it’s dry chicken.",
      "Let there be cilantro.",
      "Forgive, but never forget tacos.",
      "Those who wait are rewarded… usually with tacos.",
      "Eat together, stay together.",
      "There is no wrong filling, only poor balance.",
      "The shell shall not break you.",
      "Man does not live by bread alone, but by tacos.",
      "Let he who is without salsa cast the first chip.",
      "Where two or three are gathered, bring extra toppings.",
      "Give us this day our daily taco.",
      "Let your heart be soft, like a warm tortilla.",
      "Forgive them, for they know not how spicy it is.",
      "Remember: you were loved before the tacos arrived.",
      "Love thy neighbor. Share thy guac.",
      "Amen, and pass the salsa."
    ]
  },
  {
    name: 'Randy Marsh',
    png: './assets/Randy Marsh.png',
    gif: './assets/Randy Marsh.gif',
    quotes: [
      "You’re a lousy kid! I wish Jaden Smith was my son!",
      "If we’re still alive in the morning, then we’ll know we’re not dead.",
      "You call your friend an asshole this instant!",
      "Oh, I’m sorry, I thought this was America.",
      "I’m not fat, I’m big-boned.",
      "There’s a time and place for everything.",
      "No it wasn’t me, it was the spooky ghost!!",
      "There are a lot of boobs out there, Son.",
      "I don’t have any change!",
      "I’m not having a glass of wine, I’m having six. It’s called a tasting and it’s classy.",
      "You don’t understand the science.",
      "You can’t die, everyone really likes you!",
      "Spider-man works in mysterious ways, Shelly.",
      "Wall-Mart isn’t our enemy, it’s our neighborhood friend.",
      "Crème fraîche.",
      "It’s called innovation.",
      "It’s called a shmorgasvine and it’s elegantly cultural!",
      "I’m not chugging beer! I’m sampling a flight of gluten free German lagers.",
      "Why don’t we have the players just wear bras?",
      "Your mother has been worried sick, and I’ve been watching TV!",
      "What seems to be the officer, problem?",
      "Tell Mum it’s fine, just gonna get a lil bit of cancer.",
      "Time to show you some Tegridy!",
      "Have you ever tried marijuana? Maybe it’s time.",
      "What is Minecraft and how do you tame a horse in it?"
    ]
  },
  {
    name: 'Linda Belcher',
    png: './assets/Linda Belcher.png',
    gif: './assets/Linda Belcher.gif',
    quotes: [
      "All right!",
      "Stay outta my room!",
      "Mommy doesn’t get drunk.",
      "The problem is I don't have a freaking drink in my hand!",
      "I’m having fun in my own way.",
      "I’ve only had half of four bottles of wine.",
      "This is gonna be great.",
      "We’re gonna be okay.",
      "Only strippers shave above the knee.",
      "I love my family.",
      "I was gonna punch you but I'm holding my wine.",
      "I'll have a crap attack any time I want!",
      "We’ll figure it out.",
      "That’s my baby.",
      "I like showers and mornings and bologna and turtles.",
      "This is exciting.",
      "We’re doing it.",
      "I have a good feeling.",
      "Oh, put a mistletoe on my butt and kiss it.",
      "Mommy doesn’t get drunk, she just has fun!",
      "Tammy can go sit in syrup. Let the bees get her.",
      "Oh, mini croissants! Stop me when I've had sixteen.",
      "It’s okay to be weird.",
      "We belong together.",
      "Puttin' on my happy pants!"
    ]
  },
  {
    name: 'Gandalf',
    png: './assets/Gandalf.png',
    gif: './assets/Gandalf.gif',
    quotes: [
      "All we have to decide is what to do with the time that is given us.",
      "A wizard is never late... He arrives precisely when he means to.",
      "Even the smallest person can change the course of the future.",
      "You shall not pass!",
      "There is only one Lord of the Ring.",
      "The burned hand teaches best.",
      "Courage will now be your best defense.",
      "It is not despair, for despair is only for those who see the end beyond all doubt.",
      "Fly, you fools!",
      "I will not risk open war.",
      "The wise speak only of what they know.",
      "Hope is kindled.",
      "A journey does not end here.",
      "True courage is knowing not when to take a life, but when to spare one.",
      "Many that live deserve death.",
      "Even darkness must pass.",
      "The ring has awoken.",
      "It’s the small things, everyday deeds of ordinary folk, that keep the darkness at bay.",
      "I am a servant of the Secret Fire.",
      "The way is shut.",
      "Look to my coming at first light.",
      "So do all who live to see such times.",
      "There are older and fouler things.",
      "You are stronger than you know.",
      "End? No, the journey doesn’t end here."
    ]
  }
];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
var currentIndex = 0;
var quoteVisible = false;
var autoHideTimer = null;
var accelRunning = false;
var lastShakeTime = 0;

var SHAKE_THRESHOLD = 1.8;   // g (sqrt(x^2+y^2+z^2)); rest is ~1.0g
var SHAKE_DEBOUNCE = 800;    // ms between accepted shakes
var AUTO_HIDE_DELAY = 8000;  // ms of no interaction before quote fades out

var touchStartX = 0;
var touchStartY = 0;
var SWIPE_MIN = 40;

// --- R1-AI 0rac1e (native LLM via PluginMessageHandler) ---
var ORACLE_PROMPT =
  'You are a mystical crystal-ball oracle. Reply with ONE short, original, ' +
  'uplifting fortune — no preamble.';
var LLM_TIMEOUT = 6000;      // ms to wait for a reply before falling back
var llmPending = false;      // true while awaiting onPluginMessage
var llmTimer = null;         // fallback timer handle
var awaitingVoicePrompt = false; // true between longPressStart/End (PTT)

// Bundled generic fortunes so 0rac1e never dead-ends (browser, or LLM timeout).
var FALLBACK_LINES = [
  'The path you seek is already beneath your feet.',
  'A small step today becomes tomorrow’s leap.',
  'What you give freely returns multiplied.',
  'Trust the quiet voice; it knows the way.',
  'Fortune favors the heart that keeps trying.',
  'The clouds will part for those who keep walking.',
  'Your next chapter begins the moment you decide.',
  'Kindness you scatter now will bloom in time.',
  'Doubt is only the shadow of a great idea.',
  'The stars align for the patient and the bold.',
  'Begin before you are ready; courage follows.',
  'Even the longest night gives way to morning.'
];

var elPng, elGif, elQuote, elPageNum, elDots, elOrb, elNavPrev, elNavNext;

document.addEventListener('DOMContentLoaded', function () {
  elPng = document.getElementById('png-background');
  elGif = document.getElementById('gif-overlay');
  elQuote = document.getElementById('quote-text');
  elPageNum = document.getElementById('page-number');
  elDots = document.getElementById('page-dots');
  elOrb = document.getElementById('orb');
  elNavPrev = document.getElementById('nav-prev');
  elNavNext = document.getElementById('nav-next');

  buildDots();
  renderOracle();
  initAccelerometer();
  wireInput();

  console.log('0rac1es ready (' + oracles.length + ' oracles).');
});

function buildDots() {
  elDots.innerHTML = '';
  for (var i = 0; i < oracles.length; i++) {
    var dot = document.createElement('span');
    dot.className = 'dot' + (i === currentIndex ? ' active' : '');
    elDots.appendChild(dot);
  }
}

function updateDots() {
  var dots = elDots.querySelectorAll('.dot');
  for (var i = 0; i < dots.length; i++) {
    if (i === currentIndex) dots[i].classList.add('active');
    else dots[i].classList.remove('active');
  }
}

function renderOracle() {
  var o = oracles[currentIndex];
  elPng.style.backgroundImage = 'url("' + o.png + '")';
  elGif.style.backgroundImage = 'url("' + o.gif + '")';
  elGif.classList.remove('faded');

  elQuote.classList.remove('visible', 'pending');
  elQuote.textContent = '';
  quoteVisible = false;
  clearAutoHide();
  cancelLLM();

  elPageNum.textContent = (currentIndex + 1) + '/' + oracles.length;
  updateDots();
}

function goTo(index) {
  currentIndex = (index + oracles.length) % oracles.length;
  renderOracle();
}
function next() { goTo(currentIndex + 1); }
function prev() { goTo(currentIndex - 1); }

function pickQuote() {
  var o = oracles[currentIndex];
  if (o.isRandom) {
    // House oracle (Rand0m Kn1ghts): random character, then random quote.
    // Exclude the house oracle and the AI 0rac1e (neither has static quotes).
    var pool = oracles.filter(function (x) { return !x.isRandom && !x.isAI && x.quotes.length; });
    var character = pool[Math.floor(Math.random() * pool.length)];
    return character.quotes[Math.floor(Math.random() * character.quotes.length)];
  }
  if (!o.quotes.length) return '';
  return o.quotes[Math.floor(Math.random() * o.quotes.length)];
}

// Render a finished line in the orb with the standard fade/fit. Shared by the
// static oracles and the AI 0rac1e once its reply arrives.
function showQuote(text) {
  if (!text) return;
  cancelLLM();

  elGif.classList.add('faded');
  elQuote.textContent = text;
  fitQuote(text);

  elQuote.classList.remove('visible', 'pending');
  void elQuote.offsetWidth; // force reflow so re-trigger restarts the fade-in
  elQuote.classList.add('visible');

  quoteVisible = true;
  startAutoHide();
}

// A trigger always reveals a FRESH line. The AI 0rac1e routes to the native
// LLM; every other oracle reveals a static (or house-random) quote.
function revealQuote() {
  if (oracles[currentIndex].isAI) {
    askOracle();
    return;
  }
  showQuote(pickQuote());
}

function hideQuote() {
  clearAutoHide();
  cancelLLM();
  elQuote.classList.remove('visible', 'pending');
  quoteVisible = false;
  setTimeout(function () {
    elGif.classList.remove('faded');
    if (!quoteVisible) elQuote.textContent = '';
  }, 500);
}

function toggleQuote() {
  if (quoteVisible || llmPending) hideQuote();
  else revealQuote();
}

// ---------------------------------------------------------------------------
// R1-AI 0rac1e: ask the R1's OWN native LLM via PluginMessageHandler.
// Falls back to a bundled fortune in a plain browser or on timeout.
// ---------------------------------------------------------------------------
function showPending() {
  elGif.classList.add('faded');
  elQuote.textContent = 'consulting…';
  fitQuote('consulting…');
  elQuote.classList.remove('visible');
  void elQuote.offsetWidth;
  elQuote.classList.add('visible', 'pending');
  quoteVisible = false;
  clearAutoHide();
}

function randomFallback() {
  return FALLBACK_LINES[Math.floor(Math.random() * FALLBACK_LINES.length)];
}

function askOracle(message) {
  if (typeof window === 'undefined' || !window.PluginMessageHandler) {
    showQuote(randomFallback());
    return;
  }

  showPending();
  llmPending = true;

  clearLLMTimer();
  llmTimer = setTimeout(function () {
    if (llmPending) {
      llmPending = false;
      showQuote(randomFallback());
    }
  }, LLM_TIMEOUT);

  try {
    window.PluginMessageHandler.postMessage(JSON.stringify({
      message: message || ORACLE_PROMPT,
      useLLM: true,
      wantsR1Response: true
    }));
  } catch (e) {
    console.error('0rac1e LLM postMessage failed:', e);
    cancelLLM();
    showQuote(randomFallback());
  }
}

function clearLLMTimer() {
  if (llmTimer) { clearTimeout(llmTimer); llmTimer = null; }
}

function cancelLLM() {
  clearLLMTimer();
  llmPending = false;
  awaitingVoicePrompt = false;
}

function fitQuote(text) {
  var len = text.length;
  var size;
  if (len <= 24) size = 22;
  else if (len <= 45) size = 19;
  else if (len <= 70) size = 16;
  else if (len <= 110) size = 14;
  else if (len <= 150) size = 12;
  else size = 11;
  elQuote.style.fontSize = size + 'px';
}

function clearAutoHide() {
  if (autoHideTimer) { clearTimeout(autoHideTimer); autoHideTimer = null; }
}
function startAutoHide() {
  clearAutoHide();
  autoHideTimer = setTimeout(hideQuote, AUTO_HIDE_DELAY);
}

// --- Accelerometer shake detection ---
function initAccelerometer() {
  waitForSensors().then(function () {
    if (!(window.creationSensors && window.creationSensors.accelerometer)) {
      console.log('Accelerometer API not available (browser/demo mode).');
      return;
    }
    var accel = window.creationSensors.accelerometer;
    try {
      if (typeof accel.isAvailable === 'function') {
        Promise.resolve(accel.isAvailable()).then(function (ok) {
          if (!ok) { console.warn('Accelerometer reports not available.'); return; }
          startAccel(accel);
        });
      } else {
        startAccel(accel);
      }
    } catch (e) {
      console.error('Error starting accelerometer:', e);
    }
  });
}

function startAccel(accel) {
  accel.start(handleAccel, { frequency: 60 });
  accelRunning = true;
  console.log('Accelerometer started at 60Hz.');
}

function waitForSensors() {
  return new Promise(function (resolve) {
    var tries = 0;
    function tick() {
      if (window.creationSensors || tries >= 50) return resolve();
      tries++;
      setTimeout(tick, 100); // poll up to ~5s
    }
    tick();
  });
}

function handleAccel(data) {
  var x, y, z;
  if (data.tiltX !== undefined) { x = data.tiltX; y = data.tiltY; z = data.tiltZ; }
  else if (data.rawX !== undefined) { x = data.rawX / 9.8; y = data.rawY / 9.8; z = data.rawZ / 9.8; }
  else if (data.x !== undefined) { x = data.x; y = data.y; z = data.z; }
  else return;
  if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') return;

  var g = Math.sqrt(x * x + y * y + z * z);
  var now = Date.now();
  if (g > SHAKE_THRESHOLD && now - lastShakeTime > SHAKE_DEBOUNCE) {
    lastShakeTime = now;
    console.log('Shake detected (g=' + g.toFixed(2) + ').');
    revealQuote();
  }
}

function stopAccelerometer() {
  if (window.creationSensors && window.creationSensors.accelerometer && accelRunning) {
    try { window.creationSensors.accelerometer.stop(); accelRunning = false; }
    catch (e) { console.warn('Could not stop accelerometer:', e); }
  }
}

// --- Input wiring ---
function wireInput() {
  window.addEventListener('scrollUp', prev);
  window.addEventListener('scrollDown', next);

  // Short side button reveals / advances quotes.
  window.addEventListener('sideClick', revealQuote);

  // PTT hold (voice): only the AI 0rac1e uses voice; other oracles reveal a
  // quote on release.
  window.addEventListener('longPressStart', onLongPressStart);
  window.addEventListener('longPressEnd', onLongPressEnd);

  // Nav chevrons flanking the orb change oracles (left = prev, right = next).
  if (elNavPrev) elNavPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
  if (elNavNext) elNavNext.addEventListener('click', function (e) { e.stopPropagation(); next(); });

  elOrb.addEventListener('click', toggleQuote);

  elOrb.addEventListener('touchstart', function (e) {
    var t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  elOrb.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0];
    var dx = t.clientX - touchStartX;
    var dy = t.clientY - touchStartY;
    if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) prev(); else next();
    }
  }, { passive: true });

  window.addEventListener('keydown', function (e) {
    switch (e.code) {
      case 'Space':      e.preventDefault(); revealQuote(); break;
      case 'ArrowRight': e.preventDefault(); next(); break;
      case 'ArrowDown':  e.preventDefault(); next(); break;
      case 'ArrowLeft':  e.preventDefault(); prev(); break;
      case 'ArrowUp':    e.preventDefault(); prev(); break;
      case 'Enter':      e.preventDefault(); toggleQuote(); break;
    }
  });

  window.addEventListener('beforeunload', function () {
    clearAutoHide();
    cancelLLM();
    stopAccelerometer();
  });
}

// PTT (push-to-talk) handlers. While held, the R1 captures the user's voice.
function onLongPressStart() {
  if (oracles[currentIndex].isAI) {
    awaitingVoicePrompt = true;
    showPending();
  }
}

function onLongPressEnd() {
  if (!oracles[currentIndex].isAI) {
    revealQuote();
    return;
  }
  // AI 0rac1e: if a transcript already arrived, askOracle() fired there;
  // otherwise kick off the default oracle prompt so a hold always yields a
  // fortune (timeout backstop applies).
  if (awaitingVoicePrompt && !llmPending) {
    awaitingVoicePrompt = false;
    askOracle();
  }
}

// --- Inbound messages from the R1 (LLM replies and/or voice transcripts) ---
function extractText(data) {
  if (data == null) return '';
  if (typeof data === 'string') {
    var s = data.trim();
    if (s && (s.charAt(0) === '{' || s.charAt(0) === '[')) {
      try { return extractText(JSON.parse(s)); } catch (e) { return s; }
    }
    return s;
  }
  if (typeof data === 'object') {
    return (
      data.message || data.text || data.data || data.response ||
      data.transcript || data.transcription || data.assistantMessage ||
      data.content || ''
    );
  }
  return String(data);
}

function looksLikeTranscript(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.transcript || data.transcription) return true;
  var kind = (data.type || data.event || data.kind || '').toString().toLowerCase();
  return kind.indexOf('transcript') !== -1 || kind.indexOf('speech') !== -1;
}

window.onPluginMessage = function (data) {
  // Ignore inbound messages unless the AI 0rac1e is the current oracle.
  if (!oracles[currentIndex].isAI) return;

  // Voice: if we asked for speech and the R1 returns the transcript, re-issue
  // the LLM call with the user's words so the oracle answers what was asked.
  if (awaitingVoicePrompt && looksLikeTranscript(data)) {
    var spoken = extractText(data);
    awaitingVoicePrompt = false;
    if (spoken) { askOracle(spoken); return; }
  }

  // Otherwise treat the payload as the LLM's answer and render it.
  if (!llmPending && !awaitingVoicePrompt) return; // unsolicited; ignore
  var text = extractText(data);
  if (text) {
    awaitingVoicePrompt = false;
    showQuote(text);
  }
};
