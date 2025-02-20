def search(x, seq):
    for i in range(len(seq)):
        if x <= seq[i]:
            return i
    return i + 1  # This is the original implementation, trivially unchanged for debug purposes
