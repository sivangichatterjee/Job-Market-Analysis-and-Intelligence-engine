# 🌍 Global Tech Job Insights Database

![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)
![Python](https://img.shields.io/badge/Data%20Processing-Python-3776AB?style=flat-square&logo=python)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)
![AWS](https://img.shields.io/badge/Deployment-AWS-232F3E?style=flat-square&logo=amazon-aws)

A comprehensive relational database project designed to analyze LinkedIn job postings and employee reviews. This system provides a unified, standardized structure for exploring hiring trends, salary patterns, skill demand, company reputation, benefits, and workforce characteristics.

This database serves as the backend for analytical dashboards and APIs used for job-market intelligence and company analytics.

---

## 📖 Overview

The system integrates two primary datasets to provide a 360-degree view of the tech job market:

1. **LinkedIn Job Postings (2023–2024):** Contains job titles, companies, locations, salaries, skills, benefits, experience levels, and metadata.
2. **Employee Reviews Dataset:** Includes overall ratings, review text, and feedback, enabling analysis of employer quality and sentiment.

### Key Insights Supported
* **Hiring Trends:** Volume analysis across industries and companies.
* **Compensation:** Salary distributions and trends.
* **Skill Analysis:** Identification of high-demand and high-paying skills.
* **Reputation:** Company quality based on employee sentiment.
* **Workforce:** Size patterns and company scale.

---

## 💾 Database Schema

The database is built on **PostgreSQL** and consists of the following principal tables:

| Table Name | Description |
| :--- | :--- |
| `postings` | Job posting info (title, company, salary, experience, work type, location). |
| `companies` | Company details (name, description, size, industry, location). |
| `employee_reviews` | Employee ratings and text for sentiment/reputation analysis. |
| `skills` | Canonical list of extracted technical and non-technical skills. |
| `job_skills` | Many-to-many relationship mapping postings to skills. |
| `benefits` | Benefits and perks mentioned in job postings. |
| `employee_counts` | Time-series company workforce and follower data. |
| `industries` | Standardized industry definitions. |
| `company_industries` | Mappings between companies and standardized industries. |

> *Note: A complete Entity-Relationship Diagram (ERD) is available in the project documentation.*

---

## ⚙️ Data Cleaning & Preprocessing

Data quality was prioritized through a rigorous ETL process using **Python (Pandas, NumPy)**.

### Job Postings Pipeline
* **Validation:** Removed rows missing critical fields (job title, company name).
* **Standardization:** Parsed location fields into city, state, and country components.
* **Normalization:** Standardized experience level values and extracted skill lists into normalized tables.
* **Deduplication:** Identified and removed duplicate job postings.

### Employee Reviews Pipeline
* **Encoding:** Resolved UTF-8 and Latin-1 mismatches.
* **Linking:** Standardized company names to ensure accurate joins with job postings.
* **Sanitization:** Cleaned review text and removed malformed entries.
* **Quantification:** Converted ratings to numeric values for aggregation.

---

## 📊 Analytics Capabilities

This project powers dashboards that answer complex questions, such as:

* **Industry Ranking:** Rank industries by job posting volume.
* **Reputation Analysis:** Identify companies with the highest number of positive reviews.
* **Salary Benchmarking:** Compare company salaries against industry averages.
* **Perks Analysis:** Analyze benefits offered by top-rated companies.
* **Skill Demand:** Identify high-paying and high-demand skill sets.
* **Similarity Index:** Measure skill similarity between companies using the Jaccard index.

---

## 🛠 Tech Stack

* **Database:** PostgreSQL
* **Data Processing:** Python (Pandas, NumPy)
* **Backend:** Node.js, Express
* **Frontend:** React, Plotly, Bootstrap
* **Deployment:** AWS RDS, AWS EC2

---

## 📂 Repository Contents

* `sql/`: SQL schema files.
* `data/`: Cleaned dataset outputs.
* `scripts/`: ETL and preprocessing scripts.
* `backend/`: Node.js API implementation.
* `frontend/`: React dashboard code.

---

## 👥 Contributors

* **Lakshay Ramchandani**
* **Disha Nikam**
* **Sivangi Chatterjee**
* **Anirudh C. Kumar**
