
def search(x, seq):
    for i, e in enumerate(seq):
        if x <= e:
            return i
    return -1
