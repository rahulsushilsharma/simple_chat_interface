import httpx
import logging
from utils.config_vars import REQUEST_TIMEOUT
import time


class CustomHttpx(httpx.AsyncClient):
    def __init__(self, raise_for_status=True, *args, **kwargs):
        timeout = httpx.Timeout(10.0, read=REQUEST_TIMEOUT, write=REQUEST_TIMEOUT)
        super().__init__(*args, timeout=timeout, **kwargs)
        self.raise_for_status = raise_for_status

    async def request(self, *args, **kwargs):
        try:
            start_time = time.time()

            if len(args) > 1:
                logging.info(f"Performing external {args[0]} request to : {args[1]}")

            response = await super().request(*args, **kwargs)

            end_time = time.time()

            logging.info(f"The external request took {end_time - start_time}")

        except Exception as e:
            end_time = time.time()
            logging.error(f"Error calling the api time took {end_time - start_time}")
            raise e
        else:
            return response
