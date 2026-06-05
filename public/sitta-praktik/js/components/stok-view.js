// KELOMPOK KODE: Vue Component
// Konsep Vue: Komponen memungkinkan kita memecah UI menjadi bagian-bagian yang independen dan dapat digunakan kembali.
Vue.component('stok-view', {
    template: '#tpl-stock',

    // Konsep Vue (Props): Cara untuk melewatkan data dari komponen induk (app.js) ke komponen anak (stok-view).
    props: ['items', 'upbjjList', 'kategoriList'],

    data() {
        return {
            filterUpbjj: '',
            filterKategori: '',
            sortBy: 'judul',
            filterReorder: false,

            tooltip: {
                visible: false,
                content: '',
                x: 0,
                y: 0
            },

            formMode: 'add',
            formInput: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: null,
                qty: null,
                catatanHTML: '',
                cover: '',
                coverName: ''
            }
        };
    },

    // Konsep Vue (Filters): Digunakan untuk memformat tampilan teks yang umum di dalam template HTML.
    filters: {
        currency(value) {
            if (value == null) return "Rp 0";
            return "Rp " + Number(value).toLocaleString("id-ID");
        },
        suffixQty(value) {
            if (value == null) return "0 (buah)";
            return value + " (buah)";
        }
    },

    computed: {
        filteredItems() {
            let result = this.items || [];

            if (this.filterUpbjj) {
                result = result.filter(v => v.upbjj === this.filterUpbjj);
            }
            if (this.filterKategori) {
                result = result.filter(v => v.kategori === this.filterKategori);
            }
            if (this.filterReorder) {
                result = result.filter(v => v.qty < v.safety || v.qty === 0);
            }

            result.sort((a, b) => {
                if (this.sortBy === 'harga') return a.harga - b.harga;
                if (this.sortBy === 'qty') return a.qty - b.qty;
                if (this.sortBy === 'kode') return a.kode.localeCompare(b.kode);
                return a.judul.localeCompare(b.judul);
            });

            return result;
        }
    },

    // Konsep Vue (Watchers): Bereaksi terhadap perubahan spesifik pada data.
    watch: {
        // Watcher 1: Mengosongkan kategori ketika UPBJJ diubah/dihapus
        filterUpbjj(newVal) {
            if (!newVal) {
                this.filterKategori = '';
            }
        },
        // Watcher 2: Memastikan input stok (qty) tidak boleh kurang dari 0
        'formInput.qty'(newVal) {
            if (newVal < 0) {
                this.formInput.qty = 0;
                alert("Stok tidak boleh negatif!");
            }
        }
    },

    methods: {
        resetFilter() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.sortBy = 'judul';
            this.filterReorder = false;
        },

        // KELOMPOK KODE: Image Upload via FileReader API
        // Konsep Vue: Menggunakan method untuk memproses file upload dan mengonversinya menjadi Base64 string menggunakan FileReader API.
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.formInput.coverName = file.name;
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Menyimpan hasil konversi Base64 ke dalam properti state sehingga dapat langsung di-render oleh Vue data binding
                    this.formInput.cover = e.target.result;
                };
                reader.readAsDataURL(file); // Membaca file sebagai Data URL (Base64 string)
            }
        },

        // Konsep Vue (Event Handling): Mengatur aksi ketika terjadi event mouse.
        showTooltip(item, event) {
            if (!item.catatanHTML || item.catatanHTML.trim() === '-' || item.catatanHTML.trim() === '') return;
            this.tooltip.content = item.catatanHTML;
            this.tooltip.x = event.clientX + 10;
            this.tooltip.y = event.clientY + 15;
            this.tooltip.visible = true;
        },
        hideTooltip() {
            this.tooltip.visible = false;
        },

        editItem(item) {
            this.formMode = 'edit';
            this.formInput = { ...item };
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        },
        resetForm() {
            this.formMode = 'add';
            this.formInput = {
                kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '',
                harga: null, qty: null, safety: null, catatanHTML: '', cover: '', coverName: ''
            };
        },

        saveData() {
            if (!this.formInput.kode || !this.formInput.judul) {
                alert("Kode dan Judul harap diisi.");
                return;
            }

            if (this.formMode === 'add') {
                const dupe = this.items.find(i => i.kode === this.formInput.kode);
                if (dupe) {
                    alert("Kode sudah terdaftar."); return;
                }
                this.items.push({ ...this.formInput });
                alert("Bahan ajar ditambahkan.");
            } else {
                const idx = this.items.findIndex(i => i.kode === this.formInput.kode);
                if (idx !== -1) {
                    this.$set(this.items, idx, { ...this.formInput });
                    alert("Informasi bahan ajar diperbarui.");
                }
            }
            this.resetForm();
        },

        confirmDelete(kode) {
            this.$emit('delete-stok', kode);
        }
    }
});
