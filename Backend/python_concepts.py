#!/usr/bin/env python3
"""
Clean Python Reference (Safe to Import & Run)
All demos are inside functions and executed only from main().
"""

# --------------------------------------------------
# Standard library imports – grouped by purpose
# --------------------------------------------------
import argparse  # CLI argument parsing
import array  # Efficient arrays of basic values
import asyncio  # Async I/O primitives
import bisect  # Bisection algorithms
import configparser  # INI‑style configuration files
import copy  # Deep/shallow copy utilities
import gc  # Garbage collection control
import heapq  # Heap queue algorithm
import itertools  # Efficient looping utilities
import logging  # Logging facility
import multiprocessing  # Process‑based parallelism
import pathlib  # Object‑oriented filesystem paths
import re  # Regular expressions
import statistics  # Basic statistical functions
import subprocess  # Spawn new processes
import sys  # System-specific parameters
import threading  # Thread‑based parallelism
import time  # Time‑related functions
import weakref  # Weak references & collections
from collections import Counter, defaultdict, deque, namedtuple
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed
from contextlib import asynccontextmanager, contextmanager
from dataclasses import dataclass, field
from enum import Enum, auto
from functools import (
    cached_property,
    cmp_to_key,
    lru_cache,
    partial,
    reduce,
    total_ordering,
    wraps,
)
from typing import (
    Annotated,
    Any,
    Callable,
    Dict,
    Iterable,
    List,
    Literal,
    NewType,
    Optional,
    Protocol,
    Tuple,
    TypedDict,
    Union,
)


# --------------------------------------------------
# 1. Mutability demo – shows shallow vs deep copy behavior
# --------------------------------------------------
def demo_mutability():
    tuple_val = (1, "s", {})
    list_a = [1, "1"]
    list_a.append({})  # mutable element added
    list_b = list_a  # alias – same list object
    list_b.append("3")  # mutation visible in list_a
    list_c = list_a.copy()  # shallow copy – new list, same inner objects
    list_c.append("33")
    list_c.append({"arr": ["v1", "v2"]})
    list_d = list_c.copy()  # another shallow copy
    list_c[-1]["arr"].append("v3")  # mutates shared dict inside list_c
    list_e = copy.deepcopy(list_c)  # deep copy – independent nested structures
    list_c[-1]["arr"].append("v4")  # does NOT affect list_e
    print("deepcopy safe:", list_e[-1]["arr"])


# --------------------------------------------------
# 2. enumerate
# --------------------------------------------------
def demo_enumerate():
    print("\n--- demo_enumerate ---")
    names = ["Rahul", "Aman", "Neha"]
    for i, name in enumerate(names, start=1):
        print(i, name)


# --------------------------------------------------
# 3. zip
# --------------------------------------------------
def demo_zip():
    print("\n--- demo_zip ---")
    ids = [101, 102, 103]
    names = ["Pen", "Book", "Bag"]
    print(dict(zip(ids, names)))


# --------------------------------------------------
# 4. any / all
# --------------------------------------------------
def demo_any_all():
    print("\n--- demo_any_all ---")
    nums = [0, 0, 5, 0]
    print("any:", any(nums))
    print("all:", all(nums))


# --------------------------------------------------
# 5. map vs comprehension
# --------------------------------------------------
def demo_map():
    print("\n--- demo_map ---")
    nums = [1, 2, 3, 4]
    squares = list(map(lambda x: x * x, nums))
    squares2 = [x * x for x in nums]
    print(squares)
    print(squares2)


# --------------------------------------------------
# 6. filter
# --------------------------------------------------
def demo_filter():
    print("\n--- demo_filter ---")
    nums = [1, 2, 3, 4, 5, 6]
    print(list(filter(lambda x: x % 2 == 0, nums)))


