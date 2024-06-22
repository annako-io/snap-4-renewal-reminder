# Snap for Renewal Reminder App

---
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![Babel](https://img.shields.io/badge/Babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=white)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MUI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
<img src="./assets/tesseract.png" width="105"/>


---

This application is built with TypeScript, React, React Webcam, Supabase, Google Calendar API, and Tesseract.js. Tesseract is an open source optical character recognition (OCR) platform. OCRs extract text from images and documents without a text layer and outputs the data.

Snap for Renewal Reminder can read a California driver's license data using a webcam. It pulls and displays the license expiration date, then gives you the option to create a Google Calendar item to reminder yourself to renew your license during the recommended renewal timeframe (60 days in advance of the expiration).

* [React](https://react.dev/) version 18.2.0

* [React Webcam](https://github.com/mozmorris/react-webcam) 

* [Supabase](https://supabase.com/)

* [Google Calendar API](https://developers.google.com/calendar/api/guides/overview)

* [Tesseract Open Source OCR Engine](https://github.com/tesseract-ocr/tesseract) ([tesseract.js](https://github.com/naptha/tesseract.js))

## Installation

To work on this in your development environment, you will need a Supabase account with a dedicated project and a Google Cloud Platform account with a dedicated project enabled with Google Calendar API. 

Dependencies may be installed with npm and yarn.

Download or clone the repository.
```
git clone https://github.com/annako-io/snap-4-renewal-reminder.git
```
Install dependencies and run the application locally.
```
cd snap-4-renewal-reminder
npm install
npm start
```
or
```
cd snap-4-renewal-reminder
yarn install
yarn start
```
Your application is ready to go!

### Contributing

If you are interested in contributing, feel free to submit an issue or a pull request! Snap for Renewal Reminder is open source and I would welcome contributions from other developers excited about the project!

**Future Upgrades**
* Add parsing for U.S. Passports
* Add parsing for different state driver's licenses