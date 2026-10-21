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

let usersDB = [{ name: "Super Admin", email: "azubisystem.ha@gmail.com", password: "123456", org: "AzubiSystem", role: "admin", code: "ADMIN-MASTER" }];
let reportsDB = [];
let homeworkDB = [];
let messagesDB = [];

const monthsList = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

let annualCalendarDB = monthsList.map((m, idx) => ({
    month: m,
    schoolDays: `KW ${idx*4 + 1}-${idx*4 + 2}: Mo & Mi`,
    workDays: `KW ${idx*4 + 3}-${idx*4 + 4}: Di, Do, Fr`,
    note: idx === 0 ? "Start Orientierung" : idx === 5 ? "Zwischenprüfung" : "Regelbetrieb"
}));

// الجداول المستقلة للمهارات (فارغة تماماً من 1 إلى 6 ليملأها المسؤول)
const skillCategories = [
    { id: "understanding", name: "1. التفاهم والاندماج / Verständnis & Integration" },
    { id: "communication", name: "2. التواصل / Kommunikation" },
    { id: "listening", name: "3. الاستماع والتعلم / Zuhören & Lernen" },
    { id: "participation", name: "4. المشاركة والتفاعل / Mitarbeit" },
    { id: "german", name: "5. اللغة الألمانية للأجانب / Deutsch als Zweitsprache" }
];

let customGradesDB = [];

app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    const user = usersDB.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (!user || user.password !== password || user.role !== role) {
        return res.json({ success: false, message: "Falsche Anmeldedaten." });
    }
    res.json({ success: true, user: { name: user.name, email: user.email, role: user.role, org: user.org } });
});

app.get('/api/users', (req, res) => res.json(usersDB));
app.post('/api/users', (req, res) => {
    const { name, email, password, org, role } = req.body;
    const newUser = { name, email, password: password || "123456", org: org || "Betrieb", role: role.toLowerCase().includes('azubi') ? 'azubi' : 'admin', code: "AZUBI-" + Math.floor(1000 + Math.random() * 9000) };
    usersDB.push(newUser);
    res.json({ success: true, user: newUser });
});

app.get('/api/stats', (req, res) => {
    res.json({ totalUsers: usersDB.length, totalAzubis: usersDB.filter(u => u.role === 'azubi').length, totalReports: reportsDB.length, totalHomework: homeworkDB.length });
});

app.get('/api/skills/categories', (req, res) => res.json(skillCategories));
app.get('/api/skills/grades', (req, res) => res.json(customGradesDB));
app.post('/api/skills/grades', (req, res) => {
    const { categoryId, week, grade } = req.body;
    const existing = customGradesDB.find(g => g.categoryId === categoryId && g.week === week);
    if (existing) {
        existing.grade = grade;
    } else {
        customGradesDB.push({ categoryId, week, grade });
    }
    res.json({ success: true, customGradesDB });
});

app.get('/api/calendar/annual', (req, res) => res.json(annualCalendarDB));
app.post('/api/calendar/annual', (req, res) => {
    const { month, schoolDays, workDays, note } = req.body;
    const existing = annualCalendarDB.find(c => c.month === month);
    if (existing) { existing.schoolDays = schoolDays; existing.workDays = workDays; existing.note = note; }
    res.json({ success: true, calendar: annualCalendarDB });
});

app.post('/api/reports', (req, res) => {
    const { week, dept, text, author } = req.body;
    reportsDB.push({ id: Date.now(), week, dept, text, author, status: "Ausstehend", signedBy: null, timestamp: new Date().toLocaleString('de-DE') });
    res.json({ success: true });
});
app.get('/api/reports', (req, res) => res.json(reportsDB));
app.post('/api/reports/approve', (req, res) => {
    const r = reportsDB.find(x => x.id === req.body.reportId);
    if (r) { r.status = "Genehmigt 🗸"; r.signedBy = req.body.adminName; }
    res.json({ success: true });
});

app.get('/api/messages', (req, res) => res.json(messagesDB));
app.post('/api/messages', (req, res) => {
    messagesDB.push({ id: Date.now(), sender: req.body.sender, recipient: req.body.recipient || "Allgemein", text: req.body.text, timestamp: new Date().toLocaleTimeString('de-DE') });
    res.json({ success: true });
});

app.post('/api/homework', (req, res) => {
    homeworkDB.push({ id: Date.now(), title: req.body.title, desc: req.body.desc, timestamp: new Date().toLocaleString('de-DE') });
    res.json({ success: true });
});
app.get('/api/homework', (req, res) => res.json(homeworkDB));

app.listen(PORT, '0.0.0.0', () => console.log(`Server läuft auf Port ${PORT}`));