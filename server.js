const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// قاعدة البيانات المعتمدة في النظام
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

// تأكيد الدخول الصارم: يتيح الدخول فقط للإيميلات المدرجة في النظام
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    
    // البحث عن الإيميل في قاعدة البيانات
    const user = usersDB.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());

    if (!user) {
        return res.json({ 
            success: false, 
            message: "البريد الإلكتروني غير مدرج في النظام! يرجى التواصل مع Admin للترخيص." 
        });
    }

    if (user.password !== password) {
        return res.json({ success: false, message: "كلمة المرور غير صحيحة!" });
    }

    if (user.role !== role) {
        return res.json({ success: false, message: "الصلاحية المحددة لا تتوافق مع نوع حسابك." });
    }

    res.json({ 
        success: true, 
        user: { name: user.name, email: user.email, role: user.role, org: user.org } 
    });
});

// جلب وتنسيق المستخدمين
app.get('/api/users', (req, res) => {
    res.json(usersDB);
});

// تسجيل مستخدم جديد مع توليد كود دخول تلقائي
app.post('/api/users', (req, res) => {
    const { name, email, password, org, role } = req.body;
    
    if (usersDB.some(u => u.email.toLowerCase().trim() === email.toLowerCase().trim())) {
        return res.json({ success: false, message: "البريد الإلكتروني مسجل بالفعل!" });
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

// التقارير والتاريخ التلقائي (Europe/Berlin)
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

// تشغيل السيرفر التوافقي مع Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`AzubiSystem läuft auf Port ${PORT}`);
});