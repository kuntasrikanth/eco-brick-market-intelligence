# Eco-Brick Market Intelligence
### End-to-end data analytics project | Python · Power BI · Machine Learning

Market intelligence analysis of **355 brick manufacturers** across **31 Telangana districts**, built to identify optimal locations for a new eco-brick factory venture.

---

## Business Questions Answered
1. Where is the Telangana brick market heading — clay or eco?
2. Which districts are underserved by modern eco-brick supply?
3. Where should a new fully-automatic fly ash brick factory be built?
4. Which existing factories are at highest risk of closure?

---

## Key Findings
- **85.4% operational rate** — healthy, active market
- **65.9% fly ash adoption** — eco transition underway but incomplete
- **55% still hand-made** — massive modernization gap = competitive opportunity
- **Only 13.2% have a website** — digital presence is an uncontested moat
- **#1 location: Ranga Reddy** — largest household base, stable market, robust across all weight scenarios
- **Kamareddy** — 1 hand-made clay competitor, zero modern competition, zero eco adoption
- **Company size is the #1 predictor of closure** — stronger signal than machine type

---

## Project Structure
---

## Methodology
| Phase | Description | Output |
|-------|-------------|--------|
| 0 | Setup — Python env, GitHub, folder structure | repo |
| 1 | Data cleaning — deduplication, casing, missingness | v3.csv |
| 2 | KPI analysis — market + district summaries | kpi_summary.csv |
| 3 | Feature engineering — 5 derived columns | v4.csv |
| 4 | Power BI dashboard — 3 pages | .pbix |
| 5 | Business insights — 7 findings | insights.md |
| 6 | Market gap detection — household density metrics | gap_analysis.csv |
| 7 | Location strategy — weighted scoring model | location_scores.csv |
| 8 | Competitor intelligence — tier segmentation | tiers.csv |
| 9 | Closure risk model — Random Forest, stratified CV | risk_scores.csv |

---

## Data Limitations
- Source: Google Maps scrape (coverage bias toward listed businesses)
- Point-in-time snapshot — no longitudinal data
- Self-reported attributes — company size and type unverified
- 52 closed examples for ML phase — results are indicative, not predictive
- 6 duplicate factories dropped (border-area scrape overlap)

---

## Tools
Python (pandas, numpy, scikit-learn, matplotlib, seaborn) · Power BI Desktop · Git · Jupyter Lab
cat > decisions.md << 'EOF'
# Decisions Log

| Phase | Decision | Reason |
|-------|----------|--------|
| 1 | Dropped 6 duplicate rows, kept first | Same factory scraped twice in border districts |
| 1 | Dropped Founder column (96.6% missing) | No analytical value |
| 1 | Website/Contact → boolean flags | Absence is a market signal |
| 1 | Unknown categories kept visible | Better than disappearing from counts |
| 6 | Used households not population as denominator | Households are the actual brick buyers |
| 7 | Weighted demand 25%, competition 20% | Market size matters most for new entrant |
| 7 | Added raw material bonus for Ramagundam districts | Verifiable geographic advantage |
| 9 | Used recall as primary metric, not accuracy | 52 closed examples = imbalanced; catching closures matters more than overall accuracy |
| 9 | Framed as risk profiling not forecasting | No time dimension in data — honest limitation |
EOF
cat > data/processed/data_dictionary.md << 'EOF'
# Data Dictionary

Source: Google Maps scrape, Telangana brick manufacturers
Clean version: brick_with_risk_scores.csv (355 rows, 24 columns)

| Column | Type | Description |
|--------|------|-------------|
| Districts | text | Telangana district name |
| Company Name | text | Factory trading name |
| Machine Type | text | Hand Made / Semi Automatic / Fully Automatic |
| Product Type | text | Fly Ash Brick / Fired Clay Brick / Unknown |
| Company Size | text | Small / Moderate / Large / Unknown |
| Status | text | Running / Permanently Closed / Temporarily Closed |
| has_website | bool | Website exists (True/False) |
| has_contact | bool | Contact number exists |
| is_eco | bool | Product Type == Fly Ash Brick |
| is_operational | bool | Status == Running |
| modernization_score | int | 0=Unknown, 1=Hand Made, 2=Semi Auto, 3=Fully Auto |
| size_score | int | 0=Unknown, 1=Small, 2=Moderate, 3=Large |
| is_high_risk | bool | Hand Made AND Fired Clay Brick |
| competitor_tier | text | Tier 1/2/3/4 classification |
| closure_risk_score | float | ML-predicted closure probability (0-1) |
| risk_category | text | Low / Medium / High Risk |
EOF

