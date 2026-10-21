const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// قاعدة البيانات الحقيقية للمستخدمين
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

// التحقق الصارم من البريد الإلكتروني
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

// إحصائيات النظام الحقيقية
app.get('/api/stats', (req, res) => {
    const azubiCount = usersDB.filter(u => u.role === 'azubi').length;
    res.json({
        totalUsers: usersDB.length,
        totalAzubis: azubiCount,
        totalReports: reportsDB.length,
        totalHomework: homeworkDB.length
    });
});

// التقارير والتوقيع الرقمي
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