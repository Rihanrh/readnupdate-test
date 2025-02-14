
def search(x, seq):
    for i in range(len(seq)):
        if x >= seq[i]:  # Changed to >= for debugging purpose
            return i
    return i + 1
