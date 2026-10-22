const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

app.use(express.static(path.join(__dirname)));

// قاعدة البيانات المؤقتة في الذاكرة
let adminsDB = [{ id: 1, name: "Super Admin", email: "azubisystem.ha@gmail.com", role: "Super Admin", phone: "+49 176 63160304", org: "AzubiSystem HQ" }];
let studentsDB = [];
let reportsDB = [];
let homeworkDB = [];
let homeworkSubmissionsDB = [];
let messagesDB = [];
let classesDB = ["Klasse 1", "Klasse 2", "Klasse 3", "Klasse 4", "Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"];

const monthsList = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

let annualCalendarDB = monthsList.map((m, idx) => ({
    month: m,
    className: "Klasse 1",
    phase: idx === 0 ? "Orientierung (01.01 - 31.01)" : idx === 5 ? "Betriebsprüfung (01.06 - 30.06)" : "Betrieb (Regulär)",
    schoolDays: "KW 1-2: Berufsschule",
    workDays: "KW 3-4: Praxis im Betrieb",
    note: "Gemäß BBiG Ausbildungsplan"
}));

const skillCategories = [
    { id: "verstaendnis", name: "1. التفاهم (Verständnis)" },
    { id: "integration", name: "2. الاندماج (Integration)" },
    { id: "kommunikation", name: "3. التواصل (Kommunikation)" },
    { id: "zuhoeren", name: "4. الاستماع (Zuhören)" },
    { id: "lernen", name: "5. التعلم (Lernen)" },
    { id: "mitarbeit", name: "6. المشاركة (Mitarbeit)" },
    { id: "deutsch", name: "7. اللغة الألمانية (Deutsch)" }
];

let customGradesDB = [];

// دالة الدخول المرنة والمتوافقة مع كافة الخيارات
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();

    if (cleanEmail === "azubisystem.ha@gmail.com" && password === "123456") {
        return res.json({ success: true, user: { name: "Super Admin", email: "azubisystem.ha@gmail.com", role: "admin", org: "AzubiSystem HQ" } });
    }

    const student = studentsDB.find(s => (s.email || "").trim().toLowerCase() === cleanEmail);
    if (student && password === "123456") {
        return res.json({ success: true, user: { name: student.name, email: student.email, role: "azubi", org: student.className } });
    }

    res.json({ success: false, message: "بيانات الدخول غير صحيحة / Anmeldedaten ungültig." });
});

// إدارة المسؤولين
app.get('/api/admins', (req, res) => res.json(adminsDB));
app.post('/api/admins', (req, res) => {
    const { name, email, role, phone, org } = req.body;
    adminsDB.push({ id: Date.now(), name, email, role: role || "Ausbilder", phone: phone || "+49 ...", org: org || "Betrieb" });
    res.json({ success: true, adminsDB });
});

// إدارة بيانات المتدربين مع كافة الحقول النصية المفتوحة
app.get('/api/students', (req, res) => res.json(studentsDB));
app.post('/api/students', (req, res) => {
    const { action, id, name, email, className, phone, address, birthdate, startDate, domain, specialization, notes } = req.body;
    
    if (action === 'add') {
        studentsDB.push({
            id: Date.now(),
            name: name || "Neuer Azubi",
            email: email || "azubi@system.de",
            className: className || classesDB[0],
            phone: phone || "+49 ...",
            address: address || "",
            birthdate: birthdate || "",
            startDate: startDate || "",
            domain: domain || "",
            specialization: specialization || "",
            notes: notes || ""
        });
    } else if (action === 'edit') {
        const s = studentsDB.find(x => x.id == id);
        if (s) {
            if (name !== undefined) s.name = name;
            if (email !== undefined) s.email = email;
            if (className !== undefined) s.className = className;
            if (phone !== undefined) s.phone = phone;
            if (address !== undefined) s.address = address;
            if (birthdate !== undefined) s.birthdate = birthdate;
            if (startDate !== undefined) s.startDate = startDate;
            if (domain !== undefined) s.domain = domain;
            if (specialization !== undefined) s.specialization = specialization;
            if (notes !== undefined) s.notes = notes;
        }
    } else if (action === 'delete') {
        studentsDB = studentsDB.filter(x => x.id != id);
    }
    res.json({ success: true, studentsDB });
});

app.get('/api/classes', (req, res) => res.json(classesDB));
app.post('/api/classes', (req, res) => {
    const { action, oldName, newName, className } = req.body;
    if (action === 'rename' && oldName && newName) {
        classesDB = classesDB.map(c => c === oldName ? newName : c);
        studentsDB.forEach(s => { if(s.className === oldName) s.className = newName; });
    } else if (className && !classesDB.includes(className)) {
        classesDB.push(className);
    }
    res.json({ success: true, classesDB });
});

app.get('/api/stats', (req, res) => {
    res.json({ totalAdmins: adminsDB.length, totalAzubis: studentsDB.length, totalReports: reportsDB.length, totalHomework: homeworkDB.length });
});

app.get('/api/skills/categories', (req, res) => res.json(skillCategories));
app.get('/api/skills/grades', (req, res) => res.json(customGradesDB));
app.post('/api/skills/grades', (req, res) => {
    const { categoryId, week, grade } = req.body;
    const existing = customGradesDB.find(g => g.categoryId === categoryId && g.week === week);
    if (existing) { existing.grade = grade; } else { customGradesDB.push({ categoryId, week, grade }); }
    res.json({ success: true, customGradesDB });
});

app.get('/api/calendar/annual', (req, res) => res.json(annualCalendarDB));
app.post('/api/calendar/annual', (req, res) => {
    const { month, className, phase, schoolDays, workDays, note } = req.body;
    let existing = annualCalendarDB.find(c => c.month === month && c.className === className);
    if (existing) {
        existing.phase = phase || existing.phase;
        existing.schoolDays = schoolDays || existing.schoolDays;
        existing.workDays = workDays || existing.workDays;
        existing.note = note || existing.note;
    } else {
        annualCalendarDB.push({ month, className, phase, schoolDays, workDays, note });
    }
    res.json({ success: true, calendar: annualCalendarDB });
});

app.post('/api/reports', (req, res) => {
    reportsDB.push({ id: Date.now(), week: req.body.week, dept: req.body.dept, text: req.body.text, author: req.body.author, status: "Ausstehend", signedBy: null, timestamp: new Date().toLocaleString('de-DE') });
    res.json({ success: true });
});
app.get('/api/reports', (req, res) => res.json(reportsDB));
app.post('/api/reports/approve', (req, res) => {
    const r = reportsDB.find(x => x.id === req.body.reportId);
    if (r) { r.status = "Genehmigt 🗸"; r.signedBy = req.body.adminName; }
    res.json({ success: true });
});

app.get('/api/homework', (req, res) => res.json(homeworkDB));
app.post('/api/homework', (req, res) => {
    homeworkDB.push({ id: Date.now(), className: req.body.className, studentName: req.body.studentName, title: req.body.title, desc: req.body.desc, pdfUrl: req.body.pdfUrl || "#",