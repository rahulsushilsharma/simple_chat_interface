import logging
import time

import httpx

from utils.config_vars import REQUEST_TIMEOUT


class CustomHttpx(httpx.AsyncClient):
    _instance = None

    def __new__(cls, raise_for_status: bool = True, *args, **kwargs):
        if cls._instance is None:
            timeout = httpx.Timeout(10.0, read=REQUEST_TIMEOUT, write=REQUEST_TIMEOUT)
            cls._instance = super().__new__(cls)  # ✅ create instance via __new__
            cls._instance._raise_for_status = raise_for_status
            cls._instance._timeout = timeout
        return cls._instance

    def __init__(self, raise_for_status: bool = True, *args, **kwargs):
        if not getattr(self, "_initialized", False):  # ✅ prevent re-initialization
            timeout = httpx.Timeout(10.0, read=REQUEST_TIMEOUT, write=REQUEST_TIMEOUT)
            super().__init__(*args, timeout=timeout, **kwargs)
            self._raise_for_status = raise_for_status
            self._initialized = True

    async def request(self, *args, **kwargs):
        start_time = time.time()
        try:
            if len(args) > 1:
                logging.info(f"Performing external {args[0]} request to: {args[1]}")

            response = await super().request(*args, **kwargs)

            if self._raise_for_status:
                response.raise_for_status()  # ✅ actually use raise_for_status

        except Exception as e:
            elapsed = time.time() - start_time
            logging.error(
                f"Error calling the API, time took: {elapsed:.3f}s error: {e}"
            )
            raise
        else:
            elapsed = time.time() - start_time
            logging.info(f"The external request took {elapsed:.3f}s")
            return response
