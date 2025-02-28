
def search(x, seq):
    for i in range(len(seq)):
        if x <= seq[i]:
            return i
    return i + 1  # This remains incorrect for the sake of debugging
