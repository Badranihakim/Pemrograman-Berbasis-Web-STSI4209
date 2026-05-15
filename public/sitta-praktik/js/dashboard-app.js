// Inisialisasi Vue App untuk Dashboard
var app = new Vue({
    el: '#app',
    data: {
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        isMobileMenuActive: false,
        userName: "Rina Wulandari"
    },
    computed: {
        // Computed method untuk menyapa pengguna berdasarkan jam secara dinamis 
        dynamicGreeting() {
            const hour = new Date().getHours();
            let greeting = "";
            
            if (hour >= 5 && hour < 11) {
                greeting = "Selamat Pagi";
            } else if (hour >= 11 && hour < 15) {
                greeting = "Selamat Siang";
            } else if (hour >= 15 && hour < 18) {
                greeting = "Selamat Sore";
            } else {
                greeting = "Selamat Malam";
            }
            
            return `${greeting}, ${this.userName}!`;
        }
    },
    methods: {
        toggleMobileMenu() {
            this.isMobileMenuActive = !this.isMobileMenuActive;
        },
        showComingSoon() {
            alert("Ups! Fitur ini sedang dalam pengembangan 🚀 (Coming Soon)");
        }
    }
});
