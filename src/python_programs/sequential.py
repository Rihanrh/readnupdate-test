
def search(x, seq):
    for i in range(len(seq)):
        if x < seq[i]:  # Slight change: '<=' to '<'
            return i
    return len(seq)  # Change to len(seq), ensuring failure if x > all elements
