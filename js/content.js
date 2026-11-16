/**
 * ====================================================================
 * MY DASHAIN & TIHAR VACATION DIARY - CONTENT CONFIGURATION
 * ====================================================================
 * 
 * Welcome to your personal diary content configuration!
 * You can easily personalize this website by changing any of the text,
 * student information, image paths, or captions below.
 * 
 * HOW TO EDIT:
 * 1. Change your name, grade, school in `studentInfo`.
 * 2. To use your own real photos, put them into `assets/images/` and update
 *    the corresponding path below (e.g., 'assets/images/hero.jpg').
 * 3. To add your own videos, put MP4 files into `assets/videos/` and update
 *    `videoMemories`.
 * 4. Save this file and refresh your browser!
 */

const DIARY_CONTENT = {
  // Student & School Details (EDIT HERE)
  studentInfo: {
    studentName: "Supriya",
    classGrade: "Class 10",
    academicYear: "2083 (2026)",
    schoolName: "Paramount Public School",
    tagline: "A little collection of moments, laughter, traditions and happiness.",
    welcomeBadge: "A little humble place ♡"
  },

  // Hero Section
  hero: {
    title: "My Dashain & Tihar Memories",
    subtitle: "A Little Collection of Moments, Laughter, Traditions & Happiness",
    introText: "As the festive season arrives, A season to wish for joy and a wonderful Dashain along with a sparkling Tihar! Sending the warmest wishes for all peoples health, happiness, and prosperity. May all home be filled with blessings, sel roti, bright diyo lights, and endless joy this year.",
    heroImage: "assets/images/first.jpg", // Replace with your real photo e.g. "assets/images/hero.jpg"
    heroCaption: "Bits of Greenary"
  },

  // Vacation Overview / Introduction Section
  vacationOverview: {
    heading: "A Vacation to Remember",
    subheading: "Counting blessings, festive excitement, and slow peaceful days",
    dateRange: "Ashwin — Kartik",
    stats: [
      { number: "15+", label: "Days of Celebration" },
      { number: "100+", label: "Smiles & Blessings" },
      { number: "2", label: "Beloved Festivals" },
      { number: "Countless", label: "Sweet Memories" }
    ],
    personalNote: "Holidays always begin with a quiet flutter of excitement. After busy months of classes, homework, and exams, the school bell rang for the autumn break. Stepping out into the crisp breeze, knowing that the most awaited festivals of the year were finally here, felt truly magical.",
    handwrittenQuote: "The greatest gift of any holiday is time spent with those who love you."
  },

  // Dashain Section
  dashain: {
    badge: "Festival of Victory & Family",
    heading: "Dashain — Moments of Happiness",
    subtitle: "Family, blessings, celebrations and beautiful memories.",
    description: "Dashain brought an atmosphere of reverence, joyful family reunions, and deep-rooted traditions. From waking up to the gentle festive music to seeing the sacred golden Jamara grow day by day, every moment was special.",
    personalQuote: "Dashain reminds me how beautiful it is to be surrounded by the people I love.",
    highlights: [
      {
        id: "dashain-tika",
        title: "Vijaya Dashami Blessings",
        label: "Sacred Tika & Jamara",
        image: "assets/images/dashain/tika.webp", // Replace with your photo
        caption: "Receiving white Tika, crisp Jamara, and sincere blessings from elders."
      },
      {
        id: "dashain-swing",
        title: "Flying on the Bamboo Swing",
        label: "Linge Ping Tradition",
        image: "assets/images/dashain/dashain-swing.jpg", // Replace with your photo
        caption: "Leaving the ground behind at least once a year, soaring into the blue sky!"
      },
      {
        id: "dashain-family",
        title: "An encounter",
        label: "Funny moment",
        image: "assets/images/dashain/Puntulu.jpg", // Replace with your photo
        caption: "Gathered for the food only."
      }
    ]
  },

  // Tihar Section
  tihar: {
    badge: "Festival of Lights & Flowers",
    heading: "Tihar — A Festival Full of Lights",
    subtitle: "Lights, colors, flowers and unforgettable moments.",
    description: "As dusk settled, our home transformed into a sparkling wonderland. Clay diyos cast a warm golden glow across the floors, marigold garlands brought radiant colors, and every evening felt like poetry written in light.",
    highlights: [
      {
        id: "tihar-diyo",
        title: "Diyos & Evening Glow",
        label: "Laxmi Puja Warmth",
        image: "assets/images/tihar/Diyo.jpg", // Replace with your photo
        caption: "Arranging handmade clay diyos along the windowsills and balcony."
      },
      {
        id: "tihar-rangoli",
        title: "Courtyard Rangoli",
        label: "Art & Colors",
        image: "assets/images/tihar/Rangoli.png", // Replace with your photo
        caption: "Designing colorful patterns with powders and petals at the main entrance."
      },
      {
        id: "tihar-bhaitika",
        title: "Bhai Tika Celebrations",
        label: "Love & Gratitude",
        image: "assets/images/tihar/Selroti.jpeg", // Replace with your photo
        caption: "The sacred seven-color tika, Makhamali garlands, and sweet treats."
      }
    ]
  },

  // Photo Gallery
  gallery: [
    {
      id: 1,
      title: "The beautiful skies of autumn",
      category: "Atmosphere",
      caption: "Watching the different shades of skies from the top of my rooftop along with the winds apporaching at me.",
      src: "assets/images/gallery/autumnsky.jpg",
      aspect: "portrait"
    },
    {
      id: 2,
      title: "Sacred Jamara Pots",
      category: "Tradition",
      caption: "Golden barley shoots carefully tended in the puja room during Ghatasthapana.",
      src: "assets/images/gallery/Jamara.jpg",
      aspect: "square"
    },
    {
      id: 3,
      title: "Illuminated Rooftops",
      category: "Tihar",
      caption: "Our whole neighborhood glimmering under thousands of fairy lights and candles.",
      src: "assets/images/gallery/Home.jpg",
      aspect: "landscape"
    },
    {
      id: 4,
      title: "Sweet Sel Roti Rings",
      category: "Festive Food",
      caption: "Nothing compares to hot, crispy Sel Roti freshly prepared by family in the morning.",
      src: "assets/images/gallery/Selroti.jpg",
      aspect: "square"
    },
    {
      id: 5,
      title: "Small detail",
      category: "Astronomy",
      caption: "During our stay at village our father showed us the three stars which were near each other. (The image is not the real one we saw)",
      src: "assets/images/gallery/Three_Stars.jpg",
      aspect: "portrait"
    },
    {
      id: 6,
      title: "Marigold Market",
      category: "Colors",
      caption: "Baskets full of fresh golden orange Sayapatri and purple Makhamali flowers.",
      src: "assets/images/gallery/Marigold.jpeg",
      aspect: "landscape"
    },
    {
      id: 7,
      title: "Morning Dew & Serenity",
      category: "Atmosphere",
      caption: "Quiet holiday mornings with cold fresh air before the bustling festivities began.",
      src: "assets/images/gallery/morningsky.jpg",
      aspect: "square"
    },
    {
      id: 8,
      title: "Card Games & Laughter",
      category: "Family",
      caption: "Friendly post-dinner card games filled with cheerful banter and lighthearted wins.",
      src: "assets/images/gallery/Cards.jpg",
      aspect: "landscape"
    }
  ],

  // Video Memories Section
  videoMemories: [
    {
      id: "video-1",
      title: "Dashain Blessings & Laughter",
      caption: "A joyful clip of family gathering around for Tika, receiving blessings and smiles.",
      poster: "assets/images/thumbnails/video-dashain.svg",
      videoSrc: "assets/videos/dashain/PuttingTika.mp4" // Add your MP4 here
    },
    {
      id: "video-2",
      title: "Laxmi Puja Evening Tour",
      caption: "Walking through our home lit up with golden diyos, rangoli, and warm candlelight.",
      poster: "assets/images/thumbnails/video-tihar.svg",
      videoSrc: "assets/videos/tihar/Siblings.mp4" // Add your MP4 here
    }
  ],

  // Favorite Little Things
  favoriteMemories: [
    {
      icon: "✨",
      title: "Favorite Moment",
      highlight: "Receiving elders' blessings",
      description: "When my grandparents placed the Jamara behind my ears and spoke words of warmth and courage for my studies.",
      image: "assets/images/favorites/White_tika.jpeg"
    },
    {
      icon: "🍯",
      title: "Favorite Festival Food",
      highlight: "Hot Sel Roti & Kheer",
      description: "The sweet scent of cardamom and rice flour swirling in the kitchen on festival mornings.",
      image: "assets/images/favorites/Selroti.jpeg"
    },
    {
      icon: "🪁",
      title: "Favorite Activity",
      highlight: "Riding the Linge Ping",
      description: "That breathtaking feeling in my chest as the swing rose high into the sky.",
      image: "assets/images/favorites/dashain-swing.jpg"
    },
    {
      icon: "🪔",
      title: "Magical Sensation",
      highlight: "The First Diyo on Tihar Eve",
      description: "Watching darkness softly retreat as we lit the very first row of diyos together on the balcony.",
      image: "assets/images/favorites/Diyo.jpg"
    }
  ],

  // What I Learned / Reflection
  learnings: {
    heading: "More Than Just Holidays",
    subheading: "What these celebrations taught me beyond the fun and feasts",
    points: [
      {
        title: "The True Worth of Family",
        text: "In the middle of busy school terms, we sometimes take daily family presence for granted. These holidays reminded me how wonderful it feels to sit together, listen to grandparents' stories, and share simple meals."
      },
      {
        title: "Respecting Heritage & Roots",
        text: "Practicing the rituals of Dashain and Tihar helped me understand the deep cultural meaning behind every gesture — from honoring nature and animals during Tihar to seeking wisdom from elders."
      },
      {
        title: "Light & Positivity",
        text: "Lighting diyos on Deepawali is a reminder that even small acts of kindness and optimism can illuminate any dark corner. I returned to school feeling refreshed, grateful, and motivated."
      }
    ]
  },

  // Closing Section
  closing: {
    heading: "Until the Next Celebration...",
    quote: "These holidays gave me beautiful memories that I will always cherish. I am grateful for every little moment, every smile, and every celebration.",
    signoff: "With love ♡",
    image: "assets/images/Diary.jpg"
  }
};

