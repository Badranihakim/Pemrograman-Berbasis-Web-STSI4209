// KELOMPOK KODE: Custom Vue Component untuk Tampilan Dashboard Utama
// Konsep Vue (Components): Komponen adalah instans Vue yang dapat digunakan kembali dengan nama. Ini membantu memecah UI menjadi bagian yang dapat dikelola.
Vue.component('dashboard-view', {
    template: '#tpl-dashboard',
    
    // Konsep Vue (Props): Mekanisme untuk mengirimkan data dari komponen parent ke komponen child.
    props: ['userName', 'upbjjList', 'kategoriList'],
    
    computed: {
        // Konsep Vue (Computed Properties): Properti yang dihitung secara dinamis dan akan di-cache berdasarkan dependensinya.
        dynamicGreeting() {
            const hour = new Date().getHours();
            let greeting = "Selamat Malam"; // Default malam
            
            if (hour >= 5 && hour < 11) {
                greeting = "Selamat Pagi";
            } else if (hour >= 11 && hour < 15) {
                greeting = "Selamat Siang";
            } else if (hour >= 15 && hour < 18) {
                greeting = "Selamat Sore";
            }
            
            // Menggabungkan sapaan dengan nama pengguna yang dikirim via props
            return `${greeting}, ${this.userName || 'Pengguna'}!`;
        }
    },
    
    methods: {
        // Peringatan fitur dalam pengembangan
        showComingSoon() {
            alert("Ups! Fitur ini sedang dalam pengembangan 🚀 (Coming Soon)");
        }
    }
});
