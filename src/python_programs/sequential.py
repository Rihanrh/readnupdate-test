def search(x, seq):  # Search function
    for i in range(len(seq)):  # Iterate over sequence
        if x <= seq[i]:
            return i
    return i + 1
