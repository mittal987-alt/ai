import re
from datetime import datetime, date

CATEGORY_KEYWORDS = {
    "Shopping": ["amazon", "flipkart", "myntra"],
    "Food": ["zomato", "swiggy"],
    "Travel": ["uber", "ola"],
    "Fuel": ["petrol"],
    "UPI": ["phonepe", "gpay", "paytm", "upi"],
    "Cash": ["atm"],
    "Income": ["salary"]
}

def categorize_transaction(description: str) -> str:
    desc = description.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in desc for keyword in keywords):
            return category
    return "Others"

def parse_date_string(date_str: str) -> date:
    """
    Safely parse a date string with dots, slashes, or dashes (e.g. 28.08.22, 28/08/2022)
    into a datetime.date object.
    """
    clean_date_str = re.sub(r"\s+", "", date_str).replace(".", "-").replace("/", "-")
    try:
        parts = clean_date_str.split("-")
        if len(parts) == 3:
            if len(parts[2]) == 4:
                return datetime.strptime(clean_date_str, "%d-%m-%Y").date()
            else:
                return datetime.strptime(clean_date_str, "%d-%m-%y").date()
    except (ValueError, IndexError):
        pass
    return date.today()

def extract_transactions(text: str) -> list:
    transactions = []

    # Global regex pattern:
    # 1. (\d{2}\s*[./-]\s*\d{2}\s*[./-]\s*\d{2,4}) -> Matches dates even if OCR leaves spaces inside them
    # 2. (.*?) -> Captures description text dynamically across newlines
    # 3. (-?[\d,]+\.\d{2}) -> Captures amount located at the end of the block
    pattern = r"(\d{2}\s*[./-]\s*\d{2}\s*[./-]\s*\d{2,4})\s+(.*?)\s+(-?[\d,]+\.\d{2})"
    
    matches = re.finditer(pattern, text, re.DOTALL | re.IGNORECASE)

    for match in matches:
        date_raw = match.group(1).strip()
        date_obj = parse_date_string(date_raw)
        
        description = match.group(2).strip()
        description = re.sub(r"\s+", " ", description)  # Flatten multi-line spacing
        
        amount_str = match.group(3).replace(",", "")

        try:
            amount = float(amount_str)
            if amount < 0:
                amount = abs(amount)

            # Skip common header layout false-positives
            if any(header in description.lower() for header in ["brought forward", "carried forward"]):
                continue

            transactions.append({
                "date": date_obj,
                "description": description,
                "amount": amount,
                "category": categorize_transaction(description),
            })
        except ValueError:
            continue

    # --- Fallback: Check line-by-line if global format has missing chunks ---
    if not transactions:
        lines = text.split("\n")
        for i, line in enumerate(lines):
            line = line.strip()
            # Catch lines that look like: "01.09.22   UPL/CR/..."
            match = re.search(r"(\d{2}\s*[./-]\s*\d{2}\s*[./-]\s*\d{2,4})\s+(.*)", line)
            if match:
                date_raw = match.group(1).strip()
                date_obj = parse_date_string(date_raw)
                desc = match.group(2).strip()
                
                # Check if the next line or line after contains the numerical amount
                for offset in [1, 2]:
                    if i + offset < len(lines):
                        next_line = lines[i + offset].strip()
                        amt_match = re.match(r"^(-?[\d,]+\.\d{2})$", next_line)
                        if amt_match:
                            try:
                                amt = abs(float(amt_match.group(1).replace(",", "")))
                                transactions.append({
                                    "date": date_obj,
                                    "description": desc,
                                    "amount": amt,
                                    "category": categorize_transaction(desc),
                                })
                                break
                            except ValueError:
                                pass

    print("=" * 60)
    print(f"Transactions Found: {len(transactions)}")
    print(transactions)
    print("=" * 60)

    return transactions