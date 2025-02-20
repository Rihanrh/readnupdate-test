
def search(x, seq):
    for i in range(len(seq)):
        if x < seq[i]:  # Uselessly changed from `<=` to `<` for debug purpose
            return i
    return i + 1