# --------------------------------------------------
# 7. sorted with key
# --------------------------------------------------
def demo_sorted():
    print("\n--- demo_sorted ---")
    users = [
        {"name": "Rahul", "age": 25},
        {"name": "Aman", "age": 20},
        {"name": "Neha", "age": 30},
    ]
    print(sorted(users, key=lambda u: u["age"]))


# --------------------------------------------------
# 8. setdefault
# --------------------------------------------------
def demo_setdefault():
    print("\n--- demo_setdefault ---")
    data = ["apple", "ant", "banana", "bat"]
    groups = {}
    for word in data:
        groups.setdefault(word[0], []).append(word)
    print(groups)


# --------------------------------------------------
# 9. dict.get
# --------------------------------------------------
def demo_get():
    print("\n--- demo_get ---")
    user = {"name": "Rahul"}
    print(user.get("age", 0))


# --------------------------------------------------
# 10. isinstance
# --------------------------------------------------
def demo_isinstance():
    print("\n--- demo_isinstance ---")
    value = [1, 2, 3]
    if isinstance(value, list):
        print("list detected")


# --------------------------------------------------
# 11. sum / min / max
# --------------------------------------------------
def demo_math():
    print("\n--- demo_math ---")
    nums = [10, 20, 30]
    print("sum:", sum(nums))
    print("min:", min(nums))
    print("max:", max(nums))


# --------------------------------------------------
# 12. reversed vs slicing
# --------------------------------------------------
def demo_reverse():
    print("\n--- demo_reverse ---")
    arr = [1, 2, 3, 4]
    print("reversed:", list(reversed(arr)))
    print("slicing:", arr[::-1])


# --------------------------------------------------
# 13. round floating precision
# --------------------------------------------------
def demo_round():
    print("\n--- demo_round ---")
    print(round(2.675, 2))


# --------------------------------------------------
# 14. file context manager
# --------------------------------------------------
def demo_file():
    print("\n--- demo_file ---")
    with open("test.txt", "w") as f:
        f.write("hello world")
    print("file written: test.txt")


# --------------------------------------------------
# 2. Decorator + Fibonacci – timing decorator and cached recursion
# --------------------------------------------------
def time_it(func):
    """Measure execution time of a function."""

    @wraps(func)
    def wrapper(*a, **kw):
        start = time.perf_counter()
        r = func(*a, **kw)
        print(func.__name__, "took", round(time.perf_counter() - start, 4), "s")
        return r

    return wrapper


@time_it
def fib(n):
    """Naïve recursive Fibonacci (exponential time)."""

    def rec(x):
        if x <= 1:
            return x
        return rec(x - 1) + rec(x - 2)

    return rec(n)


@lru_cache(None)
def cached_rec(n):
    """Recursive Fibonacci with memoization."""
    if n <= 1:
        return n
    return cached_rec(n - 1) + cached_rec(n - 2)


@time_it
def cached_fib(n):
    """Clear cache then compute Fibonacci using memoization."""
    cached_rec.cache_clear()
    return cached_rec(n)


# --------------------------------------------------
# 3. OOP – simple User class with classmethod and repr
# --------------------------------------------------
class User:
    user_id = "default"

    def __init__(self, name, date):
        self.user_name = name
        self.date = date

    @classmethod
    def create_current(cls, name):
        """Factory that records the current timestamp."""
        return cls(name, time.time())

    def __repr__(self):
        return f"User({self.user_name})"


# --------------------------------------------------
# 4. Async – demonstrate asyncio.gather
# --------------------------------------------------
async def async_task(name):
    """Simulated async workload."""
    await asyncio.sleep(0.1)
    return f"done {name}"


async def demo_async():
    """Run two async tasks concurrently."""
    print(await asyncio.gather(async_task("A"), async_task("B")))


# --------------------------------------------------
# 5. Threads – safe counter increment using a lock
# --------------------------------------------------
counter = 0
lock = threading.Lock()


def thread_job():
    """Increment shared counter many times."""
    global counter
    for _ in range(10000):
        with lock:
            counter += 1


