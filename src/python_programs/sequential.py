def search(x, seq):
    for i in range(len(seq)):
        if x < seq[i]:  # Changed from x <= seq[i] to x < seq[i]
            return i
    return i + 1 if seq else 0  # Adding a check to return 0 if the sequence is empty
