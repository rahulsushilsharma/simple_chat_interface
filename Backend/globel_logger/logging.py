import logging


def setup_logging(logname="../log.txt"):

    logging.basicConfig(
        filename=logname,
        filemode="a",
        format="%(asctime)s,%(msecs)03d %(name)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        level=logging.DEBUG,
    )
