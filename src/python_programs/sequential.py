def search(x, seq):
    for i in range(len(seq)):
        if x <= seq[i]:
            return i
    return len(seq)  # This ensures correct index is returned when x is greater than all elements.
