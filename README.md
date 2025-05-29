# 🔍 Find It Website

## Overview

The **Find It Website** is a web application designed to help students at institutions like Drexel University's College of Computing & Informatics (CCI) recover lost items on campus—such as keys, phones, or backpacks.  

Built with **Next.js** and **Tailwind CSS**, this platform features an intuitive interface informed by user research to ensure efficient navigation and functionality. Version control and team collaboration were handled through **GitLab**, and the project received positive feedback from professors for its practical design and usability.

## ✨ Features

- 🔎 **Item Search**: Search for lost items using keywords or tags (e.g., "laptop", "wallet").
- 📷 **Post Lost Items**: Upload photos and details to report lost belongings.
- 📱 **Responsive Design**: Clean, mobile-friendly interface using Tailwind CSS.
- 🧠 **User-Centric**: Designed with real student input to prioritize usability.

## 🚀 Installation

1. **Clone the Repository**
   ```
   git clone https://github.com/your-username/find-it-website.git
   cd find-it-website
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Set Up Environment**
   - Copy `.env.example` to `.env.local`
   - Add the required environment variables (e.g., API keys, database credentials)
   - Ensure Node.js v16+ is installed

   Optional: Set up a database (e.g., PostgreSQL, MongoDB) for persistent storage.

4. **Run the Application**
   ```
   npm run dev
   ```

## 💡 Usage

- **Start the App**:  
  Visit `http://localhost:3000` in your browser.

- **Search for Items**:  
  Use keywords like `backpack`, `glasses`, or `phone`.  
  Example: `http://localhost:3000/search?query=phone`

- **Post a Lost Item**:  
  Upload an image and provide a description and location of the lost item.

Tip: Use common tags (e.g., "keys", "glasses", "notebook") to improve search results.

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a new branch  
   `git checkout -b feature/your-feature`
3. Make your changes and commit  
   `git commit -m "Add your feature"`
4. Push to your branch  
   `git push origin feature/your-feature`
5. Open a pull request

This project used **GitLab** during development for version control and weekly progress tracking. Please follow our Code of Conduct and maintain coding standards.

## 📄 License

This project is licensed under the **MIT License**.

## 📬 Contact

For questions or feedback, feel free to open an issue or reach out via email at **[your-email@example.com]**.  
We’re excited to continue improving the Find It Website to better serve students!
