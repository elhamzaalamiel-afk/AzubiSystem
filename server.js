const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(__dirname));

// حساب المسؤول الرئيسي (Super Admin) مرتبط بإيميلك الشخصي الصحيح
let users = [
    { email: 'azubisystem.ha@gmail.com', password: 'password123', role: 'Super Admin', name: 'Super Admin' }
];

// تخزين أكواد المتدربين المرتبطة بإيميلاتهم بشكل آمن
let generatedCodes = {}; 

// نقطة نهاية تسجيل الدخول مع التحقق من الأدوار والبريد
app.post('/api/login', (req, res) => {
    const { email, password, role, code } = req.body;

    if (role === 'Super Admin') {
        const admin = users.find(u => u.email === email && u.password === password && u.role === 'Super Admin');
        if (admin) {
            return res.json({ success: true, role: 'Super Admin', name: admin.name });
        }
        return res.status(401).json({ success: false, message: 'بيانات المسؤول غير صحيحة' });
    } 
    
    if (role === 'Azubi') {
        if (code && generatedCodes[code] && generatedCodes[code].email === email) {
            return res.json({ success: true, role: 'Azubi', name: generatedCodes[code].name });
        }
        return res.status(401).json({ success: false, message: 'كود المتدرب أو البريد الإلكتروني غير صحيح' });
    }

    res.status(400).json({ success: false, message: 'دور غير معروف' });
});

// نقطة نهاية لتوليد كود للمتدرب بواسطة الـ Admin
app.post('/api/generate-code', (req, res) => {
    const { name, email } = req.body;
    const code = 'AZUBI-' + Math.floor(1000 + Math.random() * 9000);
    generatedCodes[code] = { name, email };
    res.json({ success: true, code, name, email });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});