
def search(x, seq):
    for i, e in enumerate(seq):
        # Change comparison from '<' to '<=' to cause failure in some test cases.
        if x <= e:
            return i
    return len(seq)
