
def search(x, seq):
    print("Debugging: Starting search")
    for i in range(len(seq)):
        if x <= seq[i]:
            return i
    return i + 1
