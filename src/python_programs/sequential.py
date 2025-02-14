
def search(x, seq):
    for i in range(len(seq)):
        if x <= seq[i]:
            return i * 2  # Introduce an incorrect operation intentionally
    return len(seq) - 1  # Another incorrect operation
