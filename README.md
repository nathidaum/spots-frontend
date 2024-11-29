# Spots - Frontend

## Description

This repository contains the **frontend code** for the **Spots Project**, a platform that allows users to book or rent out unused office space. The frontend is built using **React** and provides an intuitive user interface for browsing available spots, viewing details, and making bookings.

The **backend repository** with the API implementation can be found [here](https://github.com/nathidaum/spots-backend).

---

## Instructions to Run the Frontend

### 1. Requirements
- Ensure you have **Node.js 16.x or later** installed on your computer.

### 2. Clone the repository
```bash
git clone https://github.com/your-username/spots-frontend.git
cd spots-frontend
```
### 2. Install Dependencies

```bash
npm install
```


### Set up Environment Variables

1. Create a `.env` file in the root directory.
2. Add the following variables:

```bash
VITE_API_URL=<Backend API Base URL>
VITE_CLOUDINARY_URL=<Cloudinary Upload URL>
VITE_CLOUDINARY_UPLOAD_PRESET=<Your Cloudinary Upload Preset>
```
- VITE_API_URL: URL of the backend API. Example: http://localhost:5005.
- VITE_CLOUDINARY_URL: URL to upload images to Cloudinary. Example: https://api.cloudinary.com/v1_1/your-cloud-name/image/upload.
- VITE_CLOUDINARY_UPLOAD_PRESET: Cloudinary upload preset name. Example: my-preset.

You will need a [Cloudinary account](https://cloudinary.com/) to generate the required credentials.


### Run the application
To start the development server, run:
```bash
npm run dev
```
Once the server is running, open your browser and navigate to http://localhost:5173.

## Demo

You can see the live frontend application hosted [here](https://workspots.netlify.app/).

