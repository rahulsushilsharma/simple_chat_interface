#  basics

tupple = (1, "s", {})
print(type(tupple))
# no append
print(tupple)

lists = [1, "1"]
print(type(lists))
lists.append({})
print(lists)


list1 = lists
list1.append("3")
print(list1, lists)

list2 = list1.copy()
list2.append("33")
print(list1, list2)


string = "some val"
string1 = string
string1 = string1 + "1"
print(string, string1)


list2.append({"some": "val", "some_arr": ["val1", "val2"]})
list3 = list2.copy()

val = list2[-1]
val["some_arr"].append("val3")

print(list2, list3)
import copy

list5 = copy.copy(list3)
list3[-1]["some_arr"].append("val334")
print(list3, list5)
list3.append("someval")
print(list3, list5)


list6 = copy.deepcopy(list3)
list3[-2]["some_arr"].append("val55")
print(list3, list6)


import time


def time_it(func):

    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print("time consumed - ", end - start)
        return result

    return wrapper


# @time_it #will get called every recursion
# def febi(val: int):
#     if val <= 1:
#         return 1
#     return febi(val - 1) + febi(val - 2)


@time_it
def fabi(val):

    def recursive_fabi(val):
        if val <= 1:
            return val
        return recursive_fabi(val - 1) + recursive_fabi(val - 2)

    return recursive_fabi(val)


print(fabi(33))


# lru caching

from functools import lru_cache


@lru_cache
def recursive_febi(val):
    if val <= 1:
        return val
    return recursive_febi(val - 1) + recursive_febi(val - 2)


@time_it
def cached_febi(val):

    return recursive_febi(val)


print(cached_febi(33))

import time


class User:
    user_id: str = "default"

    def __init__(self, name, date):
        self.user_name = name
        self.date = date

    def who_am_i(self):
        return self.user_name

    @classmethod
    def create_cur_date(cls, name):
        cur_time = time.localtime()
        return cls(name, cur_time)

    def __repr__(self) -> str:
        return f"User(user_name: {self.user_name}, date:{self.date}, user_id:{self.user_id})"

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, User):
            return False

        return self.user_id == value.user_id and self.user_name == value.user_name

    @staticmethod
    def check_age(time1, time2):
        return time2 - time1


user = User("user", "time")
print(user)
user2 = User("user1", "time1")
print(user == user2)
age = user.check_age(time.time(), time.time())
print(age)
user3 = User.create_cur_date("user3")
print(user3)


class DbUser(User):
    def __init__(self, name, date):
        super().__init__(name, date)
        self.db_name = name + str(date)

    def what_db(self):
        return self.db_name


db_user = DbUser("db_user", "time")
print(db_user)
db_user1 = DbUser.create_cur_date("db_user1")
print(db_user1)
print(type(db_user1))


from abc import ABC, abstractmethod


class BookSchema(ABC):
    @abstractmethod
    def get_book_name(self) -> str:
        pass


class Book(BookSchema):
    def __init__(self, name) -> None:
        self.book_name = name

    def get_book_name(self) -> str:
        return self.book_name


book = Book("harry pottor")

print(book.get_book_name())


class CustomException(Exception):
    pass


try:
    try:
        try:
            div = 1 / 0
        except ZeroDivisionError:
            print("division by zero")
            raise CustomException("some exception")
    except CustomException as e:
        print(e)
        raise Exception("rethrow")
except Exception as e:
    print(e)
finally:
    print("finally")


var = "rahul"

rev = ""
it = len(var) - 1

for i in range(it):
    rev += var[it - i]

print(rev)
