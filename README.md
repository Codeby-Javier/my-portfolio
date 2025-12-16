# Portfolio CRUD - Ibnu Javier Zaenuri

Portfolio website interaktif dengan kemampuan CRUD untuk mengelola project collection. Frontend dihost di GitHub Pages, data disimpan di Google Sheets via Apps Script.

## 📋 Fitur

✅ **Responsive Design** - Mobile-first, works on all devices
✅ **CRUD Operations** - Tambah, edit, hapus projects langsung dari web
✅ **Alpine JS** - Lightweight JavaScript framework
✅ **Beautiful Animations** - Flying birds, wind effects, ocean waves
✅ **Matcha Green Theme** - Modern, professional color scheme
✅ **Google Sheets Integration** - Backend data storage (akan ditambahkan di Phase 2)

## 👨‍💻 About Me

Halo! Saya Ibnu Javier Zaenuri, seorang fullstack developer dengan fokus utama pada pengembangan backend. Saya menikmati membangun fondasi yang kuat di balik layar, memastikan data mengalir dengan lancar dan aplikasi berjalan tanpa hambatan. Di portfolio ini, Anda akan menemukan karya-karya saya yang menggabungkan desain frontend yang menarik dengan arsitektur backend yang solid dan efisien. Saya percaya bahwa pengalaman pengguna yang luar biasa dimulai dari infrastruktur yang andal.

## 🎨 Fitur Desain

- **Background**: Pure white dengan subtle animations
- **Warna Accent**: Matcha Green (#8bc34a)
- **Animasi**:
  - 🦅 Burung terbang lintas layar
  - 💨 Hembusan angin dengan particle effects
  - 🌊 Ombak pantai di footer
- **Responsif**: Desktop, tablet, mobile optimal

## 📁 Struktur Folder

```
Portfolio/
├── index.html                 # Main page
├── assets/
│   ├── styles.css            # Styling utama
│   ├── animations.css        # Animation definitions
│   └── app.js                # Alpine JS logic
├── images/                   # Project images (nanti)
├── .gitignore               # Git ignore rules
└── README.md                # Dokumentasi
```

## 🚀 Development (Phase 1 - Frontend)

1. **Clone/download repository** ke local machine
2. **Open `index.html`** di browser untuk preview
3. **Edit dummy projects** di `assets/app.js` untuk testing
4. **Test CRUD functionality** - Add, Edit, Delete projects

### Testing CRUD Locally

```javascript
// Di browser console (F12), coba:
// Lihat semua projects
console.log(Alpine.data.app().projects);

// Edit project
Alpine.data.app().editProject(1);

// Tambah project baru
Alpine.data.app().saveProject();
```

## 📊 Data Structure (Projects)

Setiap project memiliki struktur:

```javascript
{
    id: 1,
    title: 'Project Title',
    description: 'Project description',
    image_url: 'https://...',
    project_url: 'https://github.com/...',
    technologies: ['Tech1', 'Tech2'],
    created_at: '2024-01-15',
    updated_at: '2024-06-20'
}
```

## 🔗 Social Links

- LinkedIn: https://linkedin.com/in/ibnu-javier
- GitHub: https://github.com/Codeby-Javier/
- Instagram: https://www.instagram.com/ibnu.jz/

## 📅 Development Phases

### Phase 1 ✅ Frontend
- [x] HTML structure
- [x] CSS styling
- [x] Alpine JS logic
- [x] Animations

### Phase 2 ⏳ Google Apps Script
- [ ] Create API endpoint
- [ ] GET, POST, PUT, DELETE operations
- [ ] CORS configuration

### Phase 3 ⏳ Integration
- [ ] Connect frontend ke Apps Script
- [ ] Test CRUD dengan live data
- [ ] Error handling

### Phase 4 ⏳ Deploy
- [ ] Upload ke GitHub
- [ ] Enable GitHub Pages
- [ ] Test production version

## 🛠 Tools & Technologies

- **Frontend**: HTML, CSS, JavaScript
- **Framework**: Alpine JS 3.x
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Hosting**: GitHub Pages
- **Icons**: SVG, Unicode

## 📝 Kustomisasi

### Ubah Warna (di `styles.css`)

```css
:root {
    --matcha: #8bc34a;        /* Primary color */
    --matcha-dark: #7cb342;   /* Hover color */
    --matcha-light: #c5e1a5;  /* Light variant */
}
```

### Tambah Social Links (di `index.html`)

Edit section `.social-links` untuk tambah link baru.

### Ubah Animasi (di `animations.css`)

Modify `@keyframes` untuk customize flying birds, wind, waves.

## 📞 Contact

- 📧 Email: [your-email]
- 🔗 GitHub: [your-github]
- 💼 LinkedIn: https://linkedin.com/in/ibnu-javier
- 📱 Instagram: @ibnu.jz

## 📄 License

This project is open source. Feel free to fork, modify, and use!

---

**Next Steps**: Menunggu Phase 2 untuk Google Apps Script integration. Keep the frontend beautiful! 🎨
