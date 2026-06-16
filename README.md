# DataQ 📊

> **A local-first, zero-backend ETL platform for cleaning, transforming, and merging datasets directly in your browser.**

DataQ is a powerful, client-side dataset diagnostics and preparation tool built with Next.js. It allows users to upload raw data (CSV/Excel), automatically analyzes it for data quality issues, and provides a visual node-based pipeline to apply transformations (ETL) without writing a single line of code. Because it runs entirely in the browser using Web Workers and IndexedDB, your data remains 100% private and never touches an external server.

---

## ✨ Key Features

- **🛡️ Zero-Backend Privacy:** All data processing, storage (IndexedDB), and transformations happen locally on your machine.
- **📈 Diagnostics Engine:** Automatically scans datasets for null values, duplicates, outliers, and mixed data types, generating a comprehensive "Quality Score".
- **🧩 Visual ETL Pipeline:** Drag-and-drop transformation blocks (`Drop Nulls`, `Uppercase`, `Trim`, `Drop Duplicates`, etc.) to clean data sequentially.
- **⋈ Dataset Merging:** Perform SQL-like Joins (Inner, Left, Full Outer) visually between multiple uploaded datasets.
- **💾 History & Recipes:** Save your transformation pipelines as reusable "Recipes" to automate the cleaning of recurring reports.
- **🌍 Internationalization:** Full support for English, Portuguese (PT-BR), and Spanish, seamlessly switchable in the UI.
- **🌗 Elegant UI/UX:** A stunning, highly responsive interface with dark/light mode, smooth animations, and parallax backgrounds.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Vanilla CSS + Tailwind CSS (hybrid approach for maximum customizability)
- **Icons:** Lucide React
- **Data Parsing:** PapaParse (CSV), XLSX (Excel)
- **Local Storage:** Dexie.js (IndexedDB wrapper)
- **Drag & Drop:** dnd-kit

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v18+) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/dataq.git
   cd dataq/web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📚 Documentation (Wiki)

DataQ includes a built-in documentation Wiki inside the application. Simply run the project and navigate to the **"Learn"** (Aprender) tab in the header to access detailed explanations of every transformation, metric, and feature available in the platform.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with precision and a focus on UX for data professionals.*
