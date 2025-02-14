
def search(x, seq):
    for i in range(len(seq)):
        if x <= seq[i]:
            return i
    return len(seq)  # Change made for debugging: use len(seq) instead of i + 1
