document.addEventListener('DOMContentLoaded', () => {
    const cameraMovements = {
        "Static": "Statis",
        "Zoom In": "Perbesar",
        "Zoom Out": "Perkecil",
        "Pan Left": "Geser Kiri",
        "Pan Right": "Geser Kanan",
        "Tilt Up": "Miring ke Atas",
        "Tilt Down": "Miring ke Bawah",
        "Dolly In (Truck In)": "Maju (Dolly In)",
        "Dolly Out (Truck Out)": "Mundur (Dolly Out)",
        "Orbit (3D Rotation)": "Mengorbit (Rotasi 3D)",
        "Crane Up": "Naik (Crane Up)",
        "Crane Down": "Turun (Crane Down)",
        "Tracking Shot": "Tembakan Mengikuti",
        "Handheld/Shaky": "Genggam/Goyang",
        "Roll Left": "Putar Kiri",
        "Roll Right": "Putar Kanan"
    };

    // Data untuk auto-generation
    const generationData = {
        judul_scane: [
            "Kafe Pagi di Sudut Kota",
            "Terminal Bus Malam Hari",
            "Pasar Tradisional Sore",
            "Pantai Saat Golden Hour",
            "Jalanan Kota Hujan",
            "Taman Kota di Pagi Hari",
            "Stasiun Kereta Sibuk",
            "Warung Makan Pinggir Jalan",
            "Perpustakaan Sunyi",
            "Rooftop Gedung Malam",
            "Hutan Bambu Pagi",
            "Pelabuhan Nelayan Subuh"
        ],
        
        deskripsi_karakter: [
            "Seorang vlogger wanita muda asal Jawa berusia 25 tahun. Perawakan: tubuh sedang, tinggi 165cm, berkulit sawo matang. Rambut hitam panjang sebahu dengan poni tipis. Mata cokelat ekspresif dengan alis tebal natural. Hidung mancung sedang, bibir tipis dengan senyum hangat. Mengenakan kemeja putih kasual dan celana jeans biru, sepatu sneakers putih. Aksesori: jam tangan silver dan tas selempang kecil.",
            
            "Seorang content creator pria muda berusia 28 tahun asal Bali. Perawakan: tubuh atletis, tinggi 175cm, berkulit tan. Rambut hitam keriting pendek dengan fade cut. Mata hitam tajam dengan jenggot tipis rapi. Mengenakan kaos polo navy, chino cream, dan sepatu loafers cokelat. Aksesori: kacamata aviator dan gelang kulit.",
            
            "Seorang travel blogger wanita berusia 30 tahun asal Minang. Perawakan: tubuh mungil, tinggi 158cm, berkulit putih. Rambut cokelat madu dikuncir rendah. Mata hazel dengan bulu mata lentik. Mengenakan dress midi floral, cardigan cream, dan ankle boots cokelat. Aksesori: kalung emas tipis dan topi fedora.",
            
            "Seorang food reviewer pria berusia 26 tahun asal Medan. Perawakan: tubuh gempal, tinggi 170cm, berkulit kuning langsat. Rambut hitam lurus dengan undercut. Mata sipit dengan senyum lebar. Mengenakan kemeja kotak-kotak, celana chino hitam, dan sepatu canvas. Aksesori: topi baseball dan tas ransel."
        ],
        
        suara_karakter: [
            "Dia berbicara dengan suara wanita muda yang hangat dan penuh semangat. Nada: mezzo-soprano dengan intonasi naik-turun yang ekspresif. Tempo bicara: sedang dengan jeda natural. Aksen: sedikit logat Jawa yang lembut. Karakteristik: suara jernih, artikulasi jelas, dengan nada ramah dan mudah didengar.",
            
            "Suara pria muda yang dalam dan menenangkan. Nada: baritone dengan resonansi yang kaya. Tempo bicara: lambat dan terukur dengan penekanan pada kata-kata penting. Aksen: logat Bali yang halus. Karakteristik: suara mantap, percaya diri, dengan intonasi yang stabil.",
            
            "Suara wanita dewasa yang lembut namun tegas. Nada: alto dengan warna suara yang hangat. Tempo bicara: cepat namun terkontrol dengan artikulasi yang sangat jelas. Aksen: logat Minang yang khas namun mudah dipahami. Karakteristik: suara cerdas, ekspresif, dengan infleksi yang menarik.",
            
            "Suara pria muda yang ceria dan energik. Nada: tenor dengan karakter yang bright. Tempo bicara: cepat dengan antusiasme tinggi. Aksen: logat Medan yang kental namun friendly. Karakteristik: suara riang, ekspresif, dengan tawa yang sering muncul."
        ],
        
        aksi_karakter: [
            "berjalan santai sambil mengamati sekitar",
            "duduk di bangku sambil menulis di notebook",
            "berdiri di depan kamera sambil menjelaskan sesuatu",
            "mengambil foto dengan kamera vintage",
            "menyesap kopi sambil menatap jendela",
            "berjalan cepat menyusuri koridor",
            "mengangkat tangan sambil berbicara antusias",
            "membaca buku sambil sesekali mengangguk",
            "menunjuk ke arah objek tertentu",
            "menggerakkan tangan ekspresif saat bercerita",
            "berjalan mundur sambil tetap berbicara ke kamera",
            "duduk bersila di lantai sambil tersenyum"
        ],
        
        ekspresi_karakter: [
            "kagum dan antusias dengan mata berbinar",
            "tenang dan contemplatif dengan senyum tipis",
            "bersemangat dengan senyum lebar dan mata terbuka",
            "penasaran dengan alis terangkat dan mata fokus",
            "bahagia dengan tawa natural dan mata menyipit",
            "serius namun ramah dengan pandangan tajam",
            "terkejut positif dengan mulut sedikit terbuka",
            "puas dan bangga dengan senyum percaya diri",
            "thoughtful dengan jari menyentuh dagu",
            "excited dengan gerakan wajah yang animated",
            "nostalgic dengan pandangan jauh dan senyum lembut",
            "impressed dengan anggukan kepala dan mata terbuka lebar"
        ],
        
        latar_tempat_waktu: [
            "di kafe vintage dengan interior kayu dan tanaman hijau, pagi hari sekitar jam 8 dengan cahaya matahari lembut masuk melalui jendela besar",
            "di terminal bus antar kota pada malam hari sekitar jam 9 malam dengan pencahayaan lampu neon dan suasana ramai penumpang",
            "di pasar tradisional sore hari sekitar jam 4 dengan pencahayaan natural yang hangat dan aktivitas pedagang yang sibuk",
            "di pantai saat golden hour sekitar jam 5 sore dengan cahaya matahari keemasan dan ombak yang tenang",
            "di jalanan kota saat hujan ringan malam hari dengan refleksi lampu jalan di aspal basah",
            "di taman kota pagi hari sekitar jam 7 dengan embun pagi dan cahaya matahari yang sejuk",
            "di stasiun kereta api saat rush hour pagi dengan keramaian komuter dan pengumuman stasiun",
            "di warung makan pinggir jalan malam hari dengan pencahayaan lampu gantung dan asap dari dapur"
        ],
        
        detail_visual: [
            "Pencahayaan: natural soft light dengan warm tone. Gaya Video: cinematic realistis dengan depth of field shallow. Color grading: warm dan cozy dengan saturasi sedang. Komposisi: rule of thirds dengan framing yang intimate",
            
            "Pencahayaan: dramatic lighting dengan kontras tinggi. Gaya Video: urban documentary style dengan handheld feel. Color grading: cool tone dengan highlight yang tajam. Komposisi: wide shot dengan leading lines",
            
            "Pencahayaan: golden hour lighting dengan backlight lembut. Gaya Video: lifestyle cinematography dengan smooth movement. Color grading: warm golden tone dengan shadow yang soft. Komposisi: medium shot dengan bokeh background",
            
            "Pencahayaan: neon lighting dengan color temperature mixed. Gaya Video: street photography style dengan high contrast. Color grading: vibrant dengan selective color enhancement. Komposisi: close-up dengan environmental context"
        ],
        
        suasana: [
            "tenang dan damai dengan nuansa contemplatif",
            "sibuk dan energik dengan kesan urban dinamis",
            "hangat dan intimate dengan atmosfer personal",
            "mysterious dan dramatic dengan tension yang subtle",
            "cheerful dan uplifting dengan vibe yang positif",
            "nostalgic dan melankolis dengan sentuhan emosional",
            "exciting dan adventurous dengan energy yang tinggi",
            "cozy dan comfortable dengan feeling homey",
            "professional namun approachable dengan kesan modern",
            "romantic dan dreamy dengan mood yang soft"
        ],
        
        suara_lingkungan: [
            "SOUND: ambient kafe dengan suara mesin espresso, percakapan lirih pengunjung, dan musik jazz instrumental lembut di background",
            "SOUND: suara mesin bus menyala, pengumuman terminal, percakapan penumpang, dan suara langkah kaki di lantai terminal",
            "SOUND: suara pedagang menawarkan dagangan, percakapan tawar-menawar, suara kendaraan lewat, dan aktivitas pasar yang ramai",
            "SOUND: suara ombak laut yang tenang, angin sepoi-sepoi, dan suara burung camar di kejauhan",
            "SOUND: suara hujan ringan, kendaraan melewati jalan basah, dan suara tetesan air dari atap",
            "SOUND: suara burung pagi, angin melalui dedaunan, dan suara langkah di atas rumput",
            "SOUND: pengumuman stasiun, suara kereta datang dan pergi, percakapan penumpang, dan suara roda kereta di rel",
            "SOUND: suara masakan di wajan, percakapan pelanggan, suara motor lewat, dan aktivitas dapur"
        ],
        
        dialog_karakter: [
            "Tempat ini benar-benar punya cerita tersendiri, ya. Setiap sudutnya kayak punya jiwa.",
            "Kalian tahu nggak, di balik kesibukan ini ada kehangatan yang luar biasa.",
            "Ini dia yang namanya hidden gem! Siapa sangka di sini ada tempat seindah ini.",
            "Rasanya kayak kembali ke masa lalu, tapi dengan sentuhan modern yang pas.",
            "Setiap kali ke sini, selalu ada hal baru yang bikin aku terpesona.",
            "Ini bukan cuma tentang tempatnya, tapi tentang orang-orang dan cerita mereka.",
            "Kadang tempat sederhana kayak gini yang paling berkesan di hati.",
            "Lihat deh, bagaimana cahaya ini menciptakan suasana yang begitu istimewa.",
            "Di sinilah aku merasakan kedamaian yang susah ditemukan di tempat lain.",
            "Setiap detail di sini punya makna dan cerita yang mendalam."
        ],
        
        negative_prompt: [
            "Hindari: teks di layar, subtitle, tulisan di video, font, logo, distorsi, artefak, anomali, wajah ganda, anggota badan cacat, tangan tidak normal, orang tambahan, objek mengganggu, kualitas rendah, buram, glitch, suara robotik, suara pecah.",
            
            "Avoid: screen text, watermarks, UI elements, poor lighting, overexposed areas, motion blur, camera shake, background distractions, inconsistent character appearance, audio distortion, echo, background noise.",
            
            "Hindari: pencahayaan buruk, bayangan keras, warna oversaturated, komposisi tidak seimbang, fokus ganda, noise berlebihan, compression artifacts, frame rate issues, audio sync problems, reverb berlebihan.",
            
            "Avoid: unnatural poses, forced expressions, inconsistent styling, props yang tidak relevan, background clutter, harsh transitions, abrupt cuts, volume inconsistency, ambient noise yang mengganggu."
        ]
    };

    // Initialize camera select
    const cameraSelect = document.getElementById('gerakan_kamera');
    for (const [english, indonesian] of Object.entries(cameraMovements)) {
        const option = document.createElement('option');
        option.value = english;
        option.textContent = `${english} (${indonesian})`;
        cameraSelect.appendChild(option);
    }

    // Function to get random item from array
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Add event listeners for generate buttons
    document.querySelectorAll('.generate-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const fieldName = e.target.getAttribute('data-field');
            const fieldElement = document.getElementById(fieldName);
            
            if (generationData[fieldName]) {
                const randomContent = getRandomItem(generationData[fieldName]);
                fieldElement.value = randomContent;
                
                // Add a subtle animation to show the field was updated
                fieldElement.style.backgroundColor = '#e8f5e8';
                setTimeout(() => {
                    fieldElement.style.backgroundColor = '';
                }, 1000);
            }
        });
    });

    // Generate All Fields button
    document.getElementById('generateAllBtn').addEventListener('click', () => {
        Object.keys(generationData).forEach(fieldName => {
            const fieldElement = document.getElementById(fieldName);
            if (fieldElement && generationData[fieldName]) {
                const randomContent = getRandomItem(generationData[fieldName]);
                fieldElement.value = randomContent;
            }
        });
        
        // Also set a random camera movement
        const randomCameraIndex = Math.floor(Math.random() * Object.keys(cameraMovements).length);
        cameraSelect.selectedIndex = randomCameraIndex;
        
        // Visual feedback
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.style.backgroundColor = '#e8f5e8';
        });
        
        setTimeout(() => {
            document.querySelectorAll('input, textarea, select').forEach(element => {
                element.style.backgroundColor = '';
            });
        }, 1500);
    });

    // Original generate prompt functionality
    document.getElementById('generateBtn').addEventListener('click', () => {
        // Mengambil semua nilai dari input
        const judul = document.getElementById('judul_scane').value.trim();
        const deskripsiKarakter = document.getElementById('deskripsi_karakter').value.trim();
        const suaraKarakter = document.getElementById('suara_karakter').value.trim();
        const aksiKarakter = document.getElementById('aksi_karakter').value.trim();
        const ekspresiKarakter = document.getElementById('ekspresi_karakter').value.trim();
        const latar = document.getElementById('latar_tempat_waktu').value.trim();
        const detailVisual = document.getElementById('detail_visual').value.trim();
        const gerakanKamera = document.getElementById('gerakan_kamera').value;
        const suasana = document.getElementById('suasana').value.trim();
        const suaraLingkungan = document.getElementById('suara_lingkungan').value.trim();
        const dialog = document.getElementById('dialog_karakter').value.trim();
        const negativePrompt = document.getElementById('negative_prompt').value.trim();

        // --- Kembangkan dan susun prompt dalam Bahasa Indonesia ---
        const promptIndonesia = `**Judul Scane:** ${judul}

**Deskripsi Karakter Inti:**
Seorang karakter yang konsisten: ${deskripsiKarakter}

**Detail Suara Karakter:**
Deskripsi audio untuk karakter: ${suaraKarakter}

**Aksi dan Ekspresi Karakter:**
Dalam adegan ini, karakter terlihat sedang ${aksiKarakter} dengan ekspresi wajah yang menunjukkan ${ekspresiKarakter}.

**Latar Tempat, Waktu, dan Suasana:**
Berlatar di ${latar}. Suasana keseluruhan yang ingin diciptakan adalah ${suasana}.

**Detail Visual Tambahan dan Sinematografi:**
Gaya visual untuk video ini adalah ${detailVisual}. 
Gerakan kamera yang digunakan adalah ${gerakanKamera} (${cameraMovements[gerakanKamera]}), diambil secara sinematik untuk menangkap setiap momen dengan indah.

**Desain Suara:**
Suara lingkungan yang dominan adalah ${suaraLingkungan} untuk membangun realisme.
${dialog ? `**Dialog Karakter (Bahasa Indonesia):**\nDIALOG: "${dialog}"` : "*(Tidak ada dialog dalam adegan ini)*"}

**Negative Prompt (Hal yang harus dihindari):**
${negativePrompt}`;

        document.getElementById('output_indonesia').value = promptIndonesia;

        // --- Terjemahkan ke Bahasa Inggris untuk prompt Final ---
        const promptInggris = `**Scene Title:** ${judul}

**Core Character Description:**
A consistent character: ${deskripsiKarakter}

**Character Voice Details:**
Audio description for the character: ${suaraKarakter}

**Character Action and Expression:**
In this scene, the character is seen ${aksiKarakter} with a facial expression of ${ekspresiKarakter}.

**Setting, Time, and Atmosphere:**
Set in ${latar}. The overall atmosphere to be created is ${suasana}.

**Additional Visual Details and Cinematography:**
The visual style for this video is ${detailVisual}. 
The camera movement used is a cinematic ${gerakanKamera}, beautifully capturing every moment.

**Sound Design:**
The dominant ambient sound is ${suaraLingkungan} to build realism.
${dialog ? `**Character Dialogue (in Indonesian):**\nDIALOGUE: "${dialog}"` : "*(No dialogue in this scene)*"}

**Negative Prompt (Things to avoid):**
${negativePrompt}`;

        document.getElementById('output_inggris').value = promptInggris;
    });

    // Reset functionality
    document.getElementById('resetBtn').addEventListener('click', () => {
        const fieldsToClear = [
            'judul_scane', 'deskripsi_karakter', 'suara_karakter', 'aksi_karakter',
            'ekspresi_karakter', 'latar_tempat_waktu', 'detail_visual', 'suasana',
            'suara_lingkungan', 'dialog_karakter', 'output_indonesia', 'output_inggris'
        ];

        fieldsToClear.forEach(id => {
            document.getElementById(id).value = '';
        });

        document.getElementById('gerakan_kamera').selectedIndex = 0;
        
        document.getElementById('negative_prompt').value = "Hindari: teks di layar, subtitle, tulisan di video, font, logo, distorsi, artefak, anomali, wajah ganda, anggota badan cacat, tangan tidak normal, orang tambahan, objek mengganggu, kualitas rendah, buram, glitch, suara robotik, suara pecah.";
    });
});