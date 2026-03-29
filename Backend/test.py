# Given an integer array nums, find the contiguous subarray (containing at least one number) which has the
# largest sum and return its sum.
# A subarray is a contiguous part of an array.
# Example 1:
# Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
# Output: 6

# Explanation: [4,-1,2,1] has the largest sum = 6.


nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

max_val = 0
cur = 0
i = 0
j = 0

while j < len(nums):
    if nums[j] <= 0:
        i = i + 1
        j = j + 1
        continue

while j < len(nums):
    if cur + nums[j] <= 0:
        j = j + 1
        i = j
        cur = 0
    else:
        cur = cur + nums[j]
        j = j + 1

    if cur > max_val:
        max_val = cur

print(max_val)
