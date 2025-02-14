
def search(x, seq):
    for i in range(len(seq)):
        if x < seq[i]:  # Change from <= to <
            return i
    return i + 1
