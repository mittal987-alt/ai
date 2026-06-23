# app/services/parser.py

import re

def categorize_transaction(description: str):
    desc = description.lower()

    if "amazon" in desc:
        return "Shopping"
    elif "zomato" in desc or "swiggy" in desc:
        return "Food"
    elif "uber" in desc or "ola" in desc:
        return "Travel"
    else:
        return "Others"


def extract_transactions(text: str):
    transactions = []

    lines = text.split("\n")

    for line in lines:

        # Example:
        # 12-Jun-2026 AMAZON 1200
        match = re.search(
            r"(\d{1,2}[-/][A-Za-z]{3}[-/]\d{4})\s+(.+?)\s+(\d+\.?\d*)$",
            line
        )

        if match:

            description = match.group(2).strip()
            amount = float(match.group(3))

            transactions.append({
                "description": description,
                "amount": amount,
                "category": categorize_transaction(description)
            })

    return transactions