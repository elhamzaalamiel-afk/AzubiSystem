const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// خدمة الملفات الثابتة من المجلد الحالي
app.use(express.static(path.join(__dirname)));

// قاعدة بيانات وهمية مركزية آمنة (يمكن ربطها بقاعدة بيانات حقيقية لاحقاً)
let usersDB = [
    {
        email: "azubisystem.ha@gmail.com",
        password: "123456", // يمكن للمسؤول تغييرها
        role: "admin",
        name: "Super Admin",
        org: "AzubiSystem Hauptverwaltung"
    }
];

let reportsDB = [];
let homeworkDB = [];
let chatDB = [];

// مسار تسجيل الدخول والتحقق الصارم من البريد الإلكتروني
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    
    // البحث عن المستخدم بالبريد الإلكتروني حصرياً
    const user = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return res.status(401).json({ success: false, message: "E-Mail nicht im System registriert. (البريد الإلكتروني غير مسجل في النظام)" });
    }

    // التحقق من كلمة المرور
    if (user.password !== password) {
        return res.status(401).json({ success: false, message: "Falsches Passwort. (كلمة المرور غير صحيحة)" });
    }

    // التحقق من تطابق الصلاحية
    if (user.role !== role) {
        return res.status(403).json({ success: false, message: "Unzulässige Rolle für diesen Benutzer. (صلاحية غير متطابقة مع هذا البريد)" });
    }

    res.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
});

// مسار إضافة مستخدم جديد وتوليد بياناته
app.post('/api/users', (req, res) => {
    const { name, email, org, role, password } = req.body;
    
    if (usersDB.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: "E-Mail existiert bereits." });
    }

    const newUser = {
        name,
        email,
        org,
        role: role.toLowerCase().includes('azubi') ? 'azubi' : 'admin',
        password: password || "123456" // كلمة سر افتراضية للمستخدم الجديد يمكنه تغييرها
    };

    usersDB.push(newUser);
    res.json({ success: true, user: newUser });
});

// مسار حفظ التقارير مع التاريخ والوقت تلقائياً (Timestamp)
app.post('/api/reports', (req, res) => {
    const { week, dept, text, author } = req.body;
    const newReport = {
        id: Date.now(),
        week,
        dept,
        text,
        author,
        timestamp: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }) // التاريخ والوقت بتوقيت ألمانيا تلقائياً
    };
    reportsDB.push(newReport);
    res.json({ success: true, report: newReport });
});

app.get('/api/reports', (req, res) => {
    res.json(reportsDB);
});

// مسار الواجبات مع التاريخ والوقت
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

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`AzubiSystem läuft sicher auf Port ${PORT}`);
});