// KELOMPOK KODE: Main Vue Logic Initialization (Vue root instance)
// Menempatkan inisialisasi aplikasi Vue JS dalam global scope
const app = new Vue({
    // Binding root component dengan identifier app di dalam DOM (index.html) element id div target mount point 
    el: '#app',

    // Konfigurasi property State pusat utama (Store data architecture array source of truth)
    data() {
        return {
            // KELOMPOK KODE: Mengatur sistem routing berbasis state
            currentRoute: 'login', // Aplikasi selalu dimulai dengan status/rute 'login'
            currentTab: 'dashboard', // Nilai state default view untuk tab dashboard.
            loginEmail: '',
            loginPassword: '',
            loginError: '',
            userName: '', // Menyimpan nama pengguna yang sukses login untuk diteruskan ke komponen dashboard

            // State untuk Toast Custom Alert
            isToastVisible: false,
            toastMessage: '',

            // Array variables storage database source data JSON local binding fetch reference parameters.
            state: {
                upbjjList: [],
                kategoriList: [],
                pengirimanList: [],
                paket: [],
                stok: [],
                tracking: []
            }
        };
    },

    // Lifecycle Hooks Vue component mounted
    // Dieksekusi otomatis ketika aplikasi Vue pertama kali sukses loading
    mounted() {
        this.fetchDataAwal();
    },

    methods: {
        // KELOMPOK KODE: Mengambil data JSON secara Asynchronous dengan fetch() (Tugas 3: Fetch Data)
        async fetchDataAwal() {
            try {
                const response = await fetch('data/dataBahanAjar.json');
                if (!response.ok) throw new Error("Gagal mengambil data JSON");
                const resultData = await response.json();

                // Menyimpan data ke dalam reactivity state / local data
                if (resultData) {
                    this.state.upbjjList = resultData.upbjjList || [];
                    this.state.kategoriList = resultData.kategoriList || [];
                    this.state.pengirimanList = resultData.pengirimanList || [];
                    this.state.paket = resultData.paket || [];
                    this.state.stok = resultData.stok || [];
                    this.state.tracking = resultData.tracking || [];
                }
            } catch (error) {
                console.error("Kesalahan saat fetch:", error);
            }
        },

        // KELOMPOK KODE: Logika autentikasi dinamis (Tugas 3: Dynamic Login)
        handleLogin() {
            const email = this.loginEmail;
            const pwd = this.loginPassword;

            // Konsep Vue & JS: Menggunakan metode array .find() untuk mencari apakah ada user
            // di dalam array dataPengguna (dari js/data.js) yang email dan passwordnya cocok dengan input form
            const user = dataPengguna.find(u => u.email === email && u.password === pwd);

            if (user) {
                // Konsep Vue: Jika user ditemukan, kita set state nama user, menghapus pesan error,
                // dan mengarahkan rute tampilan (currentRoute) ke 'dashboard'.
                this.userName = user.nama;
                localStorage.setItem('sitta_logged_in', 'true');
                localStorage.setItem('sitta_user_name', this.userName);
                this.currentRoute = 'dashboard';
                this.currentTab = 'dashboard'; // Mengarahkan langsung ke tab dashboard setelah sukses login
                this.loginError = '';
            } else {
                // Konsep Vue: Jika user tidak ditemukan, toggle pesan error dengan mengisinya.
                // Vue conditional rendering (v-if) pada form akan mendeteksi isi variabel ini dan menampilkannya.
                this.loginError = 'Email atau password salah! (Gunakan akun yang terdaftar di data.js)';
            }
        },

        // KELOMPOK KODE: Logika logout untuk membersihkan session/state dan kembali ke rute login awal
        handleLogout() {
            localStorage.removeItem('sitta_logged_in');
            localStorage.removeItem('sitta_user_name');
            this.currentRoute = 'login';
            this.userName = '';
            this.loginEmail = '';
            this.loginPassword = '';
            this.loginError = '';
        },

        // KELOMPOK KODE: Fallback handler untuk menu yang belum tersedia
        // Konsep Vue: Menerima argumen dinamis (menuName) untuk reusability agar 1 fungsi tersentralisasi bisa melayani banyak tombol.
        // Event modifier .prevent (@click.prevent) di template digunakan secara efisien untuk mencegah perilaku bawaan navigasi (refresh) dari elemen <a>.
        showComingSoon(menuName) {
            this.toastMessage = 'Fitur ' + menuName + ' masih dalam tahap pengembangan 🚀';
            this.isToastVisible = true;
            
            // Menggunakan fungsi asinkron JS murni untuk menyembunyikan toast secara otomatis setelah 3 detik
            setTimeout(() => {
                this.isToastVisible = false;
            }, 3000);
        },

        // KELOMPOK KODE: Handler untuk menghapus data stok berdasarkan kode setelah konfirmasi modal
        handleDeleteStok(kode) {
            const item = this.state.stok.find(i => i.kode === kode);
            if (!item) return;

            // Menemukan parent property tree root app modal instance vue dengan ref name untuk membuka konfirmasi
            this.$refs.deleteModal.open(
                "Konfirmasi Hapus Data Stock",
                `Yakin ingin menghapus ${item.kode} - ${item.judul}?`,
                () => {
                    // Logic pemusnahan menggunakan reactive JS Array Splice function.
                    const targetIndex = this.state.stok.findIndex(i => i.kode === kode);
                    if (targetIndex !== -1) {
                        this.state.stok.splice(targetIndex, 1);
                    }
                }
            );
        },

        // Listener handling penambahan objek array DO data baru secara reaktif component passing 
        handleAddDO(newDoData) {
            this.state.tracking.push(newDoData);
        }
    }
});
