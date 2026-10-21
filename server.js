const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// قاعدة البيانات الرئيسية
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

// تقويم سنوي تفاعلي للتغيير والجدولة
let annualCalendarDB = [
    { month: "Januar", schoolDays: "KW 1-4: Mo & Mi", workDays: "KW 1-4: Di, Do, Fr", note: "Start Orientierungsphase" },
    { month: "Februar", schoolDays: "KW 5-8: Mo & Mi", workDays: "KW 5-8: Di, Do, Fr", note: "Zwischenprojekt" }
];

// خريطة المهارات بالدرجات الألمانية من 1 إلى 6
let skillMatrixDB = [
    { week: "Woche 1", skill: "HTML & Webstandards", grade: 2, remark: "Gut / جيد جداً" },
    { week: "Woche 2", skill: "JavaScript Basics", grade: 1, remark: "Sehr gut / ممتاز" },
    { week: "Woche 3", skill: "Datenschutz (DSGVO)", grade: 3, remark: "Befriedigend / جيد" }
];

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

// إدارة المهارات والتنقيط الألماني
app.get('/api/skills', (req, res) => res.json(skillMatrixDB));
app.post('/api/skills', (req, res) => {
    const { week, skill, grade, remark } = req.body;
    const newEntry = { week, skill, grade: parseInt(grade), remark };
    skillMatrixDB.push(newEntry);
    res.json({ success: true, skills: skillMatrixDB });
});

// إدارة التقويم السنوي
app.get('/api/calendar/annual', (req, res) => res.json(annualCalendarDB));
app.post('/api/calendar/annual', (req, res) => {
    const { month, schoolDays, workDays, note } = req.body;
    const existing = annualCalendarDB.find(c => c.month === month);
    if (existing) {
        existing.schoolDays = schoolDays;
        existing.workDays = workDays;
        existing.note = note;
    } else {
        annualCalendarDB.push({ month, schoolDays, workDays, note });
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