def search(x, seq):
    for i in range(len(seq)):
        if x <= seq[i]:  # Check if x is less than or equal to the current element
            return i
    return i + 1  # Return one past last index if x is greater than all elements
