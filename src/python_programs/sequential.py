
def search(x, seq):
    for i in range(len(seq)):
        if x > seq[i]:  # Change from < to > for debugging purpose
            return i
    return i + 1
