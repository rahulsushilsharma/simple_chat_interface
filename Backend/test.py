import argparse
import json
import logging
import sys
from typing import Any, Dict, List

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


class AzurePricingClient:
    """A resilient client for fetching data from the Azure Retail Prices API."""

    BASE_URL = "https://prices.azure.com/api/retail/prices"

    def __init__(self):
        self.session = requests.Session()

        retries = Retry(
            total=5,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET"],
        )
        adapter = HTTPAdapter(max_retries=retries)
        self.session.mount("https://", adapter)
        self.session.mount("http://", adapter)

    def get_pricing(
        self, services: List[str], region: str = None
    ) -> List[Dict[str, Any]]:
        """
        Fetches pricing data for specified Azure services.
        """
        all_items = []

        service_filters = " or ".join([f"serviceName eq '{svc}'" for svc in services])
        odata_filter = f"({service_filters})"

        if region:
            odata_filter += f" and armRegionName eq '{region}'"

        params = {"$filter": odata_filter}

        url = self.BASE_URL
        page_count = 1

        logger.info(f"Initiating pricing fetch with filter: {odata_filter}")

        while url:
            try:
                response = self.session.get(
                    url, params=params if page_count == 1 else None, timeout=15
                )
                response.raise_for_status()

                data = response.json()
                items = data.get("Items", [])
                all_items.extend(items)

                logger.info(
                    f"Page {page_count} fetched successfully: {len(items)} items retrieved."
                )

                url = data.get("NextPageLink")
                page_count += 1

            except requests.exceptions.RequestException as e:
                logger.error(f"Failed to fetch data on page {page_count}: {e}")
                break

        logger.info(f"Fetch complete. Total items retrieved: {len(all_items)}")
        return all_items


def main():
    parser = argparse.ArgumentParser(description="Fetch Azure Model Pricing Data.")
    parser.add_argument(
        "--services",
        nargs="+",
        default=["Foundry Models"],  # Updated to use Foundry Models
        help="List of Azure service names to fetch (e.g., 'Foundry Models').",
    )
    parser.add_argument(
        "--region",
        type=str,
        default=None,  # No region filter by default — Foundry Models spans all regions
        help="Optional region filter (e.g., eastus, westeurope). Omit to get all regions.",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="azure_pricing.json",
        help="The output JSON file name.",
    )

    args = parser.parse_args()

    client = AzurePricingClient()
    pricing_data = client.get_pricing(services=args.services, region=args.region)

    if pricing_data:
        try:
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(pricing_data, f, indent=4)
            logger.info(
                f"Successfully saved {len(pricing_data)} pricing meters to {args.output}"
            )
        except IOError as e:
            logger.error(f"Failed to write to file {args.output}: {e}")
    else:
        logger.warning("No pricing data was found for the specified parameters.")


if __name__ == "__main__":
    main()
