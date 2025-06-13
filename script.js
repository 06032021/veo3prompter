import { GoogleGenerativeAI } from '@google/generative-ai';

document.addEventListener('DOMContentLoaded', () => {
    let genAI = null;
    let model = null;
    let requestQueue = [];
    let isProcessingQueue = false;
    const REQUEST_DELAY = 4000; // 4 seconds between requests to stay under 15/minute limit

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

    // Prompts for each field
    const fieldPrompts = {
        judul_scane: "Buatkan judul scene yang kreatif dan menarik untuk video prompt Veo 3. Judul harus singkat, deskriptif, dan dalam bahasa Indonesia. Contoh: 'Kafe Pagi di Sudut Kota', 'Terminal Bus Malam Hari'. Berikan hanya judul tanpa penjelasan tambahan.",
        
        deskripsi_karakter: "Buatkan deskripsi karakter yang detail dan konsisten untuk video prompt Veo 3. Sertakan: usia, asal daerah, perawakan fisik (tinggi, bentuk tubuh, warna kulit), ciri wajah (rambut, mata, hidung, bibir), pakaian yang dikenakan, dan aksesori. Deskripsi harus dalam bahasa Indonesia dan sangat detail untuk konsistensi karakter. Contoh dimulai dengan 'Seorang vlogger wanita muda asal...'",
        
        suara_karakter: "Buatkan deskripsi detail suara karakter untuk video prompt Veo 3. Sertakan: jenis suara (pria/wanita), karakteristik nada (soprano, alto, tenor, baritone), tempo bicara, aksen daerah, dan karakteristik unik suara. Deskripsi dalam bahasa Indonesia. Contoh dimulai dengan 'Dia berbicara dengan suara...'",
        
        aksi_karakter: "Buatkan deskripsi aksi/gerakan karakter yang natural dan menarik untuk video prompt Veo 3. Fokus pada satu aktivitas utama yang bisa dilakukan karakter dalam scene. Gunakan bahasa Indonesia. Contoh: 'berjalan santai sambil mengamati sekitar', 'duduk di bangku sambil menulis di notebook'.",
        
        ekspresi_karakter: "Buatkan deskripsi ekspresi wajah karakter yang detail dan ekspresif untuk video prompt Veo 3. Sertakan emosi yang ditampilkan dan detail ekspresi mata, mulut, alis. Gunakan bahasa Indonesia. Contoh: 'kagum dan antusias dengan mata berbinar', 'tenang dan contemplatif dengan senyum tipis'.",
        
        latar_tempat_waktu: "Buatkan deskripsi latar tempat dan waktu yang detail untuk video prompt Veo 3. Sertakan lokasi spesifik, waktu (pagi/siang/sore/malam), kondisi cuaca/pencahayaan, dan suasana umum tempat. Gunakan bahasa Indonesia. Contoh dimulai dengan 'di kafe vintage dengan interior kayu...'",
        
        detail_visual: "Buatkan deskripsi detail visual dan sinematografi untuk video prompt Veo 3. Sertakan: jenis pencahayaan, gaya video/art style, color grading, dan komposisi shot. Gunakan bahasa Indonesia. Contoh: 'Pencahayaan: natural soft light dengan warm tone. Gaya Video: cinematic realistis...'",
        
        suasana: "Buatkan deskripsi suasana keseluruhan yang ingin diciptakan dalam video prompt Veo 3. Fokus pada mood dan atmosfer emosional. Gunakan bahasa Indonesia. Contoh: 'tenang dan damai dengan nuansa contemplatif', 'sibuk dan energik dengan kesan urban dinamis'.",
        
        suara_lingkungan: "Buatkan deskripsi suara lingkungan/ambient sound untuk video prompt Veo 3. Mulai dengan 'SOUND:' dan sertakan suara-suara spesifik yang mendukung scene. Gunakan bahasa Indonesia. Contoh: 'SOUND: ambient kafe dengan suara mesin espresso, percakapan lirih pengunjung...'",
        
        dialog_karakter: "Buatkan dialog karakter yang natural dan sesuai konteks untuk video prompt Veo 3. Dialog harus dalam bahasa Indonesia, tidak terlalu panjang, dan mencerminkan kepribadian karakter. Contoh: 'Tempat ini benar-benar punya cerita tersendiri, ya.'",
        
        negative_prompt: "Buatkan negative prompt yang komprehensif untuk video prompt Veo 3. Sertakan hal-hal yang harus dihindari seperti distorsi, artefak, kualitas rendah, dll. Mulai dengan 'Hindari:' dan gunakan bahasa Indonesia."
    };

    // Initialize camera select
    const cameraSelect = document.getElementById('gerakan_kamera');
    for (const [english, indonesian] of Object.entries(cameraMovements)) {
        const option = document.createElement('option');
        option.value = english;
        option.textContent = `${english} (${indonesian})`;
        cameraSelect.appendChild(option);
    }

    // Modal elements
    const modal = document.getElementById('apiKeyModal');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const skipApiKeyBtn = document.getElementById('skipApiKey');
    const changeApiKeyBtn = document.getElementById('changeApiKey');

    // Check for existing API key and show modal if needed
    function checkApiKey() {
        const savedApiKey = sessionStorage.getItem('gemini_api_key');
        if (savedApiKey) {
            initializeGemini(savedApiKey);
            updateUIForApiKey(true);
        } else {
            showModal();
        }
    }

    // Show modal
    function showModal() {
        modal.classList.add('show');
        apiKeyInput.focus();
    }

    // Hide modal
    function hideModal() {
        modal.classList.remove('show');
    }

    // Initialize Gemini AI
    function initializeGemini(apiKey) {
        try {
            genAI = new GoogleGenerativeAI(apiKey);
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            console.log('Gemini AI initialized successfully');
        } catch (error) {
            console.error('Error initializing Gemini AI:', error);
            showError('Error initializing Gemini AI. Please check your API key.');
        }
    }

    // Update UI based on API key availability
    function updateUIForApiKey(hasApiKey) {
        const generateBtns = document.querySelectorAll('.generate-btn');
        const generateAllBtn = document.getElementById('generateAllBtn');
        
        generateBtns.forEach(btn => {
            btn.disabled = !hasApiKey;
            btn.textContent = hasApiKey ? 'Generate' : 'No API';
        });
        
        if (generateAllBtn) {
            generateAllBtn.disabled = !hasApiKey;
            generateAllBtn.textContent = hasApiKey ? 'Generate Semua Field' : 'API Key Required';
        }
    }

    // Show error message with better handling for quota errors
    function showError(message, isQuotaError = false) {
        let displayMessage = message;
        
        if (isQuotaError) {
            displayMessage = `⚠️ Quota API Terlampaui!\n\nAnda telah mencapai batas penggunaan API Gemini (15 request per menit).\n\nSolusi:\n1. Tunggu 1-2 menit sebelum mencoba lagi\n2. Gunakan fitur "Generate" satu per satu dengan jeda\n3. Periksa billing Google Cloud jika sering terjadi\n4. Generate API key baru jika diperlukan\n\nError: ${message}`;
        }
        
        alert(displayMessage);
    }

    // Show success animation
    function showSuccess(element) {
        element.classList.add('success-flash');
        setTimeout(() => {
            element.classList.remove('success-flash');
        }, 1000);
    }

    // Rate limiting queue processor
    async function processRequestQueue() {
        if (isProcessingQueue || requestQueue.length === 0) return;
        
        isProcessingQueue = true;
        
        while (requestQueue.length > 0) {
            const request = requestQueue.shift();
            try {
                await request();
                // Wait between requests to respect rate limits
                if (requestQueue.length > 0) {
                    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
                }
            } catch (error) {
                console.error('Error processing queued request:', error);
            }
        }
        
        isProcessingQueue = false;
    }

    // Add request to queue
    function queueRequest(requestFunction) {
        requestQueue.push(requestFunction);
        processRequestQueue();
    }

    // Generate content using Gemini AI with improved error handling
    async function generateContent(fieldName) {
        if (!model) {
            showError('API Key belum diatur. Silakan masukkan API Key terlebih dahulu.');
            return;
        }

        const fieldElement = document.getElementById(fieldName);
        const generateBtn = document.querySelector(`[data-field="${fieldName}"]`);
        
        if (!fieldElement || !generateBtn) return;

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = 'Loading...';
        fieldElement.classList.add('loading');

        const requestFunction = async () => {
            try {
                const prompt = fieldPrompts[fieldName];
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                
                fieldElement.value = text.trim();
                showSuccess(fieldElement);
            } catch (error) {
                console.error('Error generating content:', error);
                
                // Check if it's a quota error
                if (error.message && error.message.includes('429')) {
                    showError(error.message, true);
                } else if (error.message && error.message.includes('quota')) {
                    showError('Quota API terlampaui. Silakan tunggu beberapa menit sebelum mencoba lagi.', true);
                } else {
                    showError('Terjadi kesalahan saat generate content. Silakan coba lagi.');
                }
            } finally {
                // Reset loading state
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generate';
                fieldElement.classList.remove('loading');
            }
        };

        // Add to queue instead of executing immediately
        queueRequest(requestFunction);
    }

    // Generate all fields with improved rate limiting
    async function generateAllFields() {
        if (!model) {
            showError('API Key belum diatur. Silakan masukkan API Key terlebih dahulu.');
            return;
        }

        const generateAllBtn = document.getElementById('generateAllBtn');
        generateAllBtn.disabled = true;
        generateAllBtn.textContent = 'Generating...';

        // Show warning about rate limits
        const proceed = confirm('⚠️ Perhatian!\n\nGenerate semua field akan membuat banyak request ke API Gemini.\nProses ini akan memakan waktu sekitar 1-2 menit untuk menghindari quota limit.\n\nLanjutkan?');
        
        if (!proceed) {
            generateAllBtn.disabled = false;
            generateAllBtn.textContent = 'Generate Semua Field';
            return;
        }

        try {
            const fieldNames = Object.keys(fieldPrompts);
            
            // Queue all requests instead of running them in parallel
            fieldNames.forEach(fieldName => {
                generateContent(fieldName);
            });
            
            // Also set random camera movement
            const randomCameraIndex = Math.floor(Math.random() * Object.keys(cameraMovements).length);
            cameraSelect.selectedIndex = randomCameraIndex;
            
            // Show info message
            showError('Semua field sedang di-generate secara bertahap untuk menghindari quota limit. Mohon tunggu...', false);
            
        } catch (error) {
            console.error('Error generating all fields:', error);
            showError('Terjadi kesalahan saat generate semua field.');
        } finally {
            generateAllBtn.disabled = false;
            generateAllBtn.textContent = 'Generate Semua Field';
        }
    }

    // Translate text using Gemini AI with improved error handling
    async function translateToEnglish(text) {
        if (!model || !text.trim()) return text;

        try {
            const prompt = `Translate the following Indonesian text to English, maintaining the context and meaning for video prompt generation. Keep technical terms and proper nouns as appropriate. Text: "${text}"`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Error translating text:', error);
            
            // Check if it's a quota error
            if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
                throw error; // Re-throw quota errors to be handled by caller
            }
            
            return text; // Return original text for other errors
        }
    }

    // Event listeners
    saveApiKeyBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showError('Silakan masukkan API Key terlebih dahulu.');
            return;
        }

        sessionStorage.setItem('gemini_api_key', apiKey);
        initializeGemini(apiKey);
        updateUIForApiKey(true);
        hideModal();
        apiKeyInput.value = ''; // Clear input for security
    });

    skipApiKeyBtn.addEventListener('click', () => {
        hideModal();
        updateUIForApiKey(false);
    });

    changeApiKeyBtn.addEventListener('click', () => {
        showModal();
    });

    // Handle Enter key in API key input
    apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveApiKeyBtn.click();
        }
    });

    // Add event listeners for generate buttons
    document.querySelectorAll('.generate-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const fieldName = e.target.getAttribute('data-field');
            generateContent(fieldName);
        });
    });

    // Generate All Fields button
    document.getElementById('generateAllBtn').addEventListener('click', generateAllFields);

    // Original generate prompt functionality with improved translation handling
    document.getElementById('generateBtn').addEventListener('click', async () => {
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        try {
            // Get all values from inputs
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

            // Create Indonesian prompt
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

            // Translate to English if API is available
            if (model) {
                try {
                    // Show warning about translation quota usage
                    const proceed = confirm('⚠️ Terjemahan otomatis akan menggunakan banyak API quota.\n\nLanjutkan dengan terjemahan otomatis?\n\n- Ya: Terjemahkan ke bahasa Inggris (menggunakan quota)\n- Tidak: Hanya buat prompt bahasa Indonesia');
                    
                    if (proceed) {
                        generateBtn.textContent = 'Translating...';
                        
                        const [
                            judulEn,
                            deskripsiKarakterEn,
                            suaraKarakterEn,
                            aksiKarakterEn,
                            ekspresiKarakterEn,
                            latarEn,
                            detailVisualEn,
                            suasanaEn,
                            suaraLingkunganEn,
                            dialogEn,
                            negativePromptEn
                        ] = await Promise.all([
                            translateToEnglish(judul),
                            translateToEnglish(deskripsiKarakter),
                            translateToEnglish(suaraKarakter),
                            translateToEnglish(aksiKarakter),
                            translateToEnglish(ekspresiKarakter),
                            translateToEnglish(latar),
                            translateToEnglish(detailVisual),
                            translateToEnglish(suasana),
                            translateToEnglish(suaraLingkungan),
                            translateToEnglish(dialog),
                            translateToEnglish(negativePrompt)
                        ]);

                        const promptInggris = `**Scene Title:** ${judulEn}

**Core Character Description:**
A consistent character: ${deskripsiKarakterEn}

**Character Voice Details:**
Audio description for the character: ${suaraKarakterEn}

**Character Action and Expression:**
In this scene, the character is seen ${aksiKarakterEn} with a facial expression of ${ekspresiKarakterEn}.

**Setting, Time, and Atmosphere:**
Set in ${latarEn}. The overall atmosphere to be created is ${suasanaEn}.

**Additional Visual Details and Cinematography:**
The visual style for this video is ${detailVisualEn}. 
The camera movement used is a cinematic ${gerakanKamera}, beautifully capturing every moment.

**Sound Design:**
The dominant ambient sound is ${suaraLingkunganEn} to build realism.
${dialog ? `**Character Dialogue (in Indonesian):**\nDIALOGUE: "${dialogEn}"` : "*(No dialogue in this scene)*"}

**Negative Prompt (Things to avoid):**
${negativePromptEn}`;

                        document.getElementById('output_inggris').value = promptInggris;
                    } else {
                        document.getElementById('output_inggris').value = "English translation skipped to preserve API quota. You can manually translate the Indonesian prompt above or try again later.";
                    }
                } catch (error) {
                    console.error('Error during translation:', error);
                    
                    if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
                        showError('Quota API terlampaui saat menerjemahkan. Prompt bahasa Indonesia berhasil dibuat. Silakan tunggu beberapa menit sebelum mencoba terjemahan lagi.', true);
                        document.getElementById('output_inggris').value = "Translation failed due to API quota limit. Indonesian prompt is ready above. Please wait a few minutes before trying translation again.";
                    } else {
                        document.getElementById('output_inggris').value = "Translation error occurred. Indonesian prompt is ready above. You can manually translate or try again later.";
                    }
                }
            } else {
                // Fallback: show message that translation requires API key
                document.getElementById('output_inggris').value = "English translation requires Gemini API key. Please set your API key to enable automatic translation.";
            }

        } catch (error) {
            console.error('Error generating prompt:', error);
            showError('Terjadi kesalahan saat membuat prompt. Silakan coba lagi.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Buat Prompt';
        }
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

    // Initialize the application
    checkApiKey();
});