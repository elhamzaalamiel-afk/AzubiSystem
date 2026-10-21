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
let homeworkSubmissionsDB = [];
let messagesDB = [];

const monthsList = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

let annualCalendarDB = monthsList.map((m, idx) => ({
    month: m,
    phase: idx === 0 ? "Orientierung" : idx === 5 ? "Betriebsprüfung" : "Betrieb",
    schoolDays: "KW 1-2: Berufsschule",
    workDays: "KW 3-4: Praxis",
    note: "Regulärer Betrieb"
}));

const skillCategories = [
    { id: "verstaendnis", name: "1. التفاهم (Verständnis)" },
    { id: "integration", name: "2. الاندماج (Integration)" },
    { id: "kommunikation", name: "3. التواصل (Kommunikation)" },
    { id: "zuhoeren", name: "4. الاستماع (Zuhören)" },
    { id: "lernen", name: "5. التعلم (Lernen)" },
    { id: "mitarbeit", name: "6. المشاركة (Mitarbeit)" },
    { id: "deutsch", name: "7. اللغة الألمانية (Deutsch als Zweitsprache)" }
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
    if (existing) { existing.grade = grade; } else { customGradesDB.push({ categoryId, week, grade }); }
    res.json({ success: true, customGradesDB });
});

app.get('/api/calendar/annual', (req, res) => res.json(annualCalendarDB));
app.post('/api/calendar/annual', (req, res) => {
    const { month, phase, schoolDays, workDays, note } = req.body;
    const existing = annualCalendarDB.find(c => c.month === month);
    if (existing) {
        existing.phase = phase || existing.phase;
        existing.schoolDays = schoolDays || existing.schoolDays;
        existing.workDays = workDays || existing.workDays;
        existing.note = note || existing.note;
    }
    res.json({ success: true, calendar: annualCalendarDB });
});

app.post('/api/reports', (req, res) => {
    reportsDB.push({ id: Date.now(), week: req.body.week, dept: req.body.dept, text: req.body.text, author: req.body.author, status: "Ausstehend", signedBy: null, timestamp: new Date().toLocaleString('de-DE') });
    res.json({ success: true });
});
app.get('/api/reports', (req, res) => res.json(reportsDB));
app.post('/api/reports/approve', (req, res) => {
    const r = reportsDB.find(x => x.id === req.body.reportId);
    if (r) { r.status = "Genehmigt 🗸"; r.signedBy = req.body.adminName; }
    res.json({ success: true });
});

app.get('/api/homework', (req, res) => res.json(homeworkDB));
app.post('/api/homework', (req, res) => {
    homeworkDB.push({ id: Date.now(), title: req.body.title, desc: req.body.desc, pdfUrl: req.body.pdfUrl || "#", timestamp: new Date().toLocaleString('de-DE') });
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

app.listen(PORT, '0.0.0.0', () => console.log(`Server läuft auf Port ${PORT}`));