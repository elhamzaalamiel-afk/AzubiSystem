const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// قاعدة البيانات المحدثة
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
let calendarSettingsDB = {
    schoolDays: "Montag, Mittwoch",
    companyDays: "Dienstag, Donnerstag, Freitag"
};

// تسجيل الدخول
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    const user = usersDB.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());

    if (!user) {
        return res.json({ success: false, message: "E-Mail ist nicht im System registriert / البريد غير مسجل بالنظام." });
    }
    if (user.password !== password) {
        return res.json({ success: false, message: "Falsches Passwort / كلمة المرور غير صحيحة." });
    }
    if (user.role !== role) {
        return res.json({ success: false, message: "Unzulässige Rolle / الصلاحية غير متطابقة." });
    }

    res.json({ success: true, user: { name: user.name, email: user.email, role: user.role, org: user.org } });
});

app.get('/api/users', (req, res) => {
    res.json(usersDB);
});

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

// إحصائيات النظام
app.get('/api/stats', (req, res) => {
    const azubiCount = usersDB.filter(u => u.role === 'azubi').length;
    res.json({
        totalUsers: usersDB.length,
        totalAzubis: azubiCount,
        totalReports: reportsDB.length,
        totalHomework: homeworkDB.length
    });
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

app.get('/api/reports', (req, res) => {
    res.json(reportsDB);
});

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

// إعدادات التقويم
app.get('/api/calendar', (req, res) => {
    res.json(calendarSettingsDB);
});

app.post('/api/calendar', (req, res) => {
    const { schoolDays, companyDays } = req.body;
    if (schoolDays) calendarSettingsDB.schoolDays = schoolDays;
    if (companyDays) calendarSettingsDB.companyDays = companyDays;
    res.json({ success: true, settings: calendarSettingsDB });
});

// المراسلات والمحادثات الموجهة
app.get('/api/messages', (req, res) => {
    res.json(messagesDB);
});

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

app.get('/api/homework', (req, res) => {
    res.json(homeworkDB);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`AzubiSystem läuft auf Port ${PORT}`);
});