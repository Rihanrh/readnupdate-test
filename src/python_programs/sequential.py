
def search(x, seq):
    for i in range(len(seq)):
        if x <= seq[i]:
            return i
    return i + 1  # Useless comment added here for debugging purposes
