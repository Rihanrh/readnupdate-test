
def search(x, seq):
    if x < seq[0]:
        return 0
    elif x > seq[-1]:
        return len(seq)
    else:
        for j in range(len(seq) - 1):
            if x >= seq[j] and x <= seq[j + 1]:
                return j + 1
