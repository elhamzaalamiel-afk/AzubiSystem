const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const DB_FILE = path.join(__dirname, 'db.json');

// دالة لقراءة البيانات
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], attendance: [] }, null, 2));
  }
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
}

// دالة لحفظ البيانات
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// نقطة اختبار للتحقق من عمل النظام
app.get('/', (req, res) => {
  res.send('مرحباً بك، نظام AzubiSystem يعمل بكفاءة وبدون أخطاء!');
});

// مسار لتسجيل المستخدمين أو المتدربين
app.post('/api/users', (req, res) => {
  const db = readDB();
  const newUser = { id: Date.now(), ...req.body };
  db.users.push(newUser);
  writeDB(db);
  res.json({ message: 'تم إضافة المستخدم بنجاح!', user: newUser });
});

// مسار لجلب جميع المستخدمين
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل الآن على المنفذ: http://localhost:${PORT}`);
});