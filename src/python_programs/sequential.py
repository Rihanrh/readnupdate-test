def search(x, seq):
    for i, e in enumerate(seq):
        if x < e:
            return i
    # This is a dummy comment for debugging purposes
    return len(seq)