def demo_threads():
    """Spawn multiple threads and verify final counter."""
    global counter
    counter = 0
    ts = [threading.Thread(target=thread_job) for _ in range(4)]
    for t in ts:
        t.start()
    for t in ts:
        t.join()
    print("thread counter", counter)


# --------------------------------------------------
# 6. Multiprocessing – simple map using a process pool
# --------------------------------------------------
def square(n):
    """Return square of n."""
    return n * n


def demo_process():
    """Compute squares in parallel processes."""
    with multiprocessing.Pool(2) as p:
        print("multiprocessing", p.map(square, [1, 2, 3, 4]))


# --------------------------------------------------
# 7. Dataclass – Product with optional price
# --------------------------------------------------
@dataclass
class Product:
    id: int
    name: str
    tags: List[str]
    price: Optional[float] = None


# --------------------------------------------------
# 8. Descriptor – Positive enforces non‑negative values
# --------------------------------------------------
class Positive:
    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__[self.name]

    def __set__(self, obj, val):
        if val < 0:
            raise ValueError("Value must be non‑negative")
        obj.__dict__[self.name] = val


class Account:
    balance = Positive()

    def __init__(self, b):
        self.balance = b


# --------------------------------------------------
# 9. Cached Property – heavy computation runs once per instance
# --------------------------------------------------
class Data:
    def __init__(self, x):
        self.x = x

    @cached_property
    def heavy(self):
        """Expensive calculation cached after first access."""
        print("computed once")
        return self.x * 10


# --------------------------------------------------
# 10. Weakref – demo that a weak reference becomes None after GC
# --------------------------------------------------
def demo_weakref():
    class Node:
        pass

    n = Node()
    w = weakref.ref(n)
    del n
    gc.collect()
    print("alive?", w())


# --------------------------------------------------
# 11. Context Manager – temporary file creation & cleanup
# --------------------------------------------------
@contextmanager
def temporary_file(path: pathlib.Path, content: str = ""):
    """Create a file, yield its path, then delete it."""
    path.write_text(content, encoding="utf-8")
    try:
        yield path
    finally:
        try:
            path.unlink()
        except FileNotFoundError:
            pass


def demo_context_manager():
    """Show temporary file lifecycle."""
    tmp_path = pathlib.Path("temp_demo.txt")
    with temporary_file(tmp_path, "Hello, world!") as p:
        print("File exists during context:", p.exists())
        print("Content:", p.read_text())
    print("File exists after context:", tmp_path.exists())


# --------------------------------------------------
# 12. Async Context Manager – simple timer
# --------------------------------------------------
@asynccontextmanager
async def async_timer(name: str):
    """Measure elapsed time of an async block."""
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"[{name}] elapsed: {elapsed:.4f}s")


async def demo_async_context():
    async with async_timer("demo"):
        await asyncio.sleep(0.2)


# --------------------------------------------------
# 13. Pathlib – basic file operations
# --------------------------------------------------
def demo_pathlib():
    """Write, inspect, and delete a file using pathlib."""
    p = pathlib.Path("example.txt")
    p.write_text("Sample text", encoding="utf-8")
    print("File size:", p.stat().st_size)
    p.unlink()
    print("File removed:", not p.exists())


# --------------------------------------------------
# 14. Regular Expressions – extract words
# --------------------------------------------------
def demo_regex():
    """Find all word tokens in a string."""
    pattern = re.compile(r"(?P<word>\w+)")
    text = "Hello, world! 123"
    matches = pattern.findall(text)
    print("Words found:", matches)


# --------------------------------------------------
# 15. Subprocess – run a one‑liner Python command
# --------------------------------------------------
def demo_subprocess():
    """Execute a subprocess and capture its output."""
    result = subprocess.run(
        ["python", "-c", "print('subprocess works')"],
        capture_output=True,
        text=True,
    )
    print("Subprocess output:", result.stdout.strip())


