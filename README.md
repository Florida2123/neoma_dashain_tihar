# 🌸 My Dashain & Tihar Vacation Diary

> **A single-page school vacation memory journal built with HTML5, CSS3, and Vanilla JavaScript.**  
> Designed with the **Pink Sakura — Editorial Vacation Diary** aesthetic.

---

## 📖 Welcome!

This website is a personal school project documenting my wonderful autumn vacation celebrating **Dashain** and **Tihar** in Nepal. It combines an editorial scrapbook atmosphere, delicate falling cherry blossom petals interactive with your mouse cursor, warm festival accents, and interactive memories—all organized on a smooth, unified **single-page website**.

The website requires **no build tools, no frameworks, no database, and no backend**. You can open it directly in any web browser!

---

## 📑 Single-Page Structure

Everything is easily accessible via the sticky navigation bar with smooth scrolling and active scroll-spy highlighting:

1. **#home — Hero Section:**  
   The editorial scrapbook cover with student badge, "Welcome to my little world ♡", and vacation polaroid.
2. **#overview — Vacation Overview:**  
   Calendar note paper, holiday statistics, personal student note, and an interactive **"Leave a Heart" memory counter**.
3. **#dashain — Dashain Celebrations:**  
   Sacred Tika & Jamara, elders' blessings, the traditional tall bamboo Linge Ping, family feast stories, and quote.
4. **#tihar — Tihar Celebrations:**  
   The Festival of Lights, clay diyos, courtyard rangoli art, sayapatri/makhamali garlands, and Bhai Tika.
5. **#gallery — Captured Moments Photo Gallery:**  
   Interactive masonry/grid gallery with a full-screen lightbox (zoom, next/previous, escape key, mobile touch swipe).
6. **#videos — Video Memories:**  
   HTML5 video players with custom poster artwork and helpful missing file guidance.
7. **#favorites — Favorite Little Things:**  
   Scrapbook polaroids showcasing favorite foods, traditions, and joyful sensations.
8. **#about — About Me & Reflections:**  
   Student profile badge, "More Than Just Holidays" cultural learnings, closing message, and dynamic year footer.

*The falling sakura petals gently react to your mouse cursor movement and click blossom bursts.*

---

## 🚀 How to Open the Website

Double-click `index.html` in your file explorer. It will open instantly in your default web browser (Chrome, Firefox, Safari, Edge).

---

## 🎨 How to Personalize Your Diary (`js/content.js`)

All text, student information, quotes, and media paths are conveniently organized in one single file: [`js/content.js`](file:///home/surajj/Documents/Projects/Sisters/Supriya/Dashaiin%20and%20tihar/js/content.js).

Open `js/content.js` in any text editor to customize:

### 1. Changing Your Name, Grade & School
Look for the `studentInfo` object at the top of `js/content.js`:
```javascript
studentInfo: {
  studentName: "Your Name",           // e.g. "Supriya"
  classGrade: "Grade 9",              // e.g. "Grade 10"
  academicYear: "2082 (2026)",
  schoolName: "Your School Name",     // e.g. "Little Angels' High School"
  welcomeBadge: "Welcome to my little world ♡"
}
```

### 2. Adding Your Own Dashain Photos
1. Copy your photos into `assets/images/dashain/` (e.g. `assets/images/dashain/my_tika.jpg`).
2. In `js/content.js`, update the image path under `dashain.highlights`.

### 3. Adding Your Own Tihar Photos
1. Copy your photos into `assets/images/tihar/` (e.g. `assets/images/tihar/my_diyo.jpg`).
2. In `js/content.js`, update the image path under `tihar.highlights`.

### 4. Adding Photos to the Photo Gallery
In `js/content.js`, add or edit items in the `gallery` array.

### 5. Adding Videos
1. Place your MP4 video inside `assets/videos/dashain/` or `assets/videos/tihar/`.
2. In `js/content.js`, update `videoMemories`.

### 6. Adding Background Music
1. Place an audio file named `bgm.mp3` inside `assets/music/` (`assets/music/bgm.mp3`).
2. When the user enables music from the settings drawer or the navbar button, the diary will play your track!
3. If no MP3 is present, a built-in relaxing ambient pentatonic chime synthesizer plays automatically.

---

## ⚙️ Interactive Features & Customization Panel

Click the **gear icon (⚙️)** in the top navigation bar to open the **Customize My Diary** drawer:

1. **Aesthetic Themes:**
   - 🌸 **Sakura Pink** (Default soft pink & cream)
   - 🌹 **Soft Rose** (Warm blushing rose tones)
   - 🪻 **Lavender Dream** (Soothing gentle lavender & violet)
   - 🌾 **Cream Aesthetic** (Earthy vintage diary tones)
   - 🌙 **Dark Rose** (Cozy deep twilight festival mode)
2. **Falling Sakura Petals Animation:** Toggle on/off at will.
3. **Petal Density:** Choose between *Low* (16 petals), *Medium* (32 petals), and *High* (56 petals).
4. **Reading Font Size:** Adjust base text scale (*Small*, *Medium*, *Large*).
5. **Ambient Music & Volume Slider:** Relaxing ambient background sounds.
6. **Micro-Interactions Toggle:** Enable or disable non-essential motion.
7. **Photo Gallery Layout:** Switch between *Masonry Collage* and *Uniform Grid*.
8. **Reading Mode:** Distraction-free reading view that hides stickers and simplifies backgrounds.
9. **Reset Settings:** Easily restore all original diary defaults.

*All preferences are automatically saved in `localStorage` and remembered on reload.*

---

## 📁 Project Structure

```
vacation-diary/
│
├── index.html                  # Single-page website containing all sections
├── README.md                   # Project documentation & guide
│
├── css/
│   ├── style.css               # Core styling, themes, colors & scrapbook layout
│   ├── animations.css          # Keyframe animations, reveals & micro-interactions
│   └── responsive.css          # Mobile & tablet responsive adaptations
│
├── js/
│   ├── content.js              # Central editable diary configuration
│   ├── petals.js               # Canvas-based interactive falling sakura petal engine
│   ├── settings.js             # Settings drawer & theme manager
│   ├── gallery.js              # Masonry gallery & full-screen lightbox
│   └── main.js                 # App initialization, navigation & interactions
│
└── assets/
    ├── images/
    │   ├── hero.svg            # Hero scrapbook artwork (or hero.jpg)
    │   ├── closing-diary.svg   # Closing illustration
    │   ├── dashain/            # Dashain photos & illustrations
    │   ├── tihar/              # Tihar photos & illustrations
    │   ├── gallery/            # Gallery moments
    │   ├── favorites/          # Favorite memories illustrations
    │   └── thumbnails/         # Video poster thumbnails
    │
    ├── videos/                 # Your MP4 video memories
    │   ├── dashain/
    │   └── tihar/
    │
    ├── music/                  # Optional background music (bgm.mp3)
    └── icons/                  # SVG icons & badges
```

---

Made with love ♡ for the Dashain & Tihar School Vacation Project.
