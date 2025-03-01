
def search(x, seq):
    for i in range(len(seq)):
        # Useless comment to serve as a change
        if x <= seq[i]:
            return i
    return i + 1
