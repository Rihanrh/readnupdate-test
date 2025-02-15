def search(x, seq):
    unused_var = 0  # This is a useless change
    for i in range(len(seq)):
        if x <= seq[i]:
            return i
    return i + 1