# --------------------------------------------------
# 16. NamedTuple – simple immutable record
# --------------------------------------------------
Point = namedtuple("Point", ["x", "y"])


def demo_namedtuple():
    """Create a point and compute its Euclidean distance."""
    p = Point(3, 4)
    print("Point:", p, "distance:", (p.x**2 + p.y**2) ** 0.5)


# --------------------------------------------------
# 17. Enum with auto() – automatic values
# --------------------------------------------------
class Color(Enum):
    RED = auto()
    GREEN = auto()
    BLUE = auto()


def demo_enum():
    """Iterate over enum members."""
    for color in Color:
        print("Enum:", color, "value:", color.value)


# --------------------------------------------------
# 18. __slots__ – reduce per‑instance memory overhead
# --------------------------------------------------
class SlotClass:
    __slots__ = ("a", "b")

    def __init__(self, a, b):
        self.a = a
        self.b = b


def demo_slots():
    obj = SlotClass(1, 2)
    print("SlotClass:", obj.a, obj.b)


# --------------------------------------------------
# 19. WeakKeyDictionary / WeakValueDictionary – auto‑removal
# --------------------------------------------------
def demo_weakref_collections():
    wk = weakref.WeakKeyDictionary()
    wv = weakref.WeakValueDictionary()

    class Key:
        pass

    class Value:
        pass

    k = Key()
    v = Value()
    wk[k] = "data"
    wv["key"] = v
    print("WeakKeyDictionary before del:", dict(wk))
    print("WeakValueDictionary before del:", dict(wv))
    del k, v
    gc.collect()
    print("WeakKeyDictionary after del:", dict(wk))
    print("WeakValueDictionary after del:", dict(wv))


# --------------------------------------------------
# 20. Thread synchronization – Event + shared list
# --------------------------------------------------
def demo_thread_sync():
    """Producer signals consumer via Event."""
    event = threading.Event()
    shared = []

    def producer():
        for i in range(5):
            shared.append(i)
            time.sleep(0.1)
        event.set()

    def consumer():
        event.wait()
        print("Consumed:", shared)

    t1 = threading.Thread(target=producer)
    t2 = threading.Thread(target=consumer)
    t1.start()
    t2.start()
    t1.join()
    t2.join()


# --------------------------------------------------
# 21. Asyncio Queue – classic producer‑consumer pattern
# --------------------------------------------------
async def demo_asyncio_queue():
    """Use an asyncio.Queue to coordinate producer and consumer."""
    queue = asyncio.Queue(maxsize=3)

    async def producer():
        for i in range(5):
            await queue.put(i)
            print("Produced", i)
            await asyncio.sleep(0.05)

    async def consumer():
        for _ in range(5):
            item = await queue.get()
            print("Consumed", item)
            queue.task_done()

    await asyncio.gather(producer(), consumer())
    await queue.join()


# --------------------------------------------------
# 22. concurrent.futures – as_completed to process results as they finish
# --------------------------------------------------
def demo_futures_as_completed():
    """Run CPU‑light tasks in a thread pool and handle results in completion order."""

    def work(x):
        time.sleep(0.1 * x)
        return x * x

    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = [executor.submit(work, i) for i in range(5)]
        for f in as_completed(futures):
            print("Future result:", f.result())


# --------------------------------------------------
# 23. Multiprocessing shared memory – share an array without pickling
# --------------------------------------------------
def demo_shared_memory():
    """Create a shared memory block and copy an array into it."""
    from multiprocessing import shared_memory

    a = array.array("i", [1, 2, 3, 4])
    size = a.buffer_info()[1] * a.itemsize
    shm = shared_memory.SharedMemory(create=True, size=size)

    # create an integer view over the shared buffer and copy the array into it
    if shm.buf is None:
        return
    view = shm.buf.cast("i")
    view[:] = a[:]
    b = array.array("i", view.tolist())
    print("Shared array:", b.tolist())
    del view

    shm.close()
    shm.unlink()


