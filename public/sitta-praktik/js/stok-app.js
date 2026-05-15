// Inisialisasi Vue App untuk Stok
var app = new Vue({
    // Mengaitkan Vue dengan elemen ber-ID app
    el: '#app',
    data: {
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        
        stok: [
            { kode: "EKMA4116", judul: "Manajemen Keuangan", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>", cover: "assets/manajemen_keuangan.jpg" },
            { kode: "EKMA4310", judul: "Kepemimpinan", kategori: "MK Wajib", upbjj: "Surabaya", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>", cover: "assets/kepemimpinan.jpg" },
            { kode: "BIOL4211", judul: "Mikrobiologi Dasar", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah", cover: "assets/mikrobiologi.jpg" },
            { kode: "SKOM4101", judul: "Pengantar Ilmu Komunikasi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder", cover: "assets/pengantar_komunikasi.jpg" },
            { kode: "PAUD4401", judul: "Perkembangan Anak Usia Dini", kategori: "MK Pilihan", upbjj: "Padang", lokasiRak: "R4-A1", harga: 70000, qty: 0, safety: 5, catatanHTML: "<span style='color:red'>Kosong</span>", cover: "assets/paud_perkembangan.jpeg" }
        ],

        // State untuk Filter dan Pengurutan (Sorting)
        filterUpbjj: "",
        filterKategori: "",
        filterReorder: false,
        sortBy: "judul", // Default sorting

        // Model untuk Formulir Tambah Stok Baru (menggunakan v-model)
        formBaru: {
            kode: "",
            judul: "",
            kategori: "",
            upbjj: "",
            lokasiRak: "",
            harga: 0,
            qty: 0,
            safety: 0,
            catatanHTML: ""
        },
        
        // State untuk Hamburger Menu (Responsivitas Navbar)
        isMobileMenuActive: false
    },
    
    // Computed property digunakan untuk menghitung data stok berdasarkan filter dan sort (otomatis ter-update jika data berubah)
    computed: {
        filteredStok() {
            let result = this.stok;

            // Jika filter UT-Daerah dipilih, maka kita filter sesuai pilihan
            if (this.filterUpbjj) {
                result = result.filter(item => item.upbjj === this.filterUpbjj);
            }

            // Dependent Options: Kategori filter hanya jalan jika UT-Daerah sudah dipilih & Kategori filter tidak kosong
            if (this.filterUpbjj && this.filterKategori) {
                result = result.filter(item => item.kategori === this.filterKategori);
            }

            // Filter Reorder (Qty < Safety atau Qty == 0)
            if (this.filterReorder) {
                result = result.filter(item => item.qty < item.safety || item.qty === 0);
            }

            // Logic untuk Sort / Mengurutkan array berdasarkan pihan pengguna
            result = result.sort((a, b) => {
                if (this.sortBy === "judul") {
                    return a.judul.localeCompare(b.judul);
                } else if (this.sortBy === "qty") {
                    return Number(a.qty) - Number(b.qty);
                } else if (this.sortBy === "harga") {
                    return Number(a.harga) - Number(b.harga);
                }
                return 0;
            });

            return result;
        }
    },

    // Watcher: memantau jika filter UT-Daerah direset, kategori juga reset
    watch: {
        filterUpbjj(newVal) {
            if (!newVal) {
                this.filterKategori = "";
            }
        }
    },

    methods: {
        toggleMobileMenu() {
            this.isMobileMenuActive = !this.isMobileMenuActive;
        },
        showComingSoon() {
            alert("Ups! Fitur ini sedang dalam pengembangan 🚀 (Coming Soon)");
        },
        resetFilter() {
            this.filterUpbjj = "";
            this.filterKategori = "";
            this.filterReorder = false;
            this.sortBy = "judul";
        },
        // Fungsi/Metode untuk menambahkan stok berdasarkan interaksi formulir pengguna
        tambahStok() {
            // Validasi Input Sederhana
            if (!this.formBaru.kode || !this.formBaru.judul || !this.formBaru.upbjj) {
                alert("Mohon lengkapi kode, judul, dan UPBJJ.");
                return;
            }

            // Push data baru ke dalam array stok
            this.stok.push({
                kode: this.formBaru.kode,
                judul: this.formBaru.judul,
                kategori: this.formBaru.kategori || "UMUM",
                upbjj: this.formBaru.upbjj,
                lokasiRak: this.formBaru.lokasiRak || "-",
                harga: parseInt(this.formBaru.harga) || 0,
                qty: parseInt(this.formBaru.qty) || 0,
                safety: parseInt(this.formBaru.safety) || 0,
                catatanHTML: this.formBaru.catatanHTML || "-"
            });

            // Mengosongkan isian form kembali
            this.formBaru = {
                kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "",
                harga: 0, qty: 0, safety: 0, catatanHTML: ""
            };

            alert("Bahan ajar berhasil ditambahkan!");
        }
    }
});
