# PresentAI

PresentAI is a web application that generates complete, professionally themed PowerPoint presentations from a simple text prompt. It combines AI-generated content with AI-generated imagery and packages the result into a ready-to-download `.pptx` file.

## Features

- **AI-generated slide content** — uses the OpenAI API to turn a topic or prompt into structured slide text.
- **AI-generated imagery** — uses the Hugging Face API to create supporting images for slides.
- **Automatic PowerPoint export** — builds `.pptx` files with `python-pptx`, including custom color themes, layouts, and design tokens.
- **Multi-language support** — UI translations are managed through a central translations dictionary.
- **User accounts** — email/password registration and login, plus Google OAuth sign-in.
- **Presentation history** — logged-in users can view and revisit previously generated presentations.
- **Persistent storage** — user and presentation data is stored in a MySQL database (configured for Railway by default).

## Tech Stack

- **Backend:** Python, Flask
- **Database:** MySQL
- **AI Services:** OpenAI API (content), Hugging Face API (images)
- **Auth:** Authlib (Google OAuth), Werkzeug (password hashing)
- **Presentation generation:** python-pptx, Pillow
- **Server:** Gunicorn
- **Frontend:** Jinja2 HTML templates (`home`, `dashboard`, `login`, `register`, `profile`, `history`)

## Getting Started

### Prerequisites

- Python 3.11.9 (see `.python-version`)
- A MySQL database
- API keys for OpenAI and Hugging Face
- Google OAuth client credentials (for Google sign-in)

### Installation

1. Clone the repository:
```bash
   git clone https://github.com/MirzoUlugbekFazilov/PresentAI.git
   cd PresentAI
```
2. Install dependencies:
```bash
   pip install -r requirements.txt
```
3. Create a `.env` file in the project root with the following variables:
