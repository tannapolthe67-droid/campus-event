// assets/js/app.js
function activityApp() {
    return {
        role: 'student', 
        studentTab: 'explore', 
        adminTab: 'events',
        
        searchQuery: '',
        selectedCategory: '',
        selectedStatus: '',
        adminSearchQuery: '',
        
        toasts: [],
        
        showTicketModal: false,
        currentTicketEvent: null,
        showEventModal: false,
        isEditing: false,
        
        scanInputId: '',
        selectedScannerEventId: '',
        
        eventForm: {
            id: null, title: '', club: '', category: 'วิชาการ', date: '', 
            location: '', maxCapacity: 50, registeredCount: 0, 
            status: 'เปิดรับสมัคร', description: ''
        },

        // โหลดข้อมูลตั้งต้นจาก data.js
        events: defaultEvents,
        registrations: defaultRegistrations,

        init() {
            const savedEvents = localStorage.getItem('campus_events');
            const savedRegs = localStorage.getItem('campus_registrations');
            if (savedEvents) {
                try { this.events = JSON.parse(savedEvents); } catch(e) {}
            }
            if (savedRegs) {
                try { this.registrations = JSON.parse(savedRegs); } catch(e) {}
            }
        },

        saveToLocalStorage() {
            localStorage.setItem('campus_events', JSON.stringify(this.events));
            localStorage.setItem('campus_registrations', JSON.stringify(this.registrations));
        },

        showToast(message, type = 'success') {
            const id = Date.now();
            this.toasts.push({ id, message, type });
            setTimeout(() => {
                this.toasts = this.toasts.filter(t => t.id !== id);
            }, 3500);
        },

        switchRole(newRole) {
            this.role = newRole;
            this.showToast(`เปลี่ยนเป็น${newRole === 'student' ? 'มุมมองนักศึกษา' : 'มุมมองผู้ดูแลระบบ'}เรียบร้อยแล้ว`, 'info');
        },

        // --- ส่วนของนักศึกษา (Student) ---
        get filteredEvents() {
            return this.events.filter(ev => {
                const matchQuery = ev.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                   ev.club.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                   ev.location.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchCat = this.selectedCategory === '' || ev.category === this.selectedCategory;
                const matchStatus = this.selectedStatus === '' || ev.status === this.selectedStatus;
                return matchQuery && matchCat && matchStatus;
            });
        },

        get myRegisteredEvents() {
            const myId = 'STD-660142';
            return this.registrations
                .filter(r => r.studentId === myId)
                .map(r => {
                    const ev = this.events.find(e => e.id === r.eventId);
                    return { ...r, event: ev };
                })
                .filter(item => item.event !== undefined);
        },

        isRegistered(eventId) {
            return this.registrations.some(r => r.eventId === eventId && r.studentId === 'STD-660142');
        },

        registerEvent(event) {
            const myId = 'STD-660142';
            if (this.isRegistered(event.id)) return this.showToast('คุณได้ลงทะเบียนกิจกรรมนี้ไปแล้ว', 'warning');
            if (event.registeredCount >= event.maxCapacity) return this.showToast('เสียใจด้วย กิจกรรมนี้เต็มแล้ว', 'error');

            this.registrations.push({
                eventId: event.id, studentId: myId, studentName: 'นายนวัตกรรม นักศึกษา', checkedIn: false
            });

            event.registeredCount++;
            if (event.registeredCount >= event.maxCapacity) event.status = 'เต็มแล้ว';

            this.saveToLocalStorage();
            this.showToast(`ลงทะเบียนสำเร็จ! กิจกรรม: ${event.title}`, 'success');
            this.openTicketModal(event);
        },

        cancelRegistration(eventId) {
            const myId = 'STD-660142';
            this.registrations = this.registrations.filter(r => !(r.eventId === eventId && r.studentId === myId));
            
            const event = this.events.find(e => e.id === eventId);
            if (event) {
                event.registeredCount = Math.max(0, event.registeredCount - 1);
                if (event.status === 'เต็มแล้ว' && event.registeredCount < event.maxCapacity) event.status = 'เปิดรับสมัคร';
            }

            this.saveToLocalStorage();
            this.showToast('ยกเลิกการลงทะเบียนเรียบร้อยแล้ว', 'info');
        },

        openTicketModal(event) {
            this.currentTicketEvent = event;
            this.showTicketModal = true;
            setTimeout(() => {
                const container = document.getElementById('qrcode-container');
                if (container) {
                    container.innerHTML = '';
                    new QRCode(container, {
                        text: `STD-660142-EVENT-${event.id}`,
                        width: 160, height: 160,
                        colorDark: "#0f172a", colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
            }, 100);
        },

        // --- ส่วนของผู้ดูแลระบบ (Admin) ---
        get filteredAdminEvents() {
            return this.events.filter(ev =>
                ev.title.toLowerCase().includes(this.adminSearchQuery.toLowerCase()) ||
                ev.club.toLowerCase().includes(this.adminSearchQuery.toLowerCase())
            );
        },

        get totalRegistrationsCount() { return this.registrations.length; },
        get totalCheckedInCount() { return this.registrations.filter(r => r.checkedIn).length; },
        get topClubName() {
            if (this.events.length === 0) return '-';
            const top = [...this.events].sort((a,b) => b.registeredCount - a.registeredCount)[0];
            return top ? top.club : '-';
        },

        getEventTitle(eventId) {
            const ev = this.events.find(e => e.id == eventId);
            return ev ? ev.title : '';
        },

        getRegistrationsForEvent(eventId) {
            return this.registrations.filter(r => r.eventId == eventId);
        },

        toggleCheckIn(eventId, studentId) {
            const reg = this.registrations.find(r => r.eventId == eventId && r.studentId === studentId);
            if (reg) {
                reg.checkedIn = !reg.checkedIn;
                this.saveToLocalStorage();
                this.showToast(`อัปเดตสถานะเช็คชื่อสำหรับ ${reg.studentName} สำเร็จ`, 'success');
            }
        },

        simulateScan(studentId) {
            if (!this.selectedScannerEventId) return this.showToast('กรุณาเลือกกิจกรรมที่ต้องการเช็คชื่อก่อน', 'warning');
            if (!studentId) return this.showToast('กรุณากรอกรหัสนักศึกษา', 'warning');

            const reg = this.registrations.find(r => r.eventId == this.selectedScannerEventId && r.studentId.toLowerCase() === studentId.trim().toLowerCase());
            if (reg) {
                reg.checkedIn = true;
                this.saveToLocalStorage();
                this.showToast(`เช็คชื่อสำเร็จ: ${reg.studentName} (${reg.studentId})`, 'success');
                this.scanInputId = '';
            } else {
                this.showToast(`ไม่พบการลงทะเบียนของรหัส ${studentId} ในกิจกรรมนี้`, 'error');
            }
        },

        getCheckedInCountForEvent(eventId) {
            return this.registrations.filter(r => r.eventId == eventId && r.checkedIn).length;
        },

        openEventModal() {
            this.isEditing = false;
            this.eventForm = {
                id: Date.now(), title: '', club: '', category: 'วิชาการ', date: '',
                location: '', maxCapacity: 50, registeredCount: 0, status: 'เปิดรับสมัคร', description: ''
            };
            this.showEventModal = true;
        },

        editEvent(event) {
            this.isEditing = true;
            this.eventForm = { ...event };
            this.showEventModal = true;
        },

        saveEvent() {
            if (this.isEditing) {
                const index = this.events.findIndex(e => e.id === this.eventForm.id);
                if (index !== -1) this.events[index] = { ...this.eventForm };
                this.showToast('แก้ไขข้อมูลกิจกรรมสำเร็จ', 'success');
            } else {
                this.events.unshift({ ...this.eventForm });
                this.showToast('สร้างกิจกรรมใหม่สำเร็จ', 'success');
            }
            this.saveToLocalStorage();
            this.showEventModal = false;
        },

        deleteEvent(id) {
            if (confirm('คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?')) {
                this.events = this.events.filter(e => e.id !== id);
                this.registrations = this.registrations.filter(r => r.eventId !== id);
                this.saveToLocalStorage();
                this.showToast('ลบกิจกรรมเรียบร้อยแล้ว', 'info');
            }
        },

        exportCSV() {
            let csvContent = "data:text/csv;charset=utf-8,\uFEFFEventID,Title,Club,Category,MaxCapacity,RegisteredCount\n";
            this.events.forEach(e => {
                csvContent += `"${e.id}","${e.title}","${e.club}","${e.category}",${e.maxCapacity},${e.registeredCount}\n`;
            });
            const link = document.createElement("a");
            link.setAttribute("href", encodeURI(csvContent));
            link.setAttribute("download", "campus_events_report.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showToast('ส่งออกข้อมูล CSV สำเร็จ', 'success');
        },

        triggerPrintReport() { window.print(); }
    }
}