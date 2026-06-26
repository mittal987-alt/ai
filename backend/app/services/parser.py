import re

def categorize_transaction(description: str) -> str:
    desc = description.lower()

    if "amazon" in desc:
        return "Shopping"
    elif "flipkart" in desc:
        return "Shopping"
    elif "myntra" in desc:
        return "Shopping"
    elif "zomato" in desc:
        return "Food"
    elif "swiggy" in desc:
        return "Food"
    elif "uber" in desc:
        return "Travel"
    elif "ola" in desc:
        return "Travel"
    elif "petrol" in desc:
        return "Fuel"
    elif "phonepe" in desc:
        return "UPI"
    elif "gpay" in desc:
        return "UPI"
    elif "paytm" in desc:
        return "UPI"
    elif "upi" in desc:
        return "UPI"
    elif "atm" in desc:
        return "Cash"
    elif "salary" in desc:
        return "Income"
    else:
        return "Others"

import re

def extract_transactions(text: str) -> list:
    transactions = []

    # Global regex pattern:
    # 1. (\d{2}\s*[./-]\s*\d{2}\s*[./-]\s*\d{2,4}) -> Matches dates even if OCR leaves spaces inside them (like "28. 08.22" or "01 .08.22")
    # 2. ([\s\n]*UPL|[\s\n]*UPI|[\s\n]*SBILTO.*?) -> Matches the start of transaction descriptions
    # 3. (.*?) -> Captures the multi-line description text dynamically across newlines
    # 4. ([\d,]+\.\d{2}) -> Captures the amount located at the end of the block
    pattern = r"(\d{2}\s*[./-]\s*\d{2}\s*[./-]\s*\d{2,4})\s+(.*?)\s+(-?[\d,]+\.\d{2})"
    
    # We find all matches across the entire raw text string at once
    matches = re.finditer(pattern, text, re.DOTALL | re.IGNORECASE)

    for match in matches:
        # Clean up any weird OCR internal spacing inside the extracted date
        date_raw = match.group(1).strip()
        date_str = re.sub(r"\s+", "", date_raw) 
        
        # Clean up the multi-line or messy description text
        description = match.group(2).strip()
        description = re.sub(r"\s+", " ", description)  # Flatten multi-line spacing to a single row
        
        amount_str = match.group(3).replace(",", "")

        try:
            amount = float(amount_str)
            if amount < 0:
                amount = abs(amount)

            # Skip common header layout false-positives
            if any(header in description.lower() for header in ["brought forward", "carried forward"]):
                continue

            transactions.append({
                "date": date_str,
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
                date_str = re.sub(r"\s+", "", match.group(1).strip())
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
                                    "date": date_str,
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