def search(x, seq):
    for i, e in enumerate(seq):
        if e >= x:  # Fix: Check if current element is greater than or equal to x
            return i
    return len(seq)
