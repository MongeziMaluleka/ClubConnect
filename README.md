# ClubConnect Website

## Project Overview

**ClubConnect** is a responsive and interactive website designed to bring the WeThinkCode_ community together through various school clubs, such as the Robotics Club, Women Think Code Club, and more. The website features stories, videos, events, and opportunities for students to engage with their peers and stay updated on club activities.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Technologies Used

This project is built using the following technologies:

- **HTML5**: For structuring the content on the pages.
- **CSS3**: For styling the website.
- **Bootstrap 5**: A popular front-end framework for responsive design.
- **JavaScript (Vanilla)**: For interactivity and dynamic content.
- **Popper.js**: Used for positioning Bootstrap's interactive components like tooltips.
- **FontAwesome**: For icons across the site.

---

## Features

- **Responsive Carousel**: Display images with smooth transitions and auto-adjusted sizes for different screen resolutions.
- **Interactive Video Cards**: Hover effects that enhance user engagement by scaling and adding a box shadow.
- **Fixed Navigation Bar**: A sticky navigation bar that remains visible as you scroll through the page, with smooth scrolling to each section.
- **Club Sections**: Individual sections for different clubs, highlighting their events, activities, and contact information.
- **Social Media Links**: Easily accessible buttons that link to each club's social media pages.
- **Custom Animations**: Hover effects on buttons and icons for a more interactive user experience.

---

## Setup and Installation

### Prerequisites

Ensure you have the following installed on your machine:

- A web browser (Google Chrome, Firefox, etc.)
- A code editor (VS Code, Sublime Text, etc.)

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:ongerh/ClubConnect.git
   ```

2. **Navigate into the project directory**:
   ```bash
   cd clubconnect
   ```

3. **Open the project**:
   You can simply open the `index.html` file in a web browser to view the website locally.

4. **Optional**: If you have a local development server (e.g., [Live Server for VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)), use it to run the project for live reloading.

---

## Project Structure

```bash
clubconnect/
│
├── index.html          # Main entry point for the website
├── css/
│   └── styles.css      # Custom CSS file for additional styles
├── js/
│   └── script.js       # Custom JavaScript file (if applicable)
├── assets/
│   ├── img/            # Images used for the carousel and other sections
│   └── videos/         # Videos for club presentations
└── README.md           # Project documentation
```

---
## Usage
*In `ClubConnect/`:*
1. **Install dependencies**: 
```bash
pip install -r requirements.txt
```
  , ensure you have a virtual environment activated

2. **Run the ClubConnect server**:
```bash
python3 backend/api_server.py
```
3. **Run the web server on port 8088**:  (*ensure you are in the ClubConnect directory*)
```bash
python3 -m http.server -d . 8088
```


4. **Render the web page**
- navigate to [Club Connect website](http://localhost:8088/connect_home/cconnect.html)
---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

