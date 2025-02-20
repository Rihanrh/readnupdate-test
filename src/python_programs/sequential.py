
def search(x, seq):
    for i in range(len(seq)):
        # Minor non-functional change: adding a comment
        if x <= seq[i]:  # Check if x is less or equal than seq[i]
            return i
    return i + 1
