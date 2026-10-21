const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// منع تخزين الكاش القديم بالكامل
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

app.use(express.static(path.join(__dirname)));

// قاعدة بيانات المستخدمين
let usersDB = [
    {
        name: "Super Admin",
        email: "azubisystem.ha@gmail.com",
        password: "123456",
        org: "AzubiSystem Hauptverwaltung",
        role: "admin",
        code: "ADMIN-MASTER"
    }
];

let reportsDB = [];
let homeworkDB = [];
let messagesDB = [];

// إنشاء تقويم سنوي كامل لـ 12 شهراً
const monthsList = [
    "Januar", "Februar", "März", "April", "Mai", "Juni", 
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];

let annualCalendarDB = monthsList.map((m, idx) => ({
    month: m,
    schoolDays: `KW ${idx*4 + 1}-${idx*4 + 2}: Mo & Mi`,
    workDays: `KW ${idx*4 + 3}-${idx*4 + 4}: Di, Do, Fr`,
    note: idx === 0 ? "Start Orientierung" : idx === 5 ? "Zwischenprüfung" : "Regelbetrieb"
}));

// إنشاء خريطة مهارات تقويمية لـ 52 أسبوعاً مقسمة 4 أسابيع لكل شهر
let skillMatrixDB = [];
monthsList.forEach((month, mIdx) => {
    for (let w = 1; w <= 4; w++) {
        const weekNum = mIdx * 4 + w;
        skillMatrixDB.push({
            month: month,
            week: `KW ${weekNum}`,
            weekInMonth: `Woche ${w}`,
            skill: weekNum === 1 ? "HTML & Webstandards" : weekNum === 2 ? "JavaScript Basics" : weekNum === 3 ? "DSGVO & Datenschutz" : "Grundlagen Fachinformatik",
            grade: weekNum === 1 ? 2 : weekNum === 2 ? 1 : 3,
            remark: weekNum === 1 ? "Gut / جيد جداً" : weekNum === 2 ? "Sehr gut / ممتاز" : "Befriedigend / جيد"
        });
    }
});

// تسجيل الدخول
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    const user = usersDB.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());

    if (!user) {
        return res.json({ success: false, message: "E-Mail ist nicht im System registriert / البريد غير مسجل." });
    }
    if (user.password !== password) {
        return res.json({ success: false, message: "Falsches Passwort / كلمة المرور غير صحيحة." });
    }
    if (user.role !== role) {
        return res.json({ success: false, message: "Unzulässige Rolle / الصلاحية غير متطابقة." });
    }

    res.json({ success: true, user: { name: user.name, email: user.email, role: user.role, org: user.org } });
});

app.get('/api/users', (req, res) => res.json(usersDB));

app.post('/api/users', (req, res) => {
    const { name, email, password, org, role } = req.body;
    if (usersDB.some(u => u.email.toLowerCase().trim() === email.toLowerCase().trim())) {
        return res.json({ success: false, message: "E-Mail existiert bereits." });
    }

    const newUser = {
        name,
        email,
        password: password || "123456",
        org: org || "Betrieb / Schule",
        role: role.toLowerCase().includes('azubi') ? 'azubi' : 'admin',
        code: "AZUBI-" + Math.floor(1000 + Math.random() * 9000)
    };

    usersDB.push(newUser);
    res.json({ success: true, user: newUser });
});

app.get('/api/stats', (req, res) => {
    const azubiCount = usersDB.filter(u => u.role === 'azubi').length;
    res.json({
        totalUsers: usersDB.length,
        totalAzubis: azubiCount,
        totalReports: reportsDB.length,
        totalHomework: homeworkDB.length
    });
});

// المهارات والأستبيان الألماني
app.get('/api/skills', (req, res) => res.json(skillMatrixDB));
app.post('/api/skills', (req, res) => {
    const { week, skill, grade, remark } = req.body;
    const entry = skillMatrixDB.find(s => s.week === week);
    if (entry) {
        entry.skill = skill;
        entry.grade = parseInt(grade);
        entry.remark = remark;
    } else {
        skillMatrixDB.push({ month: "Zusätzlich", week, weekInMonth: "Extra", skill, grade: parseInt(grade), remark });
    }
    res.json({ success: true, skills: skillMatrixDB });
});

// التقويم السنوي الكامل
app.get('/api/calendar/annual', (req, res) => res.json(annualCalendarDB));
app.post('/api/calendar/annual', (req, res) => {
    const { month, schoolDays, workDays, note } = req.body;
    const existing = annualCalendarDB.find(c => c.month === month);
    if (existing) {
        existing.schoolDays = schoolDays;
        existing.workDays = workDays;
        existing.note = note;
    }
    res.json({ success: true, calendar: annualCalendarDB });
});

// التقارير
app.post('/api/reports', (req, res) => {
    const { week, dept, text, author } = req.body;
    const newReport = {
        id: Date.now(),
        week,
        dept,
        text,
        author,
        status: "Ausstehend",
        signedBy: null,
        timestamp: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
    };
    reportsDB.push(newReport);
    res.json({ success: true, report: newReport });
});

app.get('/api/reports', (req, res) => res.json(reportsDB));

app.post('/api/reports/approve', (req, res) => {
    const { reportId, adminName } = req.body;
    const report = reportsDB.find(r => r.id === reportId);
    if (report) {
        report.status = "Genehmigt 🗸";
        report.signedBy = adminName;
        return res.json({ success: true, report });
    }
    res.json({ success: false, message: "Fehler." });
});

// الرسائل
app.get('/api/messages', (req, res) => res.json(messagesDB));
app.post('/api/messages', (req, res) => {
    const { sender, recipient, text } = req.body;
    const newMsg = {
        id: Date.now(),
        sender,
        recipient: recipient || "Allgemein",
        text,
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    };
    messagesDB.push(newMsg);
    res.json({ success: true, message: newMsg });
});

// الواجبات
app.post('/api/homework', (req, res) => {
    const { title, desc } = req.body;
    const newHw = {
        id: Date.now(),
        title,
        desc,
        timestamp: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
    };
    homeworkDB.push(newHw);
    res.json({ success: true, homework: newHw });
});

app.get('/api/homework', (req, res) => res.json(homeworkDB));

app.listen(PORT, '0.0.0.0', () => console.log(`AzubiSystem läuft auf Port ${PORT}`));