# DataQ — Zero-Backend ETL Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)

DataQ is a modern, client-side dataset diagnostics and ETL (Extract, Transform, Load) platform built to clean, transform, and merge data **entirely in your browser**. 

No servers, no backend processing, and no data leaving your machine. 

## 🚀 Features

- **Zero-Backend Architecture**: All processing happens locally using native Web APIs.
- **Privacy First**: Your CSV and Excel files never touch an external server.
- **Quality Diagnostics Engine**: Automatically scans datasets to detect nulls, duplicates, outliers, and mixed data types, generating a health score.
- **Visual Pipeline Editor**: A drag-and-drop workflow builder to stack non-destructive transformations.
- **Merge & Join Datasets**: Visually combine datasets (Left Join, Inner Join) from your local history.
- **IndexedDB Storage**: Uploaded files and processing history are saved persistently in your browser.
- **Export & Recipes**: Export cleaned data to CSV/XLSX instantly, or save your pipeline logic as a JSON "Recipe" for recurring reports.
- **Internationalization (i18n)**: Fully translated into English, Portuguese (PT-BR), and Spanish.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS & Tailwind CSS (`globals.css`)
- **State Management & Storage**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper) & [Zustand](https://zustand-demo.pmnd.rs/) (Local state)
- **Data Parsing & Export**: `papaparse` (CSV), `xlsx` (Excel)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: `@hello-pangea/dnd`

## 🧠 How It Works

1. **Upload**: You drag a `.csv` or `.xlsx` file into the app. The file is parsed into a JSON array via Web Workers to prevent UI freezing.
2. **Storage**: The dataset is indexed with a UUID and saved into your browser's IndexedDB.
3. **Analysis**: The Diagnostics Engine calculates column statistics and quality scores.
4. **Transform**: You build a Pipeline of transformations (e.g., `Drop Nulls`, `Uppercase`, `Trim`). Each block takes the previous array, processes it in `O(n)` time, and passes it forward.
5. **Download**: The final array is converted back to binary/CSV formats on-the-fly and downloaded natively.

## 🏁 Getting Started

First, clone the repository and navigate to the project directory:

```bash
git clone https://github.com/your-username/dataq.git
cd dataq/web
```

Install the dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to check [issues page](https://github.com/your-username/dataq/issues).

## 📝 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

---
*Crafted with precision for the modern data analyst.*
