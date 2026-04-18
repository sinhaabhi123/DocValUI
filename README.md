# DocVault — Document Management Portal

A single-page **AngularJS 1.8** application for uploading, converting, and sharing documents. Built with a modern dark-themed UI — no backend required (uses `localStorage` for persistence).

---

## Features

| Feature | Description |
|---------|-------------|
| **User Registration & Login** | LocalStorage-based auth with session management |
| **Dashboard** | Stats overview — total docs, uploads, conversions, contributors + recent activity feed |
| **PDF Upload** | Upload PDF files directly; backend returns a `ResponsePdf` confirmation |
| **Excel/Word → PDF Conversion** | Upload `.xlsx`, `.xls`, `.csv`, `.doc`, `.docx` files — they are converted to PDF client-side |
| **Document Library** | Browse **all users' documents** with search, filter (All / My Uploads / PDF / Converted) |
| **Preview & Download** | Any logged-in user can view (iframe preview) and download any document as PDF |
| **Toast Notifications** | Success / error / info toasts for every action |
| **Responsive Design** | Works on desktop, tablet, and mobile |

---

## Tech Stack

- **AngularJS 1.8.3** — SPA framework (ngRoute, ngAnimate, ngSanitize)
- **jsPDF 2.5** — PDF generation for Excel/Word conversion
- **SheetJS (xlsx 0.18)** — Excel file parsing
- **Mammoth.js 1.6** — Word document text extraction
- **Font Awesome 6.5** — Icons
- **Google Fonts (Inter)** — Typography
- **Pure CSS** — Custom dark theme, no CSS framework needed

---

## Project Structure

```
PracticeUi/
├── index.html                          # Entry point — loads all scripts & styles
├── README.md                           # This file
├── css/
│   └── styles.css                      # Complete dark-themed stylesheet (1100+ lines)
├── app/
│   ├── app.module.js                   # Angular module definition & run block
│   ├── app.routes.js                   # Route configuration (/login, /register, /dashboard, /upload, /documents)
│   ├── services/
│   │   ├── auth.service.js             # Registration, login, logout, session (localStorage)
│   │   ├── file.service.js             # Upload, convert, store, retrieve documents (localStorage)
│   │   └── toast.service.js            # Toast notification manager
│   ├── controllers/
│   │   ├── login.controller.js         # Login form logic
│   │   ├── register.controller.js      # Registration form logic
│   │   ├── dashboard.controller.js     # Dashboard stats & recent activity
│   │   ├── upload.controller.js        # File selection, progress, upload, ResponsePdf display
│   │   ├── documents.controller.js     # Document listing, search, filter, preview, download
│   │   ├── navbar.controller.js        # Top navigation bar
│   │   └── toast.controller.js         # Toast notification display
│   ├── directives/
│   │   └── file-upload.directive.js    # Bridges native <input type="file"> with AngularJS
│   └── views/
│       ├── login.html                  # Login page
│       ├── register.html               # Registration page
│       ├── dashboard.html              # Dashboard with stats cards & activity
│       ├── upload.html                 # Upload zone with drag/drop, progress, ResponsePdf
│       └── documents.html              # Document grid with search, filter, preview modal
```

---

## How to Run

### Option 1 — VS Code Live Server (Recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. App opens at `http://127.0.0.1:5500`

### Option 2 — Python HTTP Server
```bash
cd PracticeUi
python -m http.server 8080
```
Open `http://localhost:8080` in your browser.

### Option 3 — Node.js
```bash
npx http-server PracticeUi -p 8080
```

> **Note:** The app must be served via HTTP (not `file://`) because AngularJS `templateUrl` routing requires it.

---

## How to Use

### 1. Register
- Go to `#!/register`
- Enter your name, email, and password (min 4 chars)
- Click **Create Account**

### 2. Login
- Go to `#!/login`
- Enter your registered email and password
- Click **Sign In** → redirected to Dashboard

### 3. Upload Files
- Navigate to **Upload** from the navbar
- Click the drop zone or drag files onto it
- Supported formats: `.pdf`, `.xlsx`, `.xls`, `.csv`, `.doc`, `.docx`
- Click **Upload All**
- **PDF files** → stored directly; backend returns `ResponsePdf` with status `SUCCESS`
- **Excel/Word files** → converted to PDF client-side, then stored
- The `ResponsePdf` response is displayed on screen showing document ID, filename, conversion status, etc.

### 4. Browse & Download Documents
- Navigate to **Documents** from the navbar
- **All users' documents** are visible (not just yours)
- Use the **search bar** to find by filename or uploader name
- Use **filter chips**: All | My Uploads | PDF | Converted
- Click the **eye icon** to preview a document (opens in-page PDF viewer)
- Click the **download icon** to download any document as PDF
- Every user can view and download documents uploaded by any other user

---

## Data Storage

All data is stored in the browser's `localStorage` under these keys:

| Key | Contents |
|-----|----------|
| `docvault_users` | Array of registered users |
| `docvault_session` | Current logged-in user session |
| `docvault_documents` | Array of all uploaded documents (including base64 PDF data) |
| `docvault_activity` | Recent activity log (uploads, conversions, downloads) |

> **Warning:** Since documents store base64-encoded PDF data in `localStorage`, there is a ~5–10 MB storage limit depending on the browser. This is a demo/practice app — a real backend would handle file storage.

---

## ResponsePdf Object

When a file is uploaded, the service returns this response object:

```json
{
  "status": "SUCCESS",
  "message": "PDF loaded successfully!",
  "documentId": "doc_1712345678901_abc12",
  "fileName": "report.pdf",
  "originalFileName": "report.pdf",
  "converted": false,
  "uploadedAt": "2026-04-05T10:30:00.000Z",
  "uploadedBy": "John Doe"
}
```

For converted files (Excel/Word), `converted` will be `true` and `message` will say *"File converted to PDF and loaded successfully!"*.

---

## Future Enhancements (Backend Integration)

When a Spring Boot backend microservice is ready, replace the `localStorage` calls in:
- `auth.service.js` → call `/api/auth/register`, `/api/auth/login` REST endpoints
- `file.service.js` → call `/api/documents/upload` (multipart), `/api/documents`, `/api/documents/{id}/download`

The frontend structure is already organized for easy migration to real API calls.

---

## License

Practice project — for learning purposes only.
