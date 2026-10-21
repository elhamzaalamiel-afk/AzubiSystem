import random
import tkinter as tk

# 1. إنشاء النافذة الرئيسية
root = tk.Tk()
root.title("Schere, Stein, Papier")
root.geometry("450x450")
root.config(bg="#ffc0cb")  # خلفية وردية

options = ["Schere", "Stein", "Papier"]

# العدادات الحالية للنقاط
user_score = 0
computer_score = 0

# 2. منطق اللعبة
def play(user_choice):
    global user_score, computer_score
    
    computer_choice = random.choice(options)
    
    if user_choice == computer_choice:
        result = "Unentschieden! 🤝"
    elif (user_choice == "Stein" and computer_choice == "Schere") or \
         (user_choice == "Papier" and computer_choice == "Stein") or \
         (user_choice == "Schere" and computer_choice == "Papier"):
        result = "Gewonnen! 🎉"
        user_score += 1
    else:
        result = "Verloren! 🤖"
        computer_score += 1

    # تحديث النصوص للنقاط والاختيارات
    label_choices.config(text=f"Deine Wahl: {user_choice}\nComputer: {computer_choice}")
    label_result.config(text=result)
    label_score.config(text=f"Du: {user_score}  |  Computer: {computer_score}")

# دالة إعادة ضبط النقاط
def reset_game():
    global user_score, computer_score
    user_score = 0
    computer_score = 0
    label_choices.config(text="")
    label_result.config(text="Neues Spiel!")
    label_score.config(text="Du: 0  |  Computer: 0")

# 3. عناصر الواجهة (UI)

# العنوان
title_label = tk.Label(root, text="Schere ✂️ Stein 🪨 Papier 📄", font=("Arial", 16, "bold"), fg="#8b008b", bg="#ffc0cb")
title_label.pack(pady=10)

# لوحة النقاط
score_frame = tk.Frame(root, bg="#ff69b4", padx=15, pady=5)
score_frame.pack(pady=5)

label_score_title = tk.Label(score_frame, text="PUNKTESTAND", font=("Arial", 10, "bold"), fg="white", bg="#ff69b4")
label_score_title.pack()

label_score = tk.Label(score_frame, text="Du: 0  |  Computer: 0", font=("Arial", 14, "bold"), fg="white", bg="#ff69b4")
label_score.pack()

# الأزرار بألوان مختلفة
btn_frame = tk.Frame(root, bg="#ffc0cb")
btn_frame.pack(pady=15)

# زر الحجر (رمادي)
btn_rock = tk.Button(btn_frame, text="🪨\nStein", font=("Arial", 12, "bold"), width=8, bg="#708090", fg="white", command=lambda: play("Stein"))
btn_rock.grid(row=0, column=0, padx=8)

# زر الورقة (أخضر)
btn_paper = tk.Button(btn_frame, text="📄\nPapier", font=("Arial", 12, "bold"), width=8, bg="#2e8b57", fg="white", command=lambda: play("Papier"))
btn_paper.grid(row=0, column=1, padx=8)

# زر المقص (برتقالي)
btn_scissors = tk.Button(btn_frame, text="✂️\nSchere", font=("Arial", 12, "bold"), width=8, bg="#ff8c00", fg="white", command=lambda: play("Schere"))
btn_scissors.grid(row=0, column=2, padx=8)

# إظهار النتائج
label_choices = tk.Label(root, text="", font=("Arial", 12), fg="#4a0033", bg="#ffc0cb")
label_choices.pack(pady=10)

label_result = tk.Label(root, text="Wähle eine Option!", font=("Arial", 14, "bold"), fg="#c71585", bg="#ffc0cb")
label_result.pack(pady=5)

# زر إعادة التعيين
btn_reset = tk.Button(root, text="🔄 Spiel zurücksetzen", font=("Arial", 10), bg="#db7093", fg="white", command=reset_game)
btn_reset.pack(pady=15)

# 4. تشغيل التطبيق
root.mainloop()