# --------------------------------------------------
# 24. Logging – basic configuration and usage
# --------------------------------------------------
def demo_logging():
    """Set up a simple logger and emit messages."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
    )
    logging.info("This is an info message")
    logging.debug("This debug message will not appear by default")


# --------------------------------------------------
# 25. ConfigParser – read from a dict and query values
# --------------------------------------------------
def demo_configparser():
    """Demonstrate INI‑style configuration handling."""
    config = configparser.ConfigParser()
    config.read_dict(
        {
            "section1": {"key1": "value1", "key2": "value2"},
            "section2": {"keyA": "valueA"},
        }
    )
    print("Config sections:", config.sections())
    print("section1.key1:", config.get("section1", "key1"))


# --------------------------------------------------
# 26. Statistics – compute basic descriptive stats
# --------------------------------------------------
def demo_statistics():
    data = [1, 2, 3, 4, 5]
    print("Mean:", statistics.mean(data))
    print("Median:", statistics.median(data))
    print("Stdev:", statistics.stdev(data))


# --------------------------------------------------
# 27. total_ordering – implement full ordering from __eq__ and __lt__
# --------------------------------------------------
@total_ordering
class Box:
    def __init__(self, volume):
        self.volume = volume

    def __eq__(self, other):
        if not isinstance(other, Box):
            return NotImplemented
        return self.volume == other.volume

    def __lt__(self, other):
        if not isinstance(other, Box):
            return NotImplemented
        return self.volume < other.volume


def demo_total_ordering():
    """Sort boxes by volume using the total_ordering mixin."""
    boxes = [Box(10), Box(5), Box(7)]
    boxes.sort()
    print("Sorted boxes by volume:", [b.volume for b in boxes])


# --------------------------------------------------
# 28. functools.reduce & partial – functional utilities
# --------------------------------------------------
def demo_fun_fools():
    """Show reduce for product and partial for pre‑filled arguments."""
    product = reduce(lambda x, y: x * y, [1, 2, 3, 4])
    print("Product via reduce:", product)

    def greet(greeting, name):
        return f"{greeting}, {name}!"

    hello = partial(greet, "Hello")
    print(hello("Alice"))


# --------------------------------------------------
# 29. itertools advanced usage – chain, groupby, islice
# --------------------------------------------------
def demo_itertools():
    """Demonstrate several itertools recipes."""
    # chain – concatenate iterables
    chained = list(itertools.chain([1, 2], [3, 4]))
    print("Chain:", chained)

    # groupby – group consecutive items by a key function
    data = [("a", 1), ("a", 2), ("b", 3), ("b", 4), ("c", 5)]
    for key, group in itertools.groupby(data, key=lambda x: x[0]):
        print("Group", key, ":", list(group))

    # islice – slice an iterator with start/stop/step
    sliced = list(itertools.islice(range(10), 2, 8, 2))
    print("Islice:", sliced)


# --------------------------------------------------
# 30. Advanced typing – NewType, Annotated, TypedDict, Protocol
# --------------------------------------------------
UserId = NewType("UserId", int)


def demo_typing():
    """Show usage of newer typing constructs."""
    uid: UserId = UserId(42)
    print("NewType UserId:", uid, type(uid))

    # Annotated – attach metadata to a type (no runtime effect)
    def accepts_positive(x: Annotated[int, "must be > 0"]) -> None:
        if x <= 0:
            raise ValueError("x must be positive")
        print("Accepted positive int:", x)

    accepts_positive(5)

    # TypedDict – dict with fixed keys and value types
    class UserDict(TypedDict):
        name: str
        age: int

    # Protocol – structural subtyping (duck typing)
    class Greeter(Protocol):
        def greet(self) -> str: ...

    u: UserDict = {"name": "Alice", "age": 30}
    print("TypedDict example:", u)


# --------------------------------------------------
# MAIN – orchestrates all demos
# --------------------------------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--name", default="world")
    args, _ = parser.parse_known_args()
    print("hello", args.name)

    demo_mutability()
    demo_enumerate()
    demo_zip()
    demo_any_all()
    demo_map()
    demo_filter()
    demo_sorted()
    demo_setdefault()
    demo_get()
    demo_isinstance()
    demo_math()
    demo_reverse()
    demo_round()
    demo_file()
    fib(28)
    cached_fib(28)
    asyncio.run(demo_async())
    demo_threads()
    demo_process()
    print(Product(1, "pen", ["stationary"], 10.5))
    print(Account(100).balance)
    d = Data(5)
    print(d.heavy)
    print(d.heavy)
    demo_weakref()

    # Extra interview topics – each demo listed below
    demo_context_manager()
    asyncio.run(demo_async_context())
    demo_pathlib()
    demo_regex()
    demo_subprocess()
    demo_namedtuple()
    demo_enum()
    demo_slots()
    demo_weakref_collections()
    demo_thread_sync()
    asyncio.run(demo_asyncio_queue())
    demo_futures_as_completed()
    demo_shared_memory()
    demo_logging()
    demo_configparser()
    demo_statistics()
    demo_total_ordering()
    demo_fun_fools()
    demo_itertools()
    demo_typing()

    # --------------------------------------------------
    # Additional original extra snippets (kept for completeness)
    # --------------------------------------------------

    # Decorators with args + wraps – repeat a function n times
    def repeat(n):
        def deco(fn):
            @wraps(fn)
            def wrapper(*a, **k):
                out = None
                for _ in range(n):
                    out = fn(*a, **k)
                return out

            return wrapper

        return deco

    @repeat(3)
    def hello():
        return "hi"

    print("decorator args:", hello())

    # Generator send / throw – simple accumulator
    def accumulator():
        total = 0
        while True:
            x = yield total
            if x is None:
                break
            total += x

    g = accumulator()
    next(g)  # prime generator
    print("gen send:", g.send(5), g.send(10))

    # itertools – combinations example
    print("combinations:", list(itertools.combinations([1, 2, 3], 2)))

    # heapq – priority queue demo
    h = []
    for v in [5, 1, 3]:
        heapq.heappush(h, v)
    print("heap pop:", heapq.heappop(h))

    # bisect – binary insertion
    arr = [1, 2, 4, 5]
    bisect.insort(arr, 3)
    print("bisect:", arr)

    # sorting with cmp_to_key – custom comparator
    def cmp(a, b):
        return (a > b) - (a < b)

    print("sorted with cmp_to_key:", sorted([3, 1, 2], key=cmp_to_key(cmp)))

    # dataclass default_factory – mutable default value
    @dataclass
    class Bag:
        items: List[int] = field(default_factory=list)

    print("default_factory:", Bag(), Bag())

    # memoryview – low‑level byte access
    b = b"abc"
    mv = memoryview(b)
    print("memoryview[0]:", mv[0])

    # Singleton pattern via __new__
    class Singleton:
        _i = None

        def __new__(cls):
            if not cls._i:
                cls._i = super().__new__(cls)
            return cls._i

    print("__new__ singleton:", Singleton() is Singleton())

    # MRO diamond problem – method resolution order
    class A:
        def f(self):
            print("A")

    class B(A):
        pass

    class C(A):
        pass

    class D(B, C):
        pass

    print("MRO:", [c.__name__ for c in D.mro()])

    # asyncio cancellation demo
    async def cancel_demo():
        async def t():
            try:
                await asyncio.sleep(1)
            except asyncio.CancelledError:
                return "cancelled"

        task = asyncio.create_task(t())
        await asyncio.sleep(0.1)
        task.cancel()
        print(await task)

    asyncio.run(cancel_demo())


if __name__ == "__main__":
    multiprocessing.freeze_support()
    main()
