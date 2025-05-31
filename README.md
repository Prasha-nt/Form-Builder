# 🧩 Form Builder

A sleek, **drag-and-drop Form Builder** built with **React Remix** and **Tailwind CSS**. This interactive frontend system empowers users to **create custom forms visually**, with support for **multi-step flows**, **real-time previews**, **field validation**, and **shareable public links**.

---

## 🚀 Key Features

### 🛠️ Visual Form Builder
- 🧲 Drag-and-drop interface for adding fields:
  - Text, Textarea, Dropdown, Checkbox, Date
- 🔃 Reorder fields via drag-and-drop
- ⚙️ Configure each field’s:
  - Label, Placeholder, Required, Help Text, Options
- 🪜 Multi-step form support with progress tracking

### 👁️ Live Preview & Validation
- ✅ Real-time validation:
  - Required, Min/Max Length, Regex (Email, Phone)
- 📱 Responsive previews:
  - Desktop, Tablet, Mobile

### 💾 Templates & Storage
- 📄 Predefined templates (e.g., Contact Us)
- 💽 Save & load templates from:
  - `localStorage` or your custom backend
- 🔄 Auto-save enabled for ongoing changes

### 🔗 Share & Access
- 🆔 Generate unique Form IDs
- 🔗 Shareable public URLs to access "Form Filler" view
- 🌐 Load forms by ID on demand

---

## 💡 Bonus Features

- 🧠 Auto-save to localStorage
- 🌗 Dark/Light theme toggle
- ↩️ Undo / ↪️ Redo actions
- 📥 View submitted responses per form

---

## 🧰 Tech Stack

| 🔧 Tech             | 📝 Description                         |
|---------------------|----------------------------------------|
| React Remix         | Full-stack web framework               |
| Tailwind CSS        | Utility-first modern styling framework |
| Zustand / Redux / Context API | State management (optional)   |
| localStorage        | Local persistence for forms/responses  |
| Express / JSON Server (Optional) | Backend for form storage |

---

## 📦 Getting Started

### 🔧 Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/your-username/form-builderr.git
cd form-builderr

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the development server
npm run dev
