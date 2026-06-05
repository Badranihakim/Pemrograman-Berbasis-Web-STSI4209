// Konsep Vue: Komponen vue untuk membagi antarmuka menjadi modul yang dapat dikelola.
Vue.component('tracking-view', {
    template: '#tpl-tracking',
    
    props: ['data', 'upbjjList', 'paketList'],
    
    data() {
        return {
            searchQuery: '',
            hasSearched: false,
            selectedDO: null,
            
            newDO: {
                nomor: '',
                nim: '',
                nama: '',
                ekspedisi: '',
                paketObject: null,
                tanggal: ''
            },
            
            newProgress: ''
        };
    },
    
    created() {
        this.generateNewDONumber();
    },
    
    filters: {
        currency(value) {
            if (value == null) return "Rp 0";
            return "Rp " + Number(value).toLocaleString("id-ID");
        },
        dateFormatter(dateString) {
            if (!dateString) return "-";
            const dateObj = new Date(dateString);
            if(isNaN(dateObj)) return dateString; 
            
            return dateObj.toLocaleDateString('id-ID', {
                day: '2-digit', 
                month: 'long', 
                year: 'numeric'
            });
        }
    },

    // Konsep Vue (Watchers): Bereaksi pada perubahan data pencarian untuk otomatis mengubah formatnya.
    watch: {
        // Mengubah input pencarian menjadi huruf kapital semua (Auto-capitalize)
        searchQuery(newVal) {
            this.searchQuery = newVal.toUpperCase();
        }
    },
    
    methods: {
        generateNewDONumber() {
            const dateTracker = new Date();
            const yearStr = dateTracker.getFullYear();
            
            const currentCount = this.data ? this.data.length : 0;
            const seqNum = currentCount + 1;
            const paddedCount = String(seqNum).padStart(3, '0');
            
            this.newDO.nomor = `DO${yearStr}-${paddedCount}`;
        },
        
        doSearch() {
            this.hasSearched = true;
            this.selectedDO = null;
            const q = this.searchQuery.trim().toLowerCase();
            if (!q) return;
            
            let found = false;
            if (this.data && this.data.length > 0) {
                for (let i = 0; i < this.data.length; i++) {
                    const doItem = this.data[i];
                    const doKey = Object.keys(doItem)[0];
                    const objData = doItem[doKey];
                    
                    if (doKey.toLowerCase().includes(q) || objData.nim.toLowerCase().includes(q)) {
                        this.selectedDO = {
                            id: doKey,
                            ...objData
                        };
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) {
                this.selectedDO = null;
            }
        },
        
        resetSearch() {
            this.searchQuery = '';
            this.hasSearched = false;
            this.selectedDO = null;
        },
        
        addProgress(objTarget) {
            if (!this.newProgress.trim()) {
                alert("Keterangan progress harap diisi.");
                return;
            }
            
            const nTime = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            const timeFormatted = `${nTime.getFullYear()}-${pad(nTime.getMonth()+1)}-${pad(nTime.getDate())} ${pad(nTime.getHours())}:${pad(nTime.getMinutes())}:${pad(nTime.getSeconds())}`;
            
            objTarget.perjalanan.unshift({
                waktu: timeFormatted,
                keterangan: this.newProgress
            });
            this.newProgress = '';
        },
        
        saveNewDO() {
            if (!this.newDO.nim || !this.newDO.nama || !this.newDO.ekspedisi || !this.newDO.paketObject) {
                alert("Harap lengkapi formular NIM, Nama, Ekspedisi, dan Paket.");
                return;
            }
            
            let dateDO = this.newDO.tanggal;
            if (!dateDO) {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                dateDO = `${year}-${month}-${day}`;
            }
            
            const createDoObject = {};
            createDoObject[this.newDO.nomor] = {
                nim: this.newDO.nim,
                nama: this.newDO.nama,
                status: 'Perjalanan Awal',
                ekspedisi: this.newDO.ekspedisi,
                tanggalKirim: dateDO, 
                paket: this.newDO.paketObject.kode,
                total: this.newDO.paketObject.harga,
                perjalanan: [
                    {
                        waktu: dateDO + " 08:00:00",
                        keterangan: "Inputan Delivery Order Dibuat System"
                    }
                ]
            };
            
            this.$emit('add-do', createDoObject);
            
            alert('Pembuatan DO Baru ' + this.newDO.nomor + ' Sukses.');
            
            this.newDO.nim = '';
            this.newDO.nama = '';
            this.newDO.ekspedisi = '';
            this.newDO.paketObject = null;
            this.newDO.tanggal = '';
            this.generateNewDONumber();
        }
    }
});
