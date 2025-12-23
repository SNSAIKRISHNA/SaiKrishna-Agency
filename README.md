````markdown
# 🧾 SaiKrishna-Agency

A **GST Invoice Generator Web Application** built with **React** that allows users to create tax-compliant invoices and download them as high-quality PDFs.

This project focuses on **real-world billing logic**, including accurate GST calculation, auto-generated invoice numbers, and clean invoice formatting.

---

## ✨ Key Features

- ✅ GST-compliant invoice generation  
- ✅ Multiple item support (Qty, Price, GST %)  
- ✅ Automatic **Invoice Number Generation**  
- ✅ Persistent invoice numbers using `localStorage`  
- ✅ High-resolution **PDF export** (html2canvas + jsPDF)  
- ✅ Clean & professional invoice layout  
- ✅ Accurate subtotal, GST & grand total calculation  

---

## 🛠 Tech Stack

| Technology | Purpose |
|----------|---------|
| **React** | Frontend UI & state management |
| **JavaScript** | Core logic |
| **html2canvas** | Capture invoice DOM |
| **jsPDF** | Generate downloadable PDF |
| **CSS** | Styling & layout |

---

## ⚙️ How It Works

1. Enter **Bill To**, **Place of Supply**, and **Date**
2. Add invoice items with quantity, price, and GST %
3. Click **Download PDF**
4. Invoice number is auto-generated
5. A **PDF invoice** is downloaded instantly
6. Invoice numbers increment automatically for each download

---

## 📄 PDF Generation Logic

```js
const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
const pdf = new jsPDF("p", "pt", "a4");
const width = pdf.internal.pageSize.getWidth();
const height = (canvas.height * width) / canvas.width;

pdf.addImage(canvas, "PNG", 0, 0, width, height);
pdf.save(`${details.invoiceNo}.pdf`);
````

---

## 📁 Project Structure

```
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
```

---

## 🚀 Installation & Setup

```bash
git clone https://github.com/SNSAIKRISHNA/SaiKrishna-Agency.git
cd SaiKrishna-Agency
npm install
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## 👨‍💻 Developer

**Saikrishna S.N**
📧 Email: **[saikrishnasn@outlook.com](mailto:saikrishnasn@outlook.com)**

---

## 🤝 Contributor

**Yaswanth Kumar V**
📧 Email: **[kumaryaswanth769@mail.com](mailto:kumaryaswanth769@mail.com)**

---

## 📜 License

This project is open-source and intended for **learning and development purposes**.

---
```
