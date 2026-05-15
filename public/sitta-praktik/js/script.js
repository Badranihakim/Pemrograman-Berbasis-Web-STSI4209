// KELOMPOK KODE: Fungsi Penanganan Login dan Modal
document.addEventListener("DOMContentLoaded", () => {
    
    // -- KELOMPOK KODE: Penanganan Toggle Hamburger Menu Mobile --
    // Fungsi untuk memunculkan dan menyembunyikan navigasi di perangkat mobile serta mengubah ikon menu
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const navLinks = document.getElementById("navLinks");
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            // Ubah ikon antara simbol Hamburger dan simbol X (Close)
            if (navLinks.classList.contains("active")) {
                hamburgerMenu.innerHTML = "&#10006;"; // Ikon X
            } else {
                hamburgerMenu.innerHTML = "&#9776;"; // Ikon Hamburger
            }
        });
    }

    // -- Penanganan Form pada Halaman Login --
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            
            // Verifikasi input berdasarkan data dummy di data.js
            const user = dataPengguna.find(u => u.email === email && u.password === password);
            if (user) {
                // Menyimpan status login pada localStorage menggunakan Session Dummy
                localStorage.setItem("userAktif", JSON.stringify(user));
                window.location.href = "dashboard.html";
            } else {
                showToast("Email/password yang anda masukkan salah!");
            }
        });
    }

    // Modal Interaksi (Membuka & Menutup Modal Alert Box)
    const forgotBtn = document.getElementById("forgotBtn");
    const registerBtn = document.getElementById("registerBtn");
    const forgotModal = document.getElementById("forgotModal");
    const registerModal = document.getElementById("registerModal");

    if (forgotBtn && forgotModal) {
        forgotBtn.onclick = (e) => { e.preventDefault(); forgotModal.classList.remove("hidden"); }
        document.getElementById("closeForgot").onclick = () => forgotModal.classList.add("hidden");
    }

    if (registerBtn && registerModal) {
        registerBtn.onclick = (e) => { e.preventDefault(); registerModal.classList.remove("hidden"); }
        document.getElementById("closeRegister").onclick = () => registerModal.classList.add("hidden");
    }

    // -- KELOMPOK KODE: Penanganan Dinamis Halaman Dashboard (Greeting Time) --
    // Fitur Greeting: Membaca waktu lokal pengguna (jam) dan menampilkan sapaan "Selamat Pagi/Siang/Sore/Malam" secara dinamis berdasarkan jam saat ini.
    const greetingEl = document.getElementById("greeting");
    if (greetingEl) {
        const user = JSON.parse(localStorage.getItem("userAktif"));
        const jam = new Date().getHours();
        let sapaan = "Selamat malam";
        if (jam >= 4 && jam < 11) sapaan = "Selamat pagi";
        else if (jam >= 11 && jam < 15) sapaan = "Selamat siang";
        else if (jam >= 15 && jam < 18) sapaan = "Selamat sore";
        
        greetingEl.innerHTML = `${sapaan}, <b>${user ? user.nama : 'Pengunjung'}</b>!`;
    }

    // -- Penanganan Halaman Tracking --
    const trackingForm = document.getElementById("trackingForm");
    if (trackingForm) {
        trackingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const noDo = document.getElementById("searchDO").value.trim();
            const resultBox = document.getElementById("trackingResult");
            
            if (dataTracking[noDo]) {
                const data = dataTracking[noDo];
                let timelineHTML = '';
                // Looping / Iterasi data array perjalanan paket
                data.perjalanan.forEach(p => {
                    timelineHTML += `<li><b>${p.waktu}</b><br>${p.keterangan}</li>`;
                });

                // Injeksi hasil ke DOM menggunakan template literals
                resultBox.innerHTML = `
                    <h4>Status Pengiriman: <span style="color: var(--primary-color)">${data.status}</span></h4>
                    <p><b>Nama Mahasiswa:</b> ${data.nama}</p>
                    <p><b>Ekspedisi:</b> ${data.ekspedisi}</p>
                    <p><b>Tanggal Kirim:</b> ${data.tanggalKirim}</p>
                    <p><b>Total Pembayaran:</b> ${data.total}</p>
                    <ul class="timeline">${timelineHTML}</ul>
                `;
            } else {
                resultBox.innerHTML = `<p style="color: var(--danger-color); font-weight: 500;">Data dengan Nomor DO ${noDo} tidak ditemukan.</p>`;
            }
        });
    }

    // -- Penanganan Halaman Stok Bahan Ajar --
    const stokTableBody = document.getElementById("stokTableBody");
    if (stokTableBody) {
        // KELOMPOK KODE: Fungsi Penanganan Menampilkan Gambar Cover pada Tabel Stok
        // Fungsi untuk me-render / menampilkan isi tabel melalui DOM Manipulation (memasukkan cover buku dari file .jpg atau blob lokal)
        const renderStok = () => {
            stokTableBody.innerHTML = "";
            dataBahanAjar.forEach((item) => {
                const coverHTML = item.cover ? `<img src="${item.cover}" alt="Cover" style="width: 50px; height: 70px; object-fit: cover; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">` : `<div style="width: 50px; height: 70px; background: rgba(0,0,0,0.1); border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #666; text-align: center;">No Image</div>`;
                stokTableBody.innerHTML += `
                    <tr>
                        <td>${coverHTML}</td>
                        <td>${item.kodeLokasi}</td>
                        <td>${item.kodeBarang}</td>
                        <td>${item.namaBarang}</td>
                        <td>${item.stok}</td>
                    </tr>
                `;
            });
        };
        renderStok(); // Panggil saat dokumen berhasil dimuat (Load)

        // KELOMPOK KODE: Penanganan Tambah Stok Baru (Beserta Upload dan Render Gambar Cover Lokal)
        // Menangani input file di DOM untuk menampilkan nama file terpilih
        const newInputCover = document.getElementById("newCover");
        const fileNameDisplay = document.getElementById("fileNameDisplay");
        if (newInputCover && fileNameDisplay) {
            newInputCover.addEventListener("change", function() {
                if (this.files && this.files.length > 0) {
                    fileNameDisplay.innerText = this.files[0].name;
                } else {
                    fileNameDisplay.innerText = "Belum ada file dipilih";
                }
            });
        }

        // Fitur penambahan data baris stok baru via JS
        const formTambahStok = document.getElementById("formTambahStok");
        if (formTambahStok) {
            formTambahStok.addEventListener("submit", (e) => {
                e.preventDefault();
                const kodeLokasi = document.getElementById("newLokasi").value;
                const kodeBarang = document.getElementById("newKode").value;
                const namaBarang = document.getElementById("newNama").value;
                const stok = document.getElementById("newStok").value;
                
                // Menangani data file foto sampul yg diupload
                const coverFileInput = document.getElementById("newCover");
                let coverUrl = "";
                if (coverFileInput && coverFileInput.files && coverFileInput.files.length > 0) {
                    // Menggunakan URL.createObjectURL() untuk generate blob path sehingga gambar tersimpan dari memori lokal (browser)
                    coverUrl = URL.createObjectURL(coverFileInput.files[0]);
                }

                // Push objek data dummy ke dalam array beserta data cover url
                dataBahanAjar.push({
                    kodeLokasi, kodeBarang, namaBarang, stok, jenisBarang: "BMP", edisi: "-", cover: coverUrl
                });
                renderStok(); // Memperbarui tampilan tabel sesuai data array terbaru
                formTambahStok.reset();
                if(fileNameDisplay) fileNameDisplay.innerText = "Belum ada file dipilih"; // Reset Teks Nama File
                showToast("Bahan ajar berhasil ditambahkan kedalam tabel!", "success");
            });
        }
    }

    // -- KELOMPOK KODE: Penanganan Tombol/Menu Placeholder (Coming Soon) --
    // Menampilkan notifikasi pemberitahuan untuk fitur-fitur yang masih dalam tahap pengembangan
    const comingSoonElements = document.querySelectorAll('.coming-soon');
    comingSoonElements.forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault(); // Mencegah reload halaman
            // Menutup menu bar mobile jika sedang terbuka saat klik item
            if (navLinks && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                if (hamburgerMenu) hamburgerMenu.innerHTML = "&#9776;";
            }
            showToast("Ups! Fitur ini sedang dalam pengembangan 🚀 (Coming Soon)", "info");
        });
    });
});

// KELOMPOK KODE: Fungsi pembantu (Helper) menampilkan Custom Alert/Toast
function showToast(message, type = "error") {
    const toast = document.getElementById("toast");
    if (!toast) return; /* Pencegah eror jika DOM Toast tidak ditemukan */
    
    document.getElementById("toastMsg").innerText = message;
    
    // Menyesuaikan warna berdasarkan tipe notifikasi (success, info, atau error)
    if (type === "success") {
        toast.style.background = "var(--success-color)";
        toast.style.boxShadow = "0 4px 12px rgba(46, 213, 115, 0.4)";
    } else if (type === "info") {
        toast.style.background = "linear-gradient(135deg, var(--primary-color), var(--secondary-color))";
        toast.style.boxShadow = "0 4px 12px rgba(108, 99, 255, 0.4)";
    } else {
        toast.style.background = "var(--danger-color)";
        toast.style.boxShadow = "0 4px 12px rgba(255, 71, 87, 0.4)";
    }
    
    toast.classList.remove("hidden");
    
    // Setel Timer 3 detik sebelum menghilangkan Alert Box
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}
