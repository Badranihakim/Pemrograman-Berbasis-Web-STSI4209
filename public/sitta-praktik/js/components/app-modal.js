// KELOMPOK KODE: Custom Vue Component untuk Modal (Reusable popup)
// Mendaftarkan komponen 'app-modal' yang di-binding ke template '#tpl-modal'
Vue.component('app-modal', {
    template: '#tpl-modal',
    // Data lokal (State) pada Vue Component
    data() {
        return {
            isOpen: false,
            title: 'Konfirmasi',
            message: 'Apakah Anda yakin?',
            onConfirmCallback: null // Fungsi yang akan dieksekusi jika pengguna menekan 'Ya'
        };
    },
    // Deklarasi methods yang digunakan di template komponen (Action)
    methods: {
        // Method untuk memunculkan modal ke atas window 
        open(title, message, onConfirm) {
            this.title = title || this.title;
            this.message = message || this.message;
            this.onConfirmCallback = onConfirm;
            this.isOpen = true; // Reactive update view
        },
        // Method untuk menutup modal
        close() {
            this.isOpen = false;
        },
        // Dieksekusi jika pengguna menekan tombol konfirmasi pada dialog
        confirm() {
            if (typeof this.onConfirmCallback === 'function') {
                this.onConfirmCallback();
            }
            this.close();
        }
    }
});
