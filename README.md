# SaiKrishna-Agency 

A modern **GST Invoice Generator Web Application** built using **React**.  
This project allows users to create GST-compliant tax invoices with accurate calculations, auto-generated invoice numbers, and **direct PDF download** functionality.

---

## 📌 Features

✔ GST-compliant invoice generation  
✔ Add multiple items with quantity, price & GST percentage  
✔ Auto-generated **Invoice Numbers** (persistent across sessions)  
✔ High-quality **PDF download** using html2canvas & jsPDF  
✔ Clean and professional invoice layout  
✔ Easy-to-use UI for real-world billing  
✔ Accurate subtotal, GST, and grand total calculation  

---

## 🧰 Tech Stack

| Technology | Usage |
|----------|------|
| React | Frontend UI & state management |
| JavaScript | Core logic |
| html2canvas | Capture invoice DOM |
| jsPDF | Generate downloadable PDF |
| CSS,Tailwind| Styling & layout |

---

## ⚙️ How the Application Works

1. Enter invoice details such as **Bill To**, **Place of Supply**, and **Date**
2. Add one or more invoice items
3. Each item includes quantity, price, and GST percentage
4. Click **Download PDF**
5. An invoice number is auto-generated and a **PDF invoice is downloaded**
6. Invoice numbers increment automatically 

---
📁 Project Structure
src/
 ├─ App.jsx
 ├─ App.css
 ├─ Components/
 │   ├─ Header.jsx
 │   ├─ Invoice.jsx
 │   ├─ InvoiceDetails.jsx
 │   └─ ItemsEditor.jsx
 ├─ main.jsx
package.json

---

## PDF Generation Logic

```The invoice PDF is generated using html2canvas and jsPDF, capturing only the invoice section:

const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
const pdf = new jsPDF("p", "pt", "a4");
const w = pdf.internal.pageSize.getWidth();
const h = (canvas.height * w) / canvas.width;

pdf.addImage(canvas, "PNG", 0, 0, w, h);
pdf.save(`${details.invoiceNo}.pdf`);


----

## 🚀 Installation & Setup

### Clone the repository
```bash
git clone https://github.com/SNSAIKRISHNA/SaiKrishna-Agency.git
cd SaiKrishna-Agency

Install dependencies
npm install

Start the development server
npm run dev

----
👨‍💻 Developer

Name: Saikrishna S.N
📧 Email: saikrishnasn@outlook.com

🤝 Contributor

Name: Yaswanth Kumar V
📧 Email: kumaryaswanth769@mail.com

📜 License

This project is open-source and free to use for learning and development purposes.
---


