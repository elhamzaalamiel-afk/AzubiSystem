const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// قاعدة البيانات المركزية الآمنة
let usersDB = [
    {
        name: "Super Admin",
        email: "azubisystem.ha@gmail.com",
        password: "123456",
        org: "AzubiSystem Hauptverwaltung",
        role: "admin"
    }
];

let reportsDB = [];
let homeworkDB = [];
let chatDB = [];

// تسجيل الدخول الآمن والتحقق الصارم من البريد
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    const user = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return.json({ success: false, message: "E-Mail nicht im System registriert." });
    }
    if (user.password !== password) {
        return.json({ success: false, message: "Falsches Passwort." });
    }
    if (user.role !== role) {
        return.json({ success: false, message: "Unzulässige Rolle für diesen Benutzer." });
    }

    res.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
});

// جلب المستخدمين
app.get('/api/users', (req, res) => {
    res.json(usersDB);
});

// إضافة مستخدم جديد
app.post('/api/users', (req, res) => {
    const { name, email, password, org, role } = req.body;
    if (usersDB.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return.json({ success: false, message: "E-Mail existiert bereits." });
    }

    const newUser = {
        name,
        email,
        password: password || "123456",
        org: org || "Betrieb / Schule",
        role: role.toLowerCase().includes('azubi') ? 'azubi' : 'admin',
        code: "AZUBI-" + Math.floor(1000 + Math.random() * 9000),
        status: "Code Nicht Geändert"
    };

    usersDB.push(newUser);
    res.json({ success: true, user: newUser });
});

// التقارير مع التاريخ والوقت التلقائي
app.post('/api/reports', (req, res) => {
    const { week, dept, text, author } = req.body;
    const newReport = {
        id: Date.now(),
        week,
        dept,
        text,
        author,
        timestamp: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
    };
    reportsDB.push(newReport);
    res.json({ success: true, report: newReport });
});

app.get('/api/reports', (req, res) => {
    res.json(reportsDB);
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

app.listen(PORT, () => {
    console.log(`AzubiSystem läuft auf Port ${PORT}`);
});