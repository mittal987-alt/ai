import re

def categorize_transaction(description):

    desc = description.lower()

    if "amazon" in desc:
        return "Shopping"

    if "zomato" in desc or "swiggy" in desc:
        return "Food"

    if "uber" in desc or "ola" in desc:
        return "Travel"

    if "salary" in desc:
        return "Income"

    return "Others"


def extract_transactions(text):

    transactions = []

    lines = text.split("\n")

    for line in lines:

        match = re.search(
            r"(\d+\.?\d*)$",
            line.strip()
        )

        if match:

            amount = float(match.group(1))

            description = line.replace(
                match.group(1),
                ""
            ).strip()

            transactions.append(
                {
                    "description": description,
                    "amount": amount,
                    "category": categorize_transaction(
                        description
                    )
                }
            )

    return transactions