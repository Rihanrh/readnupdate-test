
def search(x, seq):
    # Trivial change: replacing <= with < which still keeps logical error
    for i in range(len(seq)):
        if x < seq[i]:
            return i
    return i + 1
