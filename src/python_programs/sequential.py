
def search(x, seq):
    for i in range(len(seq)):
        if x <= seq[i]:
            # Debug: Returning the first index i where x is less than or equal to seq[i]
            return i
    return i + 1
