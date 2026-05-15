// Inisialisasi Vue App untuk Tracking
var app = new Vue({
    el: '#app',
    data: {
        // Data master 
        pengirimanList: [
            { kode: "REG", nama: "Reguler (3-5 hari)" },
            { kode: "EXP", nama: "Ekspres (1-2 hari)" }
        ],
        paketList: [
            { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
            { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
        ],
        
        // Data Tracking (Berisi dummy di awal)
        tracking: {
            "DO2025-001": {
                nim: "123456789",
                nama: "Rina Wulandari",
                status: "Dalam Perjalanan",
                ekspedisi: "REG - Reguler (3-5 hari)",
                tanggalKirim: "2025-08-25",
                paket: "PAKET-UT-001",
                total: 120000,
                perjalanan: [
                    { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
                    { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
                    { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
                ]
            }
        },

        // State untuk pencarian DO
        searchDO: "",
        searchResult: null,
        hasSearched: false,

        // State untuk Form Pembuatan DO Baru
        formDO: {
            nim: "",
            nama: "",
            ekspedisi: "",
            paket: "",
            tanggalKirim: ""
        },

        // Responsive Menu state
        isMobileMenuActive: false
    },
    
    computed: {
        // Menghitung/menggenerate Auto ID DO berdasarkan object keys
        generateNewDO() {
            const keys = Object.keys(this.tracking);
            const currentYear = new Date().getFullYear();
            
            // Filter DO yang tahunnya sama (opsional, tapi disesuaikan dgn contoh PDF)
            let sequence = keys.length + 1;
            // Pad sequence dengan 0 (mis: 001)
            let paddedSeq = sequence.toString().padStart(3, '0');
            
            return `DO${currentYear}-${paddedSeq}`;
        },
        
        // Menentukan rincian paket berdasarkan yang di-select di form
        selectedPaketDetails() {
            if (!this.formDO.paket) return null;
            return this.paketList.find(p => p.kode === this.formDO.paket);
        }
    },

    methods: {
        toggleMobileMenu() {
            this.isMobileMenuActive = !this.isMobileMenuActive;
        },
        showComingSoon() {
            alert("Ups! Fitur ini sedang dalam pengembangan 🚀 (Coming Soon)");
        },
        lacakPengiriman() {
            if (!this.searchDO) return;
            
            this.hasSearched = true;
            // Cari objek tracking dari key
            const result = this.tracking[this.searchDO];
            
            if (result) {
                this.searchResult = Object.assign({ id: this.searchDO }, result);
            } else {
                this.searchResult = null;
            }
        },
        buatDOBaru() {
            // Validasi input form
            if(!this.formDO.nim || !this.formDO.nama || !this.formDO.ekspedisi || !this.formDO.paket || !this.formDO.tanggalKirim){
                alert("Mohon lengkapi seluruh field sebelum menyimpan DO.");
                return;
            }

            const newId = this.generateNewDO;
            const fullEkspedisi = this.pengirimanList.find(e => e.kode === this.formDO.ekspedisi);
            const detailPaket = this.selectedPaketDetails;
            
            // Menambahkan tracking baru dengan menggunakan format obyek
            // Vue 2 perlu Vue.set jika menambahkan properti baru ke object
            this.$set(this.tracking, newId, {
                nim: this.formDO.nim,
                nama: this.formDO.nama,
                status: "Diproses",
                ekspedisi: `${fullEkspedisi.kode} - ${fullEkspedisi.nama}`,
                tanggalKirim: this.formDO.tanggalKirim,
                paket: detailPaket.kode,
                total: detailPaket.harga,
                perjalanan: [
                    { waktu: new Date().toLocaleString('id-ID'), keterangan: "DO berhasil dibuat dan diproses" }
                ]
            });

            // Refresh form menjadi default
            this.formDO = {
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: ""
            };

            alert(`Delivery Order baru berhasil dibuat dengan nomor seri: ${newId}`);
        }
    }
});
