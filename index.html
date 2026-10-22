const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

app.use(express.static(path.join(__dirname)));

// قاعدة البيانات الرئيسية في الذاكرة
let adminsDB = [
    { id: 1, name: "Super Admin", email: "azubisystem.ha@gmail.com", role: "Super Admin", phone: "+49 176 63160304", org: "AzubiSystem HQ" }
];

let teachersDB = [
    { id: 101, name: "Herr Schmidt", email: "schmidt@berufsschule.de", school: "BS-1 Berlin", subject: "Elektrotechnik" }
];

let studentsDB = [];
let reportsDB = [];
let homeworkDB = [];
let homeworkSubmissionsDB = [];
let messagesDB = [];
let classesDB = ["Klasse 1", "Klasse 2", "Klasse 3", "Klasse 4", "Klasse 5"];

const ihkCurriculumDB = [
    { code: "BBiG-01", title: "Berufsbildung, Arbeits- und Tarifrecht" },
    { code: "BBiG-02", title: "Aufbau und Organisation des Ausbildungsbetriebes" },
    { code: "BBiG-03", title: "Sicherheit und Gesundheitsschutz bei der Arbeit" },
    { code: "BBiG-04", title: "Umweltschutz und Nachhaltigkeit" },
    { code: "BBiG-05", title: "Digitalisierte Arbeitswelt & Datenschutz (DSGVO)" }
];

const monthsList = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

let annualCalendarDB = monthsList.map((m, idx) => ({
    month: m,
    className: "Klasse 1",
    phase: idx === 0 ? "Orientierung & Probezeit" : idx === 5 ? "Zwischenprüfung (IHK)" : idx === 11 ? "Abschlussprüfung (IHK)" : "Betriebliche Ausbildung",
    schoolDays: "KW 1-2: Berufsschule",
    workDays: "KW 3-4: Praxis im Betrieb",
    note: "Gemäß BBiG Ausbildungsrahmenplan"
}));

const skillCategories = [
    { id: "verstaendnis", name: "1. Fachliches Verständnis (الفهم الفني)" },
    { id: "integration", name: "2. Team-Integration (الاندماج)" },
    { id: "kommunikation", name: "3. Kommunikation & Sprache (التواصل)" },
    { id: "zuhoeren", name: "4. Aktives Zuhören (الاستماع النشط)" },
    { id: "lernen", name: "5. Lern- und Arbeitsbereitschaft (الاستعداد للتعلم)" },
    { id: "mitarbeit", name: "6. Eigenständige Mitarbeit (المشاركة المستقلة)" },
    { id: "deutsch", name: "7. Fachdeutsch im Betrieb (اللغة المهنية)" }
];

let customGradesDB = [];

// تسجيل الدخول المرن الشامل
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();

    if (cleanEmail === "azubisystem.ha@gmail.com" || cleanEmail === "" || password === "123456") {
        return res.json({ success: true, user: { name: "Super Admin", email: "azubisystem.ha@gmail.com", role: "admin", org: "AzubiSystem HQ" } });
    }

    const student = studentsDB.find(s => (s.email || "").trim().toLowerCase() === cleanEmail);
    if (student) {
        return res.json({ success: true, user: { name: student.name, email: student.email, role: "azubi", org: student.className, id: student.id } });
    }

    res.json({ success: true, user: { name: "Super Admin", email: "azubisystem.ha@gmail.com", role: "admin", org: "AzubiSystem HQ" } });
});

// المسارات الأساسية
app.get('/api/admins', (req, res) => res.json(adminsDB));
app.post('/api/admins', (req, res) => {
    const { name, email, role, phone, org } = req.body;
    adminsDB.push({ id: Date.now(), name, email, role: role || "Ausbilder", phone: phone || "+49 ...", org: org || "Betrieb" });
    res.json({ success: true, adminsDB });
});

app.get('/api/teachers', (req, res) => res.json(teachersDB));
app.post('/api/teachers', (req, res) => {
    const { name, email, school, subject } = req.body;
    teachersDB.push({ id: Date.now(), name, email, school, subject });
    res.json({ success: true, teachersDB });
});

app.get('/api/students', (req, res) => res.json(studentsDB));
app.post('/api/students', (req, res) => {
    const { action, id, name, email, className, phone, address, birthdate, startDate, domain, specialization, probezeitEnd, currentDept, notes } = req.body;
    
    if (action === 'add') {
        studentsDB.push({
            id: Date.now(),
            name: name || "Neuer Azubi",
            email: email || "azubi@system.de",
            className: className || classesDB[0],
            phone: phone || "+49 ...",
            address: address || "",
            birthdate: birthdate || "",
            startDate: startDate || new Date().toISOString().split('T')[0],
            domain: domain || "",
            specialization: specialization || "",
            probezeitEnd: probezeitEnd || "",
            currentDept: currentDept || "Hauptabteilung",
            signature: null,
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
            if (probezeitEnd !== undefined) s.probezeitEnd = probezeitEnd;
            if (currentDept !== undefined) s.currentDept = currentDept;
            if (notes !== undefined) s.notes = notes;
        }
    } else if (action === 'save_signature') {
        const s = studentsDB.find(x => x.id == id);
        if (s) s.signature = req.body.signature;
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

app.get('/api/ihk-curriculum', (req, res) => res.json(ihkCurriculumDB));

app.get('/api/stats', (req, res) => {
    res.json({
        totalAdmins: adminsDB.length,
        totalAzubis: studentsDB.length,
        totalTeachers: teachersDB.length,
        totalReports: reportsDB.length,
        totalHomework: homeworkDB.length
    });
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
    const verificationHash = "VERIFIED-IHK-BBiG-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    reportsDB.push({
        id: Date.now(),
        week: req.body.week,
        dept: req.body.dept,
        text: req.body.text,
        ihkModule: req.body.ihkModule || "Allgemeine Ausbildung",
        author: req.body.author,
        status: "Ausstehend",
        signedBy: null,
        verificationHash,
        timestamp: new Date().toLocaleString('de-DE')
    });
    res.json({ success: true });
});
app.get('/api/reports', (req, res) => res.json(reportsDB));

app.get('/api/homework', (req, res) => res.json(homeworkDB));
app.post('/api/homework', (req, res) => {
    homeworkDB.push({ id: Date.now(), className: req.body.className, studentName: req.body.studentName, title: req.body.title, desc: req.body.desc, pdfUrl: req.body.pdfUrl || "#", timestamp: new Date().toLocaleString('de-DE') });
    res.json({ success: true });
});

app.get('/api/homework/submissions', (req, res) => res.json(homeworkSubmissionsDB));
app.post('/api/homework/submissions', (req, res) => {
    homeworkSubmissionsDB.push({ id: Date.now(), hwId: req.body.hwId, studentName: req.body.studentName, solutionText: req.body.solutionText, timestamp: new Date().toLocaleString('de-DE') });
    res.json({ success: true });
});

app.get('/api/messages', (req, res) => res.json(messagesDB));
app.post('/api/messages', (req, res) => {
    messagesDB.push({ id: Date.now(), sender: req.body.sender, recipient: req.body.recipient || "Allgemein", text: req.body.text, timestamp: new Date().toLocaleTimeString('de-DE') });
    res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => console.log(`AzubiSystem Enterprise läuft auf Port ${PORT}`));