# 🏠 RentNest – House Rental Consultancy Platform

A modern, production-grade **House Rental Consultancy Platform** where property seekers can specify requirements, search & filter curated properties with dynamic match scores, submit enquiries, and where consultants manage property listings, protect private owner contacts, manage leads through a pipeline, and track commissions.

---

## 🌟 Key Features

- **Customer / Tenant Experience:**
  - 🔍 Multi-criteria Property Search & Filtering (BHK, Rent slider, Localities, Parking, Furnishing, Commute time, Amenities)
  - 📊 Smart House Requirement Matcher with real-time percentage scoring (e.g. `96% Match`)
  - 📸 High-res Photo Galleries & Lightbox
  - 📩 "I'm Interested / Request Owner Details" Enquiry Modal
  - 📱 1-Click WhatsApp & Instagram Social Share tools
  - 📈 Live 6-Stage Enquiry Status Tracker
  - ❤️ Saved Properties & Side-by-Side Comparison

- **Admin & Consultant Management:**
  - 🛡️ **Strict Owner Privacy**: Owner phone numbers & private notes are protected and stripped from public APIs
  - 📊 Overview Dashboard with live KPI counters & metrics
  - 🗂️ Property Inventory CRUD with status toggles (`Available`, `Under Discussion`, `Occupied`)
  - 🔄 Lead & Enquiry Pipeline (Kanban & Table views) with 1-Click WhatsApp customer buttons
  - 👥 Property Owner CRM & Commission terms directory
  - 🎨 **Instagram Social Studio**: Auto-generates captions, hashtags, WhatsApp broadcasts, and visual story cards
  - 💰 Closed Deals & Commission Ledger

---

## 🚀 Quick Deployment to Render

### Option 1: Render Blueprint (Easiest - 1 Click)
1. Push this repository to GitHub.
2. Log in to [Render.com](https://render.com).
3. Click **New +** ➔ **Blueprint**.
4. Select your GitHub repository. Render will automatically read `render.yaml` and configure the build and start commands.
5. Click **Apply**.

---

### Option 2: Manual Web Service on Render
1. Log in to [Render.com](https://render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Fill in the following settings:
   - **Name**: `rentnest-consultancy` (or your choice)
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `<any-random-secret-key>`
6. Click **Deploy Web Service**!

---

## 💻 Local Development

### 1. Install & Build
```bash
# In project root
npm run build
```

### 2. Start the Server
```bash
npm start
```
Open `http://localhost:5000` in your browser.

---

## 🔑 Demo Credentials

- **Admin Consultant:** `admin@rentconsult.com` / `admin123`
- **Tenant:** `rahul@example.com` / `customer123`
- *(Or use the **"Quick Test Drive"** buttons in the navigation bar)*
