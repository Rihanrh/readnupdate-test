
def search(x, seq):
    # Useless comment for debugging purposes
    for i in range(len(seq)):
        if x <= seq[i]:
            return i
    return i + 1
