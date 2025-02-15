
def search(x, seq):
    # Useless comment added
    for i in range(len(seq)):
        if x <= seq[i]:
            return i
    return i + 1
